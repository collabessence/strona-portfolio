// Weather App - Main Script
// Features: OpenWeatherMap API, City Search, 5-day Forecast, Geolocation, Favorites, Unit Toggle

// Configuration
const CONFIG = {
    API_KEY: '', // Will be set by user or loaded from localStorage
    API_BASE_URL: 'https://api.openweathermap.org/data/2.5',
    GEO_API_URL: 'https://api.openweathermap.org/geo/1.0',
    DEMO_MODE: false
};

// State
let currentUnit = 'C'; // 'C' or 'F'
let currentCity = null;
let favorites = [];

// DOM Elements
const citySearch = document.getElementById('citySearch');
const searchSuggestions = document.getElementById('searchSuggestions');
const locationBtn = document.getElementById('locationBtn');
const unitToggle = document.getElementById('unitToggle');
const weatherLoading = document.getElementById('weatherLoading');
const weatherContent = document.getElementById('weatherContent');
const favoriteBtn = document.getElementById('favoriteBtn');
const favoritesContainer = document.getElementById('favoritesContainer');
const forecastSection = document.getElementById('forecastSection');
const forecastContainer = document.getElementById('forecastContainer');
const apiKeyModal = document.getElementById('apiKeyModal');
const apiKeyInput = document.getElementById('apiKeyInput');
const saveApiKeyBtn = document.getElementById('saveApiKeyBtn');
const useDemoBtn = document.getElementById('useDemoBtn');
const overlay = document.getElementById('overlay');

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    loadConfig();
    loadFavorites();
    attachEventListeners();
    
    if (!CONFIG.API_KEY && !CONFIG.DEMO_MODE) {
        showApiKeyModal();
    } else {
        // Load default city or last searched
        const lastCity = localStorage.getItem('lastCity');
        if (lastCity) {
            fetchWeatherByCity(lastCity);
        } else {
            fetchWeatherByCity('Warsaw');
        }
    }
});

// Load configuration from localStorage
function loadConfig() {
    const savedKey = localStorage.getItem('weatherApiKey');
    const demoMode = localStorage.getItem('weatherDemoMode');
    
    if (savedKey) {
        CONFIG.API_KEY = savedKey;
    }
    
    if (demoMode === 'true') {
        CONFIG.DEMO_MODE = true;
    }
    
    const savedUnit = localStorage.getItem('weatherUnit');
    if (savedUnit) {
        currentUnit = savedUnit;
        updateUnitToggle();
    }
}

// Load favorites from localStorage
function loadFavorites() {
    const saved = localStorage.getItem('weatherFavorites');
    if (saved) {
        favorites = JSON.parse(saved);
        renderFavorites();
    }
}

// Save favorites to localStorage
function saveFavorites() {
    localStorage.setItem('weatherFavorites', JSON.stringify(favorites));
}

// Event Listeners
function attachEventListeners() {
    // Search input
    citySearch.addEventListener('input', handleSearch);
    
    // Location button
    locationBtn.addEventListener('click', getCurrentLocation);
    
    // Unit toggle
    document.querySelectorAll('.unit').forEach(unit => {
        unit.addEventListener('click', () => {
            const newUnit = unit.dataset.unit;
            if (newUnit !== currentUnit) {
                currentUnit = newUnit;
                localStorage.setItem('weatherUnit', currentUnit);
                updateUnitToggle();
                if (currentCity) {
                    updateTemperatureDisplay();
                }
            }
        });
    });
    
    // Favorite button
    favoriteBtn.addEventListener('click', toggleFavorite);
    
    // API Key Modal
    saveApiKeyBtn.addEventListener('click', saveApiKey);
    useDemoBtn.addEventListener('click', useDemoMode);
    
    // Close suggestions when clicking outside
    document.addEventListener('click', (e) => {
        if (!citySearch.contains(e.target) && !searchSuggestions.contains(e.target)) {
            searchSuggestions.classList.remove('active');
        }
    });
}

// Show API Key Modal
function showApiKeyModal() {
    apiKeyModal.classList.add('active');
    overlay.classList.add('active');
}

// Hide API Key Modal
function hideApiKeyModal() {
    apiKeyModal.classList.remove('active');
    overlay.classList.remove('active');
}

// Save API Key
function saveApiKey() {
    const key = apiKeyInput.value.trim();
    
    if (!key) {
        alert('Proszę wprowadzić klucz API!');
        return;
    }
    
    CONFIG.API_KEY = key;
    CONFIG.DEMO_MODE = false;
    localStorage.setItem('weatherApiKey', key);
    localStorage.removeItem('weatherDemoMode');
    
    hideApiKeyModal();
    fetchWeatherByCity('Warsaw');
}

// Use Demo Mode
function useDemoMode() {
    CONFIG.DEMO_MODE = true;
    localStorage.setItem('weatherDemoMode', 'true');
    hideApiKeyModal();
    loadDemoData();
}

// Handle Search Input
let searchTimeout;
function handleSearch(e) {
    const query = e.target.value.trim();
    
    clearTimeout(searchTimeout);
    
    if (query.length < 2) {
        searchSuggestions.classList.remove('active');
        return;
    }
    
    searchTimeout = setTimeout(async () => {
        if (CONFIG.DEMO_MODE) {
            showDemoSuggestions(query);
        } else {
            await fetchCitySuggestions(query);
        }
    }, 300);
}

// Fetch City Suggestions from API
async function fetchCitySuggestions(query) {
    try {
        const response = await fetch(
            `${CONFIG.GEO_API_URL}/direct?q=${encodeURIComponent(query)}&limit=5&appid=${CONFIG.API_KEY}`
        );
        
        if (!response.ok) throw new Error('Failed to fetch suggestions');
        
        const cities = await response.json();
        displaySuggestions(cities);
    } catch (error) {
        console.error('Error fetching suggestions:', error);
    }
}

// Display City Suggestions
function displaySuggestions(cities) {
    if (cities.length === 0) {
        searchSuggestions.classList.remove('active');
        return;
    }
    
    searchSuggestions.innerHTML = cities.map(city => `
        <div class="suggestion-item" data-lat="${city.lat}" data-lon="${city.lon}" data-name="${city.name}">
            <div class="suggestion-name">${city.name}${city.state ? ', ' + city.state : ''}</div>
            <div class="suggestion-country">${getCountryName(city.country)}</div>
        </div>
    `).join('');
    
    searchSuggestions.classList.add('active');
    
    // Attach click listeners
    document.querySelectorAll('.suggestion-item').forEach(item => {
        item.addEventListener('click', () => {
            const lat = item.dataset.lat;
            const lon = item.dataset.lon;
            const name = item.dataset.name;
            fetchWeatherByCoords(lat, lon, name);
            citySearch.value = name;
            searchSuggestions.classList.remove('active');
        });
    });
}

// Show Demo Suggestions
function showDemoSuggestions(query) {
    const demoCities = [
        { name: 'Warsaw', country: 'PL', lat: 52.2297, lon: 21.0122 },
        { name: 'Kraków', country: 'PL', lat: 50.0647, lon: 19.9450 },
        { name: 'London', country: 'GB', lat: 51.5074, lon: -0.1278 },
        { name: 'Paris', country: 'FR', lat: 48.8566, lon: 2.3522 },
        { name: 'Berlin', country: 'DE', lat: 52.5200, lon: 13.4050 }
    ];
    
    const filtered = demoCities.filter(city => 
        city.name.toLowerCase().includes(query.toLowerCase())
    );
    
    displaySuggestions(filtered);
}

// Get Current Location (Geolocation)
function getCurrentLocation() {
    if (!navigator.geolocation) {
        alert('Geolokalizacja nie jest wspierana przez Twoją przeglądarkę.');
        return;
    }
    
    locationBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            fetchWeatherByCoords(latitude, longitude);
            locationBtn.innerHTML = '<i class="fas fa-location-crosshairs"></i>';
        },
        (error) => {
            console.error('Geolocation error:', error);
            alert('Nie udało się pobrać Twojej lokalizacji. Sprawdź uprawnienia przeglądarki.');
            locationBtn.innerHTML = '<i class="fas fa-location-crosshairs"></i>';
        }
    );
}

// Fetch Weather by City Name
async function fetchWeatherByCity(cityName) {
    showLoading();
    
    if (CONFIG.DEMO_MODE) {
        loadDemoData();
        return;
    }
    
    try {
        const geoResponse = await fetch(
            `${CONFIG.GEO_API_URL}/direct?q=${encodeURIComponent(cityName)}&limit=1&appid=${CONFIG.API_KEY}`
        );
        
        if (!geoResponse.ok) throw new Error('City not found');
        
        const geoData = await geoResponse.json();
        
        if (geoData.length === 0) {
            throw new Error('City not found');
        }
        
        const { lat, lon, name } = geoData[0];
        await fetchWeatherByCoords(lat, lon, name);
        
    } catch (error) {
        console.error('Error fetching weather:', error);
        alert('Nie udało się pobrać danych pogodowych. Sprawdź nazwę miasta.');
        hideLoading();
    }
}

// Fetch Weather by Coordinates
async function fetchWeatherByCoords(lat, lon, cityName = null) {
    showLoading();
    
    if (CONFIG.DEMO_MODE) {
        loadDemoData();
        return;
    }
    
    try {
        // Fetch current weather
        const weatherResponse = await fetch(
            `${CONFIG.API_BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${CONFIG.API_KEY}&units=metric&lang=pl`
        );
        
        if (!weatherResponse.ok) throw new Error('Failed to fetch weather');
        
        const weatherData = await weatherResponse.json();
        
        // Fetch 5-day forecast
        const forecastResponse = await fetch(
            `${CONFIG.API_BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${CONFIG.API_KEY}&units=metric&lang=pl`
        );
        
        if (!forecastResponse.ok) throw new Error('Failed to fetch forecast');
        
        const forecastData = await forecastResponse.json();
        
        currentCity = {
            name: cityName || weatherData.name,
            lat,
            lon,
            weather: weatherData,
            forecast: forecastData
        };
        
        localStorage.setItem('lastCity', currentCity.name);
        
        displayWeather(weatherData);
        displayForecast(forecastData);
        updateFavoriteButton();
        hideLoading();
        
    } catch (error) {
        console.error('Error fetching weather:', error);
        alert('Nie udało się pobrać danych pogodowych. Sprawdź klucz API.');
        hideLoading();
    }
}

// Display Current Weather
function displayWeather(data) {
    document.getElementById('cityName').textContent = data.name;
    document.getElementById('currentDate').textContent = formatDate(new Date());
    
    // Temperature
    const temp = convertTemperature(data.main.temp);
    document.getElementById('tempValue').textContent = Math.round(temp);
    document.querySelector('.temp-unit').textContent = `°${currentUnit}`;
    
    // Weather description and icon
    document.getElementById('weatherDescription').textContent = data.weather[0].description;
    const icon = getWeatherIcon(data.weather[0].icon);
    document.getElementById('weatherIconLarge').innerHTML = `<i class="${icon}"></i>`;
    
    // Feels like
    const feelsLike = convertTemperature(data.main.feels_like);
    document.getElementById('feelsLike').textContent = `${Math.round(feelsLike)}°${currentUnit}`;
    
    // Details
    document.getElementById('windSpeed').textContent = `${data.wind.speed} km/h`;
    document.getElementById('humidity').textContent = `${data.main.humidity}%`;
    document.getElementById('pressure').textContent = `${data.main.pressure} hPa`;
    document.getElementById('visibility').textContent = `${(data.visibility / 1000).toFixed(1)} km`;
    
    // Sunrise and Sunset
    document.getElementById('sunrise').textContent = formatTime(data.sys.sunrise);
    document.getElementById('sunset').textContent = formatTime(data.sys.sunset);
}

// Display 5-Day Forecast
function displayForecast(data) {
    // Get one forecast per day (around noon)
    const dailyForecasts = [];
    const processedDays = new Set();
    
    data.list.forEach(item => {
        const date = new Date(item.dt * 1000);
        const day = date.toDateString();
        
        if (!processedDays.has(day) && date.getHours() >= 12) {
            dailyForecasts.push(item);
            processedDays.add(day);
        }
    });
    
    // Limit to 5 days
    const forecasts = dailyForecasts.slice(0, 5);
    
    forecastContainer.innerHTML = forecasts.map(item => {
        const date = new Date(item.dt * 1000);
        const temp = convertTemperature(item.main.temp);
        const icon = getWeatherIcon(item.weather[0].icon);
        
        return `
            <div class="forecast-card">
                <div class="forecast-date">${formatForecastDate(date)}</div>
                <div class="forecast-icon">
                    <i class="${icon}"></i>
                </div>
                <div class="forecast-temp">${Math.round(temp)}°${currentUnit}</div>
                <div class="forecast-desc">${item.weather[0].description}</div>
            </div>
        `;
    }).join('');
    
    forecastSection.style.display = 'block';
}

// Toggle Favorite
function toggleFavorite() {
    if (!currentCity) return;
    
    const index = favorites.findIndex(f => f.name === currentCity.name);
    
    if (index === -1) {
        // Add to favorites
        favorites.push({
            name: currentCity.name,
            lat: currentCity.lat,
            lon: currentCity.lon,
            temp: currentCity.weather.main.temp,
            icon: currentCity.weather.weather[0].icon,
            description: currentCity.weather.weather[0].description
        });
    } else {
        // Remove from favorites
        favorites.splice(index, 1);
    }
    
    saveFavorites();
    renderFavorites();
    updateFavoriteButton();
}

// Update Favorite Button State
function updateFavoriteButton() {
    if (!currentCity) return;
    
    const isFavorite = favorites.some(f => f.name === currentCity.name);
    
    if (isFavorite) {
        favoriteBtn.classList.add('active');
        favoriteBtn.querySelector('i').className = 'fas fa-heart';
    } else {
        favoriteBtn.classList.remove('active');
        favoriteBtn.querySelector('i').className = 'far fa-heart';
    }
}

// Render Favorites
function renderFavorites() {
    if (favorites.length === 0) {
        favoritesContainer.innerHTML = `
            <div class="favorites-empty">
                <i class="fas fa-heart-crack"></i>
                <p>Brak ulubionych miast</p>
                <span>Dodaj miasto do ulubionych klikając <i class="fas fa-heart"></i></span>
            </div>
        `;
        return;
    }
    
    favoritesContainer.innerHTML = favorites.map(fav => {
        const temp = convertTemperature(fav.temp);
        const icon = getWeatherIcon(fav.icon);
        
        return `
            <div class="favorite-card" data-lat="${fav.lat}" data-lon="${fav.lon}" data-name="${fav.name}">
                <button class="favorite-remove" title="Usuń" aria-label="Remove from favorites">
                    <i class="fas fa-times"></i>
                </button>
                <div class="favorite-city">${fav.name}</div>
                <div class="favorite-weather">
                    <div class="favorite-temp">${Math.round(temp)}°${currentUnit}</div>
                    <div class="favorite-icon">
                        <i class="${icon}"></i>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    // Attach click listeners
    document.querySelectorAll('.favorite-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('.favorite-remove')) {
                const name = card.dataset.name;
                removeFavorite(name);
            } else {
                const lat = card.dataset.lat;
                const lon = card.dataset.lon;
                const name = card.dataset.name;
                fetchWeatherByCoords(lat, lon, name);
            }
        });
    });
}

// Remove Favorite
function removeFavorite(name) {
    favorites = favorites.filter(f => f.name !== name);
    saveFavorites();
    renderFavorites();
    updateFavoriteButton();
}

// Update Unit Toggle Display
function updateUnitToggle() {
    document.querySelectorAll('.unit').forEach(unit => {
        unit.classList.toggle('active', unit.dataset.unit === currentUnit);
    });
}

// Update Temperature Display When Unit Changes
function updateTemperatureDisplay() {
    if (!currentCity) return;
    displayWeather(currentCity.weather);
    displayForecast(currentCity.forecast);
    renderFavorites();
}

// Convert Temperature
function convertTemperature(celsius) {
    return currentUnit === 'C' ? celsius : (celsius * 9/5) + 32;
}

// Get Weather Icon Class
function getWeatherIcon(code) {
    const iconMap = {
        '01d': 'fas fa-sun',
        '01n': 'fas fa-moon',
        '02d': 'fas fa-cloud-sun',
        '02n': 'fas fa-cloud-moon',
        '03d': 'fas fa-cloud',
        '03n': 'fas fa-cloud',
        '04d': 'fas fa-cloud',
        '04n': 'fas fa-cloud',
        '09d': 'fas fa-cloud-showers-heavy',
        '09n': 'fas fa-cloud-showers-heavy',
        '10d': 'fas fa-cloud-sun-rain',
        '10n': 'fas fa-cloud-moon-rain',
        '11d': 'fas fa-cloud-bolt',
        '11n': 'fas fa-cloud-bolt',
        '13d': 'fas fa-snowflake',
        '13n': 'fas fa-snowflake',
        '50d': 'fas fa-smog',
        '50n': 'fas fa-smog'
    };
    
    return iconMap[code] || 'fas fa-cloud-sun';
}

// Format Date
function formatDate(date) {
    return date.toLocaleDateString('pl-PL', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

// Format Forecast Date
function formatForecastDate(date) {
    return date.toLocaleDateString('pl-PL', { 
        weekday: 'short', 
        day: 'numeric',
        month: 'short'
    });
}

// Format Time
function formatTime(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
}

// Get Country Name
function getCountryName(code) {
    const countries = {
        'PL': 'Polska',
        'GB': 'Wielka Brytania',
        'US': 'Stany Zjednoczone',
        'FR': 'Francja',
        'DE': 'Niemcy',
        'IT': 'Włochy',
        'ES': 'Hiszpania'
    };
    
    return countries[code] || code;
}

// Show Loading State
function showLoading() {
    weatherLoading.style.display = 'flex';
    weatherContent.style.display = 'none';
}

// Hide Loading State
function hideLoading() {
    weatherLoading.style.display = 'none';
    weatherContent.style.display = 'block';
}

// Load Demo Data
function loadDemoData() {
    const demoData = {
        name: 'Warsaw',
        main: {
            temp: 18,
            feels_like: 16,
            humidity: 65,
            pressure: 1013
        },
        weather: [{
            description: 'częściowe zachmurzenie',
            icon: '02d'
        }],
        wind: {
            speed: 12
        },
        visibility: 10000,
        sys: {
            sunrise: Date.now() / 1000 - 3600 * 3,
            sunset: Date.now() / 1000 + 3600 * 5
        }
    };
    
    const demoForecast = {
        list: [
            { dt: (Date.now() / 1000) + 86400 * 1, main: { temp: 20 }, weather: [{ description: 'słonecznie', icon: '01d' }] },
            { dt: (Date.now() / 1000) + 86400 * 2, main: { temp: 19 }, weather: [{ description: 'pochmurno', icon: '03d' }] },
            { dt: (Date.now() / 1000) + 86400 * 3, main: { temp: 17 }, weather: [{ description: 'deszcz', icon: '10d' }] },
            { dt: (Date.now() / 1000) + 86400 * 4, main: { temp: 16 }, weather: [{ description: 'deszcz', icon: '09d' }] },
            { dt: (Date.now() / 1000) + 86400 * 5, main: { temp: 18 }, weather: [{ description: 'zachmurzenie', icon: '02d' }] }
        ]
    };
    
    currentCity = {
        name: 'Warsaw (Demo)',
        lat: 52.2297,
        lon: 21.0122,
        weather: demoData,
        forecast: demoForecast
    };
    
    displayWeather(demoData);
    displayForecast(demoForecast);
    updateFavoriteButton();
    hideLoading();
}

// Console log
console.log('Weather App loaded successfully!');
console.log('Demo Mode:', CONFIG.DEMO_MODE);
