// All values are SAMPLE data (temperatures in °C, wind in km/h, pressure in hPa).
export const CONDITIONS = ['Sunny', 'Cloudy', 'Rainy', 'Stormy', 'Foggy'];
const K = { S: 'Sunny', C: 'Cloudy', R: 'Rainy', T: 'Stormy', F: 'Foggy' };
export const HOURS = ['Now', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM'];
const DAYS = ['Thu', 'Fri', 'Sat', 'Sun', 'Mon'];

const mk = (o) => ({
  ...o,
  hc: [...o.hc].map((x) => K[x]),
  daily: o.daily.map(([hi, lo, c, rain], i) => ({ day: DAYS[i], hi, lo, cond: K[c], rain })),
});

export const CITIES = {
  Hyderabad: mk({ state: 'Telangana', lat: 17.3850, lon: 78.4867, temp: 29, cond: 'Cloudy', humidity: 58, wind: 14, pressure: 1012, uv: 6,
    sunrise: '06:20 AM', sunset: '05:38 PM', hourly: [29, 30, 30, 29, 28, 26, 25, 24], hc: 'CCCCCCCC',
    daily: [[30, 18, 'S', 5], [31, 19, 'S', 0], [29, 20, 'C', 20], [28, 19, 'R', 60], [30, 18, 'S', 10]] }),
  Bengaluru: mk({ state: 'Karnataka', lat: 12.9716, lon: 77.5946, temp: 25, cond: 'Cloudy', humidity: 70, wind: 11, pressure: 1014, uv: 5,
    sunrise: '06:15 AM', sunset: '05:57 PM', hourly: [25, 26, 26, 25, 24, 23, 22, 21], hc: 'CCCCRRCC',
    daily: [[26, 17, 'C', 30], [25, 17, 'R', 55], [24, 16, 'R', 65], [26, 17, 'C', 25], [27, 18, 'S', 10]] }),
  Chennai: mk({ state: 'Tamil Nadu', lat: 13.0827, lon: 80.2707, temp: 28, cond: 'Rainy', humidity: 82, wind: 22, pressure: 1008, uv: 3,
    sunrise: '06:08 AM', sunset: '05:32 PM', hourly: [28, 28, 27, 27, 26, 26, 25, 25], hc: 'RRRTRRCC',
    daily: [[29, 24, 'R', 80], [28, 24, 'T', 85], [29, 25, 'R', 70], [30, 25, 'C', 40], [31, 25, 'C', 20]] }),
  Delhi: mk({ state: 'NCT of Delhi', lat: 28.6139, lon: 77.2090, temp: 22, cond: 'Foggy', humidity: 62, wind: 8, pressure: 1016, uv: 4,
    sunrise: '06:57 AM', sunset: '05:25 PM', hourly: [22, 24, 25, 25, 24, 21, 19, 17], hc: 'FFCCCCFF',
    daily: [[25, 11, 'F', 5], [26, 12, 'S', 0], [26, 12, 'S', 0], [24, 11, 'C', 10], [23, 10, 'F', 5]] }),
  Vijayawada: mk({ state: 'Andhra Pradesh', lat: 16.5062, lon: 80.6480, temp: 31, cond: 'Sunny', humidity: 64, wind: 13, pressure: 1010, uv: 8,
    sunrise: '06:12 AM', sunset: '05:36 PM', hourly: [31, 32, 33, 32, 31, 29, 27, 26], hc: 'SSSSSCCC',
    daily: [[33, 21, 'S', 0], [34, 22, 'S', 0], [32, 22, 'C', 15], [30, 22, 'R', 50], [31, 21, 'S', 10]] }),
};
export const CITY_KEYS = Object.keys(CITIES);

// City positions on the illustrative SVG map
export const MAP_POS = { Delhi: [185, 95], Hyderabad: [200, 235], Vijayawada: [250, 255], Bengaluru: [180, 320], Chennai: [255, 320] };

export const SEED_ALERTS = [
  { id: 1, city: 'Chennai', level: 'severe', title: 'Heavy rainfall warning', text: 'Sample alert: Intense showers expected for the next 12 hours.' },
  { id: 2, city: 'Delhi', level: 'warning', title: 'Dense fog advisory', text: 'Sample alert: Visibility below 200 m during early morning.' },
  { id: 3, city: 'Vijayawada', level: 'warning', title: 'High UV exposure', text: 'Sample alert: UV index peaks around midday.' },
  { id: 4, city: 'All', level: 'info', title: 'Sample data notice', text: 'All alerts in this demo are manually defined sample entries.' },
];
