let allMakes = [];

document.addEventListener("DOMContentLoaded", startGaragePage);

function startGaragePage() {
  const vehicleForm = document.getElementById("vehicleForm");
  const yearInput = document.getElementById("year");
  const makeInput = document.getElementById("make");
  const modelInput = document.getElementById("model");

  if (yearInput) {
    addYearOptions();
  }

  if (makeInput) {
    getMakes();
  }

  if (yearInput && makeInput && modelInput) {
    yearInput.addEventListener("input", yearChanged);
    makeInput.addEventListener("input", makeChanged);
  }

  if (vehicleForm) {
    vehicleForm.reset();
    vehicleForm.addEventListener("submit", saveVehicle);
    getVehicles();
  }
}

function yearChanged() {
  const makeInput = document.getElementById("make");
  const modelInput = document.getElementById("model");

  if (makeInput) {
    makeInput.value = "";
  }

  if (modelInput) {
    modelInput.value = "";
  }

  getMakesForYear();
  getModels();
}

function makeChanged() {
  const modelInput = document.getElementById("model");

  if (modelInput) {
    modelInput.value = "";
  }

  getModels();
}

function addYearOptions() {
  const yearOptions = document.getElementById("yearOptions");

  if (!yearOptions) {
    return;
  }

  const currentYear = new Date().getFullYear();
  const firstYear = 1900;

  yearOptions.innerHTML = "";

  for (let year = currentYear; year >= firstYear; year--) {
    const option = document.createElement("option");
    option.value = year;
    yearOptions.appendChild(option);
  }
}

// Fetch Call #1: gets saved vehicles from backend
async function getVehicles() {
  const vehicleList = document.getElementById("vehicleList");

  if (!vehicleList) {
    return;
  }

  const response = await fetch("/api/vehicles");
  const vehicles = await response.json();

  vehicleList.innerHTML = "";

  if (vehicles.length === 0) {
    vehicleList.innerHTML = "<p>No vehicles saved yet.</p>";
    makeGarageChart([]);
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

    vehicleList.appendChild(vehicleItem);
  }

  makeGarageChart(vehicles);
}

// Fetch Call #2: saves a new vehicle to backend
async function saveVehicle(event) {
  event.preventDefault();

  const year = document.getElementById("year").value;
  const make = document.getElementById("make").value;
  const model = document.getElementById("model").value;
  const mileage = document.getElementById("mileage").value;

  const vehicleData = {
    year: Number(year),
    make: make,
    model: model,
    mileage: Number(mileage)
  };

  const response = await fetch("/api/vehicles", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(vehicleData)
  });

  await response.json();

  Swal.fire({
    title: "Vehicle Saved",
    text: "Your vehicle was added successfully.",
    icon: "success"
  });

  document.getElementById("vehicleForm").reset();

  const modelOptions = document.getElementById("modelOptions");
  if (modelOptions) {
    modelOptions.innerHTML = "";
  }

  getVehicles();
}

// Fetch Call #3: gets all car makes from backend/NHTSA
async function getMakes() {
  const response = await fetch("/api/makes");
  const makes = await response.json();

  allMakes = makes;
  showMakes(allMakes);
}

function showMakes(makes) {
  const makeOptions = document.getElementById("makeOptions");

  if (!makeOptions) {
    return;
  }

  makeOptions.innerHTML = "";

  for (let i = 0; i < makes.length; i++) {
    const option = document.createElement("option");
    option.value = makes[i].MakeName;
    makeOptions.appendChild(option);
  }
}

// This checks each make against the selected year.
// The user can still type a make even if it is not suggested.
async function getMakesForYear() {
  const yearInput = document.getElementById("year");

  if (!yearInput) {
    return;
  }

  const year = yearInput.value.trim();

  if (year.length < 4) {
    showMakes(allMakes);
    return;
  }

  const makesForThatYear = [];

  for (let i = 0; i < allMakes.length; i++) {
    const make = allMakes[i];
    const makeName = encodeURIComponent(make.MakeName);

    const response = await fetch("/api/models/" + makeName + "/" + year);
    const models = await response.json();

    if (models.length > 0) {
      makesForThatYear.push(make);
    }
  }

  showMakes(makesForThatYear);
}

// Fetch Call #4: gets model suggestions based on year and make
async function getModels() {
  const yearInput = document.getElementById("year");
  const makeInput = document.getElementById("make");
  const modelOptions = document.getElementById("modelOptions");

  if (!yearInput || !makeInput || !modelOptions) {
    return;
  }

  const year = yearInput.value.trim();
  const make = makeInput.value.trim();

  modelOptions.innerHTML = "";

  if (year === "" || make === "") {
    return;
  }

  const makeName = encodeURIComponent(make);
  const response = await fetch("/api/models/" + makeName + "/" + year);
  const models = await response.json();

  const addedModels = [];

  for (let i = 0; i < models.length; i++) {
    const modelName = models[i].Model_Name;

    if (!addedModels.includes(modelName)) {
      const option = document.createElement("option");
      option.value = modelName;
      modelOptions.appendChild(option);

      addedModels.push(modelName);
    }
  }
}