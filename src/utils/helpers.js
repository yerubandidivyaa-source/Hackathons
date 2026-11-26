import { HOURS } from '../data/weatherData.js';

export const load = (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } };
export const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* ignore */ } };

export const conv = (c, u) => Math.round(u === 'F' ? (c * 9) / 5 + 32 : c);
export const deg = (c, u) => `${conv(c, u)}°${u}`;
export const toC = (v, u) => (u === 'F' ? ((v - 32) * 5) / 9 : v);
export const feels = (w) => Math.round(w.temp + (w.humidity - 50) / 10 - w.wind / 15);
export const uvLabel = (u) => (u <= 2 ? 'Low' : u <= 5 ? 'Moderate' : u <= 7 ? 'High' : u <= 10 ? 'Very high' : 'Extreme');

// Builds hourly series from the base city data, shifted by any manual changes.
export function hourly(base, w, unit) {
  const d = w.temp - base.temp;
  const jit = [0, 2, 3, 1, -1, -2, -3, -2];
  return base.hourly.map((t, i) => ({
    h: HOURS[i],
    tc: t + d,
    temp: conv(t + d, unit),
    cond: i === 0 ? w.cond : base.hc[i],
    hum: Math.max(5, Math.min(100, Math.round(w.humidity - (t - base.temp) * 2))),
    wind: Math.max(0, Math.round(w.wind + jit[i])),
  }));
}

// Recommendation engine – plain JavaScript conditions.
export function recommend(w) {
  const r = [];
  if (w.temp >= 33) r.push({ lvl: 'warn', icon: 'Droplets', title: 'Stay hydrated', text: 'It is hot. Drink water regularly and avoid strenuous work from noon to 3 PM.' });
  if (w.temp <= 15) r.push({ lvl: 'info', icon: 'Shirt', title: 'Layer up', text: 'Temperatures are low. Carry a jacket, especially in the morning and evening.' });
  if (w.cond === 'Rainy') r.push({ lvl: 'info', icon: 'Umbrella', title: 'Carry an umbrella', text: 'Rain is likely. Keep an umbrella or raincoat handy and allow extra travel time.' });
  if (w.cond === 'Stormy') r.push({ lvl: 'bad', icon: 'CloudLightning', title: 'Stay indoors', text: 'Thunderstorm conditions. Avoid open areas and unplug sensitive electronics.' });
  if (w.cond === 'Foggy') r.push({ lvl: 'warn', icon: 'CloudFog', title: 'Low visibility', text: 'Drive slowly, use fog lamps and keep a longer distance from other vehicles.' });
  if (w.humidity >= 75) r.push({ lvl: 'warn', icon: 'Droplets', title: 'Humid-weather advisory', text: 'High humidity makes it feel warmer. Wear breathable fabrics and keep rooms ventilated.' });
  if (w.uv >= 6) r.push({ lvl: w.uv >= 8 ? 'bad' : 'warn', icon: 'Sun', title: 'Sun protection', text: `UV index is ${w.uv}. Use SPF 30+ sunscreen, sunglasses and a hat outdoors.` });
  if (w.wind >= 30) r.push({ lvl: 'warn', icon: 'Wind', title: 'Strong winds', text: 'Secure loose objects and be careful when cycling or driving high-sided vehicles.' });
  if (!r.length) r.push({ lvl: 'good', icon: 'Smile', title: 'Pleasant conditions', text: 'No weather concerns right now. A great time to be outside.' });
  return r;
}

const clamp = (n) => Math.max(0, Math.min(100, Math.round(n)));
export function activities(w) {
  const wet = w.cond === 'Rainy' ? 45 : w.cond === 'Stormy' ? 80 : w.cond === 'Foggy' ? 15 : 0;
  const base = 100 - wet - Math.max(0, w.temp - 30) * 3 - Math.max(0, 12 - w.temp) * 3 - Math.max(0, w.humidity - 70) * 0.8 - Math.max(0, w.uv - 6) * 4;
  const list = [
    { name: 'Walking', icon: 'Footprints', score: clamp(base - Math.max(0, w.wind - 35)) },
    { name: 'Cycling', icon: 'Bike', score: clamp(base - Math.max(0, w.wind - 15) * 1.6) },
    { name: 'Outdoor sports', icon: 'TreePine', score: clamp(base - Math.max(0, w.wind - 25) - Math.max(0, w.temp - 28) * 2) },
  ];
  return list.map((a) => ({ ...a, label: a.score >= 70 ? 'Great' : a.score >= 40 ? 'Okay' : 'Avoid' }));
}
