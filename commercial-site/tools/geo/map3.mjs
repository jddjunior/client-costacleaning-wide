import fs from 'node:fs';
import { geoMercator, geoPath, geoArea, geoBounds } from 'd3-geo';
const lands = JSON.parse(fs.readFileSync(new URL('../node_modules/@geo-maps/earth-lands-1km/map.geo.json', import.meta.url)));
const counties = JSON.parse(fs.readFileSync(new URL('./counties.json', import.meta.url)));
const fix = (f) => { if (geoArea(f) > 2 * Math.PI) { const g = f.geometry; const rev = (p) => p.map(r => r.slice().reverse()); g.coordinates = g.type === 'Polygon' ? rev(g.coordinates) : g.coordinates.map(rev); } return f; };
// explode to polygons, keep the ones near Florida
const polys = [];
for (const f of (lands.type === 'FeatureCollection' ? lands.features : lands.type === 'GeometryCollection' ? lands.geometries : [lands])) {
  const g = f.geometry || f;
  const list = g.type === 'Polygon' ? [g.coordinates] : g.coordinates;
  for (const c of list) {
    let [x0, y0, x1, y1] = [180, 90, -180, -90];
    for (const [x, y] of c[0]) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    if (x1 < -88.5 || x0 > -79 || y1 < 24 || y0 > 31.5) continue;
    polys.push(fix({ type: 'Feature', properties: {}, geometry: { type: 'Polygon', coordinates: [c[0]] } }));
  }
}
const box = (lo0, la0, lo1, la1) => ({ type: 'Polygon', coordinates: [[[lo0, la0], [lo0, la1], [lo1, la1], [lo1, la0], [lo0, la0]]] });
const chaikin = (pts, closed) => {
  if (pts.length < 4) return pts;
  const out = [];
  const n = pts.length;
  for (let i = 0; i < (closed ? n : n - 1); i++) {
    const a = pts[i], b = pts[(i + 1) % n];
    out.push([0.75 * a[0] + 0.25 * b[0], 0.75 * a[1] + 0.25 * b[1]], [0.25 * a[0] + 0.75 * b[0], 0.25 * a[1] + 0.75 * b[1]]);
  }
  return out;
};
const tidy = (d, smooth = 0, digits = 1) => {
  if (!d) return '';
  return d.split('M').filter(Boolean).map(seg => {
    const closed = seg.endsWith('Z');
    let pts = seg.replace('Z', '').split('L').map(p => p.trim().split(',').map(Number));
    const dd = []; for (const p of pts) { const l = dd[dd.length - 1]; if (!l || Math.hypot(l[0] - p[0], l[1] - p[1]) > 0.6) dd.push(p); }
    if (dd.length < 3) return '';
    for (let k = 0; k < smooth; k++) pts = chaikin(k === 0 ? dd : pts, closed);
    if (!smooth) pts = dd;
    return 'M' + pts.map(p => p[0].toFixed(digits).replace(/\.0$/, '') + ',' + p[1].toFixed(digits).replace(/\.0$/, '')).join('L') + (closed ? 'Z' : '');
  }).join('');
};
function render(W, H, b, digits) {
  const proj = geoMercator().fitSize([W, H], box(...b)).clipExtent([[-2, -2], [W + 2, H + 2]]);
  const path = geoPath(proj).digits(digits);
  return { proj, path };
}
// detail: Lee + Charlotte
const W = 640, H = 600;
const D = render(W, H, [-82.36, 26.28, -81.50, 27.04], 1);
const land = tidy(polys.map(p => D.path(p)).join(''), 2, 1);
const want = { '071': 'Lee', '015': 'Charlotte' };
const served = tidy(counties.features.filter(f => f.properties.STATE === '12' && want[f.properties.COUNTY]).map(fix).map(f => D.path(f)).join(''));
const cities = [['Punta Gorda', 26.9298, -82.0454], ['Cape Coral', 26.5629, -81.9495], ['North Fort Myers', 26.6673, -81.8801], ['Fort Myers', 26.6406, -81.8723],
  ['Lehigh Acres', 26.6254, -81.6248], ['Sanibel', 26.4434, -82.0700], ['Estero', 26.4381, -81.8068], ['Bonita Springs', 26.3398, -81.7787]];
const pxPerMile = (() => { const a = D.proj([-81.8723, 26.6406]); const b = D.proj([-81.8723, 26.6406 + 10 / 69.17]); return Math.abs(a[1] - b[1]) / 10; })();
// inset: the whole state
const IW = 150, IH = 150;
const I = render(IW, IH, [-87.7, 24.4, -79.9, 31.05], 0);
const inset = tidy(polys.map(p => I.path(p)).join(''), 1, 1);
const [ix0, iy0] = I.proj([-82.36, 27.04]); const [ix1, iy1] = I.proj([-81.50, 26.28]);
const out = { w: W, h: H, land, served, pxPerMile: +pxPerMile.toFixed(3),
  cities: Object.fromEntries(cities.map(([n, la, lo]) => [n, D.proj([lo, la]).map(v => +v.toFixed(1))])),
  labels: { Lee: D.proj([-81.66, 26.52]).map(v => +v.toFixed(0)), Charlotte: D.proj([-81.80, 26.985]).map(v => +v.toFixed(0)), Gulf: D.proj([-82.25, 26.55]).map(v => +v.toFixed(0)) },
  inset: { w: IW, h: IH, d: inset, box: [+ix0.toFixed(1), +iy0.toFixed(1), +(ix1 - ix0).toFixed(1), +(iy1 - iy0).toFixed(1)] } };
fs.writeFileSync('/home/claude/costa-night/build/map.json', JSON.stringify(out));
console.log('polys', polys.length, 'land', land.length, 'served', served.length, 'inset', inset.length, 'pxPerMile', out.pxPerMile, JSON.stringify(out.cities), out.inset.box);
