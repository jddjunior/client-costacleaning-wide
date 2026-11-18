// Costa lead form receiver: POST /lead (JSON) -> email via Resend. No dependencies.
// Env: RESEND_API_KEY (required), PORT, LEAD_TO_EMAIL, LEAD_FROM_EMAIL, ALLOWED_ORIGINS (comma list).
// Optional sheet log (skipped unless both are set): LEADS_SHEET_ID, COMPOSIO_CONSUMER_API_KEY (Composio Connect ck_ key); LEADS_SHEET_TAB (default "Leads").
const http = require('http');
const TO = process.env.LEAD_TO_EMAIL || 'info@costacleaning.co';
const FROM = process.env.LEAD_FROM_EMAIL || 'Costa Cleaning Website <leads@costacleaning.co>';
const ORIGINS = (process.env.ALLOWED_ORIGINS || 'https://costacleaning.co,https://www.costacleaning.co,https://costa-cleaning-commercial.vercel.app').split(',').map((s) => s.trim());
const FIELDS = [['type', 'Need'], ['frequency', 'How often'], ['project', 'Project'], ['service', 'Service'], ['name', 'Name'], ['company', 'Company'], ['phone', 'Phone'], ['email', 'Email'],
  ['facility', 'Facility type'], ['city', 'City'], ['size', 'Size'], ['contract_end', 'Current contract ends'], ['notes', 'Notes'], ['page', 'Page']];
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const clean = (v) => String(v == null ? '' : v).replace(/[\r\n]+/g, ' ').trim().slice(0, 300);

// Append one row to the leads Google Sheet through Composio Connect (MCP endpoint, x-consumer-api-key).
// Never throws: a sheet problem must not block the email.
const COMPOSIO_MCP = 'https://connect.composio.dev/mcp';
async function mcpCall(key, sid, msg) {
  const h = { 'x-consumer-api-key': key, 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream' };
  if (sid) h['mcp-session-id'] = sid;
  const r = await fetch(COMPOSIO_MCP, { method: 'POST', headers: h, body: JSON.stringify(msg), signal: AbortSignal.timeout(8000) });
  const text = await r.text();
  const ct = r.headers.get('content-type') || '';
  const payload = ct.includes('event-stream') ? (text.split('\n').filter((l) => l.startsWith('data:')).map((l) => l.slice(5).trim()).pop() || '') : text;
  let json = null; try { json = payload ? JSON.parse(payload) : null; } catch (e) { /* not json */ }
  return { status: r.status, sid: r.headers.get('mcp-session-id') || sid, json, raw: payload };
}
async function logToSheet(d) {
  const sheetId = process.env.LEADS_SHEET_ID;
  const key = process.env.COMPOSIO_CONSUMER_API_KEY;
  if (!sheetId || !key) return;
  const tab = process.env.LEADS_SHEET_TAB || 'Leads';
  const row = [new Date().toISOString(), d.type, d.name, d.company, d.phone, d.email, d.facility, d.city, d.page, 'New', ''];
  try {
    const init = await mcpCall(key, null, { jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'costa-leads', version: '1.1.0' } } });
    if (init.status !== 200) throw new Error('mcp_init_' + init.status);
    await mcpCall(key, init.sid, { jsonrpc: '2.0', method: 'notifications/initialized' });
    const call = await mcpCall(key, init.sid, { jsonrpc: '2.0', id: 2, method: 'tools/call', params: { name: 'COMPOSIO_MULTI_EXECUTE_TOOL', arguments: {
      tools: [{ tool_slug: 'GOOGLESHEETS_SPREADSHEETS_VALUES_APPEND', arguments: { spreadsheetId: sheetId, range: tab + '!A:K', valueInputOption: 'RAW', insertDataOption: 'INSERT_ROWS', values: [row] } }],
      sync_response_to_workbench: false } } });
    let out = null;
    try { out = JSON.parse(call.json.result.content[0].text); } catch (e) { /* unexpected shape */ }
    const ok = call.status === 200 && out && out.successful && out.data && out.data.success_count === 1;
    if (ok) console.log('sheet_log_ok');
    else console.error('sheet_log_failed', call.status, String((out && JSON.stringify(out.data && out.data.results || out.error)) || call.raw).slice(0, 300));
  } catch (e) { console.error('sheet_log_failed', e.message); }
}

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
    const sheetLog = logToSheet(d); // runs alongside the email; never rejects
    try {
      const r = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + process.env.RESEND_API_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: FROM, to: [TO], reply_to: d.email, subject: 'New walkthrough request: ' + (d.company || d.name) + (d.city ? ' (' + d.city + ')' : ''), html, text }),
      });
      await sheetLog;
      if (!r.ok) { console.error('resend', r.status, await r.text()); return send(res, 502, { ok: false, error: 'send_failed' }, origin); }
      return send(res, 200, { ok: true }, origin);
    } catch (e) { await sheetLog; console.error('resend', e.message); return send(res, 502, { ok: false, error: 'send_failed' }, origin); }
  });
}).listen(process.env.PORT || 3000, () => console.log('costa-leads up'));
