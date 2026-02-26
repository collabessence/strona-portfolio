// Mobile Navigation
const navToggle = document.getElementById('navToggle');
const navMenu = document.querySelector('.nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80;
            const targetPosition = target.offsetTop - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Form Submission
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        carBrand: document.getElementById('carBrand').value,
        carModel: document.getElementById('carModel').value,
        service: document.getElementById('service').value,
        message: document.getElementById('message').value
    };
    
    let alertMessage = `Dziękujemy za kontakt, ${formData.name}!\n\n`;
    alertMessage += `Skontaktujemy się z Tobą wkrótce.\n\n`;
    alertMessage += `Wybrana usługa: ${formData.service}\n`;
    
    if (formData.carBrand && formData.carModel) {
        alertMessage += `Auto: ${formData.carBrand} ${formData.carModel}`;
    }
    
    alert(alertMessage);
    contactForm.reset();
});

// Phone number formatting
const phoneInput = document.getElementById('phone');
phoneInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 9) value = value.slice(0, 9);
    
    if (value.length >= 3) {
        value = value.slice(0, 3) + ' ' + value.slice(3);
    }
    if (value.length >= 7) {
        value = value.slice(0, 7) + ' ' + value.slice(7);
    }
    
    e.target.value = value;
});

// Animate on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.service-card, .pricing-card, .info-card').forEach(card => {
    card.style.opacity = '0';
    observer.observe(card);
});

// Active nav link on scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-menu a[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-menu a').forEach(link => {
                link.style.color = '';
            });
            if (navLink) {
                navLink.style.color = 'var(--primary-color)';
            }
        }
    });
});

console.log('🚗 Strona gotowa!\n💡 Personalizuj kolory w style.css\n📍 Dodaj Google Maps w sekcji kontakt');

// Cookie Consent
window.addEventListener('DOMContentLoaded', () => {
    const cookieConsent = document.getElementById('cookieConsent');
    const acceptCookies = document.getElementById('acceptCookies');
    if (!localStorage.getItem('cookiesAccepted')) {
        setTimeout(() => { cookieConsent.classList.add('show'); }, 1000);
    }
    acceptCookies.addEventListener('click', () => {
        localStorage.setItem('cookiesAccepted', 'true');
        cookieConsent.classList.remove('show');
    });
});
