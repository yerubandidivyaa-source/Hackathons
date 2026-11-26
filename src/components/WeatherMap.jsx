import React from 'react';
import { CITIES } from '../data/weatherData.js';

// OpenStreetMap is a real interactive map. Weather values still come from VARSHAM data.
export default function WeatherMap({ city }) {
  const place = CITIES[city];
  const lat = place.lat;
  const lon = place.lon;
  const box = `${lon - 0.12}%2C${lat - 0.09}%2C${lon + 0.12}%2C${lat + 0.09}`;
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${box}&layer=mapnik&marker=${lat}%2C${lon}`;
  return (
    <div className="glass card">
      <div className="row between"><h3>Live geographic map</h3><span className="tag">OpenStreetMap</span></div>
      <iframe className="real-map" title={`Map showing ${city}`} src={mapUrl} loading="lazy" />
      <p className="mut sm">Showing the real-world location of {city}. Map data © OpenStreetMap contributors.</p>
      <a className="map-link" href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=12/${lat}/${lon}`} target="_blank" rel="noreferrer">Open larger map ↗</a>
    </div>
  );
}
