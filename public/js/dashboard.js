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

  const totalVehicles = document.getElementById("totalVehicles");
  const highestMileage = document.getElementById("highestMileage");
  const maintenanceStatus = document.getElementById("maintenanceStatus");
  const dashboardVehicleList = document.getElementById("dashboardVehicleList");
  const recentStatusList = document.getElementById("recentStatusList");

  dashboardVehicleList.innerHTML = "";
  recentStatusList.innerHTML = "";

  if (vehicles.length === 0) {
    totalVehicles.textContent = "0";
    highestMileage.textContent = "0 miles";
    maintenanceStatus.textContent = "No vehicles yet";
    dashboardVehicleList.innerHTML = "<p>No vehicles saved yet. Add a vehicle in the Garage page.</p>";
    recentStatusList.innerHTML = "<p>No maintenance status available yet.</p>";
    makeDashboardChart([]);
    return;
  }

  totalVehicles.textContent = vehicles.length;

  let highest = 0;
  let needsMaintenance = false;

  for (let i = 0; i < vehicles.length; i++) {
    const vehicle = vehicles[i];
    const mileage = Number(vehicle.mileage);

    if (mileage > highest) {
      highest = mileage;
    }

    if (mileage >= 75000) {
      needsMaintenance = true;
    }
  }

  highestMileage.textContent = highest.toLocaleString() + " miles";

  if (needsMaintenance) {
    maintenanceStatus.textContent = "Check maintenance soon";
  } else {
    maintenanceStatus.textContent = "Looks good";
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