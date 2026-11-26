import React, { useState } from 'react';
import { Trash2, Plus, Users, ShieldCheck, AlertTriangle } from 'lucide-react';
import { CITY_KEYS, SEED_ALERTS } from '../data/weatherData.js';
import { Alerts, ManualPanel } from './Widgets.jsx';

export default function Admin({ users, setUsers, alerts, setAlerts, me, ctx }) {
  const [a, setA] = useState({ city: 'All', level: 'info', title: '', text: '' });
  const add = (e) => {
    e.preventDefault();
    if (!a.title.trim()) return;
    setAlerts([{ ...a, id: Date.now(), text: a.text.trim() || 'Sample alert.' }, ...alerts]);
    setA({ ...a, title: '', text: '' });
  };
  const toggleRole = (u) => setUsers(users.map((x) => (x.id === u.id ? { ...x, role: x.role === 'admin' ? 'user' : 'admin' } : x)));
  return (
    <div className="stack">
      <div className="grid3">
        <div className="glass stat"><div className="stat-ic"><Users /></div><div><span className="mut">Registered users</span><b>{users.length}</b></div></div>
        <div className="glass stat"><div className="stat-ic"><ShieldCheck /></div><div><span className="mut">Admins</span><b>{users.filter((u) => u.role === 'admin').length}</b></div></div>
        <div className="glass stat"><div className="stat-ic"><AlertTriangle /></div><div><span className="mut">Sample alerts</span><b>{alerts.length}</b></div></div>
      </div>

      <div className="glass card">
        <div className="row between wrap-row"><div><h3>Weather data control</h3><p className="mut sm">Choose what everyone sees. Live weather is the default.</p></div><div className="tabs"><button className={ctx.weatherMode === 'live' ? 'on' : ''} onClick={() => ctx.setWeatherMode('live')}>Live weather</button><button className={ctx.weatherMode === 'sample' ? 'on' : ''} onClick={() => ctx.setWeatherMode('sample')}>Manual sample</button></div></div>
        <p className="mut sm">Selected city: <b>{ctx.city}</b>. Manual changes are saved in this browser and appear to users of this demo.</p>
        <ManualPanel w={ctx.w} setOv={ctx.setOv} unit={ctx.unit} onReset={ctx.resetOv} edited={ctx.edited} />
        <div className="row wrap-row"><button className="btn" onClick={() => ctx.setWeatherMode('sample')}>Publish sample weather</button><button className="btn ghost" onClick={() => ctx.setWeatherMode('live')}>Return to live weather</button></div>
      </div>
      <div className="glass card">
        <h3>User management</h3>
        <div className="scroll"><table>
          <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Actions</th></tr></thead>
          <tbody>{users.map((u) => (
            <tr key={u.id}><td>{u.name}</td><td>{u.email}</td><td><span className={`pill ${u.role === 'admin' ? 'p-Great' : 'p-Okay'}`}>{u.role}</span></td>
              <td className="row">
                <button className="btn ghost sm" disabled={u.id === me.id} onClick={() => toggleRole(u)}>Make {u.role === 'admin' ? 'user' : 'admin'}</button>
                <button className="btn danger sm" disabled={u.id === me.id} onClick={() => window.confirm(`Delete ${u.email}?`) && setUsers(users.filter((x) => x.id !== u.id))}><Trash2 size={14} /> Delete</button>
              </td></tr>
          ))}</tbody>
        </table></div>
      </div>
      <div className="grid2">
        <form className="glass card" onSubmit={add}>
          <h3>Create sample alert</h3>
          <select value={a.city} onChange={(e) => setA({ ...a, city: e.target.value })}><option>All</option>{CITY_KEYS.map((c) => <option key={c}>{c}</option>)}</select>
          <select value={a.level} onChange={(e) => setA({ ...a, level: e.target.value })}><option value="info">Info</option><option value="warning">Warning</option><option value="severe">Severe</option></select>
          <input placeholder="Alert title" value={a.title} onChange={(e) => setA({ ...a, title: e.target.value })} />
          <textarea rows="3" placeholder="Message" value={a.text} onChange={(e) => setA({ ...a, text: e.target.value })} />
          <button className="btn" type="submit"><Plus size={16} /> Add alert</button>
        </form>
        <div className="glass card">
          <div className="row between"><h3>Active alerts</h3><button className="btn ghost sm" onClick={() => setAlerts(SEED_ALERTS)}>Restore defaults</button></div>
          {alerts.map((x) => (
            <div key={x.id} className="row alert-row"><div className="grow"><Alerts list={[x]} /></div>
              <button className="btn danger sm" aria-label="Delete alert" onClick={() => setAlerts(alerts.filter((y) => y.id !== x.id))}><Trash2 size={14} /></button></div>
          ))}
          {!alerts.length && <p className="mut">No alerts. Add one on the left.</p>}
        </div>
      </div>
    </div>
  );
}
