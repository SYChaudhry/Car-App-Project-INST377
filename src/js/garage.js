document.addEventListener("DOMContentLoaded", startPage);

function startPage() {
  loadVehicles();
  loadLatestService();
}

async function loadVehicles() {
  const dashboardVehicleList = document.getElementById("dashboardVehicleList");
  const maintenanceList = document.getElementById("maintenanceList");
  const recallList = document.getElementById("recallList");

  const response = await fetch("/api/vehicles");
  const vehicles = await response.json();

  dashboardVehicleList.innerHTML = "";
  maintenanceList.innerHTML = "";
  recallList.innerHTML = "";

  if (vehicles.length === 0) {
    dashboardVehicleList.innerHTML = "<p>No vehicles loaded yet.</p>";
    maintenanceList.innerHTML = "<p>No maintenance recommendations yet.</p>";
    recallList.innerHTML = "<p>No recall information yet.</p>";
    return;
  }

  for (let i = 0; i < vehicles.length; i++) {
    const vehicle = vehicles[i];

    addVehicleToPage(vehicle);
    addMaintenanceToPage(vehicle);
    await addRecallToPage(vehicle);
  }
}

function addVehicleToPage(vehicle) {
  const dashboardVehicleList = document.getElementById("dashboardVehicleList");

  const vehicleBox = document.createElement("div");
  vehicleBox.className = "vehicle-item";

  vehicleBox.innerHTML =
    "<strong>" +
    vehicle.year +
    " " +
    vehicle.make +
    " " +
    vehicle.model +
    "</strong>" +
    "<span>Mileage: " +
    vehicle.mileage +
    " miles</span>";

  dashboardVehicleList.appendChild(vehicleBox);
}

function addMaintenanceToPage(vehicle) {
  const maintenanceList = document.getElementById("maintenanceList");

  const maintenanceBox = document.createElement("div");
  maintenanceBox.className = "vehicle-item";

  let message = "";

  if (vehicle.mileage >= 75000) {
    message = "High mileage vehicle. Consider a full maintenance check.";
  } else if (vehicle.mileage >= 30000) {
    message = "Check brakes, tires, fluids, and filters.";
  } else if (vehicle.mileage >= 5000) {
    message = "Oil change and tire rotation may be needed soon.";
  } else {
    message = "Mileage is low. Keep tracking regular maintenance.";
  }

  maintenanceBox.innerHTML =
    "<strong>" +
    vehicle.make +
    " " +
    vehicle.model +
    "</strong>" +
    "<span>" +
    message +
    "</span>";

  maintenanceList.appendChild(maintenanceBox);
}

async function addRecallToPage(vehicle) {
  const recallList = document.getElementById("recallList");

  const year = vehicle.year;
  const make = encodeURIComponent(vehicle.make);
  const model = encodeURIComponent(vehicle.model);

  const response = await fetch(
    "/api/recalls/" + year + "/" + make + "/" + model,
  );
  const recallData = await response.json();

  const recallBox = document.createElement("div");
  recallBox.className = "vehicle-item";

  if (!recallData.results || recallData.results.length === 0) {
    recallBox.innerHTML =
      "<strong>" +
      vehicle.year +
      " " +
      vehicle.make +
      " " +
      vehicle.model +
      "</strong>" +
      "<span>No recalls found.</span>";

    recallList.appendChild(recallBox);
    return;
  }

  recallBox.innerHTML =
    "<strong>" +
    vehicle.year +
    " " +
    vehicle.make +
    " " +
    vehicle.model +
    "</strong>" +
    "<span>" +
    recallData.results.length +
    " recall(s) found.</span>";

  recallList.appendChild(recallBox);
}

async function loadLatestService() {
  const latestServicePreview = document.getElementById("latestServicePreview");

  const response = await fetch("/api/service-history");
  const records = await response.json();

  if (records.length === 0) {
    latestServicePreview.innerHTML = "<p>No service record saved yet.</p>";
    return;
  }

  const service = records[0];

  latestServicePreview.innerHTML =
    "<p>" +
    "<strong>" +
    service.vehicle +
    "</strong><br>" +
    service.service_type +
    "<br>" +
    "Date: " +
    service.service_date +
    "<br>" +
    "Cost: $" +
    service.cost +
    "</p>";
}
