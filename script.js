// ===== MOBILE NAV =====
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');

function closeNav() {
    nav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Otwórz menu');
}

navToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Zamknij menu' : 'Otwórz menu');
});

nav.addEventListener('click', (e) => {
    if (e.target.closest('a')) closeNav();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        closeNav();
        navToggle.focus();
    }
});

// ===== CONTACT FORM =====
// GitHub Pages has no backend, so the form composes the message in the
// visitor's mail client instead of pretending it was sent.
const CONTACT_EMAIL = 'collabessence@gmail.com';
const form = document.getElementById('contactForm');
const formError = document.getElementById('formError');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const type = form.type.value;
    const message = form.message.value.trim();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    form.name.setAttribute('aria-invalid', String(!name));
    form.email.setAttribute('aria-invalid', String(!emailOk));
    form.message.setAttribute('aria-invalid', String(!message));

    if (!name || !emailOk || !message) {
        formError.hidden = false;
        (!name ? form.name : !emailOk ? form.email : form.message).focus();
        return;
    }
    formError.hidden = true;

    const subject = `Wycena: ${type} – ${name}`;
    const body = `${message}\n\n--\n${name}\n${email}`;
    window.location.href = `mailto:${CONTACT_EMAIL}` +
        `?subject=${encodeURIComponent(subject)}` +
        `&body=${encodeURIComponent(body)}`;
});

// ===== FOOTER YEAR =====
document.getElementById('year').textContent = new Date().getFullYear();
