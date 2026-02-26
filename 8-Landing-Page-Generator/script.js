// Landing Page Generator - Main Script

// Configuration
const config = {
    headline: '',
    subheadline: '',
    description: '',
    buttonText: '',
    template: 'modern',
    fields: {
        name: true,
        email: true,
        phone: false,
        company: false
    },
    sections: {
        features: false,
        testimonials: false,
        pricing: false,
        faq: false
    },
    colors: {
        primary: '#6366f1',
        secondary: '#8b5cf6',
        bg: '#f8fafc'
    },
    animation: 'fade-in',
    formAction: '',
    thankYouUrl: ''
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeInputs();
    attachEventListeners();
    updatePreview();
});

// Initialize input values from config
function initializeInputs() {
    document.getElementById('headline').value = config.headline || 'Pobierz Darmowy E-book!';
    document.getElementById('subheadline').value = config.subheadline || '10 sprawdzonych strategii marketingowych';
    document.getElementById('description').value = config.description || 'Zdobądź dostęp do ekskluzywnego przewodnika, który pomoże Ci zwiększyć konwersję o 300%. Wypełnij formularz i pobierz natychmiast!';
    document.getElementById('buttonText').value = config.buttonText || 'Pobierz Bezpłatnie';
}

// Attach event listeners
function attachEventListeners() {
    // Text inputs - update on input
    ['headline', 'subheadline', 'description', 'buttonText', 'formAction', 'thankYouUrl'].forEach(id => {
        const element = document.getElementById(id);
        element.addEventListener('input', () => {
            config[id] = element.value;
            updatePreview();
        });
    });

    // Template selection
    document.querySelectorAll('input[name="template"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            config.template = e.target.value;
            updatePreview();
        });
    });

    // Field checkboxes
    ['name', 'email', 'phone', 'company'].forEach(field => {
        const element = document.getElementById(`field-${field}`);
        element.addEventListener('change', (e) => {
            config.fields[field] = e.target.checked;
            updatePreview();
        });
    });

    // Section checkboxes
    ['features', 'testimonials', 'pricing', 'faq'].forEach(section => {
        const element = document.getElementById(`section-${section}`);
        element.addEventListener('change', (e) => {
            config.sections[section] = e.target.checked;
            updatePreview();
        });
    });

    // Animation selector
    document.getElementById('animationType').addEventListener('change', (e) => {
        config.animation = e.target.value;
        updatePreview();
    });

    // Color pickers
    ['primaryColor', 'secondaryColor', 'bgColor'].forEach(id => {
        const element = document.getElementById(id);
        element.addEventListener('input', (e) => {
            const colorName = id.replace('Color', '');
            config.colors[colorName] = e.target.value;
            updatePreview();
        });
    });

    // Preview controls
    document.getElementById('desktopView').addEventListener('click', () => setPreviewMode('desktop'));
    document.getElementById('tabletView').addEventListener('click', () => setPreviewMode('tablet'));
    document.getElementById('mobileView').addEventListener('click', () => setPreviewMode('mobile'));

    // Generate button
    document.getElementById('generateBtn').addEventListener('click', generateCode);

    // Preview button
    document.getElementById('previewBtn').addEventListener('click', () => {
        window.open().document.write(generateHTML());
    });

    // Copy button
    document.getElementById('copyCodeBtn').addEventListener('click', copyCode);

    // Download button
    document.getElementById('downloadBtn').addEventListener('click', downloadHTML);
}

// Update live preview
function updatePreview() {
    const iframe = document.getElementById('livePreview');
    const html = generateHTML();
    
    iframe.srcdoc = html;
}

// Set preview mode (desktop/tablet/mobile)
function setPreviewMode(mode) {
    const frame = document.getElementById('previewFrame');
    const buttons = document.querySelectorAll('.preview-btn');
    
    buttons.forEach(btn => btn.classList.remove('active'));
    
    frame.classList.remove('tablet-view', 'mobile-view');
    
    if (mode === 'tablet') {
        frame.classList.add('tablet-view');
        document.getElementById('tabletView').classList.add('active');
    } else if (mode === 'mobile') {
        frame.classList.add('mobile-view');
        document.getElementById('mobileView').classList.add('active');
    } else {
        document.getElementById('desktopView').classList.add('active');
    }
}

// Generate HTML code
function generateHTML() {
    const template = getTemplate(config.template);
    
    return `<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${config.headline || 'Landing Page'}</title>
    <style>
        ${template.css}
    </style>
</head>
<body>
    ${template.html}
    
    <script>
        ${template.js}
    </script>
</body>
</html>`;
}

// Get template (Modern/Minimal/Gradient/Tech/Business/SaaS/E-commerce/Agency)
function getTemplate(templateName) {
    const templates = {
        modern: getModernTemplate(),
        minimal: getMinimalTemplate(),
        gradient: getGradientTemplate(),
        tech: getTechTemplate(),
        business: getBusinessTemplate(),
        saas: getSaaSTemplate(),
        ecommerce: getEcommerceTemplate(),
        agency: getAgencyTemplate()
    };
    
    return templates[templateName] || templates.modern;
}

// Modern Template
function getModernTemplate() {
    return {
        css: `
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: ${config.colors.bg};
                color: #1e293b;
                line-height: 1.6;
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
            }
            .container {
                max-width: 1000px;
                width: 100%;
                background: white;
                border-radius: 20px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
                overflow: hidden;
            }
            .hero {
                background: linear-gradient(135deg, ${config.colors.primary}, ${config.colors.secondary});
                color: white;
                padding: 60px 40px;
                text-align: center;
            }
            .hero h1 {
                font-size: 2.5rem;
                margin-bottom: 15px;
                font-weight: 700;
            }
            .hero h2 {
                font-size: 1.5rem;
                margin-bottom: 20px;
                opacity: 0.95;
                font-weight: 400;
            }
            .hero p {
                font-size: 1.1rem;
                opacity: 0.9;
                line-height: 1.8;
            }
            .form-section {
                padding: 50px 40px;
            }
            .form-group {
                margin-bottom: 25px;
            }
            .form-group label {
                display: block;
                margin-bottom: 8px;
                font-weight: 600;
                color: #475569;
            }
            .form-group input {
                width: 100%;
                padding: 15px;
                border: 2px solid #e2e8f0;
                border-radius: 10px;
                font-size: 1rem;
                transition: all 0.3s ease;
            }
            .form-group input:focus {
                outline: none;
                border-color: ${config.colors.primary};
                box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
            }
            .submit-btn {
                width: 100%;
                padding: 18px;
                background: ${config.colors.primary};
                color: white;
                border: none;
                border-radius: 10px;
                font-size: 1.1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            .submit-btn:hover {
                background: ${config.colors.secondary};
                transform: translateY(-2px);
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
            }
            .success-message {
                display: none;
                padding: 20px;
                background: #10b981;
                color: white;
                border-radius: 10px;
                text-align: center;
                margin-top: 20px;
            }
            @media (max-width: 768px) {
                .hero h1 { font-size: 2rem; }
                .hero h2 { font-size: 1.2rem; }
                .hero, .form-section { padding: 40px 20px; }
            }
        `,
        html: `
            <div class="container">
                <div class="hero">
                    <h1>${config.headline}</h1>
                    <h2>${config.subheadline}</h2>
                    <p>${config.description}</p>
                </div>
                <div class="form-section">
                    <form id="leadForm">
                        ${generateFormFields()}
                        <button type="submit" class="submit-btn">${config.buttonText}</button>
                    </form>
                    <div class="success-message" id="successMessage">
                        ✓ Dziękujemy! Sprawdź swoją skrzynkę email.
                    </div>
                </div>
            </div>
        `,
        js: getFormScript()
    };
}

// Minimal Template
function getMinimalTemplate() {
    return {
        css: `
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: #ffffff;
                color: #1e293b;
                line-height: 1.6;
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
            }
            .container {
                max-width: 600px;
                width: 100%;
            }
            .hero {
                text-align: center;
                margin-bottom: 50px;
                padding-bottom: 30px;
                border-bottom: 2px solid #e2e8f0;
            }
            .hero h1 {
                font-size: 2.5rem;
                margin-bottom: 15px;
                color: ${config.colors.primary};
                font-weight: 700;
            }
            .hero h2 {
                font-size: 1.3rem;
                margin-bottom: 20px;
                color: #64748b;
                font-weight: 400;
            }
            .hero p {
                font-size: 1rem;
                color: #64748b;
                line-height: 1.8;
            }
            .form-section {
                padding: 0;
            }
            .form-group {
                margin-bottom: 20px;
            }
            .form-group label {
                display: block;
                margin-bottom: 8px;
                font-weight: 600;
                color: #1e293b;
            }
            .form-group input {
                width: 100%;
                padding: 12px;
                border: 1px solid #cbd5e1;
                border-radius: 6px;
                font-size: 1rem;
                transition: all 0.3s ease;
            }
            .form-group input:focus {
                outline: none;
                border-color: ${config.colors.primary};
            }
            .submit-btn {
                width: 100%;
                padding: 15px;
                background: ${config.colors.primary};
                color: white;
                border: none;
                border-radius: 6px;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            .submit-btn:hover {
                opacity: 0.9;
            }
            .success-message {
                display: none;
                padding: 15px;
                background: #dcfce7;
                color: #166534;
                border: 1px solid #86efac;
                border-radius: 6px;
                text-align: center;
                margin-top: 20px;
            }
            @media (max-width: 768px) {
                .hero h1 { font-size: 2rem; }
                .hero h2 { font-size: 1.1rem; }
            }
        `,
        html: `
            <div class="container">
                <div class="hero">
                    <h1>${config.headline}</h1>
                    <h2>${config.subheadline}</h2>
                    <p>${config.description}</p>
                </div>
                <div class="form-section">
                    <form id="leadForm">
                        ${generateFormFields()}
                        <button type="submit" class="submit-btn">${config.buttonText}</button>
                    </form>
                    <div class="success-message" id="successMessage">
                        ✓ Dziękujemy! Sprawdź swoją skrzynkę email.
                    </div>
                </div>
            </div>
        `,
        js: getFormScript()
    };
}

// Gradient Template
function getGradientTemplate() {
    return {
        css: `
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, ${config.colors.primary}, ${config.colors.secondary}, #ec4899);
                color: white;
                line-height: 1.6;
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
            }
            .container {
                max-width: 700px;
                width: 100%;
                background: rgba(255, 255, 255, 0.95);
                border-radius: 20px;
                box-shadow: 0 30px 70px rgba(0, 0, 0, 0.3);
                overflow: hidden;
                color: #1e293b;
            }
            .hero {
                background: linear-gradient(135deg, rgba(99, 102, 241, 0.9), rgba(139, 92, 246, 0.9));
                color: white;
                padding: 50px 30px;
                text-align: center;
            }
            .hero h1 {
                font-size: 2.5rem;
                margin-bottom: 15px;
                font-weight: 700;
                text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            }
            .hero h2 {
                font-size: 1.4rem;
                margin-bottom: 20px;
                opacity: 0.95;
                font-weight: 400;
            }
            .hero p {
                font-size: 1.1rem;
                opacity: 0.9;
                line-height: 1.8;
            }
            .form-section {
                padding: 40px 30px;
            }
            .form-group {
                margin-bottom: 22px;
            }
            .form-group label {
                display: block;
                margin-bottom: 8px;
                font-weight: 600;
                color: #475569;
            }
            .form-group input {
                width: 100%;
                padding: 14px;
                border: 2px solid #e2e8f0;
                border-radius: 10px;
                font-size: 1rem;
                transition: all 0.3s ease;
                background: white;
            }
            .form-group input:focus {
                outline: none;
                border-color: ${config.colors.primary};
                box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
            }
            .submit-btn {
                width: 100%;
                padding: 16px;
                background: linear-gradient(135deg, ${config.colors.primary}, ${config.colors.secondary});
                color: white;
                border: none;
                border-radius: 10px;
                font-size: 1.1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            .submit-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
            }
            .success-message {
                display: none;
                padding: 18px;
                background: linear-gradient(135deg, #10b981, #059669);
                color: white;
                border-radius: 10px;
                text-align: center;
                margin-top: 20px;
                font-weight: 600;
            }
            @media (max-width: 768px) {
                .hero h1 { font-size: 2rem; }
                .hero h2 { font-size: 1.2rem; }
                .hero, .form-section { padding: 35px 20px; }
            }
        `,
        html: `
            <div class="container">
                <div class="hero">
                    <h1>${config.headline}</h1>
                    <h2>${config.subheadline}</h2>
                    <p>${config.description}</p>
                </div>
                <div class="form-section">
                    <form id="leadForm">
                        ${generateFormFields()}
                        <button type="submit" class="submit-btn">${config.buttonText}</button>
                    </form>
                    <div class="success-message" id="successMessage">
                        ✓ Dziękujemy! Sprawdź swoją skrzynkę email.
                    </div>
                </div>
            </div>
        `,
        js: getFormScript()
    };
}

// Generate form fields based on config
function generateFormFields() {
    let html = '';
    
    if (config.fields.name) {
        html += `
                        <div class="form-group">
                            <label for="name">Imię</label>
                            <input type="text" id="name" name="name" required>
                        </div>`;
    }
    
    if (config.fields.email) {
        html += `
                        <div class="form-group">
                            <label for="email">Email</label>
                            <input type="email" id="email" name="email" required>
                        </div>`;
    }
    
    if (config.fields.phone) {
        html += `
                        <div class="form-group">
                            <label for="phone">Telefon</label>
                            <input type="tel" id="phone" name="phone">
                        </div>`;
    }
    
    if (config.fields.company) {
        html += `
                        <div class="form-group">
                            <label for="company">Firma</label>
                            <input type="text" id="company" name="company">
                        </div>`;
    }
    
    return html;
}

// Form submission script
function getFormScript() {
    const formAction = config.formAction || 'https://formspree.io/f/YOUR_FORM_ID';
    const thankYouUrl = config.thankYouUrl;
    
    return `
        document.getElementById('leadForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);
            
            try {
                // Send to webhook or email service
                const response = await fetch('${formAction}', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                
                // Show success message
                document.getElementById('successMessage').style.display = 'block';
                e.target.reset();
                
                // Redirect if thank you URL provided
                ${thankYouUrl ? `setTimeout(() => { window.location.href = '${thankYouUrl}'; }, 2000);` : ''}
                
            } catch (error) {
                alert('Wystąpił błąd. Spróbuj ponownie.');
            }
        });
    `;
}

// Generate code and show
function generateCode() {
    const html = generateHTML();
    document.getElementById('generatedCode').textContent = html;
    document.getElementById('codeSection').style.display = 'block';
    
    // Scroll to code section
    document.getElementById('codeSection').scrollIntoView({ behavior: 'smooth' });
}

// Copy code to clipboard
function copyCode() {
    const code = document.getElementById('generatedCode').textContent;
    navigator.clipboard.writeText(code).then(() => {
        const btn = document.getElementById('copyCodeBtn');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Skopiowano!';
        
        setTimeout(() => {
            btn.innerHTML = originalText;
        }, 2000);
    });
}

// Download HTML file
function downloadHTML() {
    const html = generateHTML();
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'landing-page.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Tech Template - Dark theme with code-like styling
function getTechTemplate() {
    return {
        css: `
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
                font-family: 'Courier New', monospace;
                background: #0f172a;
                color: #e2e8f0;
                line-height: 1.6;
                min-height: 100vh;
                padding: 0;
            }
            .container {
                max-width: 1200px;
                margin: 0 auto;
            }
            .hero {
                background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
                padding: 100px 40px;
                text-align: center;
                border-bottom: 3px solid ${config.colors.primary};
                position: relative;
            }
            .hero::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: repeating-linear-gradient(
                    0deg,
                    rgba(99, 102, 241, 0.03) 0px,
                    transparent 1px,
                    transparent 2px,
                    rgba(99, 102, 241, 0.03) 3px
                );
                pointer-events: none;
            }
            .hero h1 {
                font-size: 3rem;
                margin-bottom: 15px;
                font-weight: 700;
                color: ${config.colors.primary};
                text-shadow: 0 0 20px rgba(99, 102, 241, 0.5);
                position: relative;
            }
            .hero h1::before {
                content: '> ';
                color: #10b981;
            }
            .hero h2 {
                font-size: 1.5rem;
                margin-bottom: 20px;
                color: #94a3b8;
                position: relative;
            }
            .hero p {
                font-size: 1.1rem;
                color: #cbd5e1;
                max-width: 600px;
                margin: 0 auto;
                position: relative;
            }
            ${config.sections.features ? getFeaturesCSS('tech') : ''}
            .form-section {
                padding: 60px 40px;
                background: #1e293b;
            }
            .form-group {
                margin-bottom: 25px;
            }
            .form-group label {
                display: block;
                margin-bottom: 8px;
                font-weight: 600;
                color: #94a3b8;
                font-family: 'Courier New', monospace;
            }
            .form-group label::before {
                content: '$ ';
                color: #10b981;
            }
            .form-group input {
                width: 100%;
                padding: 15px;
                border: 2px solid #334155;
                border-radius: 5px;
                font-size: 1rem;
                background: #0f172a;
                color: #e2e8f0;
                font-family: 'Courier New', monospace;
                transition: all 0.3s ease;
            }
            .form-group input:focus {
                outline: none;
                border-color: ${config.colors.primary};
                box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
            }
            .submit-btn {
                width: 100%;
                padding: 18px;
                background: ${config.colors.primary};
                color: white;
                border: none;
                border-radius: 5px;
                font-size: 1.1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                font-family: 'Courier New', monospace;
            }
            .submit-btn::before {
                content: '> ';
            }
            .submit-btn:hover {
                background: ${config.colors.secondary};
                box-shadow: 0 0 30px rgba(99, 102, 241, 0.4);
            }
            ${getAnimationCSS()}
            @media (max-width: 768px) {
                .hero h1 { font-size: 2rem; }
                .hero { padding: 60px 20px; }
                .form-section { padding: 40px 20px; }
            }
        `,
        html: getFormHTML('tech'),
        js: getFormJS()
    };
}

// Business Template - Professional corporate style
function getBusinessTemplate() {
    return {
        css: `
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
                font-family: 'Georgia', serif;
                background: #f8fafc;
                color: #1e293b;
                line-height: 1.8;
                min-height: 100vh;
            }
            .container {
                max-width: 1100px;
                margin: 0 auto;
                background: white;
            }
            .hero {
                background: linear-gradient(to right, ${config.colors.primary}, ${config.colors.secondary});
                color: white;
                padding: 80px 60px;
                text-align: left;
                position: relative;
            }
            .hero::after {
                content: '';
                position: absolute;
                bottom: -50px;
                left: 50%;
                transform: translateX(-50%);
                width: 100px;
                height: 100px;
                background: white;
                clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
            }
            .hero h1 {
                font-size: 2.8rem;
                margin-bottom: 15px;
                font-weight: 700;
                letter-spacing: -1px;
            }
            .hero h2 {
                font-size: 1.6rem;
                margin-bottom: 20px;
                font-weight: 400;
                opacity: 0.95;
            }
            .hero p {
                font-size: 1.15rem;
                opacity: 0.9;
                max-width: 650px;
            }
            ${config.sections.features ? getFeaturesCSS('business') : ''}
            ${config.sections.testimonials ? getTestimonialsCSS() : ''}
            .form-section {
                padding: 100px 60px 60px;
                background: #f1f5f9;
            }
            .form-section h3 {
                text-align: center;
                font-size: 2rem;
                margin-bottom: 40px;
                color: #0f172a;
            }
            .form-group {
                margin-bottom: 25px;
            }
            .form-group label {
                display: block;
                margin-bottom: 8px;
                font-weight: 600;
                color: #475569;
                font-family: 'Arial', sans-serif;
            }
            .form-group input {
                width: 100%;
                padding: 16px;
                border: 2px solid #cbd5e1;
                border-radius: 8px;
                font-size: 1rem;
                transition: all 0.3s ease;
                background: white;
            }
            .form-group input:focus {
                outline: none;
                border-color: ${config.colors.primary};
                box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
            }
            .submit-btn {
                width: 100%;
                padding: 18px;
                background: ${config.colors.primary};
                color: white;
                border: none;
                border-radius: 8px;
                font-size: 1.15rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            .submit-btn:hover {
                background: ${config.colors.secondary};
                transform: translateY(-2px);
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            }
            ${getAnimationCSS()}
            @media (max-width: 768px) {
                .hero { padding: 50px 30px; }
                .hero h1 { font-size: 2rem; }
                .form-section { padding: 70px 30px 40px; }
            }
        `,
        html: getFormHTML('business'),
        js: getFormJS()
    };
}

// SaaS Template - Modern software-as-a-service style
function getSaaSTemplate() {
    return {
        css: `
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                background: #ffffff;
                color: #1f2937;
                line-height: 1.6;
                min-height: 100vh;
            }
            .container {
                max-width: 1400px;
                margin: 0 auto;
            }
            .hero {
                background: linear-gradient(135deg, ${config.colors.primary} 0%, ${config.colors.secondary} 100%);
                color: white;
                padding: 120px 40px;
                text-align: center;
                position: relative;
                overflow: hidden;
            }
            .hero h1 {
                font-size: 3.5rem;
                margin-bottom: 20px;
                font-weight: 800;
                position: relative;
                letter-spacing: -2px;
            }
            .hero h2 {
                font-size: 1.8rem;
                margin-bottom: 25px;
                font-weight: 500;
                opacity: 0.95;
                position: relative;
            }
            .hero p {
                font-size: 1.2rem;
                opacity: 0.9;
                max-width: 700px;
                margin: 0 auto;
                position: relative;
            }
            ${config.sections.features ? getFeaturesCSS('saas') : ''}
            ${config.sections.pricing ? getPricingCSS() : ''}
            .form-section {
                padding: 80px 40px;
                background: #f9fafb;
            }
            .form-group {
                margin-bottom: 25px;
            }
            .form-group label {
                display: block;
                margin-bottom: 8px;
                font-weight: 600;
                color: #475569;
            }
            .form-group input {
                width: 100%;
                padding: 16px;
                border: 2px solid #e2e8f0;
                border-radius: 10px;
                font-size: 1rem;
                transition: all 0.3s ease;
            }
            .form-group input:focus {
                outline: none;
                border-color: ${config.colors.primary};
            }
            .submit-btn {
                width: 100%;
                padding: 18px;
                background: ${config.colors.primary};
                color: white;
                border: none;
                border-radius: 10px;
                font-size: 1.1rem;
                font-weight: 600;
                cursor: pointer;
            }
            .submit-btn:hover {
                background: ${config.colors.secondary};
            }
            ${getAnimationCSS()}
            @media (max-width: 768px) {
                .hero h1 { font-size: 2rem; }
                .hero { padding: 60px 20px; }
            }
        `,
        html: getFormHTML('saas'),
        js: getFormJS()
    };
}

// E-commerce Template
function getEcommerceTemplate() {
    return getModernTemplate(); // Use modern as base
}

// Agency Template
function getAgencyTemplate() {
    return getGradientTemplate(); // Use gradient as base
}

console.log('✅ Landing Page Generator loaded successfully!');
