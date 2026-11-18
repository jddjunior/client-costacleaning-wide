/* Costa Cleaning Co.: header, menus, prefill links, walkthrough form. Every page works without this file. */
(() => {
  const d = document;
  const PHONE = '(239) 980-6084';

  /* Header shadow once the page scrolls */
  const header = d.querySelector('.header');
  if (header) {
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* Services dropdown: hover and focus work in CSS; the button adds click and Escape */
  d.querySelectorAll('.nav__item--menu').forEach((item) => {
    const btn = item.querySelector('button.nav__link');
    if (!btn) return;
    const set = (open) => { item.classList.toggle('is-open', open); btn.setAttribute('aria-expanded', String(open)); };
    btn.addEventListener('click', () => set(!item.classList.contains('is-open')));
    item.addEventListener('keydown', (e) => { if (e.key === 'Escape') { set(false); btn.focus(); } });
    d.addEventListener('click', (e) => { if (!item.contains(e.target)) set(false); });
    item.addEventListener('focusout', (e) => { if (!item.contains(e.relatedTarget)) set(false); });
  });

  /* Mobile menu */
  const menuBtn = d.querySelector('.menu-btn');
  const panel = d.getElementById('mobile-nav');
  if (menuBtn && panel) {
    const label = menuBtn.querySelector('.menu-btn__label');
    const set = (open) => {
      menuBtn.setAttribute('aria-expanded', String(open));
      panel.hidden = !open;
      if (label) label.textContent = open ? 'Close' : 'Menu';
      const use = menuBtn.querySelector('use');
      if (use) use.setAttribute('href', open ? '#i-x' : '#i-menu');
    };
    menuBtn.addEventListener('click', () => set(panel.hidden));
    panel.addEventListener('click', (e) => { if (e.target.closest('a')) set(false); });
    d.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !panel.hidden) { set(false); menuBtn.focus(); } });
    matchMedia('(min-width: 1101px)').addEventListener('change', (e) => { if (e.matches) set(false); });
  }

  /* Walkthrough form: a tap-to-advance stepper. Without JavaScript every question shows at once. */
  const form = d.getElementById('lead-form');
  if (!form) return;
  form.noValidate = true;
  const status = form.querySelector('.form__status');
  const submit = form.querySelector('button[type="submit"]');
  const wrap = form.querySelector('.fsteps');
  const steps = [...form.querySelectorAll('.fstep')];
  const stepper = form.querySelector('.stepper');
  const countEl = form.querySelector('.stepper__count');
  const backBtn = form.querySelector('.stepper__back');
  const bar = form.querySelector('.stepper__bar');
  const answersEl = form.querySelector('.answers');
  const serviceEl = d.getElementById('f-service');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const presets = (() => { try { return JSON.parse(form.dataset.presets || '{}'); } catch (err) { return {}; } })();
  const NAMES = { type: 'What you need', frequency: 'How often', project: 'Project', facility: 'Building', city: 'City', contact: 'Your details' };

  const radioVal = (name) => { const r = form.querySelector('input[type="radio"][name="' + name + '"]:checked'); return r ? r.value : ''; };
  const setRadio = (name, value) => {
    const r = [...form.querySelectorAll('input[type="radio"][name="' + name + '"]')].find((x) => x.value === value);
    if (r) r.checked = true;
  };
  const keyOf = (s) => s.dataset.step;
  const flow = () => {
    const type = radioVal('type') || 'Recurring cleaning';
    return steps.filter((s) => !s.dataset.when || s.dataset.when === type);
  };
  const answered = (s) => keyOf(s) !== 'contact' && !!radioVal(keyOf(s));
  const firstOpen = () => { const f = flow(); return f.find((s) => !answered(s)) || f[f.length - 1]; };
  const reachable = (s) => { const f = flow(); return f.slice(0, f.indexOf(s)).every(answered); };
  let current = null;

  const setHeight = () => { if (current) wrap.style.height = (current.offsetHeight + 8) + 'px'; };
  const ro = 'ResizeObserver' in window ? new ResizeObserver(setHeight) : null;

  const renderBar = () => {
    const f = flow();
    const i = f.indexOf(current);
    countEl.textContent = 'Step ' + (i + 1) + ' of ' + f.length;
    backBtn.hidden = i <= 0;
    bar.innerHTML = '';
    f.forEach((s, n) => {
      const li = d.createElement('li');
      const b = d.createElement('button');
      b.type = 'button';
      b.className = 'stepper__seg' + (n < i || answered(s) ? ' is-done' : '') + (s === current ? ' is-current' : '');
      const label = NAMES[keyOf(s)] + (answered(s) ? ': ' + radioVal(keyOf(s)) : '');
      b.setAttribute('aria-label', 'Step ' + (n + 1) + ', ' + label);
      if (s === current) b.setAttribute('aria-current', 'step');
      b.disabled = !reachable(s);
      b.addEventListener('click', () => show(s, true));
      li.appendChild(b);
      bar.appendChild(li);
    });
    // a step that is not part of this path is not sent
    steps.forEach((s) => { const on = f.includes(s); s.querySelectorAll('input[type="radio"]').forEach((r) => { r.disabled = !on; }); });
    if (answersEl) {
      answersEl.innerHTML = '';
      f.filter(answered).forEach((s) => {
        const b = d.createElement('button');
        b.type = 'button';
        b.className = 'answer';
        b.innerHTML = '<span></span><svg class="icon" aria-hidden="true"><use href="#i-pencil"/></svg>';
        b.firstChild.textContent = radioVal(keyOf(s));
        b.setAttribute('aria-label', 'Change ' + NAMES[keyOf(s)].toLowerCase() + ': ' + radioVal(keyOf(s)));
        b.addEventListener('click', () => show(s, true));
        answersEl.appendChild(b);
      });
      answersEl.hidden = !answersEl.children.length;
    }
  };

  const show = (target, focus) => {
    const f = flow();
    const ti = f.indexOf(target);
    steps.forEach((s) => {
      const on = s === target;
      s.classList.toggle('is-active', on);
      s.classList.toggle('is-before', f.indexOf(s) > -1 && f.indexOf(s) < ti);
      s.inert = !on;
      s.setAttribute('aria-hidden', String(!on));
    });
    if (ro && current) ro.unobserve(current);
    current = target;
    if (ro) ro.observe(current);
    renderBar();
    setHeight();
    if (focus) {
      const title = target.querySelector('.fstep__title');
      if (title) title.focus({ preventScroll: true });
      // keep the whole question on screen: the sticky header sits above, the phone call bar below
      const top = form.getBoundingClientRect().top;
      const bottom = target.getBoundingClientRect().bottom;
      if (top < 90 || bottom > window.innerHeight - 80) form.scrollIntoView({ block: 'start', behavior: reduce.matches ? 'auto' : 'smooth' });
    }
  };

  const advance = (radio) => {
    const s = radio.closest('.fstep');
    const opt = radio.closest('.opt');
    if (opt) opt.classList.add('is-picked');
    renderBar();
    window.setTimeout(() => {
      if (opt) opt.classList.remove('is-picked');
      const f = flow();
      const after = f.slice(f.indexOf(s) + 1);
      show(after.find((x) => !answered(x)) || f[f.length - 1], true);
    }, reduce.matches ? 0 : 180);
  };

  if (wrap && steps.length && stepper) {
    form.classList.add('is-stepped');
    stepper.hidden = false;
    // advance on a tap or click, or Space or Enter; arrow keys only move the choice
    let via = '';
    form.addEventListener('pointerdown', () => { via = 'pointer'; }, true);
    form.addEventListener('keydown', (ev) => {
      via = ev.key;
      const r = ev.target;
      if (ev.key === 'Enter' && r.type === 'radio' && r.closest('.fstep')) { ev.preventDefault(); r.checked = true; advance(r); }
    }, true);
    form.addEventListener('click', (ev) => {
      const r = ev.target;
      if (r.type !== 'radio' || !r.closest('.fstep')) return;
      if (via === 'pointer' || via === ' ') advance(r);
      via = '';
    });
    form.addEventListener('change', (ev) => { if (ev.target.type === 'radio') renderBar(); });
    backBtn.addEventListener('click', () => { const f = flow(); const i = f.indexOf(current); if (i > 0) show(f[i - 1], true); });
    window.addEventListener('resize', setHeight, { passive: true });
    show(firstOpen(), false);
  }

  /* Contact fields */
  const digits = (v) => v.replace(/\D/g, '').replace(/^1(?=\d{10}$)/, '');
  const rules = {
    'f-name': (v) => v.trim() ? '' : 'Enter your name.',
    'f-company': (v) => v.trim() ? '' : 'Enter your company or building name.',
    'f-phone': (v) => digits(v).length === 10 ? '' : 'Enter a 10-digit phone number, like (239) 555-0142.',
    'f-email': (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Enter an email address, like name@company.com.',
  };
  const check = (el) => {
    const msg = rules[el.id](el.value);
    const help = d.getElementById(el.id + '-help');
    if (msg) { el.setAttribute('aria-invalid', 'true'); if (help) help.textContent = msg; }
    else { el.removeAttribute('aria-invalid'); if (help) help.textContent = ''; }
    return !msg;
  };
  const fields = Object.keys(rules).map((id) => d.getElementById(id)).filter((el) => el && form.contains(el));
  fields.forEach((el) => {
    el.addEventListener('blur', () => { if (el.value || el.hasAttribute('aria-invalid')) check(el); });
    el.addEventListener('input', () => { if (el.hasAttribute('aria-invalid')) check(el); });
  });

  /* Links that prefill the form: data-service, data-facility, data-city */
  d.querySelectorAll('[data-service], [data-facility], [data-city]').forEach((a) => {
    a.addEventListener('click', () => {
      const v = a.dataset;
      if (v.service) {
        if (serviceEl) serviceEl.value = v.service;
        const p = presets[v.service] || {};
        Object.keys(p).forEach((k) => setRadio(k, p[k]));
      }
      if (v.facility) setRadio('facility', v.facility);
      if (v.city) setRadio('city', v.city);
      if (current) window.setTimeout(() => show(firstOpen(), true), 0);
    });
  });

  // name the service from the answers when no page or link set it
  const inferService = () => {
    if (!serviceEl || serviceEl.value) return;
    const byProject = { 'Post-construction clean': 'Post-construction cleaning', 'Vacant suite turnover': 'Vacant suite turnover cleaning', 'Window cleaning': 'Commercial window cleaning' };
    const byFacility = { 'Office': 'Office and janitorial cleaning', 'Medical or dental practice': 'Medical and dental office cleaning', 'Retail store': 'Retail and storefront cleaning' };
    const s = radioVal('type') === 'One-time project' ? byProject[radioVal('project')] : byFacility[radioVal('facility')];
    if (s) serviceEl.value = s;
  };

  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    status.classList.remove('is-warn');
    if (current) {
      const open = flow().find((s) => keyOf(s) !== 'contact' && !answered(s));
      if (open) { show(open, true); status.textContent = 'Answer this question first.'; return; }
    } else {
      const missing = ['type', 'facility', 'city'].filter((n) => !radioVal(n));
      if (missing.length) { status.textContent = 'Answer every question above before sending.'; return; }
    }
    const bad = fields.filter((el) => !check(el));
    if (bad.length) {
      status.textContent = bad.length === 1 ? 'One field needs a fix before we can send this.' : bad.length + ' fields need a fix before we can send this.';
      bad[0].focus();
      return;
    }
    inferService();
    const endpoint = (form.dataset.endpoint || '').trim();
    if (!endpoint) {
      status.classList.add('is-warn');
      status.textContent = 'This preview is not connected to Costa yet, so nothing was sent. Call ' + PHONE + ' to book your walkthrough.';
      return;
    }
    submit.disabled = true;
    submit.setAttribute('aria-busy', 'true');
    status.textContent = 'Sending your request.';
    try {
      const body = Object.fromEntries(new FormData(form));
      body.page = location.pathname;
      const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      if (current) show(firstOpen(), false);
      status.textContent = 'Request received. We will call you to set a time for your walkthrough.';
    } catch (err) {
      status.classList.add('is-warn');
      status.textContent = 'That did not send. Call ' + PHONE + ' and we will take it from there.';
    } finally {
      submit.disabled = false;
      submit.removeAttribute('aria-busy');
    }
  });
})();
