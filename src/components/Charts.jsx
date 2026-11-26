import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, LineChart, Line, Legend } from 'recharts';
import { conv } from '../utils/helpers.js';

const tip = { background: '#0b1a3d', border: '1px solid rgba(34,211,238,.4)', borderRadius: 12, color: '#e8f1ff' };
const ax = { stroke: '#8ea6cf', fontSize: 12, tickLine: false, axisLine: false };
const Box = ({ title, children }) => (
  <div className="glass card"><h3>{title}</h3><div className="chart"><ResponsiveContainer width="100%" height="100%">{children}</ResponsiveContainer></div></div>
);

export const TempChart = ({ data, unit }) => (
  <Box title={`Temperature trend (°${unit})`}>
    <AreaChart data={data}>
      <defs><linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#22d3ee" stopOpacity={0.6} /><stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} /></linearGradient></defs>
      <CartesianGrid stroke="rgba(142,166,207,.15)" vertical={false} />
      <XAxis dataKey="h" {...ax} /><YAxis {...ax} width={32} domain={['dataMin - 2', 'dataMax + 2']} /><Tooltip contentStyle={tip} />
      <Area type="monotone" dataKey="temp" name="Temp" stroke="#22d3ee" strokeWidth={3} fill="url(#g1)" />
    </AreaChart>
  </Box>
);

export const RangeChart = ({ days, unit }) => (
  <Box title={`5-day high / low (°${unit})`}>
    <BarChart data={days.map((d) => ({ day: d.day, High: conv(d.hi, unit), Low: conv(d.lo, unit) }))}>
      <CartesianGrid stroke="rgba(142,166,207,.15)" vertical={false} />
      <XAxis dataKey="day" {...ax} /><YAxis {...ax} width={32} /><Tooltip contentStyle={tip} cursor={{ fill: 'rgba(34,211,238,.08)' }} /><Legend />
      <Bar dataKey="High" fill="#3b82f6" radius={[6, 6, 0, 0]} /><Bar dataKey="Low" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
    </BarChart>
  </Box>
);

export const HumWindChart = ({ data }) => (
  <Box title="Humidity (%) and wind (km/h)">
    <LineChart data={data}>
      <CartesianGrid stroke="rgba(142,166,207,.15)" vertical={false} />
      <XAxis dataKey="h" {...ax} /><YAxis {...ax} width={32} /><Tooltip contentStyle={tip} /><Legend />
      <Line type="monotone" dataKey="hum" name="Humidity" stroke="#22d3ee" strokeWidth={3} dot={false} />
      <Line type="monotone" dataKey="wind" name="Wind" stroke="#a78bfa" strokeWidth={3} dot={false} />
    </LineChart>
  </Box>
);

export const RainChart = ({ days }) => (
  <Box title="Chance of rain (%)">
    <BarChart data={days}>
      <CartesianGrid stroke="rgba(142,166,207,.15)" vertical={false} />
      <XAxis dataKey="day" {...ax} /><YAxis {...ax} width={32} domain={[0, 100]} /><Tooltip contentStyle={tip} cursor={{ fill: 'rgba(34,211,238,.08)' }} />
      <Bar dataKey="rain" name="Rain %" fill="#22d3ee" radius={[6, 6, 0, 0]} />
    </BarChart>
  </Box>
);
