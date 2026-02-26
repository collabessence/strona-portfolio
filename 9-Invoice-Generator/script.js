// Invoice Generator - Main Script
// Version: 1.0

// State
let items = [];
let itemCounter = 0;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeDates();
    addFirstItem();
    attachEventListeners();
    loadSavedData();
});

// Initialize dates with today
function initializeDates() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('invoiceDate').value = today;
    document.getElementById('saleDate').value = today;
    
    // Payment deadline = today + 14 days
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + 14);
    document.getElementById('paymentDeadline').value = deadline.toISOString().split('T')[0];
    
    // Generate invoice number
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    document.getElementById('invoiceNumber').value = `FV/${year}/${month}/001`;
}

// Add first item automatically
function addFirstItem() {
    addItem();
}

// Attach event listeners
function attachEventListeners() {
    // Add item button
    document.getElementById('addItemBtn').addEventListener('click', addItem);
    
    // Preview button
    document.getElementById('previewBtn').addEventListener('click', showPreview);
    
    // Close preview
    document.getElementById('closePreviewBtn').addEventListener('click', hidePreview);
    
    // Generate PDF
    document.getElementById('generateBtn').addEventListener('click', generatePDF);
    
    // Save/Load data
    document.getElementById('saveDataBtn').addEventListener('click', saveData);
    document.getElementById('loadDataBtn').addEventListener('click', loadDataDialog);
    
    // Auto-format NIP
    ['sellerNIP', 'buyerNIP'].forEach(id => {
        const input = document.getElementById(id);
        input.addEventListener('input', (e) => {
            e.target.value = formatNIP(e.target.value);
        });
    });
    
    // Auto-format postal code
    ['sellerPostal', 'buyerPostal'].forEach(id => {
        const input = document.getElementById(id);
        input.addEventListener('input', (e) => {
            e.target.value = formatPostal(e.target.value);
        });
    });
    
    // Auto-format account number
    document.getElementById('sellerAccount').addEventListener('input', (e) => {
        e.target.value = formatAccount(e.target.value);
    });
}

// Format NIP (XXX-XXX-XX-XX)
function formatNIP(value) {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    if (digits.length <= 8) return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 8)}-${digits.slice(8, 10)}`;
}

// Format postal code (XX-XXX)
function formatPostal(value) {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}-${digits.slice(2, 5)}`;
}

// Format account number (XX XXXX XXXX XXXX XXXX XXXX XXXX)
function formatAccount(value) {
    const digits = value.replace(/\D/g, '');
    const parts = [];
    for (let i = 0; i < digits.length; i += 4) {
        parts.push(digits.slice(i, i + 4));
    }
    return parts.join(' ').substring(0, 32);
}

// Add new item
function addItem() {
    itemCounter++;
    const itemId = `item-${itemCounter}`;
    
    const itemHTML = `
        <div class="item-row" id="${itemId}" data-item-id="${itemCounter}">
            <div class="item-header">
                <span class="item-number">Pozycja #${itemCounter}</span>
                <button type="button" class="remove-item-btn" onclick="removeItem('${itemId}')">
                    <i class="fas fa-trash"></i> Usuń
                </button>
            </div>
            <div class="item-grid">
                <div class="form-group">
                    <label>Nazwa towaru/usługi</label>
                    <input type="text" class="item-name" placeholder="np. Konsultacja IT" required>
                </div>
                <div class="form-group">
                    <label>Ilość</label>
                    <input type="number" class="item-quantity" value="1" min="0.01" step="0.01" required>
                </div>
                <div class="form-group">
                    <label>Jednostka</label>
                    <select class="item-unit">
                        <option value="szt.">szt.</option>
                        <option value="godz.">godz.</option>
                        <option value="usł.">usł.</option>
                        <option value="kg">kg</option>
                        <option value="m">m</option>
                        <option value="m²">m²</option>
                        <option value="kpl.">kpl.</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Cena netto</label>
                    <input type="number" class="item-price" value="0" min="0" step="0.01" required>
                </div>
                <div class="form-group">
                    <label>VAT %</label>
                    <select class="item-vat">
                        <option value="23">23%</option>
                        <option value="8">8%</option>
                        <option value="5">5%</option>
                        <option value="0">0%</option>
                        <option value="zw">ZW</option>
                        <option value="np">NP</option>
                    </select>
                </div>
            </div>
            <div class="item-totals">
                <div class="item-total">
                    <label>Wartość netto</label>
                    <span class="item-net-total">0.00 PLN</span>
                </div>
                <div class="item-total">
                    <label>Kwota VAT</label>
                    <span class="item-vat-total">0.00 PLN</span>
                </div>
                <div class="item-total">
                    <label>Wartość brutto</label>
                    <span class="item-gross-total">0.00 PLN</span>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('itemsContainer').insertAdjacentHTML('beforeend', itemHTML);
    
    // Attach calculation listeners
    const itemRow = document.getElementById(itemId);
    ['item-quantity', 'item-price', 'item-vat'].forEach(className => {
        const input = itemRow.querySelector(`.${className}`);
        input.addEventListener('input', () => calculateItemTotals(itemId));
        input.addEventListener('change', () => calculateItemTotals(itemId));
    });
    
    // Initial calculation
    calculateItemTotals(itemId);
}

// Remove item
function removeItem(itemId) {
    const itemRow = document.getElementById(itemId);
    if (itemRow) {
        itemRow.remove();
        calculateTotals();
        
        // If no items left, add one
        if (document.querySelectorAll('.item-row').length === 0) {
            addItem();
        }
    }
}

// Calculate item totals
function calculateItemTotals(itemId) {
    const itemRow = document.getElementById(itemId);
    const quantity = parseFloat(itemRow.querySelector('.item-quantity').value) || 0;
    const price = parseFloat(itemRow.querySelector('.item-price').value) || 0;
    const vatRate = itemRow.querySelector('.item-vat').value;
    
    const netTotal = quantity * price;
    let vatAmount = 0;
    
    if (vatRate === 'zw' || vatRate === 'np') {
        vatAmount = 0;
    } else {
        vatAmount = netTotal * (parseFloat(vatRate) / 100);
    }
    
    const grossTotal = netTotal + vatAmount;
    
    itemRow.querySelector('.item-net-total').textContent = `${netTotal.toFixed(2)} PLN`;
    itemRow.querySelector('.item-vat-total').textContent = `${vatAmount.toFixed(2)} PLN`;
    itemRow.querySelector('.item-gross-total').textContent = `${grossTotal.toFixed(2)} PLN`;
    
    calculateTotals();
}

// Calculate invoice totals
function calculateTotals() {
    let totalNet = 0;
    let totalVAT = 0;
    let totalGross = 0;
    
    document.querySelectorAll('.item-row').forEach(itemRow => {
        const net = parseFloat(itemRow.querySelector('.item-net-total').textContent.replace(' PLN', '')) || 0;
        const vat = parseFloat(itemRow.querySelector('.item-vat-total').textContent.replace(' PLN', '')) || 0;
        const gross = parseFloat(itemRow.querySelector('.item-gross-total').textContent.replace(' PLN', '')) || 0;
        
        totalNet += net;
        totalVAT += vat;
        totalGross += gross;
    });
    
    document.getElementById('totalNet').textContent = `${totalNet.toFixed(2)} PLN`;
    document.getElementById('totalVAT').textContent = `${totalVAT.toFixed(2)} PLN`;
    document.getElementById('totalGross').textContent = `${totalGross.toFixed(2)} PLN`;
    
    // Convert to words
    document.getElementById('totalWords').textContent = `Słownie: ${numberToWords(totalGross)} złotych ${Math.round((totalGross % 1) * 100).toString().padStart(2, '0')}/100`;
}

// Convert number to Polish words
function numberToWords(amount) {
    const units = ['', 'jeden', 'dwa', 'trzy', 'cztery', 'pięć', 'sześć', 'siedem', 'osiem', 'dziewięć'];
    const teens = ['dziesięć', 'jedenaście', 'dwanaście', 'trzynaście', 'czternaście', 'piętnaście', 'szesnaście', 'siedemnaście', 'osiemnaście', 'dziewiętnaście'];
    const tens = ['', '', 'dwadzieścia', 'trzydzieści', 'czterdzieści', 'pięćdziesiąt', 'sześćdziesiąt', 'siedemdziesiąt', 'osiemdziesiąt', 'dziewięćdziesiąt'];
    const hundreds = ['', 'sto', 'dwieście', 'trzysta', 'czterysta', 'pięćset', 'sześćset', 'siedemset', 'osiemset', 'dziewięćset'];
    const thousands = ['', 'tysiąc', 'tysiące', 'tysięcy'];
    const millions = ['', 'milion', 'miliony', 'milionów'];
    
    const num = Math.floor(amount);
    
    if (num === 0) return 'zero';
    
    function convertGroup(n) {
        let result = [];
        
        const h = Math.floor(n / 100);
        const t = Math.floor((n % 100) / 10);
        const u = n % 10;
        
        if (h > 0) result.push(hundreds[h]);
        
        if (t === 1) {
            result.push(teens[u]);
        } else {
            if (t > 0) result.push(tens[t]);
            if (u > 0) result.push(units[u]);
        }
        
        return result.join(' ');
    }
    
    function getForm(n, forms) {
        if (n === 1) return forms[1];
        const lastDigit = n % 10;
        const lastTwoDigits = n % 100;
        if (lastTwoDigits >= 10 && lastTwoDigits <= 21) return forms[3];
        if (lastDigit >= 2 && lastDigit <= 4) return forms[2];
        return forms[3];
    }
    
    const mil = Math.floor(num / 1000000);
    const thou = Math.floor((num % 1000000) / 1000);
    const rest = num % 1000;
    
    let result = [];
    
    if (mil > 0) {
        result.push(convertGroup(mil));
        result.push(getForm(mil, millions));
    }
    
    if (thou > 0) {
        result.push(convertGroup(thou));
        result.push(getForm(thou, thousands));
    }
    
    if (rest > 0) {
        result.push(convertGroup(rest));
    }
    
    return result.join(' ').trim() || 'zero';
}

// Get invoice data
function getInvoiceData() {
    return {
        seller: {
            name: document.getElementById('sellerName').value,
            nip: document.getElementById('sellerNIP').value,
            address: document.getElementById('sellerAddress').value,
            postal: document.getElementById('sellerPostal').value,
            city: document.getElementById('sellerCity').value,
            phone: document.getElementById('sellerPhone').value,
            email: document.getElementById('sellerEmail').value,
            bank: document.getElementById('sellerBank').value,
            account: document.getElementById('sellerAccount').value
        },
        buyer: {
            name: document.getElementById('buyerName').value,
            nip: document.getElementById('buyerNIP').value,
            address: document.getElementById('buyerAddress').value,
            postal: document.getElementById('buyerPostal').value,
            city: document.getElementById('buyerCity').value
        },
        invoice: {
            number: document.getElementById('invoiceNumber').value,
            date: document.getElementById('invoiceDate').value,
            saleDate: document.getElementById('saleDate').value,
            deadline: document.getElementById('paymentDeadline').value,
            paymentMethod: document.getElementById('paymentMethod').value
        },
        items: getItemsData(),
        notes: document.getElementById('notes').value,
        totals: {
            net: document.getElementById('totalNet').textContent,
            vat: document.getElementById('totalVAT').textContent,
            gross: document.getElementById('totalGross').textContent,
            words: document.getElementById('totalWords').textContent
        }
    };
}

// Get items data
function getItemsData() {
    const items = [];
    document.querySelectorAll('.item-row').forEach(itemRow => {
        items.push({
            name: itemRow.querySelector('.item-name').value,
            quantity: itemRow.querySelector('.item-quantity').value,
            unit: itemRow.querySelector('.item-unit').value,
            price: itemRow.querySelector('.item-price').value,
            vat: itemRow.querySelector('.item-vat').value,
            netTotal: itemRow.querySelector('.item-net-total').textContent,
            vatTotal: itemRow.querySelector('.item-vat-total').textContent,
            grossTotal: itemRow.querySelector('.item-gross-total').textContent
        });
    });
    return items;
}

// Show preview
function showPreview() {
    const data = getInvoiceData();
    const previewHTML = generateInvoiceHTML(data);
    
    document.getElementById('previewContent').innerHTML = previewHTML;
    document.getElementById('invoicePreview').classList.add('active');
}

// Hide preview
function hidePreview() {
    document.getElementById('invoicePreview').classList.remove('active');
}

// Generate invoice HTML
function generateInvoiceHTML(data) {
    const itemsRows = data.items.map((item, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${item.name}</td>
            <td style="text-align: center;">${item.quantity}</td>
            <td style="text-align: center;">${item.unit}</td>
            <td style="text-align: right;">${parseFloat(item.price).toFixed(2)}</td>
            <td style="text-align: center;">${item.vat === 'zw' ? 'ZW' : item.vat === 'np' ? 'NP' : item.vat + '%'}</td>
            <td style="text-align: right;">${item.netTotal}</td>
            <td style="text-align: right;">${item.vatTotal}</td>
            <td style="text-align: right;">${item.grossTotal}</td>
        </tr>
    `).join('');
    
    return `
        <div class="invoice-document">
            <div class="invoice-header">
                <div class="invoice-title">FAKTURA VAT</div>
                <div class="invoice-number">${data.invoice.number}</div>
            </div>
            
            <div class="invoice-parties">
                <div class="party-box">
                    <div class="party-title">Sprzedawca</div>
                    <div class="party-info">
                        <p><strong>${data.seller.name}</strong></p>
                        <p>${data.seller.address}</p>
                        <p>${data.seller.postal} ${data.seller.city}</p>
                        ${data.seller.nip ? `<p><strong>NIP:</strong> ${data.seller.nip}</p>` : ''}
                        ${data.seller.phone ? `<p><strong>Tel:</strong> ${data.seller.phone}</p>` : ''}
                        ${data.seller.email ? `<p><strong>Email:</strong> ${data.seller.email}</p>` : ''}
                    </div>
                </div>
                
                <div class="party-box">
                    <div class="party-title">Nabywca</div>
                    <div class="party-info">
                        <p><strong>${data.buyer.name}</strong></p>
                        <p>${data.buyer.address}</p>
                        <p>${data.buyer.postal} ${data.buyer.city}</p>
                        ${data.buyer.nip ? `<p><strong>NIP:</strong> ${data.buyer.nip}</p>` : ''}
                    </div>
                </div>
            </div>
            
            <div class="invoice-details">
                <div class="details-grid">
                    <div class="detail-item">
                        <span class="detail-label">Data wystawienia:</span>
                        <span>${formatDate(data.invoice.date)}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Data sprzedaży:</span>
                        <span>${formatDate(data.invoice.saleDate)}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Sposób płatności:</span>
                        <span>${data.invoice.paymentMethod}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Termin płatności:</span>
                        <span>${formatDate(data.invoice.deadline)}</span>
                    </div>
                </div>
            </div>
            
            <table class="items-table">
                <thead>
                    <tr>
                        <th style="width: 30px;">Lp.</th>
                        <th>Nazwa towaru/usługi</th>
                        <th style="width: 60px;">Ilość</th>
                        <th style="width: 60px;">J.m.</th>
                        <th style="width: 100px;">Cena netto</th>
                        <th style="width: 60px;">VAT</th>
                        <th style="width: 100px;">Wartość netto</th>
                        <th style="width: 100px;">Kwota VAT</th>
                        <th style="width: 100px;">Wartość brutto</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsRows}
                </tbody>
            </table>
            
            <div class="invoice-summary">
                <div class="summary-row">
                    <span><strong>Razem netto:</strong></span>
                    <span>${data.totals.net}</span>
                </div>
                <div class="summary-row">
                    <span><strong>Razem VAT:</strong></span>
                    <span>${data.totals.vat}</span>
                </div>
                <div class="summary-row">
                    <span><strong>RAZEM DO ZAPŁATY:</strong></span>
                    <span>${data.totals.gross}</span>
                </div>
                <div class="words-total">${data.totals.words}</div>
            </div>
            
            <div class="invoice-payment">
                <h4>Dane do przelewu:</h4>
                <p><strong>Bank:</strong> ${data.seller.bank || 'Nie podano'}</p>
                <p><strong>Nr konta:</strong> ${data.seller.account}</p>
                <p><strong>Tytuł przelewu:</strong> ${data.invoice.number}</p>
            </div>
            
            ${data.notes ? `
            <div class="invoice-notes">
                <h4>Uwagi:</h4>
                <p>${data.notes}</p>
            </div>
            ` : ''}
            
            <div class="invoice-footer">
                <p>Faktura wygenerowana automatycznie przez Generator Faktur PL</p>
            </div>
        </div>
    `;
}

// Format date (YYYY-MM-DD to DD.MM.YYYY)
function formatDate(dateStr) {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    return `${parts[2]}.${parts[1]}.${parts[0]}`;
}

// Generate PDF
async function generatePDF() {
    const data = getInvoiceData();
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'a4');
    
    // Set font
    doc.setFont('helvetica');
    
    // Header
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('FAKTURA VAT', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(data.invoice.number, 105, 28, { align: 'center' });
    
    // Seller
    let y = 45;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Sprzedawca:', 20, y);
    
    doc.setFont('helvetica', 'normal');
    y += 7;
    doc.text(data.seller.name, 20, y);
    y += 5;
    doc.text(data.seller.address, 20, y);
    y += 5;
    doc.text(`${data.seller.postal} ${data.seller.city}`, 20, y);
    y += 5;
    if (data.seller.nip) {
        doc.text(`NIP: ${data.seller.nip}`, 20, y);
        y += 5;
    }
    
    // Buyer
    y = 45;
    doc.setFont('helvetica', 'bold');
    doc.text('Nabywca:', 110, y);
    
    doc.setFont('helvetica', 'normal');
    y += 7;
    doc.text(data.buyer.name, 110, y);
    y += 5;
    doc.text(data.buyer.address, 110, y);
    y += 5;
    doc.text(`${data.buyer.postal} ${data.buyer.city}`, 110, y);
    y += 5;
    if (data.buyer.nip) {
        doc.text(`NIP: ${data.buyer.nip}`, 110, y);
    }
    
    // Invoice details
    y = 90;
    doc.setFontSize(10);
    doc.text(`Data wystawienia: ${formatDate(data.invoice.date)}`, 20, y);
    y += 5;
    doc.text(`Data sprzedaży: ${formatDate(data.invoice.saleDate)}`, 20, y);
    y += 5;
    doc.text(`Termin płatności: ${formatDate(data.invoice.deadline)}`, 20, y);
    y += 5;
    doc.text(`Sposób płatności: ${data.invoice.paymentMethod}`, 20, y);
    
    // Items table
    y = 115;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    
    // Table header
    doc.text('Lp', 15, y);
    doc.text('Nazwa', 25, y);
    doc.text('Ilość', 100, y);
    doc.text('J.m.', 115, y);
    doc.text('Cena netto', 130, y);
    doc.text('VAT', 155, y);
    doc.text('Brutto', 175, y);
    
    doc.line(10, y + 2, 200, y + 2);
    y += 7;
    
    // Table rows
    doc.setFont('helvetica', 'normal');
    data.items.forEach((item, index) => {
        if (y > 250) {
            doc.addPage();
            y = 20;
        }
        
        doc.text(String(index + 1), 15, y);
        doc.text(item.name.substring(0, 40), 25, y);
        doc.text(item.quantity, 100, y);
        doc.text(item.unit, 115, y);
        doc.text(parseFloat(item.price).toFixed(2), 130, y);
        const vatText = item.vat === 'zw' ? 'ZW' : item.vat === 'np' ? 'NP' : item.vat + '%';
        doc.text(vatText, 155, y);
        doc.text(item.grossTotal.replace(' PLN', ''), 175, y);
        y += 7;
    });
    
    // Totals
    y += 5;
    doc.line(10, y, 200, y);
    y += 7;
    
    doc.setFont('helvetica', 'bold');
    doc.text('Razem netto:', 20, y);
    doc.text(data.totals.net, 175, y);
    y += 6;
    
    doc.text('Razem VAT:', 20, y);
    doc.text(data.totals.vat, 175, y);
    y += 6;
    
    doc.setFontSize(11);
    doc.text('DO ZAPŁATY:', 20, y);
    doc.text(data.totals.gross, 175, y);
    y += 8;
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.text(data.totals.words, 20, y);
    
    // Payment info
    y += 10;
    doc.setFont('helvetica', 'bold');
    doc.text('Dane do przelewu:', 20, y);
    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.text(`Bank: ${data.seller.bank || 'Nie podano'}`, 20, y);
    y += 5;
    doc.text(`Nr konta: ${data.seller.account}`, 20, y);
    y += 5;
    doc.text(`Tytuł: ${data.invoice.number}`, 20, y);
    
    // Save PDF
    doc.save(`Faktura_${data.invoice.number.replace(/\//g, '_')}.pdf`);
}

// Save data to localStorage
function saveData() {
    const data = getInvoiceData();
    const json = JSON.stringify(data, null, 2);
    
    // Download as JSON
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `faktura_dane_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    alert('Dane zapisane! Plik JSON został pobrany.');
}

// Load data dialog
function loadDataDialog() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target.result);
                    loadDataFromJSON(data);
                    alert('Dane wczytane pomyślnie!');
                } catch (error) {
                    alert('Błąd wczytywania danych: ' + error.message);
                }
            };
            reader.readAsText(file);
        }
    });
    
    input.click();
}

// Load data from JSON
function loadDataFromJSON(data) {
    // Seller
    document.getElementById('sellerName').value = data.seller.name || '';
    document.getElementById('sellerNIP').value = data.seller.nip || '';
    document.getElementById('sellerAddress').value = data.seller.address || '';
    document.getElementById('sellerPostal').value = data.seller.postal || '';
    document.getElementById('sellerCity').value = data.seller.city || '';
    document.getElementById('sellerPhone').value = data.seller.phone || '';
    document.getElementById('sellerEmail').value = data.seller.email || '';
    document.getElementById('sellerBank').value = data.seller.bank || '';
    document.getElementById('sellerAccount').value = data.seller.account || '';
    
    // Buyer
    document.getElementById('buyerName').value = data.buyer.name || '';
    document.getElementById('buyerNIP').value = data.buyer.nip || '';
    document.getElementById('buyerAddress').value = data.buyer.address || '';
    document.getElementById('buyerPostal').value = data.buyer.postal || '';
    document.getElementById('buyerCity').value = data.buyer.city || '';
    
    // Invoice
    document.getElementById('invoiceNumber').value = data.invoice.number || '';
    document.getElementById('invoiceDate').value = data.invoice.date || '';
    document.getElementById('saleDate').value = data.invoice.saleDate || '';
    document.getElementById('paymentDeadline').value = data.invoice.deadline || '';
    document.getElementById('paymentMethod').value = data.invoice.paymentMethod || 'przelew';
    
    // Notes
    document.getElementById('notes').value = data.notes || '';
    
    // Items
    document.getElementById('itemsContainer').innerHTML = '';
    itemCounter = 0;
    data.items.forEach(item => {
        itemCounter++;
        const itemId = `item-${itemCounter}`;
        
        const itemHTML = `
            <div class="item-row" id="${itemId}" data-item-id="${itemCounter}">
                <div class="item-header">
                    <span class="item-number">Pozycja #${itemCounter}</span>
                    <button type="button" class="remove-item-btn" onclick="removeItem('${itemId}')">
                        <i class="fas fa-trash"></i> Usuń
                    </button>
                </div>
                <div class="item-grid">
                    <div class="form-group">
                        <label>Nazwa towaru/usługi</label>
                        <input type="text" class="item-name" value="${item.name}" required>
                    </div>
                    <div class="form-group">
                        <label>Ilość</label>
                        <input type="number" class="item-quantity" value="${item.quantity}" min="0.01" step="0.01" required>
                    </div>
                    <div class="form-group">
                        <label>Jednostka</label>
                        <select class="item-unit">
                            <option value="szt." ${item.unit === 'szt.' ? 'selected' : ''}>szt.</option>
                            <option value="godz." ${item.unit === 'godz.' ? 'selected' : ''}>godz.</option>
                            <option value="usł." ${item.unit === 'usł.' ? 'selected' : ''}>usł.</option>
                            <option value="kg" ${item.unit === 'kg' ? 'selected' : ''}>kg</option>
                            <option value="m" ${item.unit === 'm' ? 'selected' : ''}>m</option>
                            <option value="m²" ${item.unit === 'm²' ? 'selected' : ''}>m²</option>
                            <option value="kpl." ${item.unit === 'kpl.' ? 'selected' : ''}>kpl.</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Cena netto</label>
                        <input type="number" class="item-price" value="${item.price}" min="0" step="0.01" required>
                    </div>
                    <div class="form-group">
                        <label>VAT %</label>
                        <select class="item-vat">
                            <option value="23" ${item.vat === '23' ? 'selected' : ''}>23%</option>
                            <option value="8" ${item.vat === '8' ? 'selected' : ''}>8%</option>
                            <option value="5" ${item.vat === '5' ? 'selected' : ''}>5%</option>
                            <option value="0" ${item.vat === '0' ? 'selected' : ''}>0%</option>
                            <option value="zw" ${item.vat === 'zw' ? 'selected' : ''}>ZW</option>
                            <option value="np" ${item.vat === 'np' ? 'selected' : ''}>NP</option>
                        </select>
                    </div>
                </div>
                <div class="item-totals">
                    <div class="item-total">
                        <label>Wartość netto</label>
                        <span class="item-net-total">0.00 PLN</span>
                    </div>
                    <div class="item-total">
                        <label>Kwota VAT</label>
                        <span class="item-vat-total">0.00 PLN</span>
                    </div>
                    <div class="item-total">
                        <label>Wartość brutto</label>
                        <span class="item-gross-total">0.00 PLN</span>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('itemsContainer').insertAdjacentHTML('beforeend', itemHTML);
        
        // Attach listeners
        const itemRow = document.getElementById(itemId);
        ['item-quantity', 'item-price', 'item-vat'].forEach(className => {
            const input = itemRow.querySelector(`.${className}`);
            input.addEventListener('input', () => calculateItemTotals(itemId));
            input.addEventListener('change', () => calculateItemTotals(itemId));
        });
        
        calculateItemTotals(itemId);
    });
}

// Load saved seller data on start
function loadSavedData() {
    const savedSeller = localStorage.getItem('invoiceSellerData');
    if (savedSeller) {
        try {
            const data = JSON.parse(savedSeller);
            document.getElementById('sellerName').value = data.name || '';
            document.getElementById('sellerNIP').value = data.nip || '';
            document.getElementById('sellerAddress').value = data.address || '';
            document.getElementById('sellerPostal').value = data.postal || '';
            document.getElementById('sellerCity').value = data.city || '';
            document.getElementById('sellerPhone').value = data.phone || '';
            document.getElementById('sellerEmail').value = data.email || '';
            document.getElementById('sellerBank').value = data.bank || '';
            document.getElementById('sellerAccount').value = data.account || '';
        } catch (e) {
            console.log('Could not load saved seller data');
        }
    }
    
    // Save seller data on change
    ['sellerName', 'sellerNIP', 'sellerAddress', 'sellerPostal', 'sellerCity', 'sellerPhone', 'sellerEmail', 'sellerBank', 'sellerAccount'].forEach(id => {
        document.getElementById(id).addEventListener('change', () => {
            const sellerData = {
                name: document.getElementById('sellerName').value,
                nip: document.getElementById('sellerNIP').value,
                address: document.getElementById('sellerAddress').value,
                postal: document.getElementById('sellerPostal').value,
                city: document.getElementById('sellerCity').value,
                phone: document.getElementById('sellerPhone').value,
                email: document.getElementById('sellerEmail').value,
                bank: document.getElementById('sellerBank').value,
                account: document.getElementById('sellerAccount').value
            };
            localStorage.setItem('invoiceSellerData', JSON.stringify(sellerData));
        });
    });
}
