import assert from 'node:assert/strict';
import test from 'node:test';
import handler from '../api/automation-events.mjs';
let sequence=0;
const request = (data, headers={}) => new Request('https://www.vouga-agency.pt/api/automation-events', {
  method:'POST',headers:{'content-type':'application/json','x-forwarded-for':`192.0.2.${++sequence}`,...headers},body:JSON.stringify(data)
});
const event = {event:'automation_started',journey:'12345678-1234-4234-8234-123456789abc',leanked:true};
test('funnel logs include only allowlisted metadata, never submitted process/contact fields', async () => {
  const original=console.info; let record;
  console.info = value => { record=JSON.parse(value); };
  try {
    assert.equal((await handler.fetch(request({...event,process:'secret process',email:'private@example.com'}))).status,204);
    assert.equal(record.source,'Leanked Newsletter #01');
    assert.deepEqual(Object.keys(record),['type','event','journey','source','at']);
  } finally {console.info=original;}
});
test('rejects invalid events, malformed JSON structures and foreign origins', async () => {
  assert.equal((await handler.fetch(request({...event,event:'arbitrary'}))).status,422);
  assert.equal((await handler.fetch(request(null))).status,422);
  assert.equal((await handler.fetch(request(event,{origin:'https://other.example'}))).status,403);
  assert.equal((await handler.fetch(request({...event,extra:'x'.repeat(2000)}))).status,413);
});
