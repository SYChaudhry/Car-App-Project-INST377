/////////////////////// dashboard.js - Handles the logic for the dashboard page //////////////////////////////////

document.addEventListener("DOMContentLoaded", startDashboardPage);

function startDashboardPage() {
  getDashboardVehicles();
  getDashboardServiceHistory();
}

// Get vehicles for the dashboard
async function getDashboardVehicles() {
  const dashboardVehicleList = document.getElementById("dashboardVehicleList");
  const maintenanceList = document.getElementById("maintenanceList");
  const recallList = document.getElementById("recallList");

  const response = await fetch("/api/vehicles");
  const vehicles = await response.json();

  dashboardVehicleList.innerHTML = "";
  maintenanceList.innerHTML = "";
  recallList.innerHTML = "";

  if (vehicles.length === 0) {
    dashboardVehicleList.innerHTML = "<p> No vehicles loaded yet. </p>";
    maintenanceList.innerHTML =
      "<p> No maintenance recommendations available yet. </p>";
    recallList.innerHTML = "<p> No recall information loaded yet. </p>";
    return;
  }

  for (let i = 0; i < vehicles.length; i++) {
    showVehicleInfo(vehicles[i]);
    showMaintenanceRecommendation(vehicles[i]);
    await showRecallInfo(vehicles[i]);
  }
}

// Show basic vehicle information
function showVehicleInfo(vehicle) {
  const dashboardVehicleList = document.getElementById("dashboardVehicleList");

  const vehicleItem = document.createElement("div");
  vehicleItem.className = "vehicle-item";

  const mileage = Number(vehicle.mileage).toLocaleString();

  vehicleItem.innerHTML =
    "<strong>" +
    vehicle.year +
    " " +
    vehicle.make +
    " " +
    vehicle.model +
    "</strong>" +
    "<span> Mileage: " +
    mileage +
    " miles</span>";

  dashboardVehicleList.appendChild(vehicleItem);
}

// Show maintenance recommendation
function showMaintenanceRecommendation(vehicle) {
  const maintenanceList = document.getElementById("maintenanceList");

  const maintenanceItem = document.createElement("div");
  maintenanceItem.className = "vehicle-item";

  const mileage = Number(vehicle.mileage);
  let recommendation = "";

  if (mileage >= 75000) {
    recommendation = "High mileage vehicle. Consider a full maintenance check.";
  } else if (mileage >= 30000) {
    recommendation = "Consider checking brakes, tires, fluids, and filters.";
  } else if (mileage >= 5000) {
    recommendation = "Oil change and tire rotation may be needed soon.";
  } else {
    recommendation =
      "Vehicle mileage is low. Keep tracking regular maintenance.";
  }

  maintenanceItem.innerHTML =
    "<strong>" +
    vehicle.make +
    " " +
    vehicle.model +
    "</strong>" +
    "<span>" +
    recommendation +
    "</span>";

  maintenanceList.appendChild(maintenanceItem);
}

// Show recall information
async function showRecallInfo(vehicle) {
  const recallList = document.getElementById("recallList");

  const year = vehicle.year;
  const make = encodeURIComponent(vehicle.make);
  const model = encodeURIComponent(vehicle.model);

  const response = await fetch(
    "/api/recalls/" + year + "/" + make + "/" + model,
  );
  const recallData = await response.json();

  const recallItem = document.createElement("div");
  recallItem.className = "vehicle-item";

  if (!recallData.results || recallData.results.length === 0) {
    recallItem.innerHTML =
      "<strong>" +
      vehicle.year +
      " " +
      vehicle.make +
      " " +
      vehicle.model +
      "</strong>" +
      "<span> No recalls found. </span>";

    recallList.appendChild(recallItem);
    return;
  }

  let recallHTML =
    "<strong>" +
    vehicle.year +
    " " +
    vehicle.make +
    " " +
    vehicle.model +
    "</strong>" +
    "<span> " +
    recallData.results.length +
    " recall(s) found. </span>";

  for (let i = 0; i < recallData.results.length; i++) {
    const recall = recallData.results[i];

    recallHTML =
      recallHTML +
      '<div class="recall-item">' +
      "<p><strong>Component:</strong> " +
      recall.Component +
      "</p>" +
      "<p><strong>Summary:</strong> " +
      recall.Summary +
      "</p>" +
      "<p><strong>Remedy:</strong> " +
      recall.Remedy +
      "</p>" +
      "</div>";
  }

  recallItem.innerHTML = recallHTML;
  recallList.appendChild(recallItem);
}

// Get latest service history record
async function getDashboardServiceHistory() {
  const latestServicePreview = document.getElementById("latestServicePreview");

  const response = await fetch("/api/service-history");
  const records = await response.json();

  if (records.length === 0) {
    latestServicePreview.innerHTML = "<p> No service record saved yet. </p>";
    return;
  }

  const latestService = records[0];
  const cost = Number(latestService.cost).toLocaleString();

  latestServicePreview.innerHTML =
    "<p>" +
    "<strong>" +
    latestService.vehicle +
    "</strong><br>" +
    latestService.service_type +
    "<br>" +
    "Date: " +
    latestService.service_date +
    "<br>" +
    "Cost: $" +
    cost +
    "</p>";
}
