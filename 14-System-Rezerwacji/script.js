// System Rezerwacji Online - Main Script
// Author: Portfolio Project
// Features: Calendar, Time Slots, Booking Management, Admin Panel, LocalStorage

// Global State
let currentStep = 1;
let selectedService = null;
let selectedDate = null;
let selectedTime = null;
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let bookings = [];

// Service Data
const services = {
    haircut: { name: 'Strzyżenie', duration: 45, price: 80 },
    coloring: { name: 'Koloryzacja', duration: 90, price: 150 },
    styling: { name: 'Stylizacja', duration: 60, price: 100 },
    massage: { name: 'Masaż głowy', duration: 60, price: 120 },
    treatment: { name: 'Zabieg regeneracyjny', duration: 75, price: 200 },
    consultation: { name: 'Konsultacja', duration: 30, price: 50 }
};

// Working Hours (modify as needed)
const workingHours = {
    start: 9, // 9:00
    end: 19,  // 19:00
    interval: 30 // minutes
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    loadBookings();
    attachEventListeners();
    renderCalendar();
    updateAdminTable();
});

// Load bookings from localStorage
function loadBookings() {
    const saved = localStorage.getItem('bookings');
    if (saved) {
        bookings = JSON.parse(saved);
    }
}

// Save bookings to localStorage
function saveBookings() {
    localStorage.setItem('bookings', JSON.stringify(bookings));
}

// Attach Event Listeners
function attachEventListeners() {
    // Navigation buttons
    document.getElementById('nextBtn').addEventListener('click', nextStep);
    document.getElementById('prevBtn').addEventListener('click', prevStep);
    document.getElementById('submitBtn').addEventListener('click', submitBooking);
    
    // Service cards
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('click', () => selectService(card));
    });
    
    // Calendar navigation
    document.getElementById('prevMonth').addEventListener('click', () => changeMonth(-1));
    document.getElementById('nextMonth').addEventListener('click', () => changeMonth(1));
    
    // Success modal
    document.getElementById('closeSuccessModal').addEventListener('click', closeSuccessModal);
    document.getElementById('overlay').addEventListener('click', closeSuccessModal);
    
    // Admin section
    document.querySelector('a[href="#admin"]').addEventListener('click', (e) => {
        e.preventDefault();
        showAdminPanel();
    });
    
    document.querySelector('a[href="#rezerwacja"]').addEventListener('click', (e) => {
        e.preventDefault();
        showBookingSection();
    });
    
    // Admin filters
    document.getElementById('filterDate').addEventListener('change', applyFilters);
    document.getElementById('filterService').addEventListener('change', applyFilters);
    document.getElementById('filterStatus').addEventListener('change', applyFilters);
    document.getElementById('resetFilters').addEventListener('click', resetFilters);
    
    // Admin actions
    document.getElementById('exportBtn').addEventListener('click', exportToCSV);
    document.getElementById('clearAllBtn').addEventListener('click', clearAllBookings);
}

// Step Navigation
function nextStep() {
    if (currentStep === 1) {
        if (!selectedService) {
            alert('Proszę wybrać usługę!');
            return;
        }
        showStep(2);
    } else if (currentStep === 2) {
        if (!selectedDate || !selectedTime) {
            alert('Proszę wybrać datę i godzinę!');
            return;
        }
        updateSummary();
        showStep(3);
    }
}

function prevStep() {
    if (currentStep > 1) {
        showStep(currentStep - 1);
    }
}

function showStep(step) {
    // Hide all steps
    for (let i = 1; i <= 3; i++) {
        document.getElementById(`step${i}`).style.display = 'none';
        document.querySelector(`.step[data-step="${i}"]`).classList.remove('active', 'completed');
    }
    
    // Show current step
    document.getElementById(`step${step}`).style.display = 'block';
    document.querySelector(`.step[data-step="${step}"]`).classList.add('active');
    
    // Mark completed steps
    for (let i = 1; i < step; i++) {
        document.querySelector(`.step[data-step="${i}"]`).classList.add('completed');
    }
    
    // Update buttons
    document.getElementById('prevBtn').style.display = step > 1 ? 'flex' : 'none';
    document.getElementById('nextBtn').style.display = step < 3 ? 'flex' : 'none';
    document.getElementById('submitBtn').style.display = step === 3 ? 'flex' : 'none';
    
    currentStep = step;
}

// Select Service
function selectService(card) {
    // Remove previous selection
    document.querySelectorAll('.service-card').forEach(c => c.classList.remove('selected'));
    
    // Select new service
    card.classList.add('selected');
    selectedService = {
        id: card.dataset.service,
        name: services[card.dataset.service].name,
        duration: parseInt(card.dataset.duration),
        price: parseInt(card.dataset.price)
    };
}

// Calendar Functions
function renderCalendar() {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const prevLastDay = new Date(currentYear, currentMonth, 0);
    
    const firstDayIndex = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    const lastDate = lastDay.getDate();
    const prevLastDate = prevLastDay.getDate();
    
    // Update month display
    const monthNames = ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
                        'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'];
    document.getElementById('currentMonth').textContent = `${monthNames[currentMonth]} ${currentYear}`;
    
    let days = '';
    
    // Previous month days
    for (let x = firstDayIndex; x > 0; x--) {
        days += `<div class="calendar-day other-month disabled">${prevLastDate - x + 1}</div>`;
    }
    
    // Current month days
    const today = new Date();
    for (let i = 1; i <= lastDate; i++) {
        const date = new Date(currentYear, currentMonth, i);
        const isPast = date < today.setHours(0, 0, 0, 0);
        const isToday = date.toDateString() === new Date().toDateString();
        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
        
        let classes = 'calendar-day';
        if (isPast) classes += ' disabled';
        if (isToday) classes += ' today';
        if (isWeekend) classes += ' disabled'; // No bookings on weekends
        
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        if (selectedDate === dateStr) classes += ' selected';
        
        days += `<div class="${classes}" data-date="${dateStr}" onclick="selectDate('${dateStr}')">${i}</div>`;
    }
    
    // Next month days to fill grid
    const remainingDays = 7 - ((firstDayIndex + lastDate) % 7);
    if (remainingDays < 7) {
        for (let j = 1; j <= remainingDays; j++) {
            days += `<div class="calendar-day other-month disabled">${j}</div>`;
        }
    }
    
    document.getElementById('calendarDays').innerHTML = days;
}

function changeMonth(direction) {
    currentMonth += direction;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    } else if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar();
}

function selectDate(dateStr) {
    const clickedDate = new Date(dateStr);
    const today = new Date().setHours(0, 0, 0, 0);
    
    if (clickedDate < today) return;
    if (clickedDate.getDay() === 0 || clickedDate.getDay() === 6) return;
    
    selectedDate = dateStr;
    selectedTime = null; // Reset time when date changes
    renderCalendar();
    generateTimeSlots();
    
    // Update info
    const date = new Date(dateStr);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('selectedDateInfo').textContent = 
        `Wybrano: ${date.toLocaleDateString('pl-PL', options)}`;
}

function generateTimeSlots() {
    if (!selectedDate) return;
    
    const timeSlotsContainer = document.getElementById('timeSlots');
    timeSlotsContainer.innerHTML = '';
    
    const slots = [];
    let currentTime = workingHours.start * 60; // Convert to minutes
    const endTime = workingHours.end * 60;
    
    while (currentTime < endTime) {
        const hours = Math.floor(currentTime / 60);
        const minutes = currentTime % 60;
        const timeStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
        
        // Check if slot is available
        const isBooked = bookings.some(booking => 
            booking.date === selectedDate && 
            booking.time === timeStr &&
            booking.status !== 'cancelled'
        );
        
        const slotDiv = document.createElement('div');
        slotDiv.className = `time-slot ${isBooked ? 'disabled' : ''}`;
        slotDiv.textContent = timeStr;
        
        if (!isBooked) {
            slotDiv.onclick = () => selectTime(timeStr);
        }
        
        timeSlotsContainer.appendChild(slotDiv);
        
        currentTime += workingHours.interval;
    }
}

function selectTime(time) {
    document.querySelectorAll('.time-slot').forEach(slot => slot.classList.remove('selected'));
    event.target.classList.add('selected');
    selectedTime = time;
}

// Update Summary
function updateSummary() {
    document.getElementById('summaryService').textContent = selectedService.name;
    
    const date = new Date(selectedDate);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('summaryDate').textContent = date.toLocaleDateString('pl-PL', options);
    
    document.getElementById('summaryTime').textContent = selectedTime;
    document.getElementById('summaryDuration').textContent = `${selectedService.duration} min`;
    document.getElementById('summaryPrice').textContent = `${selectedService.price} zł`;
}

// Submit Booking
function submitBooking() {
    const form = document.getElementById('bookingForm');
    
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const booking = {
        id: Date.now(),
        service: selectedService.id,
        serviceName: selectedService.name,
        date: selectedDate,
        time: selectedTime,
        duration: selectedService.duration,
        price: selectedService.price,
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        notes: document.getElementById('notes').value,
        newsletter: document.getElementById('newsletter').checked,
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    
    bookings.push(booking);
    saveBookings();
    
    showSuccessModal(booking);
    
    // Reset form
    resetBooking();
}

// Show Success Modal
function showSuccessModal(booking) {
    const date = new Date(booking.date);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    
    document.getElementById('confirmationDetails').innerHTML = `
        <div class="summary-item">
            <span class="summary-label">Numer rezerwacji:</span>
            <span class="summary-value">#${booking.id}</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">Usługa:</span>
            <span class="summary-value">${booking.serviceName}</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">Termin:</span>
            <span class="summary-value">${date.toLocaleDateString('pl-PL', options)}</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">Godzina:</span>
            <span class="summary-value">${booking.time}</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">Cena:</span>
            <span class="summary-value">${booking.price} zł</span>
        </div>
    `;
    
    document.getElementById('successModal').classList.add('active');
    document.getElementById('overlay').classList.add('active');
}

function closeSuccessModal() {
    document.getElementById('successModal').classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
}

function resetBooking() {
    selectedService = null;
    selectedDate = null;
    selectedTime = null;
    document.getElementById('bookingForm').reset();
    document.querySelectorAll('.service-card').forEach(card => card.classList.remove('selected'));
    showStep(1);
}

// Admin Panel Functions
function showAdminPanel() {
    document.getElementById('rezerwacja').style.display = 'none';
    document.getElementById('admin').style.display = 'block';
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#admin');
    });
    updateAdminTable();
}

function showBookingSection() {
    document.getElementById('admin').style.display = 'none';
    document.getElementById('rezerwacja').style.display = 'block';
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#rezerwacja');
    });
}

function updateAdminTable(filtered = bookings) {
    const tbody = document.getElementById('bookingsTableBody');
    const emptyAdmin = document.getElementById('emptyAdmin');
    
    if (filtered.length === 0) {
        tbody.innerHTML = '';
        emptyAdmin.style.display = 'block';
        return;
    }
    
    emptyAdmin.style.display = 'none';
    
    tbody.innerHTML = filtered.map(booking => {
        const date = new Date(booking.date);
        const createdDate = new Date(booking.createdAt);
        
        return `
            <tr>
                <td>#${booking.id}</td>
                <td>${createdDate.toLocaleDateString('pl-PL')}</td>
                <td>${booking.firstName} ${booking.lastName}</td>
                <td>${booking.email}</td>
                <td>${booking.phone}</td>
                <td>${booking.serviceName}</td>
                <td>${date.toLocaleDateString('pl-PL')}</td>
                <td>${booking.time}</td>
                <td>${booking.price} zł</td>
                <td>
                    <span class="status-badge ${booking.status}">
                        ${booking.status === 'pending' ? 'Oczekujące' : 
                          booking.status === 'confirmed' ? 'Potwierdzone' : 'Anulowane'}
                    </span>
                </td>
                <td>
                    <div class="action-btns">
                        ${booking.status === 'pending' ? 
                            `<button class="action-btn confirm" onclick="confirmBooking(${booking.id})">
                                Potwierdź
                            </button>` : ''}
                        ${booking.status !== 'cancelled' ? 
                            `<button class="action-btn cancel" onclick="cancelBooking(${booking.id})">
                                Anuluj
                            </button>` : ''}
                        <button class="action-btn delete" onclick="deleteBooking(${booking.id})">
                            Usuń
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function confirmBooking(id) {
    const booking = bookings.find(b => b.id === id);
    if (booking) {
        booking.status = 'confirmed';
        saveBookings();
        updateAdminTable();
    }
}

function cancelBooking(id) {
    if (confirm('Czy na pewno chcesz anulować tę rezerwację?')) {
        const booking = bookings.find(b => b.id === id);
        if (booking) {
            booking.status = 'cancelled';
            saveBookings();
            updateAdminTable();
        }
    }
}

function deleteBooking(id) {
    if (confirm('Czy na pewno chcesz usunąć tę rezerwację?')) {
        bookings = bookings.filter(b => b.id !== id);
        saveBookings();
        updateAdminTable();
    }
}

function applyFilters() {
    const dateFilter = document.getElementById('filterDate').value;
    const serviceFilter = document.getElementById('filterService').value;
    const statusFilter = document.getElementById('filterStatus').value;
    
    let filtered = [...bookings];
    
    if (dateFilter) {
        filtered = filtered.filter(b => b.date === dateFilter);
    }
    
    if (serviceFilter) {
        filtered = filtered.filter(b => b.service === serviceFilter);
    }
    
    if (statusFilter) {
        filtered = filtered.filter(b => b.status === statusFilter);
    }
    
    updateAdminTable(filtered);
}

function resetFilters() {
    document.getElementById('filterDate').value = '';
    document.getElementById('filterService').value = '';
    document.getElementById('filterStatus').value = '';
    updateAdminTable();
}

function exportToCSV() {
    if (bookings.length === 0) {
        alert('Brak rezerwacji do eksportu!');
        return;
    }
    
    const headers = ['ID', 'Data utworzenia', 'Imię', 'Nazwisko', 'Email', 'Telefon', 'Usługa', 'Data wizyty', 'Godzina', 'Cena', 'Status', 'Uwagi'];
    
    const rows = bookings.map(b => [
        b.id,
        new Date(b.createdAt).toLocaleDateString('pl-PL'),
        b.firstName,
        b.lastName,
        b.email,
        b.phone,
        b.serviceName,
        new Date(b.date).toLocaleDateString('pl-PL'),
        b.time,
        b.price,
        b.status,
        b.notes || ''
    ]);
    
    let csv = headers.join(',') + '\n';
    rows.forEach(row => {
        csv += row.map(cell => `"${cell}"`).join(',') + '\n';
    });
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `rezerwacje_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
}

function clearAllBookings() {
    if (confirm('Czy na pewno chcesz usunąć WSZYSTKIE rezerwacje? Ta operacja jest nieodwracalna!')) {
        if (confirm('To usunie ' + bookings.length + ' rezerwacji. Jesteś pewien?')) {
            bookings = [];
            saveBookings();
            updateAdminTable();
            alert('Wszystkie rezerwacje zostały usunięte.');
        }
    }
}

// Console log
console.log('System Rezerwacji załadowany pomyślnie!');
console.log(`Liczba rezerwacji: ${bookings.length}`);
