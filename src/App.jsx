import React, { useState, useEffect } from 'react';
import { Search, Menu, X, LayoutDashboard, CalendarDays, Lightbulb, Settings as Cog, ShieldCheck, LogOut, Moon, Sun, CloudLightning, Star, RefreshCw } from 'lucide-react';
import { CITIES, CITY_KEYS, SEED_ALERTS } from './data/weatherData.js';
import { load, save, hourly, conv } from './utils/helpers.js';
import { getLiveWeather } from './utils/weatherApi.js';
import Auth from './components/Auth.jsx';
import Admin from './components/Admin.jsx';
import { Dashboard, Forecast, Insights, SettingsPage } from './components/Pages.jsx';

const SEED_USERS = [{ id: 1, name: 'VARSHAM Administrator', email: 'admin@varsham.dev', password: 'Admin@123', role: 'admin' }];
const NAV = [['dashboard', 'Dashboard', LayoutDashboard], ['forecast', 'Forecast', CalendarDays], ['insights', 'Insights', Lightbulb], ['settings', 'Settings', Cog]];

export default function App() {
  const prefs = load('sc_prefs', {});
  const [users, setUsers] = useState(() => {
    const savedUsers = load('sc_users', null);
    if (!savedUsers) return SEED_USERS;
    return savedUsers.map((u) => u.email === 'admin@skycast.dev' ? { ...u, email: 'admin@varsham.dev' } : u);
  });
  const [session, setSession] = useState(() => {
    const savedSession = load('sc_session', null);
    return savedSession === 'admin@skycast.dev' ? 'admin@varsham.dev' : savedSession;
  });
  const [alerts, setAlerts] = useState(() => load('sc_alerts', SEED_ALERTS));
  const [unit, setUnit] = useState(prefs.unit || 'C');
  const [theme, setTheme] = useState(prefs.theme || 'dark');
  const [city, setCityRaw] = useState(CITIES[prefs.city] ? prefs.city : 'Hyderabad');
  const [saved, setSaved] = useState(() => load('sc_saved', ['Hyderabad']).filter((c) => CITIES[c]));
  const [page, setPage] = useState('dashboard');
  const [menu, setMenu] = useState(false);
  const [q, setQ] = useState('');
  const [weatherMode, setWeatherMode] = useState(() => load('sc_weather_mode', 'live'));
  const [sampleData, setSampleData] = useState(() => load('sc_weather_samples', {}));
  const [liveWeather, setLiveWeather] = useState(null);
  const [weatherStatus, setWeatherStatus] = useState('loading');
  const [refreshCount, setRefreshCount] = useState(0);

  useEffect(() => { document.documentElement.dataset.theme = theme; }, [theme]);
  useEffect(() => save('sc_prefs', { unit, theme, city }), [unit, theme, city]);
  useEffect(() => save('sc_saved', saved), [saved]);
  useEffect(() => save('sc_users', users), [users]);
  useEffect(() => save('sc_alerts', alerts), [alerts]);
  useEffect(() => save('sc_session', session), [session]);
  useEffect(() => save('sc_weather_mode', weatherMode), [weatherMode]);
  useEffect(() => save('sc_weather_samples', sampleData), [sampleData]);

  useEffect(() => {
    const controller = new AbortController();
    setWeatherStatus('loading');
    setLiveWeather(null);
    getLiveWeather(CITIES[city], controller.signal)
      .then((data) => { setLiveWeather(data); setWeatherStatus('live'); })
      .catch((error) => {
        if (error.name !== 'AbortError') setWeatherStatus('error');
      });
    return () => controller.abort();
  }, [city, refreshCount]);

  const user = users.find((u) => u.email === session);
  const login = (email, pw) => {
    const u = users.find((x) => x.email.toLowerCase() === email.trim().toLowerCase() && x.password === pw);
    if (!u) return 'Email or password is incorrect.';
    setSession(u.email); setPage('dashboard'); return null;
  };
  const register = ({ name, email, password }) => {
    if (!name.trim()) return 'Enter your full name.';
    if (!/^\S+@\S+\.\S+$/.test(email)) return 'Enter a valid email address.';
    if (password.length < 6) return 'Password must be at least 6 characters.';
    if (users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) return 'An account with this email already exists.';
    const nu = { id: Date.now(), name: name.trim(), email: email.trim(), password, role: 'user' };
    setUsers([...users, nu]); setSession(nu.email); setPage('dashboard'); return null;
  };
  const logout = () => { setSession(null); setMenu(false); };
  if (!user) return <Auth onLogin={login} onRegister={register} />;

  const base = CITIES[city];
  const manual = { ...base, ...(sampleData[city] || {}) };
  const usingLive = weatherMode === 'live' && !!liveWeather;
  const w = usingLive ? { ...base, ...liveWeather } : manual;
  const hrs = usingLive ? liveWeather.hourly.map((item) => ({ ...item, tc: item.temp, temp: conv(item.temp, unit) })) : hourly(base, w, unit);
  const setCity = (c) => { setCityRaw(c); setQ(''); };
  const updateSample = (updater) => setSampleData((old) => ({ ...old, [city]: typeof updater === 'function' ? updater(old[city] || {}) : updater }));
  const setOv = (updater) => updateSample((old) => typeof updater === 'function' ? updater(old) : updater);
  const resetOv = () => setSampleData((old) => { const next = { ...old }; delete next[city]; return next; });
  const matches = q.trim() ? CITY_KEYS.filter((k) => k.toLowerCase().includes(q.trim().toLowerCase())) : [];
  const ctx = {
    w, city, unit, setUnit, theme, setTheme, saved, setSaved, setCity, setPage, user, logout, setOv,
    hrs, edited: !!sampleData[city] && Object.keys(sampleData[city]).length > 0, resetOv,
    cityAlerts: alerts.filter((a) => a.city === 'All' || a.city === city),
    toggleSave: (c) => setSaved((s) => (s.includes(c) ? s.filter((x) => x !== c) : [...s, c])),
    resetPrefs: () => { setUnit('C'); setTheme('dark'); },
    weatherMode, setWeatherMode, weatherStatus, refreshWeather: () => setRefreshCount((n) => n + 1),
    sampleData, setSampleData,
  };
  const nav = user.role === 'admin' ? [...NAV, ['admin', 'Admin', ShieldCheck]] : NAV;
  const go = (p) => { setPage(p); setMenu(false); window.scrollTo(0, 0); };

  return (
    <div className={`app fx fx-${w.cond}`}>
      <header className="top glass">
        <div className="logo"><CloudLightning /> VARSHAM</div>
        <nav className="nav">{nav.map(([k, l, I]) => <button key={k} className={page === k ? 'on' : ''} onClick={() => go(k)}><I size={16} />{l}</button>)}</nav>
        <div className="search"><Search size={16} /><input placeholder="Search a city…" value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && matches[0] && setCity(matches[0])} aria-label="Search city" />
          {q.trim() && <div className="drop glass">{matches.map((k) => <button key={k} onClick={() => setCity(k)}>{k} <span className="mut">{CITIES[k].state}</span></button>)}{!matches.length && <span className="mut pad">Try Hyderabad, Bengaluru, Chennai, Delhi or Vijayawada.</span>}</div>}
        </div>
        <div className="tools">
          <button className="btn ghost sm" onClick={() => setUnit(unit === 'C' ? 'F' : 'C')} aria-label="Toggle unit">°{unit}</button>
          <button className="btn ghost sm" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label="Toggle theme">{theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}</button>
          <button className="btn ghost sm hide-m" onClick={() => setRefreshCount((n) => n + 1)} aria-label="Refresh weather"><RefreshCw size={15} /></button>
          <button className="btn ghost sm hide-m" onClick={logout} aria-label="Log out"><LogOut size={16} /></button>
          <button className="btn ghost sm burger" onClick={() => setMenu(!menu)} aria-label="Menu">{menu ? <X size={18} /> : <Menu size={18} />}</button>
        </div>
      </header>
      {menu && <div className="mnav glass">{nav.map(([k, l, I]) => <button key={k} className={page === k ? 'on' : ''} onClick={() => go(k)}><I size={18} />{l}</button>)}<button onClick={logout}><LogOut size={18} />Log out</button></div>}
      <div className="chips"><Star size={14} />{CITY_KEYS.map((k) => <button key={k} className={`chip ${k === city ? 'on' : ''}`} onClick={() => setCity(k)}>{k}</button>)}</div>
      {weatherStatus === 'error' && weatherMode === 'live' && <div className="source-note warning">Live weather is unavailable right now. Showing saved sample data. <button onClick={() => setRefreshCount((n) => n + 1)}>Retry</button></div>}
      {weatherStatus === 'loading' && weatherMode === 'live' && <div className="source-note">Updating live weather for {city}…</div>}
      <main>
        {page === 'dashboard' && <Dashboard ctx={ctx} />}
        {page === 'forecast' && <Forecast ctx={ctx} />}
        {page === 'insights' && <Insights ctx={ctx} />}
        {page === 'settings' && <SettingsPage ctx={ctx} />}
        {page === 'admin' && user.role === 'admin' && <Admin users={users} setUsers={setUsers} alerts={alerts} setAlerts={setAlerts} me={user} ctx={ctx} />}
      </main>
      <footer className="mut sm">Live weather by <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">Open-Meteo</a> · Map © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap contributors</a> · VARSHAM demo</footer>
    </div>
  );
}
