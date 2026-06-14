(function(){
  'use strict';

  var board = document.getElementById('demoBoard');
  var primary = document.getElementById('primaryAction');
  var reset = document.getElementById('resetDemo');
  var progress = document.getElementById('boardProgress');
  var step = document.getElementById('boardStep');
  var status = document.getElementById('demoStatus');
  var title = document.getElementById('boardTitle');
  var assemble = document.getElementById('assembleBtn');
  var draft = document.getElementById('draftBtn');
  var tasks = document.getElementById('tasksBtn');
  var replyCard = document.getElementById('replyCard');
  var tasksCard = document.getElementById('tasksCard');
  var state = 0;

  function setText(el, value){ if (el) el.textContent = value; }

  function collectEvidence(){
    state = 1;
    board.classList.add('is-assembling');
    setText(step, 'reconciling sources');
    setText(status, 'The layer is checking pricing rules, CRM and proposal precedent.');
    setText(title, 'The answer is being assembled from approved sources.');
    progress.style.width = '52%';
    primary.disabled = true;
    primary.textContent = 'Reconciling...';
    window.setTimeout(function(){
      board.classList.add('is-layered');
      primary.disabled = false;
      primary.innerHTML = 'Build decision packet <span class="arrow">→</span>';
      primary.focus();
    }, 980);
  }

  function buildPacket(){
    state = 2;
    board.classList.add('is-packet');
    setText(step, 'decision packet ready');
    setText(status, 'Decision, evidence, owner and next actions are ready.');
    setText(title, 'Approve 12%, with owner sign-off.');
    progress.style.width = '100%';
    primary.innerHTML = 'Draft reply';
    draft.focus();
  }

  function draftReply(){
    replyCard.classList.add('ready');
    replyCard.innerHTML = '<span>Reply</span><strong>12% is possible with annual prepay and Head of Sales approval. I can confirm today.</strong>';
    setText(status, 'Client reply drafted from approved wording.');
  }

  function createTasks(){
    tasksCard.classList.add('ready');
    tasksCard.innerHTML = '<span>Tasks</span><strong>Approval request · CRM note · Client follow-up</strong>';
    setText(status, 'Tasks queued with owner and context.');
  }

  function resetDemo(){
    state = 0;
    board.classList.remove('is-assembling', 'is-layered', 'is-packet');
    progress.style.width = '10%';
    setText(step, 'stuck decision');
    setText(title, 'Can Acme get a 12% discount before Friday?');
    setText(status, 'A manager is waiting for the right answer.');
    primary.disabled = false;
    primary.innerHTML = 'Collect evidence <span class="arrow">→</span>';
    replyCard.classList.remove('ready');
    tasksCard.classList.remove('ready');
    replyCard.innerHTML = '<span>Reply</span><strong>Ready</strong>';
    tasksCard.innerHTML = '<span>Tasks</span><strong>Ready</strong>';
    primary.focus();
  }

  function primaryAction(){
    if (state === 0) collectEvidence();
    else if (state === 1) buildPacket();
    else draftReply();
  }

  primary.addEventListener('click', primaryAction);
  assemble.addEventListener('click', collectEvidence);
  draft.addEventListener('click', draftReply);
  tasks.addEventListener('click', createTasks);
  reset.addEventListener('click', resetDemo);
})();
