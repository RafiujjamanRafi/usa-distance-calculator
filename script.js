let cities = [];

fetch('us-cities.json')
  .then(res => res.json())
  .then(data => cities = data)
  .catch(err => console.error("Failed to load cities:", err));

function suggestCities(input, listId, inputId) {
  const list = document.getElementById(listId);
  list.innerHTML = "";
  if (!input) return;

  const filtered = cities.filter(city =>
    `${city.name}, ${city.state}`.toLowerCase().includes(input.toLowerCase())
  );
  filtered.slice(0, 10).forEach(city => {
    const div = document.createElement("div");
    div.textContent = `${city.name}, ${city.state}`;
    div.onclick = () => {
      document.getElementById(inputId).value = `${city.name}, ${city.state}`;
      list.innerHTML = "";
    };
    list.appendChild(div);
  });
}

function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 3958.8; // miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2)**2;
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

function calculateDistance() {
  const from = document.getElementById("fromCity").value;
  const to = document.getElementById("toCity").value;
  const result = document.getElementById("result");

  const fromCity = cities.find(c => `${c.name}, ${c.state}`.toLowerCase() === from.toLowerCase());
  const toCity = cities.find(c => `${c.name}, ${c.state}`.toLowerCase() === to.toLowerCase());

  if (!fromCity || !toCity) {
    result.innerHTML = "<span style='color:red;'>Please select valid cities.</span>";
    return;
  }

  const distance = haversineDistance(fromCity.lat, fromCity.lon, toCity.lat, toCity.lon);
  const km = distance * 1.60934;
  result.innerHTML = `Distance from <strong>${from}</strong> to <strong>${to}</strong> is <strong>${Math.round(distance)} miles</strong> (${Math.round(km)} km).`;
}
