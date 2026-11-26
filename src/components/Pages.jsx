import React from 'react';
import { Star, Sun, Moon, Trash2, LogOut, Thermometer } from 'lucide-react';
import { CITIES } from '../data/weatherData.js';
import { deg, feels, uvLabel, recommend, activities, conv } from '../utils/helpers.js';
import { CondIcon, Stat, Hourly, Daily, Alerts, Recs, ActivityPlanner } from './Widgets.jsx';
import { TempChart, RangeChart, HumWindChart, RainChart } from './Charts.jsx';
import WeatherMap from './WeatherMap.jsx';

export function Dashboard({ ctx }) {
  const { w, city, unit, hrs, cityAlerts, saved, toggleSave, weatherMode, weatherStatus } = ctx;
  return (
    <div className="dash">
      <div className="stack">
        <section className="glass hero">
          <div>
            <span className="tag">{weatherMode === 'live' ? (weatherStatus === 'live' ? 'LIVE WEATHER' : 'LIVE MODE') : 'ADMIN SAMPLE DATA'}</span>
            <h1>{city}<small>{w.state}</small></h1>
            <div className="big-temp">{conv(w.temp, unit)}<sup>°{unit}</sup></div>
            <p className="cond">{w.cond} · Feels like {deg(w.feelsLike ?? feels(w), unit)}</p>
            <button className="btn ghost sm" onClick={() => toggleSave(city)}><Star size={15} fill={saved.includes(city) ? 'currentColor' : 'none'} /> {saved.includes(city) ? 'Saved' : 'Save city'}</button>
          </div>
          <div className="orb"><CondIcon c={w.cond} size={110} /></div>
        </section>
        <div className="grid3">
          <Stat icon="Thermometer" label="Feels like" value={deg(w.feelsLike ?? feels(w), unit)} />
          <Stat icon="Droplets" label="Humidity" value={`${w.humidity}%`} />
          <Stat icon="Wind" label="Wind speed" value={`${w.wind} km/h`} />
          <Stat icon="Gauge" label="Pressure" value={`${w.pressure} hPa`} />
          <Stat icon="Sun" label="UV index" value={w.uv} sub={uvLabel(w.uv)} />
          <div className="glass stat sun">
            <div><span className="mut">Sunrise</span><b>{w.sunrise}</b></div><div><span className="mut">Sunset</span><b>{w.sunset}</b></div>
          </div>
        </div>
        <div className="source-note">{weatherMode === 'live' ? <>Live conditions and forecast · Source: <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">Open-Meteo</a></> : <>Administrator-managed sample weather data</>}</div>
        <div className="glass card"><h3>Weather alerts</h3><Alerts list={cityAlerts} /></div>
        <div className="glass card"><h3>Hourly forecast</h3><Hourly data={hrs} unit={unit} /></div>
        <div className="glass card"><h3>5-day forecast</h3><Daily days={w.daily} unit={unit} /></div>
        <TempChart data={hrs} unit={unit} />
      </div>
      <div className="stack">
        <div className="glass card"><h3>Smart tips</h3><Recs list={recommend(w)} /></div>
      </div>
    </div>
  );
}

export function Forecast({ ctx }) {
  const { w, unit, hrs, city } = ctx;
  return (
    <div className="stack">
      <h2>Forecast for {city} <span className="tag">{ctx.weatherMode === 'live' ? 'LIVE DATA' : 'SAMPLE DATA'}</span></h2>
      <div className="glass card"><h3>Next 8 hours</h3><Hourly data={hrs} unit={unit} /></div>
      <div className="glass card"><h3>5-day outlook</h3><Daily days={w.daily} unit={unit} /></div>
      <div className="grid2"><RangeChart days={w.daily} unit={unit} /><RainChart days={w.daily} /></div>
      <div className="grid2"><TempChart data={hrs} unit={unit} /><HumWindChart data={hrs} /></div>
    </div>
  );
}

export function Insights({ ctx }) {
  const { w, city, unit, setCity } = ctx;
  return (
    <div className="stack">
      <h2>Insights for {city}</h2>
      <div className="grid2">
        <div className="glass card"><h3>Smart recommendations</h3><Recs list={recommend(w)} /></div>
        <div className="glass card"><h3>Activity planner</h3><ActivityPlanner list={activities(w)} /></div>
      </div>
      <div className="grid2">
        <WeatherMap city={city} w={w} unit={unit} onPick={setCity} />
      </div>
    </div>
  );
}

export function SettingsPage({ ctx }) {
  const { unit, setUnit, theme, setTheme, saved, setSaved, setCity, setPage, user, logout, resetPrefs } = ctx;
  return (
    <div className="stack narrow">
      <h2>Settings</h2>
      <div className="glass card">
        <h3>Profile</h3>
        <p>{user.name} <span className="mut">· {user.email}</span> <span className="pill p-Okay">{user.role}</span></p>
        <button className="btn danger sm" onClick={logout}><LogOut size={14} /> Log out</button>
      </div>
      <div className="glass card">
        <h3>Preferences</h3>
        <div className="row between"><span><Thermometer size={16} /> Temperature unit</span>
          <div className="tabs"><button className={unit === 'C' ? 'on' : ''} onClick={() => setUnit('C')}>°C</button><button className={unit === 'F' ? 'on' : ''} onClick={() => setUnit('F')}>°F</button></div></div>
        <div className="row between"><span>{theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />} Theme</span>
          <div className="tabs"><button className={theme === 'dark' ? 'on' : ''} onClick={() => setTheme('dark')}>Dark</button><button className={theme === 'light' ? 'on' : ''} onClick={() => setTheme('light')}>Light</button></div></div>
        <button className="btn ghost sm" onClick={resetPrefs}>Reset preferences</button>
      </div>
      <div className="glass card">
        <h3>Saved cities</h3>
        {saved.map((c) => (
          <div key={c} className="row between sv">
            <span><CondIcon c={CITIES[c].cond} size={18} /> {c}</span>
            <span className="row"><button className="btn ghost sm" onClick={() => { setCity(c); setPage('dashboard'); }}>Open</button>
              <button className="btn danger sm" aria-label={`Remove ${c}`} onClick={() => setSaved(saved.filter((x) => x !== c))}><Trash2 size={14} /></button></span>
          </div>
        ))}
        {!saved.length && <p className="mut">No saved cities yet. Use "Save city" on the dashboard.</p>}
      </div>
      <div className="glass card">
        <h3>About VARSHAM · Technology & data sources</h3>
        <p className="mut sm">Built with React, Vite, JavaScript, CSS, npm, Lucide React and Recharts.</p>
        <div className="source-links">
          <a href="https://react.dev/" target="_blank" rel="noreferrer">React</a>
          <a href="https://vite.dev/" target="_blank" rel="noreferrer">Vite</a>
          <a href="https://www.npmjs.com/" target="_blank" rel="noreferrer">npm</a>
          <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">Open-Meteo live weather</a>
          <a href="https://open-meteo.com/en/docs" target="_blank" rel="noreferrer">Weather API documentation</a>
          <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap map data</a>
          <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">CC BY 4.0 data licence</a>
        </div>
        <p className="mut sm">Weather data by Open-Meteo. Map data © OpenStreetMap contributors.</p>
      </div>
    </div>
  );
}
