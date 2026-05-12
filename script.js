const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const supabaseJS = require("@supabase/supabase-js");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Supabase setup
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = supabaseJS.createClient(supabaseUrl, supabaseKey);

// Home page route
app.get("/", getHomePage);

function getHomePage(req, res) {
  res.sendFile(path.join(__dirname, "public", "index.html"));
}

// About page route
app.get("/about", getAboutPage);

function getAboutPage(req, res) {
  res.sendFile(path.join(__dirname, "public", "about.html"));
}

// Garage page route
app.get("/garage", getGaragePage);

function getGaragePage(req, res) {
  res.sendFile(path.join(__dirname, "public", "garage.html"));
}

// Service history page route
app.get("/service-history", getServiceHistoryPage);

function getServiceHistoryPage(req, res) {
  res.sendFile(path.join(__dirname, "public", "service-history.html"));
}

// Gets vehicle data
app.get("/api/vehicles", getVehicles);

async function getVehicles(req, res) {
  const result = await supabase.from("vehicles").select("*");

  res.json(result.data);
}

// Saves vehicle data
app.post("/api/vehicles", saveVehicle);

async function saveVehicle(req, res) {
  const year = req.body.year;
  const make = req.body.make;
  const model = req.body.model;
  const mileage = req.body.mileage;

  const newVehicle = {
    year: year,
    make: make,
    model: model,
    mileage: mileage,
  };

  const result = await supabase.from("vehicles").insert([newVehicle]).select();

  res.json(result.data);
}

// Updates vehicle data
app.put("/api/vehicles/:id", updateVehicle);

async function updateVehicle(req, res) {
  const id = req.params.id;

  const year = req.body.year;
  const make = req.body.make;
  const model = req.body.model;
  const mileage = req.body.mileage;

  const updatedVehicle = {
    year: year,
    make: make,
    model: model,
    mileage: mileage,
  };

  const result = await supabase
    .from("vehicles")
    .update(updatedVehicle)
    .eq("id", id)
    .select();

  res.json(result.data);
}

// Deletes vehicle data
app.delete("/api/vehicles/:id", deleteVehicle);

async function deleteVehicle(req, res) {
  const id = req.params.id;

  const result = await supabase.from("vehicles").delete().eq("id", id).select();

  res.json(result.data);
}

// Gets service history
app.get("/api/service-history", getServiceHistory);

async function getServiceHistory(req, res) {
  const result = await supabase.from("service_history").select("*");

  res.json(result.data);
}

// Saves service history
app.post("/api/service-history", saveServiceHistory);

async function saveServiceHistory(req, res) {
  const vehicle = req.body.vehicle;
  const serviceType = req.body.service_type;
  const serviceDate = req.body.service_date;
  const mileage = req.body.mileage;
  const cost = req.body.cost;
  const notes = req.body.notes;

  const newService = {
    vehicle: vehicle,
    service_type: serviceType,
    service_date: serviceDate,
    mileage: mileage,
    cost: cost,
    notes: notes,
  };

  const result = await supabase
    .from("service_history")
    .insert([newService])
    .select();

  res.json(result.data);
}

// Updates service history
app.put("/api/service-history/:id", updateServiceHistory);

async function updateServiceHistory(req, res) {
  const id = req.params.id;

  const vehicle = req.body.vehicle;
  const serviceType = req.body.service_type;
  const serviceDate = req.body.service_date;
  const mileage = req.body.mileage;
  const cost = req.body.cost;
  const notes = req.body.notes;

  const updatedService = {
    vehicle: vehicle,
    service_type: serviceType,
    service_date: serviceDate,
    mileage: mileage,
    cost: cost,
    notes: notes,
  };

  const result = await supabase
    .from("service_history")
    .update(updatedService)
    .eq("id", id)
    .select();

  res.json(result.data);
}

// Deletes service history
app.delete("/api/service-history/:id", deleteServiceHistory);

async function deleteServiceHistory(req, res) {
  const id = req.params.id;

  const result = await supabase
    .from("service_history")
    .delete()
    .eq("id", id)
    .select();

  res.json(result.data);
}

// Gets vehicle makes from NHTSA
app.get("/api/makes", getMakes);

async function getMakes(req, res) {
  const url =
    "https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/car?format=json";

  const response = await fetch(url);
  const data = await response.json();

  res.json(data.Results.slice(0, 40));
}

// Gets models from NHTSA based on make and year
app.get("/api/models/:make/:year", getModels);

async function getModels(req, res) {
  const make = req.params.make;
  const year = req.params.year;

  const url =
    "https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeYear/make/" +
    make +
    "/modelyear/" +
    year +
    "?format=json";

  const response = await fetch(url);
  const data = await response.json();

  res.json(data.Results.slice(0, 75));
}

app.listen(PORT, serverStarted);

function serverStarted() {
  console.log("http://localhost:" + PORT);
}
