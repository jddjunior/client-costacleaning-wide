// Costa lead form receiver: POST /lead (JSON) -> email via Resend. No dependencies.
// Env: RESEND_API_KEY (required), PORT, LEAD_TO_EMAIL, LEAD_FROM_EMAIL, ALLOWED_ORIGINS (comma list).
const http = require('http');
const TO = process.env.LEAD_TO_EMAIL || 'info@costacleaning.co';
const FROM = process.env.LEAD_FROM_EMAIL || 'Costa Cleaning Website <leads@costacleaning.co>';
const ORIGINS = (process.env.ALLOWED_ORIGINS || 'https://costacleaning.co,https://www.costacleaning.co,https://costa-cleaning-commercial.vercel.app').split(',').map((s) => s.trim());
const FIELDS = [['type', 'Need'], ['name', 'Name'], ['company', 'Company'], ['phone', 'Phone'], ['email', 'Email'], ['facility', 'Facility type'], ['city', 'City'], ['page', 'Page']];
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const clean = (v) => String(v == null ? '' : v).replace(/[\r\n]+/g, ' ').trim().slice(0, 300);

function send(res, code, obj, origin) {
  const h = { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' };
  if (origin && ORIGINS.includes(origin)) { h['Access-Control-Allow-Origin'] = origin; h.Vary = 'Origin'; }
  res.writeHead(code, h);
  res.end(JSON.stringify(obj));
}

http.createServer((req, res) => {
  const origin = req.headers.origin;
  if (req.url === '/health') return send(res, 200, { ok: true });
  if (req.method === 'OPTIONS') {
    const h = { 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Max-Age': '86400' };
    if (origin && ORIGINS.includes(origin)) { h['Access-Control-Allow-Origin'] = origin; h.Vary = 'Origin'; }
    res.writeHead(204, h); return res.end();
  }
  if (req.method !== 'POST' || req.url.split('?')[0] !== '/lead') return send(res, 404, { ok: false }, origin);
  if (!origin || !ORIGINS.includes(origin)) return send(res, 403, { ok: false }, origin);
  let raw = '';
  req.on('data', (c) => { raw += c; if (raw.length > 20000) req.destroy(); });
  req.on('end', async () => {
    let body = {};
    try { body = JSON.parse(raw); } catch (e) { /* invalid */ }
    const d = {};
    for (const [k] of FIELDS) d[k] = clean(body[k]);
    if (!d.name || !d.phone || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(d.email)) return send(res, 400, { ok: false, error: 'invalid' }, origin);
    if (!process.env.RESEND_API_KEY) return send(res, 500, { ok: false, error: 'not_configured' }, origin);
    const rows = FIELDS.filter(([k]) => d[k]);
    const html = '<h2>New walkthrough request</h2><table cellpadding="6">' + rows.map(([k, l]) => '<tr><td><b>' + l + '</b></td><td>' + esc(d[k]) + '</td></tr>').join('') + '</table>';
    const text = rows.map(([k, l]) => l + ': ' + d[k]).join('\n');
    try {
      const r = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + process.env.RESEND_API_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: FROM, to: [TO], reply_to: d.email, subject: 'New walkthrough request: ' + (d.company || d.name) + (d.city ? ' (' + d.city + ')' : ''), html, text }),
      });
      if (!r.ok) { console.error('resend', r.status, await r.text()); return send(res, 502, { ok: false, error: 'send_failed' }, origin); }
      return send(res, 200, { ok: true }, origin);
    } catch (e) { console.error('resend', e.message); return send(res, 502, { ok: false, error: 'send_failed' }, origin); }
  });
}).listen(process.env.PORT || 3000, () => console.log('costa-leads up'));
