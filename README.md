# VARSHAM – Live Weather Dashboard

A beginner-friendly React + Vite weather dashboard.

## Features
- Live current conditions and 5-day forecasts from Open-Meteo (no API key required for the free non-commercial service).
- Real interactive OpenStreetMap map for the selected city.
- Admin-only manual sample weather editor. Admins can switch the shared demo dashboard between live weather and manually entered sample values.
- Login, registration, saved cities, Celsius/Fahrenheit, dark/light themes, charts and weather tips.
- Simple React components and JavaScript helpers. No backend or database.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, usually http://localhost:5173.

## Demo administrator account

- Email: `admin@varsham.dev`
- Password: `Admin@123`

Use the **Fill demo admin login** button on the login screen. You can also register a normal user account.

## Important demo limitations

This is a frontend-only learning project. Accounts, sessions, and admin sample values are stored in the browser's localStorage. This is not secure authentication or server-side access control. Do not use real passwords or sensitive information. Admin changes are local to that browser and are not shared across devices.

## Data sources and attribution

- Live weather: [Open-Meteo](https://open-meteo.com/) Forecast API. Weather data is provided under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Attribution is displayed in the app. Free API use is for non-commercial projects and subject to the provider's fair-use limits.
- Interactive map: [OpenStreetMap](https://www.openstreetmap.org/), © OpenStreetMap contributors. See [copyright and attribution](https://www.openstreetmap.org/copyright).

## Technology
React, Vite, JavaScript, HTML, CSS, npm, Lucide React and Recharts.
