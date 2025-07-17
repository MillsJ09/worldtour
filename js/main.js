// ====== THEME TOGGLE ======
;(function() {
  const btn = document.getElementById('theme-toggle');
  const stored = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = stored || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
  btn.textContent = theme === 'dark' ? '☀️' : '🌙';
  btn.addEventListener('click', () => {
    const cur = document.documentElement.getAttribute('data-theme');
    const next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    btn.textContent = next === 'dark' ? '☀️' : '🌙';
  });
})();

// ====== AIRPORTS & AIRCRAFT ======
const airports = [
  { coords: [49.434081, -2.599489],  name: 'Guernsey Airport' },
  { coords: [49.706952, -2.215638],  name: 'Alderney Airport' },
  { coords: [49.205161, -2.194695],  name: 'Jersey Airport' },
  { coords: [51.153662, -0.182063],  name: 'London Gatwick Airport' },
  { coords: [53.355357, -2.277162],  name: 'Manchester Airport' },
  { coords: [55.947178, -3.360795],  name: 'Edinburgh Airport' },
  { coords: [62.067562, -7.279062],  name: 'Vágar Airport' },
  { coords: [64.13184,  -21.946626], name: 'Reykjavík Domestic Airport (RKV)' },
  { coords: [63.984465, -22.626635], name: 'Keflavík International Airport' },
  { coords: [43.679834, -79.628383], name: 'Toronto Pearson International Airport' },
  { coords: [41.980259, -87.908986], name: "Chicago O'Hare International Airport" },
  { coords: [39.85635,  -104.676399], name: 'Denver International Airport' },
  { coords: [42.466893, -104.697053], name: 'Guernsey Airport (Colorado)' },
  { coords: [43.608809, -110.737581], name: 'Jackson Hole Airport' },
  { coords: [39.51001,  -120.854986], name: 'Salt Lake City International Airport' },
  { coords: [37.619114, -122.381627], name: 'San Francisco International Airport' },
  { coords: [36.083091, -115.148224], name: 'Harry Reid International Airport' },
  { coords: [33.942153, -118.403605], name: 'Los Angeles International Airport' },
  { coords: [33.435249, -112.010124], name: 'Phoenix Sky Harbor International Airport' },
  { coords: [32.89809,  -97.033702],  name: 'Dallas Fort Worth International Airport' },
  { coords: [29.994032, -90.259657],  name: 'Louis Armstrong New Orleans International Airport' },
  { coords: [25.79235,  -80.282306],  name: 'Miami International Airport' },
  { coords: [18.044192, -63.113445],  name: 'Princess Juliana International Airport' },
  { coords: [9.066874,  -79.387129],  name: 'Tocumen International Airport, Panama' },
  { coords: [-12.021093, -77.118858], name: 'Jorge Chávez International Airport' },
  { coords: [-33.389762, -70.794402], name: 'Arturo Merino Benítez International Airport' },
  { coords: [-53.00406,  -70.846998], name: 'Presidente Carlos Ibáñez del Campo Airport' },
  { coords: [-62.191101, -58.987335], name: 'Teniente R. Marsh Airport' },
  { coords: [-77.8674,   166.9939],  name: 'Williams Field' },
  { coords: [-37.008937, 174.786381], name: 'Auckland Airport' },
  { coords: [-33.950033, 151.181696], name: 'Sydney Airport' },
  { coords: [1.358604,   103.989944], name: 'Singapore Changi Airport' },
  { coords: [27.405192,  89.42103],   name: 'Paro International Airport' },
  { coords: [28.556144,  77.099962],  name: 'Indira Gandhi International Airport' },
  { coords: [25.256693,  55.364318],  name: 'Dubai International Airport' },
  { coords: [41.276819,  28.73014],   name: 'Istanbul Airport' },
  { coords: [43.536704,  16.299025],  name: 'Split Airport' },
  { coords: [45.622714,  8.728234],   name: 'Milano Malpensa Airport' },
  { coords: [47.461714,  8.55086],    name: 'Zurich Airport' },
  { coords: [50.035379,  8.551839],   name: 'Frankfurt Airport' },
  { coords: [52.316919,  4.745925],   name: 'Amsterdam Airport Schiphol' },
  { coords: [51.505141,  0.052062],   name: 'London City Airport' },
  { coords: [49.434081,  -2.599489],  name: 'Guernsey Airport (Return)' }
];

const aircraftTypes = [
  'DHC-6','C208','A320','A320','A320','A320','A320','DH8D',
  'A320','A320','A320','PA28','PA28','A320','A320','A320',
  'A320','A320','A320','A320','A320','A320','A320','A320',
  'A320','A320','A350','A350','A350','A320','A350','A320',
  'A320','A380','A320','A320','A320','A320','A320','A320',
  'E190','AT76'
];

// average cruise speeds (km/h)
const speeds = {
  'DHC-6':287,'C208':223,'A320':828,'DH8D':667,
  'PA28':310,'A350':903,'A380':903,'E190':829,'AT76':660
};

function getDistance(c1, c2) {
  const toRad = v=>v*Math.PI/180;
  const [lat1, lon1]=c1, [lat2, lon2]=c2;
  const R=6371, dLat=toRad(lat2-lat1), dLon=toRad(lon2-lon1);
  const a=Math.sin(dLat/2)**2 +
          Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*
          Math.sin(dLon/2)**2;
  return R*2*Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

// center map
const lats=airports.map(a=>a.coords[0]), lngs=airports.map(a=>a.coords[1]);
const center=[(Math.min(...lats)+Math.max(...lats))/2,
              (Math.min(...lngs)+Math.max(...lngs))/2];

// init satellite map
const map=L.map('map').setView(center,2);
L.tileLayer(
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  { attribution:'Tiles © Esri World Imagery' }
).addTo(map);

// plot route and markers
const path=[];
airports.forEach(a=>{
  path.push(a.coords);
  L.marker(a.coords).bindPopup(a.name).addTo(map);
});
L.polyline(path,{color:'red',weight:3,opacity:0.7}).addTo(map);

// build departure board and track stats
const tbody=document.querySelector('#departures tbody');
let totalDist=0, totalTime=0;
airports.slice(0,-1).forEach((from,i)=>{
  const to=airports[i+1];
  const dist=getDistance(from.coords,to.coords);
  const ac=aircraftTypes[i];
  const hrs=dist/(speeds[ac]||800);
  const h=Math.floor(hrs), m=Math.round((hrs-h)*60);
  const timeStr=h&&m?`${h}h ${m}m`:(h?`${h}h`:`${m}m`);
  totalDist+=dist; totalTime+=hrs;

  const tr=document.createElement('tr');
  tr.innerHTML=`
    <td>#${i+1}</td>
    <td>${from.name}</td>
    <td>${to.name}</td>
    <td><span class="badge">${ac}</span></td>
    <td>${timeStr}</td>`;
  tbody.append(tr);
});

// populate stats box
const statsList=document.getElementById('stats-list');
const totH=Math.floor(totalTime), totM=Math.round((totalTime-totH)*60);
statsList.innerHTML=`
  <li>Total Flights: ${airports.length-1}</li>
  <li>Total Distance: ${Math.round(totalDist)} km</li>
  <li>Est. Total Time: ${totH}h ${totM}m</li>
`;
