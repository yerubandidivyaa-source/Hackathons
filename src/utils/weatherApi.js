// Simple Open-Meteo connection. No API key is needed for this project.
const conditionFromCode = (code) => {
  if (code === 0 || code === 1) return 'Sunny';
  if (code === 2 || code === 3 || code === 45 || code === 48) return code >= 45 ? 'Foggy' : 'Cloudy';
  if ([95, 96, 99].includes(code)) return 'Stormy';
  return 'Rainy';
};

const shortTime = (value) => new Date(value).toLocaleTimeString([], { hour: 'numeric', hour12: true });
const shortDay = (value) => new Date(`${value}T12:00:00`).toLocaleDateString([], { weekday: 'short' });

export async function getLiveWeather(cityInfo, signal) {
  const params = new URLSearchParams({
    latitude: cityInfo.lat,
    longitude: cityInfo.lon,
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,surface_pressure',
    hourly: 'temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation_probability,weather_code,uv_index',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset',
    forecast_days: '5',
    timezone: 'auto',
  });
  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`, { signal });
  if (!response.ok) throw new Error('Weather server is temporarily unavailable.');
  const data = await response.json();
  const c = data.current;
  const h = data.hourly;
  const d = data.daily;
  const currentHour = new Date(c.time).getHours();
  let start = h.time.findIndex((time) => new Date(time).getHours() >= currentHour && time.slice(0, 10) === c.time.slice(0, 10));
  if (start < 0) start = 0;

  const hourly = h.time.slice(start, start + 8).map((time, index) => ({
    h: index === 0 ? 'Now' : shortTime(time),
    temp: Math.round(h.temperature_2m[start + index]),
    hum: h.relative_humidity_2m[start + index],
    wind: Math.round(h.wind_speed_10m[start + index]),
    cond: conditionFromCode(h.weather_code[start + index]),
    tc: Math.round(h.temperature_2m[start + index]),
    rain: h.precipitation_probability[start + index] ?? 0,
  }));
  const daily = d.time.map((date, index) => ({
    day: index === 0 ? 'Today' : shortDay(date),
    hi: Math.round(d.temperature_2m_max[index]),
    lo: Math.round(d.temperature_2m_min[index]),
    cond: conditionFromCode(d.weather_code[index]),
    rain: d.precipitation_probability_max[index] ?? 0,
  }));

  return {
    temp: Math.round(c.temperature_2m),
    feelsLike: Math.round(c.apparent_temperature),
    cond: conditionFromCode(c.weather_code),
    humidity: c.relative_humidity_2m,
    wind: Math.round(c.wind_speed_10m),
    pressure: Math.round(c.surface_pressure),
    uv: Math.round(h.uv_index[start] ?? 0),
    sunrise: shortTime(d.sunrise[0]),
    sunset: shortTime(d.sunset[0]),
    hourly,
    daily,
    source: 'Open-Meteo',
    updatedAt: c.time,
  };
}
