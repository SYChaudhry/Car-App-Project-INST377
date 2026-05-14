let shopMap;
let shopMarkers = [];

document.addEventListener("DOMContentLoaded", startPage);

function startPage() {
  const form = document.getElementById("shopSearchForm");

  form.addEventListener("submit", searchShops);

  makeMap();
}

function makeMap() {
  shopMap = L.map("shopMap").setView([40, -75], 10);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap contributors",
  }).addTo(shopMap);
}

async function searchShops(event) {
  event.preventDefault();

  const locationInput = document.getElementById("shopLocation");
  const shopResults = document.getElementById("shopResults");

  const location = locationInput.value;

  shopResults.innerHTML = "<p>Loading nearby shops...</p>";

  clearMarkers();

  const url = "/api/nearby-shops?location=" + encodeURIComponent(location);

  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok) {
    shopResults.innerHTML = "<p>" + data.error + "</p>";

    Swal.fire({
      title: "Search Failed",
      text: data.error,
      icon: "error",
    });

    return;
  }

  const searchLat = Number(data.lat);
  const searchLon = Number(data.lon);

  shopMap.setView([searchLat, searchLon], 13);

  const searchMarker = L.marker([searchLat, searchLon]).addTo(shopMap);

  searchMarker.bindPopup("Search location: " + data.location);

  shopMarkers.push(searchMarker);

  shopResults.innerHTML =
    "<p><strong>Search area:</strong> " + data.location + "</p>";

  if (!data.shops || data.shops.length === 0) {
    shopResults.innerHTML += "<p>No nearby shops found.</p>";
    return;
  }

  for (let i = 0; i < data.shops.length; i++) {
    const shop = data.shops[i];

    const place = shop.properties;

    const lon = shop.geometry.coordinates[0];
    const lat = shop.geometry.coordinates[1];

    let shopName = "Unnamed service place";
    let address = "Address not available";
    let category = "N/A";

    if (place.name) {
      shopName = place.name;
    }

    if (place.formatted) {
      address = place.formatted;
    }

    if (place.categories) {
      category = place.categories.join(", ");
    }

    addShopMarker(lat, lon, shopName, address);
    addShopToPage(shopName, address, category);
  }

  Swal.fire({
    title: "Shops Loaded",
    text: "Nearby service places were found.",
    icon: "success",
  });
}

function addShopMarker(lat, lon, shopName, address) {
  const marker = L.marker([lat, lon]).addTo(shopMap);

  marker.bindPopup("<strong>" + shopName + "</strong><br>" + address);

  shopMarkers.push(marker);
}

function addShopToPage(shopName, address, category) {
  const shopResults = document.getElementById("shopResults");

  const shopBox = document.createElement("div");
  shopBox.className = "shop-result-card";

  shopBox.innerHTML =
    "<strong>" +
    shopName +
    "</strong><br>" +
    "<span>" +
    address +
    "</span><br>" +
    "<span>Category: " +
    category +
    "</span>";

  shopResults.appendChild(shopBox);
}

function clearMarkers() {
  for (let i = 0; i < shopMarkers.length; i++) {
    shopMap.removeLayer(shopMarkers[i]);
  }

  shopMarkers = [];
}
