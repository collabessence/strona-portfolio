document.addEventListener('DOMContentLoaded', function() {
    
    // 0. Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
        });
        
        // Close menu when clicking on a link
        const navLinksItems = document.querySelectorAll('.nav-links a');
        navLinksItems.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }
    
    // 1. Simplified header scroll effect
    const header = document.querySelector('header');
    let ticking = false;
    
    function updateHeaderOnScroll() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        ticking = false;
    }
    
    function requestHeaderUpdate() {
        if (!ticking) {
            requestAnimationFrame(updateHeaderOnScroll);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestHeaderUpdate, { passive: true });
    
    // 1. Płynne przewijanie do sekcji po kliknięciu w link nawigacyjny
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                // Smooth scroll with easing
                const startPosition = window.pageYOffset;
                const distance = targetPosition - startPosition;
                const duration = 1000;
                let startTime = null;

                function animation(currentTime) {
                    if (startTime === null) startTime = currentTime;
                    const timeElapsed = currentTime - startTime;
                    const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
                    window.scrollTo(0, run);
                    if (timeElapsed < duration) requestAnimationFrame(animation);
                }

                function easeInOutQuad(t, b, c, d) {
                    t /= d / 2;
                    if (t < 1) return c / 2 * t * t + b;
                    t--;
                    return -c / 2 * (t * (t - 2) - 1) + b;
                }

                requestAnimationFrame(animation);
            }
        });
    });

    // 2. Aktywny link w nawigacji na podstawie scrolla
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

    function updateActiveNavLink() {
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNavLink);

    // 3. Obsługa formularza kontaktowego
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitButton = this.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            
            // Pobierz dane z formularza
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');
            const consent = formData.get('consent');
            const honeypot = formData.get('website');

            // Walidacja honeypot (jeśli wypełnione = bot)
            if (honeypot) {
                console.log('Bot detected');
                return; // Nie rób nic, to bot
            }

            // Walidacja zgody RODO
            if (!consent) {
                showNotification('Musisz wyrazić zgodę na przetwarzanie danych osobowych.', 'error');
                return;
            }

            // Walidacja po stronie klienta
            if (!name || name.length < 2) {
                showNotification('Imię i nazwisko musi mieć co najmniej 2 znaki.', 'error');
                return;
            }

            if (!email || !isValidEmail(email)) {
                showNotification('Proszę podać prawidłowy adres e-mail.', 'error');
                return;
            }

            if (!message || message.length < 10) {
                showNotification('Wiadomość musi mieć co najmniej 10 znaków.', 'error');
                return;
            }

            // Zablokuj przycisk podczas wysyłania
            submitButton.disabled = true;
            submitButton.textContent = 'Wysyłanie...';

            // Wyślij dane do PHP
            fetch('send.php', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Błąd serwera: ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                if (data.status === 'success') {
                    showNotification(data.message, 'success');
                    this.reset();
                } else {
                    // Pokaż błędy
                    if (data.errors && data.errors.length > 0) {
                        showNotification(data.message + '\n' + data.errors.join('\n'), 'error');
                    } else {
                        showNotification(data.message, 'error');
                    }
                }
            })
            .catch(error => {
                console.error('Błąd:', error);
                showNotification('Wystąpił błąd podczas wysyłania wiadomości. Spróbuj ponownie później.', 'error');
            })
            .finally(() => {
                // Odblokuj przycisk
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            });
        });
    }

    // 4. Walidacja e-maila
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // 5. System powiadomień
    function showNotification(message, type = 'info') {
        // Usuń istniejące powiadomienie
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Stwórz nowe powiadomienie
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);

        // Pokaż powiadomienie
        setTimeout(() => notification.classList.add('notification--show'), 100);

        // Usuń powiadomienie po 4 sekundach
        setTimeout(() => {
            notification.classList.remove('notification--show');
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }

    // 6. Lazy loading dla obrazów (jeśli dodasz obrazy w przyszłości)
    const lazyImages = document.querySelectorAll('img[data-src]');
    if (lazyImages.length > 0) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    }

    // 7. Simplified scroll animations
    const animatedElements = document.querySelectorAll('.service-item, .offer-card');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!prefersReducedMotion && animatedElements.length > 0) {
        // Simple scroll-based animation without intensive intersection observer
        let animationTriggered = false;
        
        function checkScrollAnimation() {
            if (animationTriggered) return;
            
            const scrolled = window.pageYOffset + window.innerHeight;
            const heroHeight = document.getElementById('hero')?.offsetHeight || 0;
            
            if (scrolled > heroHeight + 200) {
                animatedElements.forEach((el, index) => {
                    setTimeout(() => {
                        el.classList.add('animate-in');
                    }, index * 50);
                });
                animationTriggered = true;
                window.removeEventListener('scroll', checkScrollAnimation);
            }
        }
        
        window.addEventListener('scroll', checkScrollAnimation, { passive: true });
        
        // Fallback - show after 2 seconds regardless
        setTimeout(() => {
            if (!animationTriggered) {
                animatedElements.forEach(el => el.classList.add('animate-in'));
            }
        }, 2000);
    } else {
        animatedElements.forEach(el => el.classList.add('animate-in'));
    }

    // 8. Parallax effect removed for better scroll performance

    // 9. Performance optimization - removed cursor trail for better performance

    // 10. Optimized page load animations
    function initPageAnimations() {
        if (prefersReducedMotion) return; // Skip animations if user prefers reduced motion
        
        const pageElements = document.querySelectorAll('h1, h2, p, .breadcrumbs');
        pageElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translate3d(0, 20px, 0)'; // Use translate3d for hardware acceleration
            
            setTimeout(() => {
                el.style.transition = 'opacity 0.6s ease, transform 0.6s ease'; // Reduced duration
                el.style.opacity = '1';
                el.style.transform = 'translate3d(0, 0, 0)';
            }, index * 50); // Reduced stagger delay
        });
    }

    // Run page animations after DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPageAnimations);
    } else {
        initPageAnimations();
    }
    
    // 11. Back to top button
    const backToTopButton = document.getElementById('backToTop');
    if (backToTopButton) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        }, { passive: true });
        
        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

});