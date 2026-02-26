// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        
        // Animate hamburger
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = navMenu.classList.contains('active') ? 'rotate(45deg) translate(7px, 7px)' : '';
        spans[1].style.opacity = navMenu.classList.contains('active') ? '0' : '1';
        spans[2].style.transform = navMenu.classList.contains('active') ? 'rotate(-45deg) translate(7px, -7px)' : '';
    });
}

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity = '1';
        spans[2].style.transform = '';
    });
});

// Format number to Polish currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('pl-PL', {
        style: 'currency',
        currency: 'PLN',
        minimumFractionDigits: 2
    }).format(amount);
}

// Format number to percentage
function formatPercent(value) {
    return new Intl.NumberFormat('pl-PL', {
        style: 'percent',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value / 100);
}

// ROI Calculator
function calculateROI() {
    const investment = parseFloat(document.getElementById('roi-investment').value);
    const returnAmount = parseFloat(document.getElementById('roi-return').value);
    const resultBox = document.getElementById('roi-result');

    if (isNaN(investment) || isNaN(returnAmount) || investment <= 0) {
        alert('Proszę wprowadzić poprawne wartości!');
        return;
    }

    const profit = returnAmount - investment;
    const roiPercentage = (profit / investment) * 100;

    // Display results
    document.getElementById('roi-percentage').textContent = formatPercent(roiPercentage);
    document.getElementById('roi-profit').textContent = formatCurrency(profit);

    // Rating and description
    let rating, description, color;
    if (roiPercentage < 0) {
        rating = '❌ Strata';
        description = `<p><strong>Uwaga!</strong> Inwestycja przyniosła stratę ${formatCurrency(Math.abs(profit))}.</p>
                      <p>ROI wynosi ${formatPercent(roiPercentage)}, co oznacza, że zainwestowane środki nie zwróciły się.</p>`;
        color = 'red';
    } else if (roiPercentage < 20) {
        rating = '⚠️ Niska';
        description = `<p>Zwrot z inwestycji wynosi ${formatPercent(roiPercentage)}, co jest stosunkowo niskim wynikiem.</p>
                      <p>Rozważ optymalizację strategii lub poszukaj lepszych możliwości inwestycyjnych.</p>`;
        color = 'orange';
    } else if (roiPercentage < 50) {
        rating = '✅ Dobra';
        description = `<p>Zwrot z inwestycji wynosi ${formatPercent(roiPercentage)} - to solidny wynik!</p>
                      <p>Zysk netto: ${formatCurrency(profit)}. Inwestycja jest opłacalna.</p>`;
        color = 'lightgreen';
    } else {
        rating = '🚀 Doskonała';
        description = `<p><strong>Świetnie!</strong> ROI wynosi ${formatPercent(roiPercentage)} - to bardzo dobry wynik!</p>
                      <p>Zysk netto: ${formatCurrency(profit)}. To bardzo opłacalna inwestycja!</p>`;
        color = 'green';
    }

    document.getElementById('roi-rating').textContent = rating;
    document.getElementById('roi-rating').style.color = color;
    document.getElementById('roi-description').innerHTML = description;

    resultBox.style.display = 'block';
    resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Profit Margin Calculator
function calculateProfit() {
    const cost = parseFloat(document.getElementById('profit-cost').value);
    const price = parseFloat(document.getElementById('profit-price').value);
    const quantity = parseFloat(document.getElementById('profit-quantity').value) || 1;
    const resultBox = document.getElementById('profit-result');

    if (isNaN(cost) || isNaN(price) || cost < 0 || price < 0) {
        alert('Proszę wprowadzić poprawne wartości!');
        return;
    }

    const profitPerUnit = price - cost;
    const totalProfit = profitPerUnit * quantity;
    const marginPercentage = price > 0 ? ((profitPerUnit / price) * 100) : 0;

    document.getElementById('profit-margin').textContent = formatPercent(marginPercentage);
    document.getElementById('profit-per-unit').textContent = formatCurrency(profitPerUnit);
    document.getElementById('profit-total').textContent = formatCurrency(totalProfit);

    let description;
    if (profitPerUnit < 0) {
        description = `<p><strong>Uwaga!</strong> Sprzedajesz poniżej kosztu - tracisz ${formatCurrency(Math.abs(profitPerUnit))} na każdej sztuce.</p>
                      <p>Całkowita strata: ${formatCurrency(Math.abs(totalProfit))}</p>`;
    } else if (marginPercentage < 20) {
        description = `<p>Marża ${formatPercent(marginPercentage)} jest stosunkowo niska.</p>
                      <p>Na ${quantity} szt. zarobisz ${formatCurrency(totalProfit)}.</p>
                      <p><strong>Sugestia:</strong> Rozważ zwiększenie ceny lub obniżenie kosztów.</p>`;
    } else if (marginPercentage < 40) {
        description = `<p>Marża ${formatPercent(marginPercentage)} jest na dobrym poziomie.</p>
                      <p>Zarobisz ${formatCurrency(profitPerUnit)} na sztuce, łącznie: ${formatCurrency(totalProfit)}</p>`;
    } else {
        description = `<p><strong>Świetnie!</strong> Wysoka marża ${formatPercent(marginPercentage)}.</p>
                      <p>Całkowity zysk na ${quantity} szt.: ${formatCurrency(totalProfit)}</p>`;
    }

    document.getElementById('profit-description').innerHTML = description;
    resultBox.style.display = 'block';
    resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Renovation Cost Calculator
function calculateRenovation() {
    const area = parseFloat(document.getElementById('reno-area').value);
    const type = document.getElementById('reno-type').value;
    const resultBox = document.getElementById('reno-result');

    if (isNaN(area) || area <= 0) {
        alert('Proszę wprowadzić poprawną powierzchnię!');
        return;
    }

    // Base cost per m²
    let costPerM2;
    let typeName;
    switch(type) {
        case 'light':
            costPerM2 = 500;
            typeName = 'Remont odświeżający';
            break;
        case 'medium':
            costPerM2 = 1200;
            typeName = 'Remont średni';
            break;
        case 'heavy':
            costPerM2 = 2500;
            typeName = 'Remont generalny';
            break;
    }

    const baseCost = area * costPerM2;

    // Extras
    let extrasCost = 0;
    if (document.getElementById('reno-bathroom').checked) extrasCost += 15000;
    if (document.getElementById('reno-kitchen').checked) extrasCost += 20000;
    if (document.getElementById('reno-flooring').checked) extrasCost += 8000;
    if (document.getElementById('reno-windows').checked) extrasCost += 10000;

    const totalCost = baseCost + extrasCost;

    document.getElementById('reno-base').textContent = formatCurrency(baseCost);
    document.getElementById('reno-extras').textContent = formatCurrency(extrasCost);
    document.getElementById('reno-total').textContent = formatCurrency(totalCost);

    const description = `
        <p><strong>${typeName}</strong> - ${area} m²</p>
        <p>Koszt podstawowy: ${formatCurrency(costPerM2)}/m² × ${area} m² = ${formatCurrency(baseCost)}</p>
        <p>Dodatkowe prace: ${formatCurrency(extrasCost)}</p>
        <p><strong>Szacunkowy całkowity koszt: ${formatCurrency(totalCost)}</strong></p>
        <p style="margin-top: 1rem; font-size: 0.9em; opacity: 0.9;">
            ⚠️ To wartość orientacyjna. Rzeczywiste koszty mogą się różnić w zależności od jakości materiałów, 
            lokalizacji i wybranego wykonawcy.
        </p>
    `;

    document.getElementById('reno-description').innerHTML = description;
    resultBox.style.display = 'block';
    resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Loan Calculator
function calculateLoan() {
    const amount = parseFloat(document.getElementById('loan-amount').value);
    const years = parseFloat(document.getElementById('loan-years').value);
    const rate = parseFloat(document.getElementById('loan-rate').value);
    const resultBox = document.getElementById('loan-result');

    if (isNaN(amount) || isNaN(years) || isNaN(rate) || amount <= 0 || years <= 0 || rate < 0) {
        alert('Proszę wprowadzić poprawne wartości!');
        return;
    }

    const monthlyRate = rate / 100 / 12;
    const numberOfPayments = years * 12;

    // Calculate monthly payment using formula
    const monthlyPayment = monthlyRate > 0 
        ? amount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
        : amount / numberOfPayments;

    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - amount;

    document.getElementById('loan-monthly').textContent = formatCurrency(monthlyPayment);
    document.getElementById('loan-interest').textContent = formatCurrency(totalInterest);
    document.getElementById('loan-total').textContent = formatCurrency(totalPayment);

    const description = `
        <p><strong>Szczegóły kredytu:</strong></p>
        <p>Kwota: ${formatCurrency(amount)} na ${years} lat (${numberOfPayments} miesięcy)</p>
        <p>Oprocentowanie: ${rate}% rocznie</p>
        <p>Miesięczna rata: ${formatCurrency(monthlyPayment)}</p>
        <p>Całkowite odsetki: ${formatCurrency(totalInterest)} (${formatPercent((totalInterest/amount)*100)} kwoty)</p>
        <p style="margin-top: 1rem;">
            <strong>Zapłacisz łącznie: ${formatCurrency(totalPayment)}</strong>
        </p>
        <p style="margin-top: 1rem; font-size: 0.9em; opacity: 0.9;">
            ℹ️ Kalkulacja przy równych ratach (annuitetowych). Rzeczywiste warunki mogą się różnić w zależności od banku.
        </p>
    `;

    document.getElementById('loan-description').innerHTML = description;
    resultBox.style.display = 'block';
    resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Salary Calculator
function toggleSalaryInput() {
    const type = document.getElementById('salary-type').value;
    const label = document.getElementById('salary-label');
    
    if (type === 'brutto') {
        label.textContent = 'Wynagrodzenie brutto (zł)';
    } else {
        label.textContent = 'Wynagrodzenie netto (zł)';
    }
}

function calculateSalary() {
    const type = document.getElementById('salary-type').value;
    const amount = parseFloat(document.getElementById('salary-amount').value);
    const contract = document.getElementById('salary-contract').value;
    const youngWorker = document.getElementById('salary-youngworker').checked;
    const resultBox = document.getElementById('salary-result');

    if (isNaN(amount) || amount <= 0) {
        alert('Proszę wprowadzić poprawną kwotę!');
        return;
    }

    let brutto, netto, deductions;

    if (contract === 'employment') {
        // Umowa o pracę - uproszczone składki 2024
        const employeeSocial = 0.1352; // ~13.52% składki pracownika
        const taxableBase = type === 'brutto' ? amount * (1 - employeeSocial) : amount;
        const taxRate = youngWorker ? 0 : 0.12; // Ulga dla młodych lub 12% podatku
        const taxAmount = taxableBase * taxRate * 0.8775; // Po odliczeniu kosztów

        if (type === 'brutto') {
            brutto = amount;
            deductions = amount * employeeSocial + taxAmount;
            netto = amount - deductions;
        } else {
            // Netto -> Brutto (przybliżone)
            netto = amount;
            brutto = amount / (1 - employeeSocial - (youngWorker ? 0 : 0.105));
            deductions = brutto - netto;
        }
    } else {
        // B2B - ryczałt 12%
        if (type === 'brutto') {
            brutto = amount;
            deductions = amount * 0.12 + 381.81; // 12% ryczałt + ZUS
            netto = brutto - deductions;
        } else {
            netto = amount;
            brutto = (amount + 381.81) / 0.88;
            deductions = brutto - netto;
        }
    }

    document.getElementById('salary-brutto').textContent = formatCurrency(brutto);
    document.getElementById('salary-deductions').textContent = formatCurrency(deductions);
    document.getElementById('salary-netto').textContent = formatCurrency(netto);

    const contractName = contract === 'employment' ? 'Umowa o pracę' : 'Działalność (B2B) - ryczałt 12%';
    const youngWorkerText = youngWorker ? ' (ulga dla młodych)' : '';

    const description = `
        <p><strong>${contractName}${youngWorkerText}</strong></p>
        <p>Wynagrodzenie brutto: ${formatCurrency(brutto)}</p>
        <p>Składki i podatek: ${formatCurrency(deductions)} (${formatPercent((deductions/brutto)*100)})</p>
        <p><strong>Wypłata netto: ${formatCurrency(netto)}</strong></p>
        <p style="margin-top: 1rem; font-size: 0.9em; opacity: 0.9;">
            ℹ️ Kalkulacja orientacyjna na podstawie zasad 2024. Rzeczywiste kwoty mogą się nieznacznie różnić.
        </p>
    `;

    document.getElementById('salary-description').innerHTML = description;
    resultBox.style.display = 'block';
    resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Add smooth scroll behavior to all internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Input validation - allow only numbers and decimal point
document.querySelectorAll('input[type="number"]').forEach(input => {
    input.addEventListener('keypress', function(e) {
        // Allow: backspace, delete, tab, escape, enter, decimal point
        if ([46, 8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
            // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
            (e.keyCode === 65 && e.ctrlKey === true) ||
            (e.keyCode === 67 && e.ctrlKey === true) ||
            (e.keyCode === 86 && e.ctrlKey === true) ||
            (e.keyCode === 88 && e.ctrlKey === true) ||
            // Allow: home, end, left, right
            (e.keyCode >= 35 && e.keyCode <= 39)) {
            return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });
});

console.log('🧮 Kalkulator Biznesowy - gotowy do użycia!');
