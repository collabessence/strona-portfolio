// Fitness Club - Main Script

// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
    });

    // Close menu when clicking on nav link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });
}

// Smooth Scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Signup Form Handling
const signupForm = document.querySelector('.signup-form');
if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            plan: document.getElementById('plan').value,
            goal: document.getElementById('goal').value
        };
        
        // Basic validation
        if (!formData.name || !formData.phone || !formData.email) {
            alert('Proszę wypełnić wszystkie wymagane pola!');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            alert('Proszę podać poprawny adres email!');
            return;
        }
        
        // Phone validation (Polish format)
        const phoneRegex = /^[\+]?[0-9]{9,15}$/;
        if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
            alert('Proszę podać poprawny numer telefonu!');
            return;
        }
        
        // Simulate form submission
        console.log('Form submitted:', formData);
        
        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <h3>Dziękujemy za zapisy!</h3>
            <p>Skontaktujemy się z Tobą w ciągu 24h, aby potwierdzić szczegóły.</p>
        `;
        successMessage.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 40px;
            border-radius: 15px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            text-align: center;
            z-index: 10000;
            max-width: 400px;
        `;
        successMessage.querySelector('i').style.cssText = `
            font-size: 4rem;
            color: #10b981;
            margin-bottom: 20px;
        `;
        successMessage.querySelector('h3').style.cssText = `
            font-size: 1.8rem;
            color: #1f2937;
            margin-bottom: 15px;
        `;
        successMessage.querySelector('p').style.cssText = `
            font-size: 1.1rem;
            color: #6b7280;
        `;
        
        // Add overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 9999;
        `;
        
        document.body.appendChild(overlay);
        document.body.appendChild(successMessage);
        
        // Reset form
        signupForm.reset();
        
        // Close message after 3 seconds
        setTimeout(() => {
            successMessage.remove();
            overlay.remove();
        }, 3000);
        
        // Close on click
        overlay.addEventListener('click', () => {
            successMessage.remove();
            overlay.remove();
        });
    });
}

// Scroll Animations with IntersectionObserver
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -80px 0px'
};

const animateOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            // Unobserve after animation
            animateOnScroll.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.feature-card, .plan-card, .trainer-card, .transformation-card').forEach(el => {
    el.classList.add('animate-on-scroll');
    animateOnScroll.observe(el);
});

// Add animation classes via CSS
const style = document.createElement('style');
style.textContent = `
    .animate-on-scroll {
        opacity: 0;
        transform: translateY(40px);
        transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .animate-on-scroll.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);

// Navbar background change on scroll
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(31, 41, 55, 0.98)';
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.background = 'rgba(31, 41, 55, 0.95)';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
    }
});

// Counter Animation for Stats
const animateCounter = (element, target, duration = 2000) => {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target.toLocaleString('pl-PL');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start).toLocaleString('pl-PL');
        }
    }, 16);
};

// Trigger counter animations when stats section is visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counters = entry.target.querySelectorAll('.stat-number');
            counters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-target'));
                if (target) {
                    animateCounter(counter, target);
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.stats-section, .hero-stats');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// Plan Card Hover Effect Enhancement
document.querySelectorAll('.plan-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-15px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// Transformation Gallery - Before/After Toggle
document.querySelectorAll('.transformation-card').forEach(card => {
    const toggleBtn = card.querySelector('.toggle-comparison');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            card.classList.toggle('show-after');
            toggleBtn.textContent = card.classList.contains('show-after') ? 'Pokaż Przed' : 'Pokaż Po';
        });
    }
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    if (hero) {
        const scrolled = window.pageYOffset;
        const parallax = scrolled * 0.5;
        hero.style.transform = `translateY(${parallax}px)`;
    }
});

// Loading Animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Add smooth reveal for page load
const pageStyle = document.createElement('style');
pageStyle.textContent = `
    body {
        opacity: 0;
        transition: opacity 0.5s ease-in;
    }
    
    body.loaded {
        opacity: 1;
    }
`;
document.head.appendChild(pageStyle);

// Console log for debugging
console.log('Fitness Club Script Loaded Successfully!');
console.log('Features: Mobile Menu, Smooth Scroll, Form Validation, Scroll Animations, Parallax');
