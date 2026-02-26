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

// Menu Filter
const menuTabs = document.querySelectorAll('.menu-tab');
const menuItems = document.querySelectorAll('.menu-item');

menuTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove active class from all tabs
        menuTabs.forEach(t => t.classList.remove('active'));
        // Add active to clicked tab
        tab.classList.add('active');
        
        const category = tab.dataset.category;
        
        menuItems.forEach(item => {
            if (category === 'all' || item.dataset.category === category) {
                item.style.display = 'block';
                item.style.animation = 'fadeInUp 0.5s ease';
            } else {
                item.style.display = 'none';
            }
        });
    });
});

// Reservation Form
const reservationForm = document.getElementById('reservationForm');

// Set minimum date to today
const dateInput = document.getElementById('date');
const today = new Date().toISOString().split('T')[0];
dateInput.min = today;

reservationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        date: document.getElementById('date').value,
        time: document.getElementById('time').value,
        guests: document.getElementById('guests').value,
        table: document.getElementById('table').value,
        message: document.getElementById('message').value
    };
    
    // Format date
    const dateObj = new Date(formData.date);
    const formattedDate = dateObj.toLocaleDateString('pl-PL', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    let alertMessage = `✅ Dziękujemy za rezerwację, ${formData.name}!\n\n`;
    alertMessage += `📅 Data: ${formattedDate}\n`;
    alertMessage += `🕐 Godzina: ${formData.time}\n`;
    alertMessage += `👥 Liczba osób: ${formData.guests}\n`;
    
    if (formData.table && formData.table !== '') {
        const tableNames = {
            'window': 'przy oknie',
            'terrace': 'na tarasie',
            'quiet': 'spokojny kącik'
        };
        alertMessage += `📍 Stolik: ${tableNames[formData.table]}\n`;
    }
    
    alertMessage += `\n📱 Wyślemy potwierdzenie SMS-em na numer: ${formData.phone}`;
    
    if (formData.message) {
        alertMessage += `\n\n💬 Twoja wiadomość:\n"${formData.message}"`;
    }
    
    alert(alertMessage);
    reservationForm.reset();
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

// Scroll animations
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

document.querySelectorAll('.menu-item, .gallery-item, .contact-card').forEach(item => {
    item.style.opacity = '0';
    observer.observe(item);
});

// Scroll down button
document.querySelector('.scroll-down')?.addEventListener('click', () => {
    document.querySelector('.about').scrollIntoView({ behavior: 'smooth' });
});

// Active nav on scroll
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

console.log('🍽️ Strona restauracji gotowa!\n💡 Personalizuj w index.html\n📸 Zamień placeholdery na prawdziwe zdjęcia\n🗺️ Dodaj Google Maps w sekcji kontakt');

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
