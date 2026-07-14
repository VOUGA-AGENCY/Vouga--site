import { parsePhoneNumberFromString } from 'libphonenumber-js/max';

function parse(value) {
  var raw = String(value || '').trim();
  if (!raw) return { valid: true, empty: true, e164: '', country: '' };

  var phone = parsePhoneNumberFromString(raw, { extract: false });
  if (!phone || !phone.country || !phone.isValid()) {
    return { valid: false, empty: false, e164: '', country: '' };
  }

  return {
    valid: true,
    empty: false,
    e164: phone.number,
    country: phone.country,
    international: phone.formatInternational()
  };
}

window.VougaPhone = { parse: parse };
