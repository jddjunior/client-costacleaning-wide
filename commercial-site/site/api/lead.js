// Receives the walkthrough form (JSON) and emails it to Costa through Resend.
// Env: RESEND_API_KEY (required), LEAD_TO_EMAIL, LEAD_FROM_EMAIL (optional overrides).
const TO = process.env.LEAD_TO_EMAIL || 'info@costacleaning.co';
const FROM = process.env.LEAD_FROM_EMAIL || 'Costa Cleaning Website <leads@costacleaning.co>';
const FIELDS = [
  ['type', 'Need'], ['name', 'Name'], ['company', 'Company'], ['phone', 'Phone'],
  ['email', 'Email'], ['facility', 'Facility type'], ['city', 'City'], ['page', 'Page'],
];
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const clean = (v) => String(v == null ? '' : v).replace(/[\r\n]+/g, ' ').trim().slice(0, 300);

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ ok: false }); }
  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }
  body = body || {};
  const d = {};
  for (const [k] of FIELDS) d[k] = clean(body[k]);
  if (!d.name || !d.phone || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(d.email)) {
    return res.status(400).json({ ok: false, error: 'invalid' });
  }
  if (!process.env.RESEND_API_KEY) return res.status(500).json({ ok: false, error: 'not_configured' });

  const rows = FIELDS.filter(([k]) => d[k]);
  const html = '<h2>New walkthrough request</h2><table cellpadding="6">' +
    rows.map(([k, label]) => '<tr><td><b>' + label + '</b></td><td>' + esc(d[k]) + '</td></tr>').join('') + '</table>';
  const text = rows.map(([k, label]) => label + ': ' + d[k]).join('\n');
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + process.env.RESEND_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: FROM, to: [TO], reply_to: d.email,
        subject: 'New walkthrough request: ' + (d.company || d.name) + (d.city ? ' (' + d.city + ')' : ''),
        html, text,
      }),
    });
    if (!r.ok) return res.status(502).json({ ok: false, error: 'send_failed' });
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(502).json({ ok: false, error: 'send_failed' });
  }
};
