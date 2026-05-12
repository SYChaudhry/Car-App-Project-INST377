document.addEventListener("DOMContentLoaded", startDashboardPage);

function startDashboardPage() {
  const dashboardVehicleList = document.getElementById("dashboardVehicleList");

  if (dashboardVehicleList) {
    loadHomePage();
  }
}

// Loads the dashboard/home page
async function loadHomePage() {
  const response = await fetch("/api/vehicles");
  const vehicles = await response.json();

  const dashboardVehicleList = document.getElementById("dashboardVehicleList");
  const recentStatusList = document.getElementById("recentStatusList");

  dashboardVehicleList.innerHTML = "";
  recentStatusList.innerHTML = "";

  if (vehicles.length === 0) {
    dashboardVehicleList.innerHTML =
      "<p>No vehicles saved yet. Add a vehicle in the Garage page.</p>";
    recentStatusList.innerHTML = "<p>No maintenance status available yet.</p>";
    makeDashboardChart([]);
    return;
  }

  for (let i = 0; i < vehicles.length; i++) {
    const vehicle = vehicles[i];

    const vehicleItem = document.createElement("div");
    vehicleItem.className = "vehicle-item";

    vehicleItem.innerHTML = `
      <strong>${vehicle.year} ${vehicle.make} ${vehicle.model}</strong>
      <span>Mileage: ${Number(vehicle.mileage).toLocaleString()}</span>
    `;

    dashboardVehicleList.appendChild(vehicleItem);

    const statusItem = document.createElement("div");
    statusItem.className = "vehicle-item";

    let statusText = "Mileage status looks normal.";

    if (Number(vehicle.mileage) >= 75000) {
      statusText = "High mileage: consider checking maintenance soon.";
    }

    statusItem.innerHTML = `
      <strong>${vehicle.make} ${vehicle.model}</strong>
      <span>${statusText}</span>
    `;

    recentStatusList.appendChild(statusItem);
  }

  makeDashboardChart(vehicles);
}
