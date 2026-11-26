import React from 'react';
import {
  Sun, Cloud, CloudRain, CloudLightning, CloudFog, Droplets, Wind, Gauge, Sunrise, Sunset, Thermometer,
  Umbrella, AlertTriangle, Footprints, Bike, TreePine, Smile, Shirt, RotateCcw,
} from 'lucide-react';
import { CONDITIONS } from '../data/weatherData.js';
import { conv, deg, toC } from '../utils/helpers.js';

export const ICONS = { Sun, Cloud, CloudRain, CloudLightning, CloudFog, Droplets, Wind, Gauge, Sunrise, Sunset, Thermometer, Umbrella, AlertTriangle, Footprints, Bike, TreePine, Smile, Shirt };
export const COND_ICON = { Sunny: Sun, Cloudy: Cloud, Rainy: CloudRain, Stormy: CloudLightning, Foggy: CloudFog };

export const CondIcon = ({ c, size = 24 }) => {
  const I = COND_ICON[c] || Cloud;
  return <I size={size} className={`ci ci-${c}`} />;
};
export const Ico = ({ name, size = 20 }) => { const I = ICONS[name] || Smile; return <I size={size} />; };

export const Stat = ({ icon, label, value, sub }) => (
  <div className="glass stat">
    <div className="stat-ic"><Ico name={icon} /></div>
    <div><span className="mut">{label}</span><b>{value}</b>{sub && <small className="mut">{sub}</small>}</div>
  </div>
);

export const Hourly = ({ data, unit }) => (
  <div className="strip">
    {data.map((x) => (
      <div key={x.h} className="hr"><span className="mut">{x.h}</span><CondIcon c={x.cond} /><b>{deg(x.tc, unit)}</b></div>
    ))}
  </div>
);

export const Daily = ({ days, unit }) => (
  <div className="days">
    {days.map((d) => (
      <div key={d.day} className="day">
        <b>{d.day}</b><CondIcon c={d.cond} /><span className="mut dc">{d.cond}</span>
        <span className="rain"><Droplets size={14} />{d.rain}%</span>
        <span className="range"><i style={{ left: `${(d.lo / 40) * 100}%`, width: `${((d.hi - d.lo) / 40) * 100}%` }} /></span>
        <span>{conv(d.lo, unit)}° / <b>{conv(d.hi, unit)}°</b></span>
      </div>
    ))}
  </div>
);

export const Alerts = ({ list }) => (
  <div className="alerts">
    {list.map((a) => (
      <div key={a.id} className={`alert lv-${a.level}`}>
        <AlertTriangle size={20} />
        <div><b>{a.title}</b><p>{a.text}</p></div>
        <span className="tag">{a.city}</span>
      </div>
    ))}
    {!list.length && <p className="mut">No active sample alerts for this city.</p>}
  </div>
);

export const Recs = ({ list }) => (
  <div className="recs">
    {list.map((r) => (
      <div key={r.title} className={`rec lv-${r.lvl}`}>
        <div className="stat-ic"><Ico name={r.icon} /></div>
        <div><b>{r.title}</b><p>{r.text}</p></div>
      </div>
    ))}
  </div>
);

export const ActivityPlanner = ({ list }) => (
  <div className="acts">
    {list.map((a) => (
      <div key={a.name} className="act">
        <div className="row"><Ico name={a.icon} /><b>{a.name}</b><span className={`pill p-${a.label}`}>{a.label}</span></div>
        <div className="bar"><i style={{ width: `${a.score}%` }} /></div>
        <small className="mut">Suitability {a.score}/100</small>
      </div>
    ))}
  </div>
);

export function ManualPanel({ w, setOv, unit, onReset, edited }) {
  const set = (k, v) => setOv((o) => ({ ...o, [k]: v }));
  return (
    <div className="glass card">
      <div className="row between"><h3>Manual weather input</h3>
        <button className="btn ghost sm" onClick={onReset} disabled={!edited}><RotateCcw size={14} /> Reset</button></div>
      <p className="mut sm">Change values to see the dashboard and advice update instantly.</p>
      <label className="fld">Temperature <b>{deg(w.temp, unit)}</b>
        <input type="range" min={conv(-5, unit)} max={conv(48, unit)} value={conv(w.temp, unit)} onChange={(e) => set('temp', toC(+e.target.value, unit))} /></label>
      <label className="fld">Humidity <b>{w.humidity}%</b>
        <input type="range" min="0" max="100" value={w.humidity} onChange={(e) => set('humidity', +e.target.value)} /></label>
      <label className="fld">Wind speed <b>{w.wind} km/h</b>
        <input type="range" min="0" max="100" value={w.wind} onChange={(e) => set('wind', +e.target.value)} /></label>
      <label className="fld">UV index <b>{w.uv}</b>
        <input type="range" min="0" max="12" value={w.uv} onChange={(e) => set('uv', +e.target.value)} /></label>
      <div className="fld">Condition</div>
      <div className="conds">
        {CONDITIONS.map((c) => (
          <button key={c} className={`chip ${w.cond === c ? 'on' : ''}`} onClick={() => set('cond', c)}><CondIcon c={c} size={16} />{c}</button>
        ))}
      </div>
    </div>
  );
}
