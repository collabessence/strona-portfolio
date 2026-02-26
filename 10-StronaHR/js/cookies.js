// Cookies Management System
(function() {
    'use strict';
    
    const COOKIE_NAME = 'stronahr_cookie_consent';
    const COOKIE_EXPIRY_DAYS = 365;
    
    // Helper functions
    function setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/;SameSite=Lax";
    }
    
    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }
    
    function showCookieBanner() {
        const banner = document.getElementById('cookieBanner');
        if (banner) {
            banner.classList.add('show');
        }
    }
    
    function hideCookieBanner() {
        const banner = document.getElementById('cookieBanner');
        if (banner) {
            banner.classList.remove('show');
        }
    }
    
    function enableAnalytics() {
        // Enable Google Analytics/GTM tracking
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                'analytics_storage': 'granted'
            });
        }
        console.log('Analytics enabled');
    }
    
    function disableAnalytics() {
        // Disable Google Analytics/GTM tracking
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                'analytics_storage': 'denied'
            });
        }
        console.log('Analytics disabled');
    }
    
    function acceptCookies() {
        setCookie(COOKIE_NAME, 'accepted', COOKIE_EXPIRY_DAYS);
        enableAnalytics();
        hideCookieBanner();
    }
    
    function rejectCookies() {
        setCookie(COOKIE_NAME, 'rejected', COOKIE_EXPIRY_DAYS);
        disableAnalytics();
        hideCookieBanner();
    }
    
    // Initialize on page load
    document.addEventListener('DOMContentLoaded', function() {
        const consent = getCookie(COOKIE_NAME);
        
        if (!consent) {
            // User hasn't made a choice yet
            showCookieBanner();
        } else if (consent === 'accepted') {
            // User previously accepted cookies
            enableAnalytics();
        } else {
            // User previously rejected cookies
            disableAnalytics();
        }
        
        // Event listeners for cookie buttons
        const acceptButton = document.getElementById('acceptCookies');
        const rejectButton = document.getElementById('rejectCookies');
        
        if (acceptButton) {
            acceptButton.addEventListener('click', acceptCookies);
        }
        
        if (rejectButton) {
            rejectButton.addEventListener('click', rejectCookies);
        }
    });
    
})();
