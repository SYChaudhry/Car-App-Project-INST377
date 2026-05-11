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

// Gets vehicle data from Supabase
app.get("/api/vehicles", getVehicles);

async function getVehicles(req, res) {
  const result = await supabase.from("vehicles").select("*");

  res.json(result.data);
}

// saves vehicle data to Supabase
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
    mileage: mileage
  };

  const result = await supabase
    .from("vehicles")
    .insert([newVehicle])
    .select();

  res.json(result.data);
}

// gets vehicle makes from NHTSA
app.get("/api/makes", getMakes);

async function getMakes(req, res) {
  const url = "https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/car?format=json";

  const response = await fetch(url);
  const data = await response.json();

  res.json(data.Results.slice(0, 40));
}

// gets models from NHTSA based on make and year
app.get("/api/models/:make/:year", getModels);

async function getModels(req, res) {
  const make = req.params.make;
  const year = req.params.year;

  const url = "https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeYear/make/" 
    + make 
    + "/modelyear/" 
    + year 
    + "?format=json";

  const response = await fetch(url);
  const data = await response.json();

  res.json(data.Results.slice(0, 75));
}

app.listen(PORT);