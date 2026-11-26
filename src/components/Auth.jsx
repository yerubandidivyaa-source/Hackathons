import React, { useState } from 'react';
import { CloudLightning, Mail, Lock, User } from 'lucide-react';

export default function Auth({ onLogin, onRegister }) {
  const [mode, setMode] = useState('login');
  const [f, setF] = useState({ name: '', email: '', password: '' });
  const [err, setErr] = useState('');
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = (e) => {
    e.preventDefault();
    setErr(mode === 'login' ? onLogin(f.email, f.password) || '' : onRegister(f) || '');
  };
  const swap = (m) => { setMode(m); setErr(''); };
  return (
    <div className="auth">
      <form className="glass auth-card" onSubmit={submit}>
        <div className="logo big"><CloudLightning /> VARSHAM</div>
        <h2>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h2>
        <p className="mut sm">{mode === 'login' ? 'Log in to open your weather dashboard.' : 'Register to save cities and preferences.'}</p>
        <div className="tabs">
          <button type="button" className={mode === 'login' ? 'on' : ''} onClick={() => swap('login')}>Login</button>
          <button type="button" className={mode === 'register' ? 'on' : ''} onClick={() => swap('register')}>Register</button>
        </div>
        {mode === 'register' && <label className="inp"><User size={18} /><input placeholder="Full name" value={f.name} onChange={set('name')} /></label>}
        <label className="inp"><Mail size={18} /><input type="email" placeholder="Email" value={f.email} onChange={set('email')} /></label>
        <label className="inp"><Lock size={18} /><input type="password" placeholder="Password (min 6 characters)" value={f.password} onChange={set('password')} /></label>
        {err && <div className="err" role="alert">{err}</div>}
        <button className="btn" type="submit">{mode === 'login' ? 'Log in' : 'Create account'}</button>
        {mode === 'login' && <button type="button" className="btn ghost" onClick={() => setF({ ...f, email: 'admin@varsham.dev', password: 'Admin@123' })}>Fill demo admin login</button>}
        <p className="mut sm center">Demo only: accounts live in this browser's localStorage. Live weather is supplied by Open-Meteo.</p>
      </form>
    </div>
  );
}
