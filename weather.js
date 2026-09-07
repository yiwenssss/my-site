const weatherLocationEl = document.getElementById('weather-location');
const weatherTempEl = document.getElementById('weather-temp');
const weatherConditionEl = document.getElementById('weather-condition');
const weatherIconEl = document.getElementById('weather-icon');

const weatherCodeMap = {
  0: { emoji: '☀️', condition: 'Clear sky' },
  1: { emoji: '🌤️', condition: 'Mostly clear' },
  2: { emoji: '⛅', condition: 'Partly cloudy' },
  3: { emoji: '☁️', condition: 'Cloudy' },
  45: { emoji: '🌫️', condition: 'Foggy' },
  48: { emoji: '🌫️', condition: 'Rime fog' },
  51: { emoji: '🌦️', condition: 'Light drizzle' },
  53: { emoji: '🌦️', condition: 'Drizzle' },
  55: { emoji: '🌧️', condition: 'Heavy drizzle' },
  56: { emoji: '🌧️', condition: 'Freezing drizzle' },
  57: { emoji: '🌧️', condition: 'Heavy freezing drizzle' },
  61: { emoji: '🌧️', condition: 'Light rain' },
  63: { emoji: '🌧️', condition: 'Rain' },
  65: { emoji: '🌧️', condition: 'Heavy rain' },
  66: { emoji: '🌧️', condition: 'Freezing rain' },
  67: { emoji: '🌧️', condition: 'Heavy freezing rain' },
  71: { emoji: '❄️', condition: 'Light snow' },
  73: { emoji: '❄️', condition: 'Snow' },
  75: { emoji: '❄️', condition: 'Heavy snow' },
  77: { emoji: '❄️', condition: 'Snow grains' },
  80: { emoji: '🌦️', condition: 'Rain showers' },
  81: { emoji: '🌧️', condition: 'Heavy showers' },
  82: { emoji: '⛈️', condition: 'Violent showers' },
  85: { emoji: '🌨️', condition: 'Snow showers' },
  86: { emoji: '🌨️', condition: 'Heavy snow showers' },
  95: { emoji: '⛈️', condition: 'Thunderstorm' },
  96: { emoji: '⛈️', condition: 'Thunderstorm with hail' },
  99: { emoji: '⛈️', condition: 'Heavy thunderstorm with hail' }
};

function setWeatherFallback(message) {
  weatherLocationEl.textContent = 'Unavailable';
  weatherTempEl.textContent = '--°C';
  weatherConditionEl.textContent = message;
  weatherIconEl.textContent = '🌍';
}

function setLocationDeniedFallback() {
  weatherLocationEl.textContent = 'Location';
  weatherTempEl.textContent = '--°C';
  weatherConditionEl.textContent = 'enable location to see your weather';
  weatherIconEl.textContent = '🙃';
}

async function fetchWeather(latitude, longitude) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&timezone=auto`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Weather request failed');

    const data = await response.json();
    const current = data.current;
    const code = current.weather_code;
    const weather = weatherCodeMap[code] || { emoji: '☁️', condition: 'Conditions vary' };
    const localName = data.timezone || 'your location';

    weatherLocationEl.textContent = localName.replace('_', ' ');
    weatherTempEl.textContent = `${Math.round(current.temperature_2m)}°C`;
    weatherConditionEl.textContent = weather.condition;
    weatherIconEl.textContent = weather.emoji;
  } catch (error) {
    setWeatherFallback('Weather unavailable');
  }
}

if (!navigator.geolocation) {
  setWeatherFallback('Location blocked');
} else {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      fetchWeather(latitude, longitude);
    },
    () => {
      setLocationDeniedFallback();
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 600000
    }
  );
}
