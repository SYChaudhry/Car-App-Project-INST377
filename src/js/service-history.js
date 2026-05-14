let editingServiceId = null;

document.addEventListener("DOMContentLoaded", startPage);

function startPage() {
  const form = document.getElementById("serviceForm");

  form.addEventListener("submit", saveService);

  loadVehicles();
  loadServices();
}

async function loadVehicles() {
  const vehicleSelect = document.getElementById("serviceVehicle");

  const response = await fetch("/api/vehicles");
  const vehicles = await response.json();

  vehicleSelect.innerHTML = "";

  const firstOption = document.createElement("option");
  firstOption.value = "";
  firstOption.textContent = "Select a vehicle from your garage";

  vehicleSelect.appendChild(firstOption);

  for (let i = 0; i < vehicles.length; i++) {
    const vehicle = vehicles[i];

    const vehicleName = vehicle.year + " " + vehicle.make + " " + vehicle.model;

    const option = document.createElement("option");
    option.value = vehicleName;
    option.textContent = vehicleName;

    vehicleSelect.appendChild(option);
  }
}

async function loadServices() {
  const serviceList = document.getElementById("serviceList");

  const response = await fetch("/api/service-history");
  const records = await response.json();

  serviceList.innerHTML = "";

  if (records.length === 0) {
    serviceList.innerHTML = "<p>No service records added yet.</p>";
    return;
  }

  for (let i = 0; i < records.length; i++) {
    addServiceToPage(records[i]);
  }
}

function addServiceToPage(record) {
  const serviceList = document.getElementById("serviceList");

  const serviceBox = document.createElement("div");
  serviceBox.className = "vehicle-item";

  let notes = "No notes added";

  if (record.notes) {
    notes = record.notes;
  }

  serviceBox.innerHTML =
    "<div>" +
    "<strong>" +
    record.vehicle +
    "</strong>" +
    "<span>Service: " +
    record.service_type +
    "</span><br>" +
    "<span>Date: " +
    record.service_date +
    "</span><br>" +
    "<span>Mileage: " +
    record.mileage +
    " miles</span><br>" +
    "<span>Cost: $" +
    record.cost +
    "</span><br>" +
    "<span>Notes: " +
    notes +
    "</span>" +
    "</div>";

  const editButton = document.createElement("button");
  editButton.type = "button";
  editButton.textContent = "Edit";

  editButton.addEventListener("click", function () {
    editService(record);
  });

  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.textContent = "Remove";

  removeButton.addEventListener("click", function () {
    deleteService(record.id);
  });

  serviceBox.appendChild(editButton);
  serviceBox.appendChild(removeButton);

  serviceList.appendChild(serviceBox);
}

async function saveService(event) {
  event.preventDefault();

  const vehicle = document.getElementById("serviceVehicle").value;
  const serviceType = document.getElementById("serviceType").value;
  const serviceDate = document.getElementById("serviceDate").value;
  const mileage = document.getElementById("serviceMileage").value;
  const cost = document.getElementById("serviceCost").value;
  const notes = document.getElementById("serviceNotes").value;

  const serviceData = {
    vehicle: vehicle,
    service_type: serviceType,
    service_date: serviceDate,
    mileage: Number(mileage),
    cost: Number(cost),
    notes: notes,
  };

  let url = "/api/service-history";
  let method = "POST";

  if (editingServiceId) {
    url = "/api/service-history/" + editingServiceId;
    method = "PUT";
  }

  const response = await fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(serviceData),
  });

  const result = await response.json();

  if (!response.ok) {
    Swal.fire({
      title: "Service Record Not Saved",
      text: result.error,
      icon: "error",
    });

    return;
  }

  editingServiceId = null;

  document.getElementById("serviceForm").reset();

  const saveButton = document.querySelector("#serviceForm button");
  saveButton.textContent = "Add Service";

  Swal.fire({
    title: "Success",
    text: "Service record saved successfully.",
    icon: "success",
  });

  loadServices();
}

function editService(record) {
  editingServiceId = record.id;

  document.getElementById("serviceVehicle").value = record.vehicle;
  document.getElementById("serviceType").value = record.service_type;
  document.getElementById("serviceDate").value = record.service_date;
  document.getElementById("serviceMileage").value = record.mileage;
  document.getElementById("serviceCost").value = record.cost;
  document.getElementById("serviceNotes").value = record.notes;

  const saveButton = document.querySelector("#serviceForm button");
  saveButton.textContent = "Update Service";

  window.scrollTo(0, 0);
}

async function deleteService(id) {
  const confirmDelete = await Swal.fire({
    title: "Remove Service Record?",
    text: "This maintenance record will be deleted.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, remove it",
    cancelButtonText: "Cancel",
  });

  if (!confirmDelete.isConfirmed) {
    return;
  }

  const response = await fetch("/api/service-history/" + id, {
    method: "DELETE",
  });

  const result = await response.json();

  if (!response.ok) {
    Swal.fire({
      title: "Service Record Not Deleted",
      text: result.error,
      icon: "error",
    });

    return;
  }

  Swal.fire({
    title: "Deleted",
    text: "Service record removed successfully.",
    icon: "success",
  });

  loadServices();
}
