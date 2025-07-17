// List of airports in order
const airports = [
  { coords: [49.434081, -2.599489], name: 'Guernsey Airport' },
  { coords: [49.706952, -2.215638], name: 'Alderney Airport' },
  // … keep going with every airport …
  { coords: [49.434081, -2.599489], name: 'Guernsey Airport (Return)' }
];

// Center map between the farthest points
const lats = airports.map(a => a.coords[0]);
const lngs = airports.map(a => a.coords[1]);
const center = [
  (Math.min(...lats)+Math.max(...lats))/2,
  (Math.min(...lngs)+Math.max(...lngs))/2
];

const map = L.map('map').setView(center, 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
  .addTo(map);

const path = [];
airports.forEach((a,i) => {
  path.push(a.coords);
  L.marker(a.coords).bindPopup(a.name).addTo(map);
});
L.polyline(path, { color: 'red' }).addTo(map);

const tbody = document.querySelector('#departures tbody');
airports.slice(0,-1).forEach((from,i) => {
  const to = airports[i+1];
  const row = document.createElement('tr');
  row.innerHTML = `<td>FT${String(i+1).padStart(3,'0')}</td>
                   <td>${from.name}</td>
                   <td>${to.name}</td>`;
  tbody.append(row);
});
