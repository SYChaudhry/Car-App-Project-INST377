let editingServiceId = null;

document.addEventListener("DOMContentLoaded", startServicePage);

function startServicePage() {
  const serviceForm = document.getElementById("serviceForm");

  getGarageVehicles();
  getServiceHistory();

  if (serviceForm) {
    serviceForm.addEventListener("submit", saveServiceRecord);
  }
}

async function getGarageVehicles() {
  const vehicleSelect = document.getElementById("serviceVehicle");

  if (!vehicleSelect) {
    return;
  }

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

async function getServiceHistory() {
  const response = await fetch("/api/service-history");
  const records = await response.json();

  showServiceRecords(records);
}

async function saveServiceRecord(event) {
  event.preventDefault();

  const serviceData = getServiceFormData();

  if (editingServiceId) {
    updateService(serviceData);
  } else {
    addService(serviceData);
  }
}

function getServiceFormData() {
  const vehicle = document.getElementById("serviceVehicle").value;
  const type = document.getElementById("serviceType").value;
  const date = document.getElementById("serviceDate").value;
  const mileage = document.getElementById("serviceMileage").value;
  const cost = document.getElementById("serviceCost").value;
  const notes = document.getElementById("serviceNotes").value;

  const serviceData = {
    vehicle: vehicle,
    service_type: type,
    service_date: date,
    mileage: Number(mileage),
    cost: Number(cost),
    notes: notes,
  };

  return serviceData;
}

async function addService(serviceData) {
  await fetch("/api/service-history", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(serviceData),
  });

  Swal.fire({
    title: "Service Added",
    text: "Your service record was added successfully.",
    icon: "success",
  });

  resetServiceForm();
  getServiceHistory();
}

async function updateService(serviceData) {
  await fetch("/api/service-history/" + editingServiceId, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(serviceData),
  });

  editingServiceId = null;

  Swal.fire({
    title: "Service Updated",
    text: "Your service record was updated successfully.",
    icon: "success",
  });

  resetServiceForm();
  getServiceHistory();
}

function resetServiceForm() {
  document.getElementById("serviceForm").reset();

  const saveButton = document.querySelector("#serviceForm button");

  if (saveButton) {
    saveButton.textContent = "Add Service";
  }
}

function showServiceRecords(records) {
  const serviceList = document.getElementById("serviceList");

  if (!serviceList) {
    return;
  }

  serviceList.innerHTML = "";

  if (records.length === 0) {
    serviceList.innerHTML = "<p>No service records added yet.</p>";
    makeServiceChart([]);
    return;
  }

  for (let i = 0; i < records.length; i++) {
    addServiceRecordToPage(records[i]);
  }

  makeServiceChart(records);
}

function addServiceRecordToPage(record) {
  const serviceList = document.getElementById("serviceList");

  const serviceItem = document.createElement("div");
  serviceItem.className = "vehicle-item";

  serviceItem.innerHTML = `
    <strong>${record.vehicle}</strong>
    <span>Service: ${record.service_type}</span><br>
    <span>Date: ${record.service_date}</span><br>
    <span>Mileage at Service: ${Number(record.mileage).toLocaleString()}</span><br>
    <span>Cost: $${Number(record.cost).toLocaleString()}</span><br>
    <span>Notes: ${record.notes}</span><br>
    <button type="button" onclick="editServiceRecord(${record.id}, '${record.vehicle}', '${record.service_type}', '${record.service_date}', ${record.mileage}, ${record.cost}, '${record.notes}')">Edit</button>
    <button type="button" onclick="removeServiceRecord(${record.id})">Remove</button>
  `;

  serviceList.appendChild(serviceItem);
}

function editServiceRecord(id, vehicle, type, date, mileage, cost, notes) {
  editingServiceId = id;

  document.getElementById("serviceVehicle").value = vehicle;
  document.getElementById("serviceType").value = type;
  document.getElementById("serviceDate").value = date;
  document.getElementById("serviceMileage").value = mileage;
  document.getElementById("serviceCost").value = cost;
  document.getElementById("serviceNotes").value = notes;

  const saveButton = document.querySelector("#serviceForm button");

  if (saveButton) {
    saveButton.textContent = "Update Service";
  }

  window.scrollTo(0, 0);
}

async function removeServiceRecord(id) {
  await fetch("/api/service-history/" + id, {
    method: "DELETE",
  });

  getServiceHistory();
}
