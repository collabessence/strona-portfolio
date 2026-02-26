// Generator Wizytówek PRO - Main JavaScript
// State management
const state = {
    template: 'modern',
    orientation: 'horizontal',
    cardSize: 'standard',
    fullName: 'Jan Kowalski',
    position: 'Senior Developer',
    company: 'Tech Solutions',
    phone: '+48 123 456 789',
    email: 'jan.kowalski@example.com',
    website: 'www.example.com',
    address: 'ul. Przykładowa 1, Warszawa',
    fontFamily: "'Roboto', sans-serif",
    primaryColor: '#667eea',
    secondaryColor: '#764ba2',
    accentColor: '#f093fb',
    bgColor: '#ffffff',
    useGradient: true,
    showQR: false,
    logo: null,
    linkedin: '',
    github: '',
    twitter: '',
    facebook: '',
    instagram: ''
};

// Template definitions
const templates = {
    modern: {
        name: 'Modern',
        render: (data) => `
            <div style="width: 100%; height: 100%; display: flex; font-family: ${data.fontFamily}; background: ${data.bgColor};">
                <div style="flex: 1; padding: 40px; display: flex; flex-direction: column; justify-content: center; background: ${data.useGradient ? `linear-gradient(135deg, ${data.primaryColor}, ${data.secondaryColor})` : data.primaryColor}; color: white;">
                    ${data.logo ? `<img src="${data.logo}" style="max-width: 120px; max-height: 60px; margin-bottom: 20px; object-fit: contain;" alt="Logo">` : ''}
                    <h1 style="font-size: 32px; font-weight: 700; margin: 0 0 10px 0;">${data.fullName}</h1>
                    <p style="font-size: 18px; opacity: 0.9; margin: 0 0 15px 0;">${data.position}</p>
                    <p style="font-size: 16px; opacity: 0.85; margin: 0;">${data.company}</p>
                </div>
                <div style="flex: 1; padding: 40px; display: flex; flex-direction: column; justify-content: center;">
                    ${data.phone ? `<div style="display: flex; align-items: center; margin-bottom: 12px;"><span style="color: ${data.primaryColor}; margin-right: 12px; font-size: 18px;">📞</span><span style="font-size: 15px;">${data.phone}</span></div>` : ''}
                    ${data.email ? `<div style="display: flex; align-items: center; margin-bottom: 12px;"><span style="color: ${data.primaryColor}; margin-right: 12px; font-size: 18px;">✉️</span><span style="font-size: 15px;">${data.email}</span></div>` : ''}
                    ${data.website ? `<div style="display: flex; align-items: center; margin-bottom: 12px;"><span style="color: ${data.primaryColor}; margin-right: 12px; font-size: 18px;">🌐</span><span style="font-size: 15px;">${data.website}</span></div>` : ''}
                    ${data.address ? `<div style="display: flex; align-items: center; margin-bottom: 12px;"><span style="color: ${data.primaryColor}; margin-right: 12px; font-size: 18px;">📍</span><span style="font-size: 14px;">${data.address}</span></div>` : ''}
                    ${renderSocialIcons(data)}
                    ${data.showQR ? `<div id="qrcode" style="margin-top: 15px;"></div>` : ''}
                </div>
            </div>
        `
    },
    elegant: {
        name: 'Elegant',
        render: (data) => `
            <div style="width: 100%; height: 100%; display: flex; flex-direction: column; font-family: ${data.fontFamily}; background: ${data.bgColor};">
                <div style="flex: 1; padding: 40px; background: linear-gradient(135deg, #2d3748, #4a5568); color: white; display: flex; flex-direction: column; justify-content: center; position: relative;">
                    ${data.logo ? `<img src="${data.logo}" style="max-width: 100px; max-height: 50px; margin-bottom: 20px; object-fit: contain;" alt="Logo">` : ''}
                    <div style="border-left: 4px solid ${data.accentColor}; padding-left: 20px;">
                        <h1 style="font-size: 36px; font-weight: 700; margin: 0 0 8px 0; letter-spacing: 1px;">${data.fullName}</h1>
                        <p style="font-size: 18px; margin: 0; opacity: 0.9;">${data.position}</p>
                    </div>
                </div>
                <div style="padding: 30px 40px; background: ${data.bgColor};">
                    <p style="font-size: 16px; font-weight: 600; color: ${data.primaryColor}; margin: 0 0 15px 0;">${data.company}</p>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 14px; color: #4a5568;">
                        ${data.phone ? `<div><strong>Tel:</strong> ${data.phone}</div>` : ''}
                        ${data.email ? `<div><strong>Email:</strong> ${data.email}</div>` : ''}
                        ${data.website ? `<div><strong>Web:</strong> ${data.website}</div>` : ''}
                        ${data.address ? `<div style="grid-column: 1 / -1;"><strong>Adres:</strong> ${data.address}</div>` : ''}
                    </div>
                    ${renderSocialIcons(data, data.primaryColor)}
                    ${data.showQR ? `<div id="qrcode" style="margin-top: 15px;"></div>` : ''}
                </div>
            </div>
        `
    },
    creative: {
        name: 'Creative',
        render: (data) => `
            <div style="width: 100%; height: 100%; font-family: ${data.fontFamily}; background: linear-gradient(135deg, ${data.primaryColor}, ${data.secondaryColor}); color: white; padding: 40px; position: relative; overflow: hidden;">
                <div style="position: absolute; top: -50px; right: -50px; width: 200px; height: 200px; background: ${data.accentColor}; border-radius: 50%; opacity: 0.3;"></div>
                <div style="position: absolute; bottom: -80px; left: -80px; width: 250px; height: 250px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
                <div style="position: relative; z-index: 1; height: 100%; display: flex; flex-direction: column; justify-content: space-between;">
                    <div>
                        ${data.logo ? `<img src="${data.logo}" style="max-width: 100px; max-height: 50px; margin-bottom: 25px; object-fit: contain; filter: brightness(0) invert(1);" alt="Logo">` : ''}
                        <h1 style="font-size: 42px; font-weight: 900; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 2px;">${data.fullName}</h1>
                        <p style="font-size: 20px; margin: 0 0 8px 0; opacity: 0.95; font-weight: 600;">${data.position}</p>
                        <p style="font-size: 16px; margin: 0; opacity: 0.85;">${data.company}</p>
                    </div>
                    <div>
                        <div style="background: rgba(255,255,255,0.2); padding: 20px; border-radius: 15px; backdrop-filter: blur(10px);">
                            ${data.phone ? `<div style="margin-bottom: 8px; font-size: 15px;">📞 ${data.phone}</div>` : ''}
                            ${data.email ? `<div style="margin-bottom: 8px; font-size: 15px;">✉️ ${data.email}</div>` : ''}
                            ${data.website ? `<div style="margin-bottom: 8px; font-size: 15px;">🌐 ${data.website}</div>` : ''}
                            ${data.address ? `<div style="font-size: 14px;">📍 ${data.address}</div>` : ''}
                        </div>
                        ${renderSocialIcons(data, 'white')}
                        ${data.showQR ? `<div id="qrcode" style="margin-top: 15px;"></div>` : ''}
                    </div>
                </div>
            </div>
        `
    },
    corporate: {
        name: 'Corporate',
        render: (data) => `
            <div style="width: 100%; height: 100%; font-family: ${data.fontFamily}; background: ${data.bgColor}; display: flex;">
                <div style="width: 35%; background: linear-gradient(180deg, #1e3a8a, #3b82f6); padding: 40px; display: flex; flex-direction: column; justify-content: center; color: white;">
                    ${data.logo ? `<img src="${data.logo}" style="max-width: 120px; max-height: 60px; margin-bottom: 25px; object-fit: contain; filter: brightness(0) invert(1);" alt="Logo">` : ''}
                    ${data.showQR ? `<div id="qrcode" style="margin-top: auto;"></div>` : ''}
                </div>
                <div style="flex: 1; padding: 40px; display: flex; flex-direction: column; justify-content: center;">
                    <div style="border-bottom: 3px solid ${data.primaryColor}; padding-bottom: 20px; margin-bottom: 20px;">
                        <h1 style="font-size: 32px; font-weight: 700; margin: 0 0 8px 0; color: #1e3a8a;">${data.fullName}</h1>
                        <p style="font-size: 18px; margin: 0; color: #3b82f6; font-weight: 600;">${data.position}</p>
                    </div>
                    <p style="font-size: 16px; font-weight: 700; color: #1e3a8a; margin: 0 0 15px 0;">${data.company}</p>
                    <div style="font-size: 14px; color: #4b5563;">
                        ${data.phone ? `<div style="margin-bottom: 8px;"><strong>T:</strong> ${data.phone}</div>` : ''}
                        ${data.email ? `<div style="margin-bottom: 8px;"><strong>E:</strong> ${data.email}</div>` : ''}
                        ${data.website ? `<div style="margin-bottom: 8px;"><strong>W:</strong> ${data.website}</div>` : ''}
                        ${data.address ? `<div><strong>A:</strong> ${data.address}</div>` : ''}
                    </div>
                    ${renderSocialIcons(data, data.primaryColor)}
                </div>
            </div>
        `
    },
    minimal: {
        name: 'Minimal',
        render: (data) => `
            <div style="width: 100%; height: 100%; font-family: ${data.fontFamily}; background: ${data.bgColor}; padding: 50px; display: flex; flex-direction: column; justify-content: center; border: 2px solid #e5e7eb;">
                ${data.logo ? `<img src="${data.logo}" style="max-width: 100px; max-height: 50px; margin-bottom: 30px; object-fit: contain;" alt="Logo">` : ''}
                <div style="margin-bottom: 30px;">
                    <h1 style="font-size: 36px; font-weight: 300; margin: 0 0 5px 0; color: #1a1a2e; letter-spacing: 2px;">${data.fullName}</h1>
                    <div style="width: 60px; height: 2px; background: ${data.primaryColor}; margin: 10px 0;"></div>
                    <p style="font-size: 16px; margin: 0; color: #6c757d; font-weight: 400;">${data.position}</p>
                    <p style="font-size: 14px; margin: 5px 0 0 0; color: #6c757d;">${data.company}</p>
                </div>
                <div style="font-size: 13px; color: #6c757d; line-height: 1.8;">
                    ${data.phone ? `<div>${data.phone}</div>` : ''}
                    ${data.email ? `<div>${data.email}</div>` : ''}
                    ${data.website ? `<div>${data.website}</div>` : ''}
                    ${data.address ? `<div>${data.address}</div>` : ''}
                </div>
                ${renderSocialIcons(data, data.primaryColor)}
                ${data.showQR ? `<div id="qrcode" style="margin-top: 20px;"></div>` : ''}
            </div>
        `
    },
    gradient: {
        name: 'Gradient',
        render: (data) => `
            <div style="width: 100%; height: 100%; font-family: ${data.fontFamily}; background: linear-gradient(135deg, ${data.primaryColor}, ${data.accentColor}); color: white; padding: 45px; display: flex; flex-direction: column; justify-content: space-between; position: relative; overflow: hidden;">
                <div style="position: absolute; top: 0; right: 0; width: 300px; height: 300px; background: rgba(255,255,255,0.1); border-radius: 50%; transform: translate(30%, -30%);"></div>
                <div style="position: relative; z-index: 1;">
                    ${data.logo ? `<img src="${data.logo}" style="max-width: 120px; max-height: 60px; margin-bottom: 25px; object-fit: contain; filter: brightness(0) invert(1);" alt="Logo">` : ''}
                    <h1 style="font-size: 38px; font-weight: 700; margin: 0 0 12px 0;">${data.fullName}</h1>
                    <p style="font-size: 20px; margin: 0 0 8px 0; opacity: 0.95;">${data.position}</p>
                    <p style="font-size: 16px; margin: 0; opacity: 0.85;">${data.company}</p>
                </div>
                <div style="position: relative; z-index: 1;">
                    <div style="display: flex; flex-wrap: wrap; gap: 15px; font-size: 14px; margin-bottom: 15px;">
                        ${data.phone ? `<div style="background: rgba(255,255,255,0.2); padding: 8px 15px; border-radius: 20px;">📞 ${data.phone}</div>` : ''}
                        ${data.email ? `<div style="background: rgba(255,255,255,0.2); padding: 8px 15px; border-radius: 20px;">✉️ ${data.email}</div>` : ''}
                        ${data.website ? `<div style="background: rgba(255,255,255,0.2); padding: 8px 15px; border-radius: 20px;">🌐 ${data.website}</div>` : ''}
                    </div>
                    ${data.address ? `<div style="font-size: 13px; opacity: 0.9;">📍 ${data.address}</div>` : ''}
                    ${renderSocialIcons(data, 'white')}
                    ${data.showQR ? `<div id="qrcode" style="margin-top: 15px;"></div>` : ''}
                </div>
            </div>
        `
    },
    bold: {
        name: 'Bold',
        render: (data) => `
            <div style="width: 100%; height: 100%; font-family: ${data.fontFamily}; background: linear-gradient(135deg, #ee0979, #ff6a00); color: white; position: relative; overflow: hidden;">
                <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><circle cx=\"50\" cy=\"50\" r=\"40\" fill=\"rgba(255,255,255,0.1)\"/></svg>') repeat; background-size: 150px; opacity: 0.3;"></div>
                <div style="position: relative; z-index: 1; padding: 45px; height: 100%; display: flex; flex-direction: column; justify-content: space-between;">
                    <div>
                        ${data.logo ? `<img src="${data.logo}" style="max-width: 120px; max-height: 60px; margin-bottom: 25px; object-fit: contain; filter: brightness(0) invert(1);" alt="Logo">` : ''}
                        <h1 style="font-size: 44px; font-weight: 900; margin: 0 0 10px 0; text-transform: uppercase; text-shadow: 2px 2px 4px rgba(0,0,0,0.2);">${data.fullName}</h1>
                        <div style="width: 80px; height: 4px; background: white; margin: 15px 0;"></div>
                        <p style="font-size: 22px; margin: 0 0 10px 0; font-weight: 700;">${data.position}</p>
                        <p style="font-size: 18px; margin: 0; font-weight: 600; opacity: 0.95;">${data.company}</p>
                    </div>
                    <div>
                        <div style="background: rgba(0,0,0,0.3); padding: 20px; border-radius: 10px; backdrop-filter: blur(10px);">
                            ${data.phone ? `<div style="font-size: 15px; margin-bottom: 8px; font-weight: 600;">📞 ${data.phone}</div>` : ''}
                            ${data.email ? `<div style="font-size: 15px; margin-bottom: 8px; font-weight: 600;">✉️ ${data.email}</div>` : ''}
                            ${data.website ? `<div style="font-size: 15px; margin-bottom: 8px; font-weight: 600;">🌐 ${data.website}</div>` : ''}
                            ${data.address ? `<div style="font-size: 14px; font-weight: 600;">📍 ${data.address}</div>` : ''}
                        </div>
                        ${renderSocialIcons(data, 'white')}
                        ${data.showQR ? `<div id="qrcode" style="margin-top: 15px;"></div>` : ''}
                    </div>
                </div>
            </div>
        `
    },
    tech: {
        name: 'Tech',
        render: (data) => `
            <div style="width: 100%; height: 100%; font-family: ${data.fontFamily}; background: linear-gradient(135deg, #0f2027, #203a43, #2c5364); color: white; padding: 40px; position: relative; overflow: hidden;">
                <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,255,0.03) 2px, rgba(0,255,255,0.03) 4px); pointer-events: none;"></div>
                <div style="position: relative; z-index: 1; height: 100%; display: flex;">
                    <div style="flex: 1; display: flex; flex-direction: column; justify-content: center;">
                        ${data.logo ? `<img src="${data.logo}" style="max-width: 120px; max-height: 60px; margin-bottom: 25px; object-fit: contain; filter: brightness(0) invert(1);" alt="Logo">` : ''}
                        <div style="border-left: 4px solid ${data.accentColor}; padding-left: 20px; margin-bottom: 25px;">
                            <h1 style="font-size: 36px; font-weight: 700; margin: 0 0 10px 0; font-family: 'Courier New', monospace; color: ${data.accentColor};">&lt;${data.fullName}/&gt;</h1>
                            <p style="font-size: 18px; margin: 0 0 8px 0; opacity: 0.95;">${data.position}</p>
                            <p style="font-size: 16px; margin: 0; opacity: 0.85; font-family: 'Courier New', monospace;">${data.company}</p>
                        </div>
                        <div style="font-size: 14px; line-height: 2; font-family: 'Courier New', monospace;">
                            ${data.phone ? `<div style="color: ${data.accentColor};">tel:</div><div style="margin-bottom: 10px; padding-left: 20px;">${data.phone}</div>` : ''}
                            ${data.email ? `<div style="color: ${data.accentColor};">email:</div><div style="margin-bottom: 10px; padding-left: 20px;">${data.email}</div>` : ''}
                            ${data.website ? `<div style="color: ${data.accentColor};">web:</div><div style="margin-bottom: 10px; padding-left: 20px;">${data.website}</div>` : ''}
                            ${data.address ? `<div style="color: ${data.accentColor};">location:</div><div style="padding-left: 20px;">${data.address}</div>` : ''}
                        </div>
                        ${renderSocialIcons(data, data.accentColor)}
                    </div>
                    ${data.showQR ? `<div style="display: flex; align-items: center; padding-left: 30px;"><div id="qrcode"></div></div>` : ''}
                </div>
            </div>
        `
    }
};

// Helper function to render social icons
function renderSocialIcons(data, color = null) {
    const icons = [];
    const iconColor = color || data.primaryColor;
    
    if (data.linkedin) icons.push(`<a href="${data.linkedin}" target="_blank" style="color: ${iconColor}; font-size: 20px; text-decoration: none;">🔗</a>`);
    if (data.github) icons.push(`<a href="${data.github}" target="_blank" style="color: ${iconColor}; font-size: 20px; text-decoration: none;">💻</a>`);
    if (data.twitter) icons.push(`<a href="${data.twitter}" target="_blank" style="color: ${iconColor}; font-size: 20px; text-decoration: none;">🐦</a>`);
    if (data.facebook) icons.push(`<a href="${data.facebook}" target="_blank" style="color: ${iconColor}; font-size: 20px; text-decoration: none;">👤</a>`);
    if (data.instagram) icons.push(`<a href="${data.instagram}" target="_blank" style="color: ${iconColor}; font-size: 20px; text-decoration: none;">📷</a>`);
    
    if (icons.length > 0) {
        return `<div style="display: flex; gap: 15px; margin-top: 15px;">${icons.join('')}</div>`;
    }
    return '';
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    renderCard();
});

// Event listeners
function initializeEventListeners() {
    // Mobile menu
    document.getElementById('mobileMenuToggle').addEventListener('click', () => {
        document.getElementById('mobileMenu').classList.toggle('active');
    });

    // Template selection
    document.querySelectorAll('.template-card').forEach(card => {
        card.addEventListener('click', () => {
            document.querySelectorAll('.template-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            state.template = card.dataset.template;
            renderCard();
        });
    });

    // Form inputs
    document.getElementById('fullName').addEventListener('input', (e) => {
        state.fullName = e.target.value;
        renderCard();
    });

    document.getElementById('position').addEventListener('input', (e) => {
        state.position = e.target.value;
        renderCard();
    });

    document.getElementById('company').addEventListener('input', (e) => {
        state.company = e.target.value;
        renderCard();
    });

    document.getElementById('phone').addEventListener('input', (e) => {
        state.phone = e.target.value;
        renderCard();
    });

    document.getElementById('email').addEventListener('input', (e) => {
        state.email = e.target.value;
        renderCard();
    });

    document.getElementById('website').addEventListener('input', (e) => {
        state.website = e.target.value;
        renderCard();
    });

    document.getElementById('address').addEventListener('input', (e) => {
        state.address = e.target.value;
        renderCard();
    });

    // Font family
    document.getElementById('fontFamily').addEventListener('change', (e) => {
        state.fontFamily = e.target.value;
        renderCard();
    });

    // Colors
    ['primaryColor', 'secondaryColor', 'accentColor', 'bgColor'].forEach(colorId => {
        const colorInput = document.getElementById(colorId);
        const textInput = document.getElementById(colorId + 'Text');
        
        colorInput.addEventListener('input', (e) => {
            state[colorId] = e.target.value;
            textInput.value = e.target.value;
            renderCard();
        });

        textInput.addEventListener('input', (e) => {
            if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
                state[colorId] = e.target.value;
                colorInput.value = e.target.value;
                renderCard();
            }
        });
    });

    // Gradient checkbox
    document.getElementById('useGradient').addEventListener('change', (e) => {
        state.useGradient = e.target.checked;
        renderCard();
    });

    // QR checkbox
    document.getElementById('showQR').addEventListener('change', (e) => {
        state.showQR = e.target.checked;
        renderCard();
    });

    // Logo upload
    document.getElementById('logoUpload').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                state.logo = event.target.result;
                document.getElementById('logoPreview').style.display = 'block';
                document.getElementById('logoImage').src = event.target.result;
                renderCard();
            };
            reader.readAsDataURL(file);
        }
    });

    document.getElementById('removeLogo').addEventListener('click', () => {
        state.logo = null;
        document.getElementById('logoPreview').style.display = 'none';
        document.getElementById('logoUpload').value = '';
        renderCard();
    });

    // Orientation
    document.querySelectorAll('input[name="orientation"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            state.orientation = e.target.value;
            renderCard();
        });
    });

    // Card size
    document.getElementById('cardSize').addEventListener('change', (e) => {
        state.cardSize = e.target.value;
        renderCard();
    });

    // Social media
    ['linkedin', 'github', 'twitter', 'facebook', 'instagram'].forEach(social => {
        document.getElementById(social).addEventListener('input', (e) => {
            state[social] = e.target.value;
            renderCard();
        });
    });

    // Export buttons
    document.getElementById('exportBtn').addEventListener('click', exportCard);
    document.getElementById('exportBtnMobile').addEventListener('click', exportCard);
    document.getElementById('exportBtnMain').addEventListener('click', exportCard);

    // Reset button
    document.getElementById('resetBtn').addEventListener('click', resetCard);

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
                document.getElementById('mobileMenu').classList.remove('active');
            }
        });
    });
}

// Render card
function renderCard() {
    const card = document.getElementById('businessCard');
    const template = templates[state.template];
    
    // Update card classes
    card.className = 'business-card';
    card.classList.add(state.orientation);
    if (state.cardSize !== 'standard') {
        card.classList.add(state.cardSize);
    }
    
    // Render template
    card.innerHTML = template.render(state);
    
    // Generate QR code if enabled
    if (state.showQR) {
        setTimeout(() => {
            const qrElement = document.getElementById('qrcode');
            if (qrElement) {
                qrElement.innerHTML = '';
                const vCard = `BEGIN:VCARD
VERSION:3.0
FN:${state.fullName}
TITLE:${state.position}
ORG:${state.company}
TEL:${state.phone}
EMAIL:${state.email}
URL:${state.website}
ADR:;;${state.address};;;
END:VCARD`;
                
                new QRCode(qrElement, {
                    text: vCard,
                    width: 100,
                    height: 100,
                    colorDark: '#000000',
                    colorLight: '#ffffff',
                    correctLevel: QRCode.CorrectLevel.M
                });
            }
        }, 100);
    }
}

// Export card
function exportCard() {
    const card = document.getElementById('businessCard');
    const scale = 4; // 300 DPI equivalent
    
    html2canvas(card, {
        scale: scale,
        backgroundColor: null,
        logging: false,
        width: card.offsetWidth,
        height: card.offsetHeight
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = `wizytowka_${state.fullName.replace(/\s/g, '_')}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    }).catch(error => {
        console.error('Export error:', error);
        alert('Wystąpił błąd podczas eksportu. Spróbuj ponownie.');
    });
}

// Reset card
function resetCard() {
    if (confirm('Czy na pewno chcesz zresetować wszystkie ustawienia?')) {
        // Reset state
        state.fullName = 'Jan Kowalski';
        state.position = 'Senior Developer';
        state.company = 'Tech Solutions';
        state.phone = '+48 123 456 789';
        state.email = 'jan.kowalski@example.com';
        state.website = 'www.example.com';
        state.address = 'ul. Przykładowa 1, Warszawa';
        state.fontFamily = "'Roboto', sans-serif";
        state.primaryColor = '#667eea';
        state.secondaryColor = '#764ba2';
        state.accentColor = '#f093fb';
        state.bgColor = '#ffffff';
        state.useGradient = true;
        state.showQR = false;
        state.logo = null;
        state.linkedin = '';
        state.github = '';
        state.twitter = '';
        state.facebook = '';
        state.instagram = '';
        state.orientation = 'horizontal';
        state.cardSize = 'standard';

        // Reset form values
        document.getElementById('fullName').value = state.fullName;
        document.getElementById('position').value = state.position;
        document.getElementById('company').value = state.company;
        document.getElementById('phone').value = state.phone;
        document.getElementById('email').value = state.email;
        document.getElementById('website').value = state.website;
        document.getElementById('address').value = state.address;
        document.getElementById('fontFamily').value = state.fontFamily;
        document.getElementById('primaryColor').value = state.primaryColor;
        document.getElementById('primaryColorText').value = state.primaryColor;
        document.getElementById('secondaryColor').value = state.secondaryColor;
        document.getElementById('secondaryColorText').value = state.secondaryColor;
        document.getElementById('accentColor').value = state.accentColor;
        document.getElementById('accentColorText').value = state.accentColor;
        document.getElementById('bgColor').value = state.bgColor;
        document.getElementById('bgColorText').value = state.bgColor;
        document.getElementById('useGradient').checked = state.useGradient;
        document.getElementById('showQR').checked = state.showQR;
        document.getElementById('logoUpload').value = '';
        document.getElementById('logoPreview').style.display = 'none';
        document.getElementById('linkedin').value = '';
        document.getElementById('github').value = '';
        document.getElementById('twitter').value = '';
        document.getElementById('facebook').value = '';
        document.getElementById('instagram').value = '';
        document.querySelector('input[name="orientation"][value="horizontal"]').checked = true;
        document.getElementById('cardSize').value = 'standard';

        renderCard();
    }
}
