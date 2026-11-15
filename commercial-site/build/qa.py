"""QA for the Costa site. Usage: python3 build/qa.py <site dir> <out dir> [page.html ...]
Per page: desktop fold + full shot, phone full shot, axe, overflow at six widths, console errors, form behaviour,
menus, internal links and anchors. Writes report.json."""
import asyncio, json, re, sys
from pathlib import Path
from playwright.async_api import async_playwright

SITE = Path(sys.argv[1]).resolve(); OUT = Path(sys.argv[2]).resolve(); OUT.mkdir(parents=True, exist_ok=True)
PAGES = sys.argv[3:] or sorted(p.name for p in SITE.glob("*.html"))
AXE = Path("/home/claude/costa-awwwards/node_modules/axe-core/axe.min.js").read_text()

OVERFLOW = """() => { const W = document.documentElement.clientWidth; const off = [];
  document.querySelectorAll('body *').forEach(e => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e);
    if (r.width && r.right > W + 1 && cs.position !== 'fixed' && !e.closest('.sr-only, svg[width="0"], .dropdown, .hero__bg')) off.push((e.className && e.className.baseVal === undefined ? e.className : e.tagName).toString().slice(0,40) + ' r=' + Math.round(r.right)); });
  return {sw: document.documentElement.scrollWidth, w: W, off: off.slice(0, 5)}; }"""
TARGETS = """() => [...document.querySelectorAll('a, button, input, select, textarea')].filter(e => {
  const r = e.getBoundingClientRect(); const cs = getComputedStyle(e);
  if (!r.width || !r.height || cs.visibility === 'hidden' || e.closest('[hidden], .sr-only, .skip')) return false;
  if (e.closest('p, .qa__a, .footer__bottom') && e.tagName === 'A') return false;
  if (e.matches('.seg__opts input')) return false;
  return r.height < 24 || r.width < 24; }).map(e => (e.textContent || e.name || e.tagName).trim().slice(0, 28) + ' ' + Math.round(e.getBoundingClientRect().width) + 'x' + Math.round(e.getBoundingClientRect().height))"""
FOLD = """() => { const q = s => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(); return [Math.round(r.top), Math.round(r.bottom)]; };
  return {vh: innerHeight, h1: q('main h1'), sub: q('main .hero__sub, main p'), cta: q('main .hero__actions .btn, main .btn')}; }"""
LINKS = """() => [...document.querySelectorAll('a[href]')].map(a => a.getAttribute('href'))"""
WORDS = """() => document.body.innerText.split(/\\s+/).filter(Boolean).length"""

async def shoot_full(page, path):
    h = await page.evaluate("document.documentElement.scrollHeight")
    for y in range(0, h, 700):
        await page.evaluate(f"window.scrollTo(0, {y})"); await page.wait_for_timeout(40)
    await page.wait_for_load_state("networkidle"); await page.evaluate("window.scrollTo(0, 0)"); await page.wait_for_timeout(250)
    await page.screenshot(path=str(path), full_page=True)

async def check_page(browser, name):
    stem = Path(name).stem; url = (SITE / name).as_uri(); rep = {"console": []}
    ctx = await browser.new_context(viewport={"width": 1440, "height": 900}); page = await ctx.new_page(); STEP = ["load"]
    page.on("console", lambda m: rep["console"].append(m.text) if m.type == "error" and "XMLHttpRequest" not in m.text and STEP[0] != "axe" else None)
    page.on("pageerror", lambda e: rep["console"].append("PAGEERROR " + str(e)))
    page.on("requestfailed", lambda r: None if STEP[0] == "axe" else rep["console"].append("REQFAIL@" + STEP[0] + " " + r.url[-40:] + " " + str(r.failure)))
    await page.goto(url, wait_until="networkidle"); await page.wait_for_timeout(500)
    STEP[0] = "fonts"
    rep["fonts"] = await page.evaluate("Promise.all([document.fonts.check('800 40px Montserrat'), document.fonts.check('400 16px \"Plus Jakarta Sans\"')])")
    await page.screenshot(path=str(OUT / f"{stem}-fold-1440.png")); rep["fold1440"] = await page.evaluate(FOLD)
    STEP[0] = "shoot"
    await shoot_full(page, OUT / f"{stem}-desktop.png")
    rep["words"] = await page.evaluate(WORDS)
    rep["links"] = await page.evaluate(LINKS)
    rep["ids"] = await page.evaluate("[...document.querySelectorAll('[id]')].map(e => e.id)")
    rep["dupIds"] = await page.evaluate("(() => { const s = {}; document.querySelectorAll('[id]').forEach(e => s[e.id] = (s[e.id] || 0) + 1); return Object.keys(s).filter(k => s[k] > 1); })()")
    STEP[0] = "axe"
    await page.add_script_tag(content=AXE)
    rep["axe"] = await page.evaluate("axe.run(document, {resultTypes: ['violations']}).then(r => r.violations.map(v => ({id: v.id, impact: v.impact, n: v.nodes.length, s: v.nodes.slice(0,3).map(n => n.target.join(' ') + ' :: ' + (n.failureSummary||'').slice(0,120))})))")
    rep["h"] = await page.evaluate("[...document.querySelectorAll('h1,h2,h3')].map(h => h.tagName + ' ' + h.textContent.trim().slice(0,50))")
    STEP[0] = "dropdown"
    # dropdown by hover
    if await page.locator(".nav__item--menu").count():
        await page.evaluate("window.scrollTo(0,0)")
        await page.locator(".nav__item--menu .nav__link").hover(); await page.wait_for_timeout(350)
        rep["dropdownVisible"] = await page.evaluate("getComputedStyle(document.querySelector('.dropdown')).visibility")
        if name == "index.html": await page.screenshot(path=str(OUT / f"{stem}-dropdown.png"), clip={"x": 0, "y": 0, "width": 1440, "height": 560})
        await page.mouse.move(5, 600)
    STEP[0] = "form"
    # form
    if await page.locator("#lead-form").count():
        btn = page.locator("#lead-form button[type=submit]")
        await btn.scroll_into_view_if_needed(); await btn.click(); await page.wait_for_timeout(250)
        rep["formEmpty"] = await page.evaluate("({status: document.querySelector('.form__status').textContent, invalid: document.querySelectorAll('#lead-form [aria-invalid=true]').length, focus: document.activeElement.id})")
        await page.locator("#lead-form").screenshot(path=str(OUT / f"{stem}-form-errors.png"))
        await page.fill("#f-name", "Dana Ruiz"); await page.fill("#f-company", "Gulf Coast Dental")
        await page.fill("#f-phone", "239-555-0142"); await page.fill("#f-email", "dana@example.com")
        await page.select_option("#f-facility", label="Office"); await page.select_option("#f-city", label="Estero")
        if await page.locator("#f-service").count():
            if not await page.evaluate("document.getElementById('f-service').value"):
                await page.select_option("#f-service", index=1)
        rep["fixedWhileTyping"] = await page.evaluate("document.querySelectorAll('#lead-form [aria-invalid=true]').length")
        await btn.click(); await page.wait_for_timeout(250)
        rep["formValid"] = await page.evaluate("document.querySelector('.form__status').textContent")
        await page.locator("#lead-form").screenshot(path=str(OUT / f"{stem}-form-sent.png"))
    STEP[0] = "prefill"
    # prefill
    pre = page.locator("[data-service], [data-facility], [data-city]")
    if await pre.count():
        await page.goto(url, wait_until="networkidle")
        target = pre.nth(min(1, await pre.count() - 1))
        attrs = await target.evaluate("e => ({s: e.dataset.service, f: e.dataset.facility, c: e.dataset.city})")
        await target.scroll_into_view_if_needed(); await target.click(); await page.wait_for_timeout(700)
        rep["prefill"] = {"want": attrs, "got": await page.evaluate("({s: (document.getElementById('f-service')||{}).value, f: (document.getElementById('f-facility')||{}).value, c: (document.getElementById('f-city')||{}).value, focus: document.activeElement.id})")}
    STEP[0] = "kb"
    # keyboard first stops
    await page.goto(url, wait_until="networkidle")
    kb = []
    for i in range(4):
        await page.keyboard.press("Tab")
        kb.append(await page.evaluate("(() => { const e = document.activeElement; const c = getComputedStyle(e); return (e.textContent||e.tagName).trim().slice(0,24) + ' | ' + c.outlineStyle + ' ' + c.outlineWidth; })()"))
    rep["keyboard"] = kb
    STEP[0] = "vp1280"
    await page.set_viewport_size({"width": 1280, "height": 800}); await page.goto(url, wait_until="networkidle"); await page.wait_for_timeout(200)
    rep["fold1280"] = await page.evaluate(FOLD)
    await ctx.close()
    ov = {}
    for w in [320, 390, 768, 1024, 1280, 1920]:
        c2 = await browser.new_context(viewport={"width": w, "height": 900}); p2 = await c2.new_page()
        await p2.goto(url, wait_until="networkidle"); await p2.wait_for_timeout(150)
        o = await p2.evaluate(OVERFLOW)
        if o["sw"] > o["w"] or o["off"]: ov[w] = o
        if w == 768: await p2.screenshot(path=str(OUT / f"{stem}-w768.png"))
        await c2.close()
    rep["overflow"] = ov
    c3 = await browser.new_context(viewport={"width": 390, "height": 844}, is_mobile=True, has_touch=True, device_scale_factor=2); p3 = await c3.new_page()
    await p3.goto(url, wait_until="networkidle"); await p3.wait_for_timeout(300)
    await p3.screenshot(path=str(OUT / f"{stem}-phone-fold.png")); rep["phoneFold"] = await p3.evaluate(FOLD)
    rep["targets"] = await p3.evaluate(TARGETS)
    await shoot_full(p3, OUT / f"{stem}-phone.png")
    await p3.evaluate("window.scrollTo(0,0)")
    await p3.locator(".menu-btn").click(); await p3.wait_for_timeout(200)
    rep["menu"] = {"open": await p3.evaluate("!document.getElementById('mobile-nav').hidden")}
    if name == "index.html": await p3.screenshot(path=str(OUT / f"{stem}-phone-menu.png"))
    await p3.keyboard.press("Escape"); rep["menu"]["closed"] = await p3.evaluate("document.getElementById('mobile-nav').hidden")
    await c3.close()
    if name in ("index.html", "contact.html", "office-janitorial-cleaning.html"):
        c4 = await browser.new_context(viewport={"width": 390, "height": 844}, java_script_enabled=False); p4 = await c4.new_page()
        await p4.goto(url, wait_until="networkidle")
        rep["noJs"] = await p4.evaluate("({h1: !!document.querySelector('main h1').getBoundingClientRect().height, form: !!document.querySelector('#lead-form') && document.querySelector('#lead-form').getBoundingClientRect().height > 0, faq: document.querySelectorAll('details').length})")
        await c4.close()
    return name, rep

async def main():
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--no-sandbox"])
        sem = asyncio.Semaphore(3)
        async def run(n):
            async with sem:
                return await check_page(browser, n)
        results = dict(await asyncio.gather(*[run(n) for n in PAGES]))
        await browser.close()
    # internal links and anchors
    all_ids = {n: set(r["ids"]) for n, r in results.items()}
    broken = []
    for n, r in results.items():
        for href in r["links"]:
            if re.match(r"^(https?:|mailto:|tel:)", href): continue
            page, _, frag = href.partition("#")
            target = page or n
            if not (SITE / target).exists(): broken.append((n, href)); continue
            if frag and target in all_ids and frag not in all_ids[target]: broken.append((n, href))
            if frag and target not in all_ids:
                txt = (SITE / target).read_text()
                if f'id="{frag}"' not in txt: broken.append((n, href))
        r.pop("links"); r.pop("ids")
    results["_broken"] = broken
    (OUT / "report.json").write_text(json.dumps(results, indent=1))

asyncio.run(main())
r = json.loads((OUT / "report.json").read_text())
print("broken links:", r.pop("_broken"))
for n, x in r.items():
    print(f"\n== {n} | axe {[(a['id'], a['n']) for a in x['axe']]} | words {x['words']} | dup {x['dupIds']} | console {x['console'][:2]} | fonts {x['fonts']}")
    print(f"   fold1280 {x['fold1280']} | phoneFold {x['phoneFold']} | overflow {x['overflow']} | targets {x['targets'][:6]}")
    print(f"   form {x.get('formEmpty')} fixed {x.get('fixedWhileTyping')} valid {str(x.get('formValid'))[:50]} | prefill {x.get('prefill')} | menu {x['menu']} | dd {x.get('dropdownVisible')} | noJs {x.get('noJs')}")
    print(f"   kb {x['keyboard']}")
    if x['axe']: print("   axe detail:", json.dumps(x['axe'])[:900])
