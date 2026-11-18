"""Build the Costa Cleaning Co. commercial site: 13 static pages into site/.
Usage: python3 -I build/build.py <project root> <brand mark svg> <lucide icons dir>"""
import html
import json
import math
import re
import shutil
import sys
from pathlib import Path

ROOT = Path(sys.argv[1]); MARK = Path(sys.argv[2]); ICONS = Path(sys.argv[3])
sys.path.insert(0, str(ROOT / "build"))
from content import *  # noqa: E402,F403

OUT = ROOT / "site"
e = html.escape
CREDITS = json.loads((ROOT / "build" / "credits.json").read_text())

# ---------- sprite: brand wave + Lucide icons (ISC) ----------
svg = MARK.read_text(encoding="utf-8")
paths = re.findall(r'<path[^>]*\sd="([^"]+)"', svg)
for d in paths:
    assert re.fullmatch(r"[MmCcLlHhVvSsQqTtZz0-9\s.,\-]+", d)
WAVE = "".join(f'<path d="{d}"/>' for d in paths)
ICON_NAMES = ["building-2", "stethoscope", "store", "utensils", "dumbbell", "warehouse", "key-round", "hard-hat", "door-open",
              "phone", "message-square-text", "shield-check", "user-check", "clipboard-check", "calendar-clock", "clock", "map-pin",
              "check", "badge-check", "refresh-ccw", "file-check-2", "chevron-down", "chevron-right", "menu", "mail", "star",
              "app-window", "spray-can", "users", "repeat-2", "plus", "arrow-right", "x"]
symbols = []
for n in ICON_NAMES:
    raw = (ICONS / f"{n}.svg").read_text()
    inner = re.search(r"<svg[^>]*>(.*)</svg>", raw, re.S).group(1)
    inner = re.sub(r"<!--.*?-->", "", inner, flags=re.S).strip()
    inner = re.sub(r"\s+", " ", inner)
    tags = set(re.findall(r"<([a-z]+)", inner))
    assert tags <= {"path", "circle", "rect", "line", "polyline", "polygon", "ellipse"}, (n, tags)
    assert not re.search(r"\son[a-z]+=", inner), n
    symbols.append(f'<symbol id="i-{n}" viewBox="0 0 24 24">{inner}</symbol>')
SPRITE = ('<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">'
          f'<symbol id="costa-wave" viewBox="62.17 2 148 148"><g transform="translate(0,253) scale(0.1,-0.1)" fill="currentColor">{WAVE}</g></symbol>'
          + "".join(symbols) + "</svg>")

def icon(name, cls="icon"):
    return f'<svg class="{cls}" aria-hidden="true"><use href="#i-{name}"/></svg>'

def stars():
    return '<span class="stars" aria-hidden="true">' + icon("star") * 5 + "</span>"

def img(key, alt, sizes, w, h, cls="", eager=False):
    lazy = 'fetchpriority="high"' if eager else 'loading="lazy" decoding="async"'
    return (f'<img{cls} src="assets/img/{key}-960.webp" srcset="assets/img/{key}-960.webp 960w, assets/img/{key}-1920.webp 1920w" '
            f'sizes="{sizes}" width="{w}" height="{h}" alt="{e(alt)}" {lazy}>')

SVC = {s["slug"]: s for s in SERVICES}
IND = {i[0]: i for i in INDUSTRIES}

# ---------- chrome ----------
UPDATED = "2026-11-15"
UPDATED_TEXT = "November 15, 2026"
REVIEWS_URL = "https://www.google.com/maps/search/?api=1&query=Costa%20Cleaning%20Co%20Fort%20Myers%20FL"
WEBSITE = {"@type": "WebSite", "@id": f"{SITE}/#website", "url": f"{SITE}/", "name": "Costa Cleaning Co.", "inLanguage": "en-US", "publisher": {"@id": f"{SITE}/#business"}}

def head(title, desc, path, schema, preload=None, ptype="WebPage"):
    canon = SITE + "/" + ("" if path == "index.html" else path)
    schema = list(schema) + [WEBSITE, {"@type": ptype, "@id": canon + "#webpage", "url": canon, "name": title, "description": desc,
              "isPartOf": {"@id": f"{SITE}/#website"}, "about": {"@id": f"{SITE}/#business"}, "publisher": {"@id": f"{SITE}/#business"},
              "dateModified": UPDATED, "inLanguage": "en-US"}]
    pre = ""
    if preload:
        pre = (f'<link rel="preload" as="image" href="assets/img/{preload}-960.webp" '
               f'imagesrcset="assets/img/{preload}-960.webp 960w, assets/img/{preload}-1920.webp 1920w" imagesizes="(max-width: 900px) 100vw, 50vw" fetchpriority="high">')
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{e(title)}</title>
<meta name="description" content="{e(desc)}">
<link rel="canonical" href="{canon}">
<meta name="author" content="Costa Cleaning Co.">
<meta name="theme-color" content="#082A6B">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Costa Cleaning Co.">
<meta property="og:title" content="{e(title)}">
<meta property="og:description" content="{e(desc)}">
<meta property="og:url" content="{canon}">
<meta property="og:image" content="{SITE}/assets/og.jpg">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="assets/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800&amp;family=Plus+Jakarta+Sans:wght@400;500;600;700&amp;display=swap">
<link rel="stylesheet" href="assets/site.css">
{pre}
<script type="application/ld+json">{json.dumps({"@context": "https://schema.org", "@graph": schema}, ensure_ascii=False).replace("</", "<\\/")}</script>
</head>
<body>
{SPRITE}
<a class="skip" href="#main">Skip to content</a>"""

NAV = [("services.html", "Services"), ("industries.html", "Industries"), ("service-areas.html", "Service areas"), ("why-costa.html", "Why Costa"), ("contact.html", "Contact")]

def logo(extra=""):
    return (f'<a class="logo{extra}" href="index.html"><svg aria-hidden="true"><use href="#costa-wave"/></svg>'
            '<span class="logo__words" aria-hidden="true"><b>COSTA</b><span>CLEANING CO.</span></span><span class="sr-only">Costa Cleaning Co., home</span></a>')

def header(current, cta="#quote"):
    def cur(href):
        return ' aria-current="page"' if href == current else ""
    svc_cur = current in ("services.html",) or current.replace(".html", "") in SVC
    drop = "".join(f'<a href="{s["slug"]}.html"{cur(s["slug"] + ".html")}><span class="badge">{icon(INCON[s["slug"]])}</span><span><b>{e(s["nav"])}</b><small>{e(s["short"])}</small></span></a>' for s in SERVICES)
    items = [f"""<div class="nav__item nav__item--menu">
          <button class="nav__link" type="button" aria-expanded="false" aria-haspopup="true"{' aria-current="page"' if svc_cur else ''}>Services{icon("chevron-down")}</button>
          <div class="dropdown">{drop}<a class="dropdown__all" href="services.html"{cur("services.html")}>All commercial cleaning services{icon("chevron-right")}</a></div>
        </div>"""]
    items += [f'<a class="nav__link" href="{h}"{cur(h)}>{t}</a>' for h, t in NAV[1:]]
    mob = "".join(f'<a href="{h}"{cur(h)}>{t}</a>' for h, t in NAV[:1])
    mob += '<div class="sub">' + "".join(f'<a href="{s["slug"]}.html"{cur(s["slug"] + ".html")}>{e(s["nav"])}</a>' for s in SERVICES) + "</div>"
    mob += "".join(f'<a href="{h}"{cur(h)}>{t}{icon("chevron-right")}</a>' for h, t in NAV[1:-1] + [("about.html", "About"), NAV[-1]])
    return f"""
<aside class="utility" aria-label="Service area and contact details"><div class="container"><p>{icon("map-pin")}Commercial cleaning across Lee and Charlotte County</p>
  <div class="utility__right"><p>{icon("clock")}{HOURS}</p><a href="mailto:{EMAIL}">{EMAIL}</a></div></div></aside>
<header class="header">
  <div class="container">
    <div class="header__bar">
      {logo()}
      <nav class="nav" aria-label="Main">
        {"".join(items)}
      </nav>
      <div class="header__actions">
        <a class="header__phone" href="tel:{TEL}">{icon("phone")}<span class="header__num">{PHONE}</span></a>
        <a class="btn btn--primary btn--sm" href="{cta}">Get a free walkthrough</a>
      </div>
      <button class="menu-btn btn btn--outline btn--sm" type="button" aria-expanded="false" aria-controls="mobile-nav"><svg class="icon" aria-hidden="true"><use href="#i-menu"/></svg><span class="menu-btn__label">Menu</span></button>
    </div>
    <nav class="mobile-nav" id="mobile-nav" aria-label="Main" hidden>
      {mob}
      <a class="btn btn--primary btn--block" href="{cta}">Get a free walkthrough</a>
    </nav>
  </div>
</header>
<main id="main">"""

INCON = {s["slug"]: s["includes"][0][1] for s in SERVICES}
INCON.update({"office-janitorial-cleaning": "building-2", "medical-dental-office-cleaning": "stethoscope", "retail-storefront-cleaning": "store",
              "post-construction-cleaning": "hard-hat", "commercial-window-cleaning": "app-window", "vacant-suite-turnover-cleaning": "key-round"})

def credits_line(keys):
    parts = []
    for k in keys:
        c = CREDITS[k]
        parts.append(f'<a href="{e(c["page"])}">{e(PHOTO_LABEL[k])}</a> by {e(c["author"])} ({e(c["license"])})')
    return "Stand-in photographs from Wikimedia Commons: " + "; ".join(parts) + "."

PHOTO_LABEL = {"openplan": "open-plan office", "corridor": "clinic corridor", "lobby": "lobby with floor scrubbers", "storefront": "glass storefront", "suite": "empty office floor", "store": "retail store"}

def footer(photo_keys, cta="#quote"):
    svc = "".join(f'<li><a href="{s["slug"]}.html">{e(s["nav"])}</a></li>' for s in SERVICES)
    comp = "".join(f'<li><a href="{h}">{t}</a></li>' for h, t in [("about.html", "About Costa"), ("why-costa.html", "Why Costa"), ("industries.html", "Industries"), ("service-areas.html", "Service areas"), ("contact.html", "Contact and free walkthrough")])
    towns = "".join(f'<li><a href="service-areas.html#{slug(c[0])}">{e(c[0])}</a></li>' for c in CITIES)
    return f"""</main>
<footer class="footer">
  <div class="container">
    <div class="footer__top">
      <div class="footer__about">
        {logo()}
        <p>Commercial cleaning for offices, medical practices, stores and facilities across Lee and Charlotte County. Licensed and insured, with background-checked crews.</p>
        <div class="nap">
          <a href="tel:{TEL}">{icon("phone")}{PHONE}</a>
          <a href="mailto:{EMAIL}">{icon("mail")}{EMAIL}</a>
          <span>{icon("clock")}{HOURS}</span>
          <span>{icon("map-pin")}Fort Myers, FL 33901</span>
        </div>
      </div>
      <nav class="footer__col" aria-labelledby="f-svc"><h2 id="f-svc">Services</h2><ul>{svc}</ul></nav>
      <nav class="footer__col" aria-labelledby="f-co"><h2 id="f-co">Company</h2><ul>{comp}</ul></nav>
      <nav class="footer__col" aria-labelledby="f-area"><h2 id="f-area">Service areas</h2><ul>{towns}</ul></nav>
    </div>
    <div class="footer__bottom">
      <p>© 2026 Costa Cleaning Co. Fort Myers, Florida.</p>
      <ul class="legal-links"><li><a href="about.html">About</a></li><li><a href="privacy.html">Privacy policy</a></li><li><a href="credits.html">Credits</a></li></ul>
    </div>
  </div>
</footer>
<div class="callbar">
  <a class="btn btn--outline" href="tel:{TEL}">{icon("phone")}Call</a>
  <a class="btn btn--primary" href="{cta}">Free walkthrough</a>
</div>
<script src="assets/site.js" defer></script>
</body>
</html>
"""

def slug(s):
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")

# ---------- form ----------
def opts(values, placeholder, selected=None):
    o = f'<option value="">{e(placeholder)}</option>'
    for v in values:
        sel = " selected" if v == selected else ""
        o += f'<option{sel}>{e(v)}</option>'
    return o

def field(fid, name, label, kind="text", auto=None, full=False, required=True, inputmode=None, select=None, optional=False):
    lab = e(label) + (' <span>(optional)</span>' if optional else "")
    help_ = f'<p class="field__help" id="{fid}-help"></p>' if required else ""
    desc = f' aria-describedby="{fid}-help"' if required else ""
    req = " required" if required else ""
    cls = "field field--full" if full else "field"
    if select is not None:
        ctl = f'<select id="{fid}" name="{name}"{req}{desc}>{select}</select>'
    elif kind == "textarea":
        ctl = f'<textarea id="{fid}" name="{name}" rows="3" placeholder="Current cleaner, start date, after-hours access"></textarea>'
    else:
        a = f' autocomplete="{auto}"' if auto else ""
        im = f' inputmode="{inputmode}"' if inputmode else ""
        ctl = f'<input id="{fid}" name="{name}" type="{kind}"{a}{im}{req}{desc}>'
    return f'<div class="{cls}"><label for="{fid}">{lab}</label>{ctl}{help_}</div>'

SERVICE_OPTIONS = [s["name"] for s in SERVICES] + ["Not sure yet"]

def lead_form(title, sub, variant="compact", service=None, facility=None, submit="Request my free walkthrough"):
    seg = """<fieldset class="seg field--full"><legend>What do you need?</legend><div class="seg__opts">
      <label><input type="radio" name="type" value="Recurring cleaning" checked>Recurring cleaning</label>
      <label><input type="radio" name="type" value="One-time project">One-time project</label></div></fieldset>"""
    rows = [field("f-name", "name", "Your name", auto="name"), field("f-company", "company", "Company", auto="organization"),
            field("f-phone", "phone", "Phone", kind="tel", auto="tel", inputmode="tel"), field("f-email", "email", "Work email", kind="email", auto="email"),
            field("f-facility", "facility", "Facility type", select=opts(FACILITY_OPTIONS, "Choose one", facility)),
            field("f-city", "city", "City", select=opts([c[0] for c in CITIES] + ["Elsewhere in Southwest Florida"], "Choose your city"))]
    if variant in ("service", "full"):
        rows.append(field("f-service", "service", "Service", full=True, select=opts(SERVICE_OPTIONS, "Choose a service", service)))
    if variant == "full":
        rows.append(field("f-size", "size", "Size", required=False, optional=True, select=opts(["Under 2,500 sq ft", "2,500 to 10,000 sq ft", "10,000 to 25,000 sq ft", "Over 25,000 sq ft"], "Not sure")))
        rows.append(field("f-frequency", "frequency", "How often", required=False, optional=True, select=opts(["Nightly", "Two to four times a week", "Weekly", "Every other week", "One time"], "Not sure yet")))
        rows.append(field("f-contract", "contract_end", "Current contract ends", required=False, optional=True, full=True, select=opts(["We have no cleaner right now", "Within 30 days", "In one to three months", "More than three months away"], "Not sure")))
        rows.append(field("f-notes", "notes", "Anything we should know", kind="textarea", required=False, optional=True, full=True))
    return f"""<div class="formcard" id="quote">
  <h2 class="formcard__title" id="quote-title">{e(title)}</h2>
  <p class="formcard__sub">{e(sub)}</p>
  <form class="form" id="lead-form" method="post" data-endpoint="/api/lead" aria-labelledby="quote-title">
    {seg}
    <div class="form__grid">{"".join(rows)}</div>
    <button class="btn btn--primary btn--block" type="submit">{e(submit)}</button>
    <p class="form__status" role="status" aria-live="polite"></p>
    <p class="form__fine">No obligation. Your details go only to Costa Cleaning Co., and we will call or email to set a time. See our <a href="privacy.html">privacy policy</a>.</p>
  </form>
</div>"""

FORM_SUB = "A real person answers during office hours. No obligation."

# ---------- sections ----------
def trust():
    items = "".join(f'<li class="trust__item"><span class="badge">{icon(i)}</span><span><b>{e(t)}</b><span>{e(s)}</span></span></li>' for i, t, s in TRUST)
    return f'<section class="trust" aria-label="Why buyers trust Costa"><div class="container"><ul class="trust__list">{items}</ul></div></section>'

def board(h_tag="h2", light=False):
    rows = "".join(f'<tr><th scope="row"><span class="board__name"><span class="badge">{icon(ic)}</span>{e(n)}</span></th><td>{e(w)}</td><td>{e(h)}</td></tr>' for n, ic, w, h in COMMITMENTS)
    band = "section section--tint board-wrap--light" if light else "section navy"
    return f"""<section class="{band}" id="standard" aria-labelledby="standard-title">
  <div class="container">
    <div class="head"><{h_tag} id="standard-title">The Costa Standard: five commitments you can hold us to</{h_tag}>
      <p>Every account gets the same five commitments in writing. Here is what each one means, and how to hold us to it.</p></div>
    <div class="board">
      <table>
        <caption class="sr-only">The Costa Standard</caption>
        <thead><tr><th scope="col">Commitment</th><th scope="col">What you get</th><th scope="col">How to hold us to it</th></tr></thead>
        <tbody>{rows}</tbody>
      </table>
      <div class="board__foot"><p>All five are written into your service agreement, along with your checklist and your flat rate.</p>
        <a class="btn btn--primary btn--sm" href="#quote">Get a free walkthrough</a></div>
    </div>
  </div>
</section>"""

def svc_cards():
    cards = ""
    for s in SERVICES:
        ticks = "".join(f'<li>{icon("check")}{e(t)}</li>' for t in s["ticks"])
        cards += f"""<li class="svc">
      <div class="svc__img">{img(s["img"], s["alt"], "(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 400px", s["w"], s["h"])}</div>
      <div class="svc__body"><h3><a href="{s["slug"]}.html">{e(s["name"])}</a></h3><p>{e(s["card"])}</p>
        <ul class="ticks">{ticks}</ul>
        <div class="svc__foot"><span class="link-more">See what's included{icon("arrow-right")}</span></div></div>
    </li>"""
    return f'<ul class="svc-grid">{cards}</ul>'

def ind_grid(link_to_page=True):
    out = "".join(f'<li><a href="industries.html#{i[0]}"><b>{e(i[1])}</b><span>{e(i[3])}</span></a></li>' for i in INDUSTRIES)
    return f'<ul class="fac-list">{out}</ul>'

def steps_list():
    return '<ol class="steps">' + "".join(f'<li class="step"><h3>{e(t)}</h3><p>{e(d)}</p></li>' for t, d in STEPS) + "</ol>"

def compare_table():
    rows = "".join(f'<tr><th scope="row">{e(a)}</th><td><span class="cell">{icon("x")}{e(b)}</span></td><td><span class="cell">{icon("check")}{e(c)}</span></td></tr>' for a, b, c in COMPARE)
    return f"""<table class="compare"><caption class="sr-only">A typical cleaning vendor compared with Costa</caption>
  <thead><tr><th scope="col"><span class="sr-only">Topic</span></th><th scope="col">Typical cleaning vendor</th><th scope="col">Costa Cleaning Co.</th></tr></thead>
  <tbody>{rows}</tbody></table>"""

def switch_section(tag="h2"):
    return f"""<section class="section" id="switching" aria-labelledby="switch-title">
  <div class="container switch">
    <div class="switch__copy"><{tag} id="switch-title">Switching from another cleaner?</{tag}>
      <p>Already under contract? Tell us when your notice period ends and we plan your first clean around it, so there is no gap and no overlap.</p>
      <a class="btn btn--primary" href="#quote">Plan my switch</a></div>
    {compare_table()}
  </div>
</section>"""

# --- service area: straight-line distances from Fort Myers ---
def miles(a, b):
    R = 3958.8
    p1, p2 = math.radians(a[0]), math.radians(b[0]); dp = p2 - p1; dl = math.radians(b[1] - a[1])
    h = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return 2 * R * math.asin(math.sqrt(h))
FM = (CITIES[0][2], CITIES[0][3])

def offset_miles(lat, lon):
    k = 69.17
    return ((lon - FM[1]) * math.cos(math.radians((lat + FM[0]) / 2)) * k, (FM[0] - lat) * k)

LABEL_SIDE = {"Fort Myers": ("end", -14, 22), "North Fort Myers": ("end", -14, -6), "Cape Coral": ("end", -15, 5), "Lehigh Acres": ("middle", 0, 30),
              "Estero": ("start", 15, 5), "Bonita Springs": ("start", 15, 5), "Sanibel": ("end", -15, 5), "Punta Gorda": ("start", 15, 5)}

MAP = json.loads((ROOT / "build" / "map.json").read_text())
LABEL_SIDE = {"Fort Myers": ("start", 14, 7), "North Fort Myers": ("end", -14, -2), "Cape Coral": ("end", -14, 5), "Lehigh Acres": ("middle", 0, 31),
              "Estero": ("start", 14, 5), "Bonita Springs": ("start", 14, 5), "Sanibel": ("end", -14, 5), "Punta Gorda": ("start", 14, 5)}
_map_n = [0]
def area_map(big=False):
    _map_n[0] += 1
    cid = f"land-{_map_n[0]}"
    W, H, ppm = MAP["w"], MAP["h"], MAP["pxPerMile"]
    fx, fy = MAP["cities"]["Fort Myers"]
    k = 0.7071  # ring labels sit on the north-west of each ring, clear of the city labels
    rings = "".join(f'<circle class="ring" cx="{fx}" cy="{fy}" r="{r * ppm:.1f}"/><text class="ring-label" x="{fx - k * r * ppm - 5:.1f}" y="{fy - k * r * ppm - 5:.1f}" text-anchor="end">{r} mi</text>' for r in (10, 20))
    pins = ""
    for name, county, la, lo, _ in CITIES:
        x, y = MAP["cities"][name]
        anchor, ox, oy = LABEL_SIDE[name]
        hq = " pin--hq" if name == "Fort Myers" else ""
        pins += (f'<g class="pin{hq}"><circle class="halo" cx="{x}" cy="{y}" r="13"/><circle class="dot" cx="{x}" cy="{y}" r="6"/>'
                 f'<text x="{x + ox:.1f}" y="{y + oy:.1f}" text-anchor="{anchor}">{e(name)}</text></g>')
    ins = MAP["inset"]; ix, iy = W - ins["w"] - 16, 16
    lx, ly = MAP["labels"]["Lee"]; cx, cy = MAP["labels"]["Charlotte"]
    counties = (f'<text class="county-label" x="{lx}" y="{ly}" text-anchor="middle">LEE COUNTY</text>'
                f'<text class="county-label" x="{ix - 16}" y="{cy}" text-anchor="end">CHARLOTTE COUNTY</text>')
    sx, sy, ten = 24, H - 28, 10 * ppm
    scale = (f'<g class="scale"><rect x="{sx - 8}" y="{sy - 26}" width="{ten + 16:.0f}" height="38" rx="6"/><line x1="{sx}" y1="{sy}" x2="{sx + ten:.1f}" y2="{sy}"/>'
             f'<line x1="{sx}" y1="{sy - 5}" x2="{sx}" y2="{sy + 5}"/><line x1="{sx + ten:.1f}" y1="{sy - 5}" x2="{sx + ten:.1f}" y2="{sy + 5}"/><text x="{sx}" y="{sy - 10}">10 miles</text></g>')
    bx, by, bw, bh = ins["box"]
    inset = (f'<g class="inset" transform="translate({ix},{iy})"><rect class="inset__bg" width="{ins["w"]}" height="{ins["h"]}" rx="8"/>'
             f'<path class="inset__land" d="{ins["d"]}"/><rect class="inset__box" x="{bx - 3}" y="{by - 3}" width="{bw + 6}" height="{bh + 6}" rx="2"/>'
             f'<text class="inset__label" x="10" y="{ins["h"] - 10}">Florida</text></g>')
    return f"""<figure class="map"><svg viewBox="0 0 {W} {H}" role="img" aria-labelledby="map-t-{_map_n[0]} map-d-{_map_n[0]}">
  <title id="map-t-{_map_n[0]}">Costa Cleaning Co. service area in Southwest Florida</title>
  <desc id="map-d-{_map_n[0]}">A map of Lee and Charlotte County, Florida, with the eight cities Costa serves from Punta Gorda in the north to Bonita Springs in the south, rings at 10 and 20 miles from Fort Myers, and a small map of Florida showing where the area sits.</desc>
  <defs><clipPath id="{cid}"><path d="{MAP["land"]}"/></clipPath></defs>
  <rect class="water" width="{W}" height="{H}"/>
  <path class="land" d="{MAP["land"]}"/>
  <path class="served" d="{MAP["served"]}" clip-path="url(#{cid})"/>
  {counties}{rings}{pins}{scale}{inset}</svg>
  <figcaption>Map data © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors</figcaption></figure>"""

def towns_list():
    out = ""
    for name, county, la, lo, _ in CITIES:
        mi = "Home base" if name == "Fort Myers" else f"{miles(FM, (la, lo)):.0f} mi"
        out += f'<a href="service-areas.html#{slug(name)}">{e(name)}<small>{mi}</small>{icon("chevron-right")}</a>'
    return f'<nav class="towns" aria-label="Cities we serve">{out}</nav>'

def area_section(tag="h2"):
    return f"""<section class="section section--line" id="area" aria-labelledby="area-title">
  <div class="container area">
    <div class="area__copy"><{tag} id="area-title">Serving Lee and Charlotte County</{tag}>
      <p>From Punta Gorda to Bonita Springs, with Fort Myers as home base. Distances are straight-line miles from Fort Myers.</p>
      {towns_list()}</div>
    {area_map()}
  </div>
</section>"""

def faq_block(items, title="Questions facility managers ask", intro="Straight answers on price, crews, scheduling and switching.", tag="h2", sid="faq"):
    qa = "".join(f'<details><summary>{e(q)}{icon("plus")}</summary><div class="qa__a"><p>{e(a)}</p></div></details>' for q, a in items)
    return f"""<section class="section section--tint" id="{sid}" aria-labelledby="{sid}-title">
  <div class="container faq">
    <div class="faq__intro"><{tag} id="{sid}-title">{e(title)}</{tag}><p>{e(intro)}</p>
      <a class="btn btn--outline" href="tel:{TEL}">{icon("phone")}Call {PHONE}</a></div>
    <div class="qa">{qa}</div>
  </div>
</section>"""

def cta_band(title="Ready for a cleaner you never have to chase?", text="Book a free walkthrough, on site or by video. You get one flat rate in writing, and no obligation.", href="#quote"):
    return f"""<section class="navy cta-band" aria-labelledby="cta-title">
  <div class="container cta-band__inner">
    <div><h2 id="cta-title">{e(title)}</h2><p>{e(text)}</p></div>
    <div class="cta-band__actions"><a class="btn btn--light" href="{href}">Get a free walkthrough</a><a class="btn btn--ghost" href="tel:{TEL}">{icon("phone")}Call {PHONE}</a></div>
  </div>
</section>"""

def book_section(title, sub, variant="service", service=None, facility=None, heading="Book a free walkthrough", text="We walk your space, on site or by video, then send one flat rate in writing."):
    ticks = "".join(f'<li>{icon("check")}{e(t)}</li>' for t in ["No obligation, no hourly billing", "One point of contact from day one", "First clean on the date you choose"])
    return f"""<section class="section navy" aria-labelledby="book-title">
  <div class="container book">
    <div class="book__copy"><h2 id="book-title">{e(heading)}</h2><p>{e(text)}</p>
      <ul class="book__list">{ticks}</ul>
      <div class="book__call">{icon("phone")}<span>Rather talk now?<br><a href="tel:{TEL}">{PHONE}</a></span></div></div>
    {lead_form(title, sub, variant=variant, service=service, facility=facility)}
  </div>
</section>"""

def crumbs(trail):
    parts = [f'<a href="index.html">Home</a>']
    for i, (label, href) in enumerate(trail):
        parts.append(icon("chevron-right"))
        if href:
            parts.append(f'<a href="{href}">{e(label)}</a>')
        else:
            parts.append(f'<span aria-current="page">{e(label)}</span>')
    return '<nav class="crumbs" aria-label="Breadcrumb">' + "".join(parts) + "</nav>"

def byline():
    return (f'<div class="byline"><div class="container"><p>Published by <a href="about.html">Costa Cleaning Co.</a>, Fort Myers, Florida. '
            f'Last updated <time datetime="{UPDATED}">{UPDATED_TEXT}</time>.</p></div></div>')

def proof_line(extra=True):
    items = f'<a class="proof__item proof__link" href="{REVIEWS_URL}" rel="noopener">{stars()}<span><strong>5.0</strong> on Google reviews</span></a>'
    items += f'<span class="proof__item">{icon("shield-check")}Licensed and insured</span>'
    if extra:
        items += f'<span class="proof__item">{icon("user-check")}Background-checked crews</span>'
    return f'<div class="proof">{items}</div>'

# ---------- schema ----------
AREA = [{"@type": "City", "name": f"{c[0]}, FL"} for c in CITIES]
BUSINESS = {
    "@type": "LocalBusiness", "@id": f"{SITE}/#business", "name": "Costa Cleaning Co.",
    "description": "Commercial cleaning for offices, medical practices, retail stores and facilities in Fort Myers and Southwest Florida.",
    "url": f"{SITE}/", "telephone": "+1-239-980-6084", "email": EMAIL, "image": f"{SITE}/assets/og.jpg", "logo": f"{SITE}/assets/favicon.svg",
    "address": {"@type": "PostalAddress", "addressLocality": "Fort Myers", "addressRegion": "FL", "postalCode": "33901", "addressCountry": "US"},
    "openingHoursSpecification": [{"@type": "OpeningHoursSpecification", "dayOfWeek": [f"https://schema.org/{d}" for d in ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]], "opens": "08:00", "closes": "19:00"}],
    "areaServed": AREA,
    "hasMap": REVIEWS_URL,
    "knowsAbout": ["Commercial cleaning", "Janitorial services", "Office cleaning", "Medical and dental office cleaning", "Retail cleaning",
                   "Post-construction cleaning", "Commercial window cleaning", "Vacant suite turnover cleaning"],
    "hasOfferCatalog": {"@type": "OfferCatalog", "name": "Commercial cleaning services", "itemListElement": [{"@type": "Offer", "itemOffered": {"@type": "Service", "name": s["name"], "url": f"{SITE}/{s['slug']}.html"}} for s in SERVICES]},
}
def faq_schema(items):
    return {"@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in items]}
def crumb_schema(trail):
    items = [{"@type": "ListItem", "position": 1, "name": "Home", "item": f"{SITE}/"}]
    for i, (n, href) in enumerate(trail, start=2):
        items.append({"@type": "ListItem", "position": i, "name": n, "item": f"{SITE}/{href}"})
    return {"@type": "BreadcrumbList", "itemListElement": items}

PAGES = {}

# ---------- Home ----------
def page_home():
    keys = ["openplan"] + [s["img"] for s in SERVICES]
    body = head("Commercial Cleaning in Fort Myers, FL | Costa Cleaning Co.",
                "Commercial cleaning for offices, medical practices and retail stores in Fort Myers and Southwest Florida. One point of contact, the same crew, a checklist every visit, one flat rate.",
                "index.html", [BUSINESS, faq_schema(FAQ_HOME)], preload="openplan")
    body += header("index.html")
    body += f"""
<section class="hero" aria-labelledby="hero-title">
  <div class="hero__bg">{img("openplan", "", "100vw", 1920, 1080, eager=True)}</div>
  <div class="container hero__grid">
    <div>
      <h1 id="hero-title">Fort Myers commercial cleaning you never have to chase</h1>
      <p class="hero__sub">Offices, medical practices, stores and facilities across Lee and Charlotte County. One point of contact, the same trained crew and a checklist every visit, all at one flat rate.</p>
      <div class="hero__actions"><a class="btn btn--light" href="#quote">Get a free walkthrough</a><a class="btn btn--ghost" href="tel:{TEL}">{icon("phone")}Call {PHONE}</a></div>
      {proof_line(extra=False)}
    </div>
    {lead_form("Request your free walkthrough", "A real person answers. Replies average 8 minutes during office hours.")}
  </div>
</section>
{trust()}
{board()}
<section class="section" id="services" aria-labelledby="svc-title">
  <div class="container">
    <div class="head"><h2 id="svc-title">Commercial cleaning services</h2><p>Six services, one point of contact. Every service is priced once, in writing, after a free walkthrough.</p></div>
    {svc_cards()}
  </div>
</section>
<section class="section section--tint" id="industries" aria-labelledby="ind-title">
  <div class="container">
    <div class="head"><h2 id="ind-title">Facilities we clean</h2><p>Every building has its own hours, rooms and rules. Your checklist is written for yours.</p></div>
    {ind_grid()}
  </div>
</section>
<section class="section" id="how-it-works" aria-labelledby="steps-title">
  <div class="container">
    <div class="head"><h2 id="steps-title">How getting started works</h2><p>Four steps from first call to first clean, with one point of contact the whole way.</p></div>
    {steps_list()}
  </div>
</section>
{switch_section()}
{area_section()}
{faq_block(FAQ_HOME)}
{cta_band()}
"""
    body += footer(sorted(set(keys)))
    return body
PAGES["index.html"] = page_home

# ---------- Service pages ----------
def page_service(s):
    def _():
        trail = [("Services", "services.html"), (s["nav"], None)]
        schema = [BUSINESS, crumb_schema([("Services", "services.html"), (s["name"], f"{s['slug']}.html")]), faq_schema(s["faq"]),
                  {"@type": "Service", "name": s["name"], "serviceType": "Commercial cleaning", "provider": {"@id": f"{SITE}/#business"}, "areaServed": AREA, "url": f"{SITE}/{s['slug']}.html", "description": s["lead"]}]
        body = head(s["title"], s["desc"], f"{s['slug']}.html", schema, preload=s["img"])
        body += header(f"{s['slug']}.html")
        inc = "".join(f'<li class="inc"><div class="inc__head"><span class="badge">{icon(ic)}</span><h3>{e(t)}</h3></div><ul class="ticks">' + "".join(f'<li>{icon("check")}{e(x)}</li>' for x in items) + "</ul></li>" for t, ic, items in s["includes"])
        sched = "".join(f"<li><b>{e(a)}</b><span>{e(b)}</span></li>" for a, b in s["schedule"])
        why = "".join(f'<li><span class="badge">{icon("badge-check")}</span><div><h3>{e(a)}</h3><p>{e(b)}</p></div></li>' for a, b in s["why"])
        others = [x for x in SERVICES if x["slug"] != s["slug"]]
        oth = "".join(f'<li><a href="{x["slug"]}.html"><b>{e(x["name"])}</b><span>{e(x["card"])}</span></a></li>' for x in others)
        body += f"""
<section class="phero" aria-labelledby="hero-title">
  <div class="container phero__grid">
    <div>
      {crumbs(trail)}
      <h1 id="hero-title">{e(s["h1"])}</h1>
      <p class="hero__sub">{e(s["lead"])}</p>
      <div class="hero__actions"><a class="btn btn--light" href="#quote" data-service="{e(s["name"])}">Get a free walkthrough</a><a class="btn btn--ghost" href="tel:{TEL}">{icon("phone")}Call {PHONE}</a></div>
      {proof_line(extra=False)}
    </div>
    <figure class="phero__img">{img(s["img"], s["alt"], "(max-width: 900px) 100vw, 560px", s["w"], s["h"], eager=True)}</figure>
  </div>
</section>
<section class="section" id="included" aria-labelledby="inc-title">
  <div class="container">
    <div class="head"><h2 id="inc-title">What's included</h2><p>Your walkthrough sets the final list, room by room. This is where it starts.</p></div>
    <ul class="includes">{inc}</ul>
  </div>
</section>
<section class="section section--tint" aria-labelledby="why-title">
  <div class="container split">
    <div class="prose"><h2 id="why-title">Why facility managers choose Costa</h2>
      <p>Every account gets the same five commitments in writing: communication, accountability, dependability, quality and a schedule built around your hours.</p>
      <ul class="feat feat--one">{why}</ul>
      <p><a class="link-more" href="why-costa.html">See the Costa Standard{icon("arrow-right")}</a></p></div>
    <aside class="aside-card" aria-labelledby="sched-title"><h3 id="sched-title">Schedules</h3><ul class="sched">{sched}</ul>
      <a class="btn btn--primary btn--block aside-card__btn" href="#quote" data-service="{e(s["name"])}">Get a free walkthrough</a></aside>
  </div>
</section>
{faq_block(s["faq"], title=s["name"] + " questions", intro="Answers to what buyers ask before a walkthrough.", sid="faq")}
{byline()}
<section class="section" aria-labelledby="more-title">
  <div class="container">
    <div class="head head--action"><h2 id="more-title">Other commercial cleaning services</h2><a class="link-more" href="services.html">All services{icon("arrow-right")}</a></div>
    <ul class="fac-list fac-list--5">{oth}</ul>
  </div>
</section>
{book_section("Request a walkthrough", FORM_SUB, variant="service", service=s["name"], heading=f"Book a free {s['nav'].lower()} walkthrough")}
"""
        body += footer([s["img"]])
        return body
    return _
for s in SERVICES:
    PAGES[f"{s['slug']}.html"] = page_service(s)

# ---------- Services hub ----------
def page_services():
    trail = [("Services", None)]
    body = head("Commercial Cleaning Services in Fort Myers, FL | Costa Cleaning Co.",
                "Office, medical, retail, post-construction, window and vacant suite cleaning across Fort Myers and Southwest Florida. One point of contact and one flat rate.",
                "services.html", [BUSINESS, crumb_schema([("Services", "services.html")]), faq_schema(FAQ_HOME[1:5])])
    body += header("services.html")
    rows = ""
    for i, s in enumerate(SERVICES):
        flip = " row--flip" if i % 2 else ""
        ticks = "".join(f'<li>{icon("check")}{e(t)}</li>' for t in s["ticks"])
        rows += f"""<article class="row{flip}" id="{s['slug']}" aria-labelledby="{s['slug']}-t">
      <div class="row__img">{img(s["img"], s["alt"], "(max-width: 900px) 100vw, 580px", s["w"], s["h"])}</div>
      <div class="row__body"><h2 id="{s['slug']}-t">{e(s["name"])}</h2><p>{e(s["lead"])}</p><ul class="ticks">{ticks}</ul>
        <div class="row__actions"><a class="btn btn--primary btn--sm" href="{s['slug']}.html">See what's included</a><a class="link-more" href="#quote" data-service="{e(s["name"])}">Book a walkthrough{icon("arrow-right")}</a></div></div>
    </article>"""
    body += f"""
<section class="phero" aria-labelledby="hero-title">
  <div class="container phero__grid phero__grid--solo">
    <div>{crumbs(trail)}<h1 id="hero-title">Commercial cleaning services in Fort Myers and Southwest Florida</h1>
      <p class="hero__sub">Six services, one point of contact and one flat rate in writing. Pick a service to see exactly what is included.</p>
      <div class="hero__actions"><a class="btn btn--light" href="#quote">Get a free walkthrough</a><a class="btn btn--ghost" href="tel:{TEL}">{icon("phone")}Call {PHONE}</a></div></div>
  </div>
</section>
<section class="section"><div class="container rows">{rows}</div></section>
{faq_block(FAQ_HOME[1:5], title="Questions about our services")}
{byline()}
{book_section("Request a walkthrough", FORM_SUB, variant="service")}
"""
    body += footer(sorted(set(s["img"] for s in SERVICES)))
    return body
PAGES["services.html"] = page_services

# ---------- Industries ----------
IND_NOUN = {"offices": "office", "medical": "practice", "retail": "store", "restaurants": "restaurant", "gyms": "gym or studio",
            "warehouses": "warehouse", "vacant": "vacant suite", "construction": "site"}
def page_industries():
    trail = [("Industries", None)]
    body = head("Commercial Cleaning by Industry in Fort Myers, FL | Costa Cleaning Co.",
                "Commercial cleaning for offices, medical and dental practices, retail stores, restaurants, gyms, warehouses, vacant suites and construction sites across Southwest Florida.",
                "industries.html", [BUSINESS, crumb_schema([("Industries", "industries.html")])])
    body += header("industries.html")
    cards = ""
    for iid, name, ic, line, matters, clean, when, sslug, fac in INDUSTRIES:
        s = SVC[sslug]
        cards += f"""<article class="ind-card" id="{iid}" aria-labelledby="{iid}-t">
      <div class="ind-card__head"><span class="badge">{icon(ic)}</span><h2 class="h-card" id="{iid}-t">{e(name)}</h2></div>
      <p>{e(matters)}</p>
      <dl class="kv"><div><dt>We clean</dt><dd>{e(clean)}</dd></div><div><dt>When</dt><dd>{e(when)}</dd></div>
        <div><dt>Service</dt><dd><a href="{sslug}.html">{e(s["name"])}</a></dd></div></dl>
      <a class="link-more" href="#quote" data-facility="{e(fac)}" data-service="{e(s["name"])}">Book a walkthrough for your {e(IND_NOUN[iid])}{icon("arrow-right")}</a>
    </article>"""
    body += f"""
<section class="phero" aria-labelledby="hero-title">
  <div class="container phero__grid phero__grid--solo">
    <div>{crumbs(trail)}<h1 id="hero-title">Commercial cleaning for every kind of facility</h1>
      <p class="hero__sub">Offices, practices, stores, restaurants, gyms, warehouses, vacant suites and construction sites. Each one gets a checklist written for its rooms and its hours.</p>
      <div class="hero__actions"><a class="btn btn--light" href="#quote">Get a free walkthrough</a><a class="btn btn--ghost" href="tel:{TEL}">{icon("phone")}Call {PHONE}</a></div></div>
  </div>
</section>
<section class="section section--tint"><div class="container"><div class="ind-rows">{cards}</div></div></section>
{byline()}
{book_section("Request a walkthrough", FORM_SUB, variant="service")}
"""
    body += footer([])
    return body
PAGES["industries.html"] = page_industries

# ---------- Service areas ----------
def page_areas():
    trail = [("Service areas", None)]
    body = head("Commercial Cleaning in Lee and Charlotte County, FL | Costa Cleaning Co.",
                "Commercial cleaning in Fort Myers, Cape Coral, Bonita Springs, Estero, Lehigh Acres, North Fort Myers, Sanibel and Punta Gorda. One point of contact and one flat rate.",
                "service-areas.html", [BUSINESS, crumb_schema([("Service areas", "service-areas.html")])])
    body += header("service-areas.html")
    cities = ""
    for name, county, la, lo, blurb in CITIES:
        mi = "Home base" if name == "Fort Myers" else f"{miles(FM, (la, lo)):.0f} miles from Fort Myers"
        cities += f"""<article class="city" id="{slug(name)}" aria-labelledby="{slug(name)}-t">
      <div class="city__top"><h2 class="h-card" id="{slug(name)}-t">Commercial cleaning in {e(name)}</h2><small>{e(county)}</small></div>
      <p>{e(blurb)}</p><p><small>{mi}</small></p>
      <a class="link-more" href="#quote" data-city="{e(name)}">Book a walkthrough in {e(name)}{icon("arrow-right")}</a>
    </article>"""
    body += f"""
<section class="phero" aria-labelledby="hero-title">
  <div class="container phero__grid">
    <div>{crumbs(trail)}<h1 id="hero-title">Commercial cleaning across Lee and Charlotte County</h1>
      <p class="hero__sub">Eight cities from Punta Gorda to Bonita Springs, served from our Fort Myers home base by crews who know the area.</p>
      <div class="hero__actions"><a class="btn btn--light" href="#quote">Get a free walkthrough</a><a class="btn btn--ghost" href="tel:{TEL}">{icon("phone")}Call {PHONE}</a></div></div>
    {area_map(big=True)}
  </div>
</section>
<section class="section section--tint"><div class="container"><div class="cities">{cities}</div></div></section>
{byline()}
{book_section("Request a walkthrough", FORM_SUB, variant="service")}
"""
    body += footer([])
    return body
PAGES["service-areas.html"] = page_areas

# ---------- Why Costa ----------
WHY = [("users", "One point of contact", "A named contact who knows your building, your crew and your checklist."),
       ("user-check", "Background-checked, trained crews", "Every crew member is background-checked and trained before they clean your site."),
       ("clipboard-check", "A checklist every visit", "Room by room, written for your building after the walkthrough."),
       ("refresh-ccw", "Misses fixed free", "Tell us, and we schedule the fix at no charge."),
       ("calendar-clock", "Your hours, one rate", "Before you open, after you close or on weekends, the price is the same."),
       ("shield-check", "Equipment and products", "Commercial equipment, HEPA-filter vacuums and eco-friendly cleaning products.")]
VISIT = [
    ("Before the crew arrives", "Your point of contact confirms the crew, the checklist and any notes you sent that day."),
    ("During the visit", "The same crew works room by room through your written checklist, after you close or before you open."),
    ("Before they leave", "Every line on the checklist is done, and doors, lights and alarms are left the way you asked."),
    ("If anything was missed", "Tell your contact. The fix is scheduled at no charge and added to the checklist so it does not happen again."),
]
SAMPLE = [
    ("Reception and entry", "Entry glass and door handles, seating, front desk, floors", "Every visit"),
    ("Workstations", "Desks and shared surfaces, trash and recycling, carpets vacuumed", "Every visit"),
    ("Kitchen and break room", "Counters, sink, appliance fronts, tables, floors", "Every visit"),
    ("Restrooms", "Fixtures disinfected, mirrors, soap and paper, floors", "Every visit"),
    ("Detail work", "Baseboards, vents, light fixtures, inside microwave", "Weekly or monthly"),
]
def page_why():
    trail = [("Why Costa", None)]
    faq = FAQ_HOME[2:]
    body = head("Why Facility Managers Switch to Costa Cleaning Co. | Fort Myers, FL",
                "The Costa Standard: one point of contact, the same trained crew, a checklist every visit, misses fixed free and one flat rate. See how a Costa visit works.",
                "why-costa.html", [BUSINESS, crumb_schema([("Why Costa", "why-costa.html")]), faq_schema(faq)])
    body += header("why-costa.html")
    visit = "".join(f'<li class="step"><h3>{e(a)}</h3><p>{e(d)}</p></li>' for a, d in VISIT)
    rows = "".join(f'<tr><th scope="row">{e(a)}</th><td>{e(b)}</td><td>{e(c)}</td></tr>' for a, b, c in SAMPLE)
    body += f"""
<section class="phero" aria-labelledby="hero-title">
  <div class="container phero__grid">
    <div>{crumbs(trail)}<h1 id="hero-title">Why facility managers switch to Costa</h1>
      <p class="hero__sub">Most cleaning problems are communication problems. Costa is built around five commitments you can hold us to, written into every agreement.</p>
      <div class="hero__actions"><a class="btn btn--light" href="#quote">Get a free walkthrough</a><a class="btn btn--ghost" href="tel:{TEL}">{icon("phone")}Call {PHONE}</a></div>
      {proof_line(extra=False)}</div>
    <figure class="phero__img">{img("lobby", "A newly finished glass-walled lobby with floor scrubbers on a polished floor", "(max-width: 900px) 100vw, 560px", 1920, 1440, eager=True)}</figure>
  </div>
</section>
<section class="section" id="visit" aria-labelledby="visit-title">
  <div class="container">
    <div class="head"><h2 id="visit-title">What one visit looks like</h2><p>The same four steps on every visit, at every building.</p></div>
    <ol class="steps">{visit}</ol>
  </div>
</section>
<section class="section section--line" id="checklist" aria-labelledby="check-title">
  <div class="container split">
    <div class="prose"><h2 id="check-title">Your checklist, written for your building</h2>
      <p>After the walkthrough we write a checklist room by room, with how often each task happens. It is the list your crew works from, and the list you can hold us to.</p>
      <p>Here is an example for an office suite. Yours is written for your rooms and your hours.</p>
      <a class="btn btn--primary" href="#quote">Get your checklist written</a></div>
    <table class="spec">
      <caption>Example checklist for an office suite</caption>
      <thead><tr><th scope="col">Area</th><th scope="col">What gets cleaned</th><th scope="col">How often</th></tr></thead>
      <tbody>{rows}</tbody>
    </table>
  </div>
</section>
{board(light=True)}
{switch_section()}
{faq_block(faq, title="Questions before you switch")}
{byline()}
{book_section("Request a walkthrough", FORM_SUB, variant="service", heading="Plan your switch", text="Tell us about your building and when your current contract ends. We walk the space and send one flat rate in writing.")}
"""
    body += footer(["lobby"])
    return body
PAGES["why-costa.html"] = page_why

# ---------- Contact ----------
def page_contact():
    trail = [("Contact", None)]
    body = head("Get a Free Commercial Cleaning Walkthrough | Costa Cleaning Co. Fort Myers",
                "Book a free commercial cleaning walkthrough in Fort Myers and Southwest Florida, on site or by video. Call (239) 980-6084 or send the form.",
                "contact.html", [BUSINESS, crumb_schema([("Contact", "contact.html")])], ptype="ContactPage")
    body += header("contact.html")
    body += f"""
<section class="phero" aria-labelledby="hero-title">
  <div class="container phero__grid phero__grid--solo">
    <div>{crumbs(trail)}<h1 id="hero-title">Get a free walkthrough</h1>
      <p class="hero__sub">Tell us about your building. We walk the space with you, on site or by video, then send one flat rate in writing. No obligation.</p></div>
  </div>
</section>
<section class="section section--tint">
  <div class="container contact">
    {lead_form("Request your free walkthrough", FORM_SUB, variant="full")}
    <aside>
      <ul class="facts">
        <li><span class="badge">{icon("phone")}</span><span><small>Call or text</small><a href="tel:{TEL}">{PHONE}</a></span></li>
        <li><span class="badge">{icon("mail")}</span><span><small>Email</small><a href="mailto:{EMAIL}">{EMAIL}</a></span></li>
        <li><span class="badge">{icon("clock")}</span><span><small>Office hours</small><b>{HOURS}</b></span></li>
        <li><span class="badge">{icon("map-pin")}</span><span><small>Home base</small><b>Fort Myers, FL 33901</b></span></li>
      </ul>
      <h2 class="h-card next__title">What happens next</h2>
      <ol class="next">
        <li><span><b>We call or email you</b> to set a walkthrough time, during office hours.</span></li>
        <li><span><b>We walk the space</b> with you, on site or by video.</span></li>
        <li><span><b>You get one flat rate</b> in writing, with your checklist and schedule.</span></li>
      </ol>
    </aside>
  </div>
</section>
"""
    body += footer([], cta="#quote")
    return body
PAGES["contact.html"] = page_contact

# ---------- About ----------
ABOUT_WORK = [("user-check", "Background-checked crews", "Every crew member is background-checked before working in a client's building."),
              ("clipboard-check", "A checklist for every building", "Crews work from a checklist written room by room after the walkthrough."),
              ("spray-can", "Eco-friendly products", "We clean with eco-friendly products and bring our own supplies."),
              ("building-2", "Commercial equipment", "Our own commercial equipment, including HEPA-filter vacuums."),
              ("shield-check", "Licensed and insured", "License and insurance details are available on request."),
              ("calendar-clock", "Your hours", "Before you open, after you close or on weekends.")]
def page_about():
    trail = [("About", None)]
    body = head("About Costa Cleaning Co. | Commercial Cleaning in Fort Myers, FL",
                "Costa Cleaning Co. is a Fort Myers commercial cleaning company serving Lee and Charlotte County, built around five commitments clients can hold us to.",
                "about.html", [BUSINESS, crumb_schema([("About", "about.html")])], ptype="AboutPage")
    body += header("about.html")
    work = "".join(f'<li><span class="badge">{icon(ic)}</span><div><h3>{e(a)}</h3><p>{e(d)}</p></div></li>' for ic, a, d in ABOUT_WORK)
    commit = "".join(f'<li><b>{e(n)}.</b> {e(w)}</li>' for n, ic, w, h in COMMITMENTS)
    body += f"""
<section class="phero" aria-labelledby="hero-title">
  <div class="container phero__grid phero__grid--solo">
    <div>{crumbs(trail)}<h1 id="hero-title">About Costa Cleaning Co.</h1>
      <p class="hero__sub">A Fort Myers commercial cleaning company serving offices, practices, stores and facilities across Lee and Charlotte County.</p>
      <div class="hero__actions"><a class="btn btn--light" href="#quote">Get a free walkthrough</a><a class="btn btn--ghost" href="tel:{TEL}">{icon("phone")}Call {PHONE}</a></div></div>
  </div>
</section>
<section class="section" aria-labelledby="who-title">
  <div class="container split">
    <div class="prose"><h2 id="who-title">Who we are</h2>
      <p>Costa Cleaning Co. cleans offices, medical and dental practices, retail stores, restaurants, gyms, warehouses, vacant suites and construction sites across Southwest Florida.</p>
      <p>Most of our work happens when our clients are closed, so the standard has to hold when nobody is watching. That is why every account gets one point of contact, a checklist written for its building and the same five commitments in writing.</p>
      <p><a class="link-more" href="why-costa.html">How a Costa visit works{icon("arrow-right")}</a></p></div>
    <aside class="aside-card" aria-labelledby="glance-title"><h3 id="glance-title">At a glance</h3>
      <dl class="kv">
        <div><dt>Based in</dt><dd>Fort Myers, Florida</dd></div>
        <div><dt>Serving</dt><dd><a href="service-areas.html">Lee and Charlotte County, 8 cities</a></dd></div>
        <div><dt>Office hours</dt><dd>{HOURS}</dd></div>
        <div><dt>Phone</dt><dd><a href="tel:{TEL}">{PHONE}</a></dd></div>
        <div><dt>Email</dt><dd><a href="mailto:{EMAIL}">{EMAIL}</a></dd></div>
        <div><dt>Licensing</dt><dd>Licensed and insured</dd></div>
      </dl></aside>
  </div>
</section>
<section class="section section--tint" aria-labelledby="how-title">
  <div class="container">
    <div class="head"><h2 id="how-title">How we hire and work</h2><p>The people and practices behind every visit.</p></div>
    <ul class="feat">{work}</ul>
  </div>
</section>
<section class="section" aria-labelledby="promise-title">
  <div class="container split">
    <div class="prose"><h2 id="promise-title">What we put in writing</h2>
      <p>Five commitments go into every service agreement, with your checklist and your flat rate.</p>
      <p><a class="link-more" href="why-costa.html#standard">See the Costa Standard{icon("arrow-right")}</a></p></div>
    <ul class="every-list">{commit}</ul>
  </div>
</section>
<section class="section section--line" aria-labelledby="reviews-title">
  <div class="container reviews-cta">
    <div><h2 id="reviews-title">Hear it from our clients</h2><p>Costa is rated 5.0 on Google. Read what clients say, in their own words.</p></div>
    <a class="btn btn--outline" href="{REVIEWS_URL}" rel="noopener">{stars()}Read our Google reviews</a>
  </div>
</section>
{byline()}
{book_section("Request a walkthrough", FORM_SUB, variant="service")}
"""
    body += footer([])
    return body
PAGES["about.html"] = page_about

# ---------- Privacy ----------
PRIVACY = [
    ("Who we are", ["Costa Cleaning Co. is a commercial cleaning company in Fort Myers, Florida. This policy explains what we do with the information you send us through this website."]),
    ("What we collect", ["When you request a walkthrough, we collect what you type into the form: your name, company, phone number, work email, facility type, city and anything else you choose to tell us, such as building size or your current contract date.",
                         "We do not ask for payment details, and we do not collect information through this website for any purpose other than responding to you."]),
    ("How we use it", ["We use your details to contact you, set up a walkthrough, prepare a written quote and provide the service you agree to."]),
    ("What we never do", ["We do not sell, rent or trade your information."]),
    ("Who can see it", ["Costa Cleaning Co. staff who handle your request, and the service providers that store or deliver our email and customer records on our behalf. They may only use your information to provide those services to us."]),
    ("How long we keep it", ["We keep request details while we are talking with you and for as long as you are a client, plus a reasonable period afterwards for our records. You can ask us to delete them at any time."]),
    ("Your choices", [f"You can ask what we hold about you, ask us to correct it or ask us to delete it. Email {EMAIL} or call {PHONE}."]),
    ("Cookies and analytics", ["This website does not use advertising cookies. If we add website analytics, we will update this page to say so."]),
    ("Children", ["This website is for businesses and is not directed at children."]),
    ("Changes to this policy", [f"We will post any changes on this page with a new date. This policy was last updated on {UPDATED_TEXT}."]),
]
def page_privacy():
    trail = [("Privacy policy", None)]
    body = head("Privacy Policy | Costa Cleaning Co.", "How Costa Cleaning Co. collects, uses and protects the information you send through this website.",
                "privacy.html", [BUSINESS, crumb_schema([("Privacy policy", "privacy.html")])])
    body += header("privacy.html", cta="contact.html#quote")
    secs = "".join(f'<h2>{e(h)}</h2>' + "".join(f"<p>{e(p)}</p>" for p in ps) for h, ps in PRIVACY)
    body += f"""
<section class="phero" aria-labelledby="hero-title">
  <div class="container phero__grid phero__grid--solo"><div>{crumbs(trail)}<h1 id="hero-title">Privacy policy</h1>
    <p class="hero__sub">Effective <time datetime="{UPDATED}">{UPDATED_TEXT}</time>.</p></div></div>
</section>
<section class="section"><div class="container"><div class="legal">{secs}</div></div></section>
"""
    body += footer([], cta="contact.html#quote")
    return body
PAGES["privacy.html"] = page_privacy

# ---------- Credits ----------
PHOTO_USE = {"openplan": "Office cleaning and home page", "corridor": "Medical and dental cleaning", "lobby": "Post-construction cleaning and Why Costa",
             "storefront": "Commercial window cleaning", "suite": "Vacant suite turnovers", "store": "Retail and storefront cleaning"}
def page_credits():
    trail = [("Credits", None)]
    body = head("Credits | Costa Cleaning Co.", "Photography, map data and icon credits for the Costa Cleaning Co. website.", "credits.html",
                [BUSINESS, crumb_schema([("Credits", "credits.html")])])
    body = body.replace('<meta name="author"', '<meta name="robots" content="noindex">\n<meta name="author"')
    body += header("credits.html", cta="contact.html#quote")
    deeds = {"CC BY-SA 4.0": "https://creativecommons.org/licenses/by-sa/4.0/", "CC BY 4.0": "https://creativecommons.org/licenses/by/4.0/",
             "CC BY-SA 3.0": "https://creativecommons.org/licenses/by-sa/3.0/"}
    def title(k):
        return re.sub(r"\.(jpe?g|png|webp)$", "", CREDITS[k]["title"].replace("File:", ""), flags=re.I)
    def lic(k):
        l = CREDITS[k]["license"]
        return f'<a href="{deeds[l]}">{e(l)}</a>' if l in deeds else e(l)
    rows = "".join(f'<tr><th scope="row">{e(PHOTO_USE[k])}</th><td><a href="{e(CREDITS[k]["page"])}">{e(title(k))}</a></td><td>{e(CREDITS[k]["author"])}</td><td>{lic(k)}</td></tr>' for k in PHOTO_USE)
    body += f"""
<section class="phero" aria-labelledby="hero-title">
  <div class="container phero__grid phero__grid--solo"><div>{crumbs(trail)}<h1 id="hero-title">Credits</h1>
    <p class="hero__sub">Photography, map data and icons used on this website.</p></div></div>
</section>
<section class="section"><div class="container"><div class="legal">
  <h2>Photography</h2>
  <p>Photographs from Wikimedia Commons, used under the licenses listed.</p>
  <table class="spec"><caption class="sr-only">Photo credits</caption><thead><tr><th scope="col">Used on</th><th scope="col">Photo</th><th scope="col">By</th><th scope="col">License</th></tr></thead><tbody>{rows}</tbody></table>
  <h2>Map data</h2>
  <p>Coastline © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, available under the Open Database License, via the geo-maps project. County outlines from the U.S. Census Bureau.</p>
  <h2>Icons</h2>
  <p><a href="https://lucide.dev">Lucide</a> icons, ISC License.</p>
</div></div></section>
"""
    body += footer([], cta="contact.html#quote")
    return body
PAGES["credits.html"] = page_credits

# ---------- 404 ----------
def page_404():
    body = head("Page Not Found | Costa Cleaning Co.", "The page you were looking for is not here.", "404.html", [BUSINESS])
    body = body.replace('<meta name="theme-color"', '<meta name="robots" content="noindex">\n<meta name="theme-color"')
    body += header("404.html", cta="contact.html#quote")
    body += f"""
<section class="lost"><div class="container">
  <h1>We couldn't find that page</h1>
  <p>It may have moved. Here are the pages most visitors are looking for, or call us and a real person will help.</p>
  <div class="hero__actions"><a class="btn btn--primary" href="contact.html#quote">Get a free walkthrough</a><a class="btn btn--outline" href="tel:{TEL}">{icon("phone")}Call {PHONE}</a></div>
  <div class="lost__links">
    <a href="services.html"><b>Services</b><span>Six commercial cleaning services</span></a>
    <a href="industries.html"><b>Industries</b><span>Offices, practices, stores and more</span></a>
    <a href="service-areas.html"><b>Service areas</b><span>Eight cities in Lee and Charlotte County</span></a>
  </div>
</div></section>
"""
    body += footer([], cta="contact.html#quote")
    return body
PAGES["404.html"] = page_404

# ---------- write ----------
(OUT / "assets").mkdir(parents=True, exist_ok=True)
for name, fn in PAGES.items():
    s = fn()
    left = re.findall(r"__[A-Z_]+__|\{(?:e|icon|img)\(", s)
    assert not left, (name, left)
    (OUT / name).write_text(s, encoding="utf-8")
    print("built", name, len(s))
shutil.copy2(ROOT / "src" / "site.css", OUT / "assets" / "site.css")
shutil.copy2(ROOT / "src" / "site.js", OUT / "assets" / "site.js")
urls = "".join(f"  <url><loc>{SITE}/{'' if n == 'index.html' else n}</loc><lastmod>{UPDATED}</lastmod></url>\n" for n in PAGES if n not in ("404.html", "credits.html"))
(OUT / "sitemap.xml").write_text(f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n{urls}</urlset>\n')
(OUT / "robots.txt").write_text(f"User-agent: *\nAllow: /\nSitemap: {SITE}/sitemap.xml\n")
