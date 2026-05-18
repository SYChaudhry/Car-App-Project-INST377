///////////////// garage.js - Handles the logic for the garage page ///////////////////////

let editingVehicleId = null;

document.addEventListener("DOMContentLoaded", startPage);

function startPage() {
  const form = document.getElementById("vehicleForm");
  form.addEventListener("submit", saveVehicle);
  loadVehicles();
}



async function loadVehicles() {
  const vehicleList = document.getElementById("vehicleList");

  const response = await fetch("/api/vehicles");
  const vehicles = await response.json();

  vehicleList.innerHTML = "";

  if (vehicles.length === 0) {
    vehicleList.innerHTML = "<p> No vehicles saved yet. </p>";
    return;
  }

  for (let i = 0; i < vehicles.length; i++) {
    addVehicleToPage(vehicles[i]);
  }
}



function addVehicleToPage(vehicle) {
  const vehicleList = document.getElementById("vehicleList");

  const vehicleBox = document.createElement("div");
  vehicleBox.className = "vehicle-item";

  const mileage = Number(vehicle.mileage).toLocaleString();

  vehicleBox.innerHTML =
    "<div>" +
    "<strong>" +
    vehicle.year +
    " " +
    vehicle.make +
    " " +
    vehicle.model +
    "</strong><br>" +
    "<span> Mileage: " +
    mileage +
    " miles </span>" +
    "</div>";

  const editButton = document.createElement("button");
  editButton.type = "button";
  editButton.textContent = "Edit";

  editButton.addEventListener("click", function () {
    editVehicle(vehicle);
  });

  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.textContent = "Remove";

  removeButton.addEventListener("click", function () {
    deleteVehicle(vehicle.id);
  });

  vehicleBox.appendChild(editButton);
  vehicleBox.appendChild(removeButton);

  vehicleList.appendChild(vehicleBox);
}



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
    mileage: Number(mileage),
  };

  let url = "/api/vehicles";
  let method = "POST";

  if (editingVehicleId) {
    url = "/api/vehicles/" + editingVehicleId;
    method = "PUT";
  }

  const response = await fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(vehicleData),
  });

  const result = await response.json();

  if (!response.ok) {
    Swal.fire({
      title: "Vehicle Not Saved",
      text: result.error,
      icon: "error",
    });

    return;
  }

  editingVehicleId = null;

  document.getElementById("vehicleForm").reset();

  const saveButton = document.querySelector("#vehicleForm button");

  saveButton.textContent = "Save Vehicle";

  Swal.fire({
    title: "Success",
    text: "Vehicle saved successfully.",
    icon: "success",
  });

  loadVehicles();
}



function editVehicle(vehicle) {
  editingVehicleId = vehicle.id;

  document.getElementById("year").value = vehicle.year;
  document.getElementById("make").value = vehicle.make;
  document.getElementById("model").value = vehicle.model;
  document.getElementById("mileage").value = vehicle.mileage;

  const saveButton = document.querySelector("#vehicleForm button");
  saveButton.textContent = "Update Vehicle";

  window.scrollTo(0, 0);
}



async function deleteVehicle(id) {
  const confirmDelete = await Swal.fire({
    title: "Remove Vehicle?",
    text: "This vehicle will be deleted from your garage.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, remove it",
    cancelButtonText: "Cancel",
  });

  if (!confirmDelete.isConfirmed) {
    return;
  }

  const response = await fetch("/api/vehicles/" + id, {
    method: "DELETE",
  });

  const result = await response.json();

  if (!response.ok) {
    Swal.fire({
      title: "Vehicle Not Deleted",
      text: result.error,
      icon: "error",
    });

    return;
  }

  Swal.fire({
    title: "Deleted",
    text: "Vehicle removed successfully.",
    icon: "success",
  });

  loadVehicles();
}