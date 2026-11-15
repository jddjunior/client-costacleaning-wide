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

  /* Walkthrough form */
  const form = d.getElementById('lead-form');
  if (!form) return;
  form.noValidate = true;
  const status = form.querySelector('.form__status');
  const submit = form.querySelector('button[type="submit"]');
  const digits = (v) => v.replace(/\D/g, '').replace(/^1(?=\d{10}$)/, '');
  const rules = {
    'f-name': (v) => v.trim() ? '' : 'Enter your name.',
    'f-company': (v) => v.trim() ? '' : 'Enter your company or building name.',
    'f-phone': (v) => digits(v).length === 10 ? '' : 'Enter a 10-digit phone number, like (239) 555-0142.',
    'f-email': (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Enter an email address, like name@company.com.',
    'f-facility': (v) => v ? '' : 'Choose your facility type.',
    'f-city': (v) => v ? '' : 'Choose your city.',
    'f-service': (v) => v ? '' : 'Choose a service, or "Not sure yet".',
  };
  const check = (el) => {
    const rule = rules[el.id];
    if (!rule) return true;
    const msg = rule(el.value);
    const help = d.getElementById(el.id + '-help');
    if (msg) { el.setAttribute('aria-invalid', 'true'); if (help) help.textContent = msg; }
    else { el.removeAttribute('aria-invalid'); if (help) help.textContent = ''; }
    return !msg;
  };
  const fields = Object.keys(rules).map((id) => d.getElementById(id)).filter((el) => el && form.contains(el));
  fields.forEach((el) => {
    el.addEventListener('blur', () => { if (el.value || el.hasAttribute('aria-invalid')) check(el); });
    el.addEventListener(el.tagName === 'SELECT' ? 'change' : 'input', () => { if (el.hasAttribute('aria-invalid')) check(el); });
  });

  /* Links that prefill the form: data-service, data-facility, data-city */
  d.querySelectorAll('[data-service], [data-facility], [data-city]').forEach((a) => {
    a.addEventListener('click', () => {
      [['service', 'f-service'], ['facility', 'f-facility'], ['city', 'f-city']].forEach(([key, id]) => {
        const v = a.dataset[key];
        const el = v && d.getElementById(id);
        if (el && [...el.options].some((o) => o.value === v)) { el.value = v; check(el); }
      });
      const next = fields.find((el) => !el.value);
      if (next) setTimeout(() => next.focus({ preventScroll: true }), 0);
    });
  });

  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    status.classList.remove('is-warn');
    const bad = fields.filter((el) => !check(el));
    if (bad.length) {
      status.textContent = bad.length === 1 ? 'One field needs a fix before we can send this.' : bad.length + ' fields need a fix before we can send this.';
      bad[0].focus();
      return;
    }
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
