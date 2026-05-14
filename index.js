const express = require("express");
require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY,
);

// Middleware
app.use(express.json());
app.use(express.static("src"));

// Page Routes

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/src/index.html");
});

app.get("/garage", function (req, res) {
  res.sendFile(__dirname + "/src/garage.html");
});

app.get("/service-history", function (req, res) {
  res.sendFile(__dirname + "/src/service-history.html");
});

app.get("/nearby-shops", function (req, res) {
  res.sendFile(__dirname + "/src/nearby-shops.html");
});

app.get("/about", function (req, res) {
  res.sendFile(__dirname + "/src/about.html");
});

// Vehicle API Routes

// Get all vehicles
app.get("/api/vehicles", async function (req, res) {
  const result = await supabase
    .from("vehicles")
    .select("*")
    .order("id", { ascending: true });

  if (result.error) {
    res.status(500).json({ error: result.error.message });
  } else {
    res.json(result.data);
  }
});

// Add a vehicle
app.post("/api/vehicles", async function (req, res) {
  const year = req.body.year;
  const make = req.body.make;
  const model = req.body.model;
  const mileage = req.body.mileage;

  const result = await supabase
    .from("vehicles")
    .insert([
      {
        year: year,
        make: make,
        model: model,
        mileage: mileage,
      },
    ])
    .select();

  if (result.error) {
    res.status(500).json({ error: result.error.message });
  } else {
    res.json(result.data);
  }
});

// Update a vehicle
app.put("/api/vehicles/:id", async function (req, res) {
  const id = req.params.id;

  const year = req.body.year;
  const make = req.body.make;
  const model = req.body.model;
  const mileage = req.body.mileage;

  const result = await supabase
    .from("vehicles")
    .update({
      year: year,
      make: make,
      model: model,
      mileage: mileage,
    })
    .eq("id", id)
    .select();

  if (result.error) {
    res.status(500).json({ error: result.error.message });
  } else {
    res.json(result.data);
  }
});

// Delete a vehicle
app.delete("/api/vehicles/:id", async function (req, res) {
  const id = req.params.id;

  const result = await supabase.from("vehicles").delete().eq("id", id).select();

  if (result.error) {
    res.status(500).json({ error: result.error.message });
  } else {
    res.json(result.data);
  }
});

// Service History API Routes

// Get all service records
app.get("/api/service-history", async function (req, res) {
  const result = await supabase
    .from("service_history")
    .select("*")
    .order("id", { ascending: false });

  if (result.error) {
    res.status(500).json({ error: result.error.message });
  } else {
    res.json(result.data);
  }
});

// Add a service record
app.post("/api/service-history", async function (req, res) {
  const vehicle = req.body.vehicle;
  const service_type = req.body.service_type;
  const service_date = req.body.service_date;
  const mileage = req.body.mileage;
  const cost = req.body.cost;
  const notes = req.body.notes;

  const result = await supabase
    .from("service_history")
    .insert([
      {
        vehicle: vehicle,
        service_type: service_type,
        service_date: service_date,
        mileage: mileage,
        cost: cost,
        notes: notes,
      },
    ])
    .select();

  if (result.error) {
    res.status(500).json({ error: result.error.message });
  } else {
    res.json(result.data);
  }
});

// Update a service record
app.put("/api/service-history/:id", async function (req, res) {
  const id = req.params.id;

  const vehicle = req.body.vehicle;
  const service_type = req.body.service_type;
  const service_date = req.body.service_date;
  const mileage = req.body.mileage;
  const cost = req.body.cost;
  const notes = req.body.notes;

  const result = await supabase
    .from("service_history")
    .update({
      vehicle: vehicle,
      service_type: service_type,
      service_date: service_date,
      mileage: mileage,
      cost: cost,
      notes: notes,
    })
    .eq("id", id)
    .select();

  if (result.error) {
    res.status(500).json({ error: result.error.message });
  } else {
    res.json(result.data);
  }
});

// Delete a service record
app.delete("/api/service-history/:id", async function (req, res) {
  const id = req.params.id;

  const result = await supabase
    .from("service_history")
    .delete()
    .eq("id", id)
    .select();

  if (result.error) {
    res.status(500).json({ error: result.error.message });
  } else {
    res.json(result.data);
  }
});

// Recall API Route

app.get("/api/recalls/:year/:make/:model", async function (req, res) {
  const year = req.params.year;
  const make = req.params.make;
  const model = req.params.model;

  const url =
    "https://api.nhtsa.gov/recalls/recallsByVehicle?make=" +
    encodeURIComponent(make) +
    "&model=" +
    encodeURIComponent(model) +
    "&modelYear=" +
    encodeURIComponent(year);

  try {
    const response = await fetch(url);
    const data = await response.json();

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Could not load recall data" });
  }
});

// Nearby Shops API Route

app.get("/api/nearby-shops", async function (req, res) {
  const location = req.query.location;

  if (!location) {
    res.status(400).json({ error: "Location is required" });
    return;
  }

  try {
    // First, turn the location into latitude and longitude
    const geoUrl =
      "https://nominatim.openstreetmap.org/search?q=" +
      encodeURIComponent(location) +
      "&format=jsonv2&limit=1";

    const geoResponse = await fetch(geoUrl, {
      headers: {
        "User-Agent": "Gearly INST377 student project",
      },
    });

    const geoData = await geoResponse.json();

    if (geoData.length === 0) {
      res.status(404).json({ error: "Location not found" });
      return;
    }

    const lat = geoData[0].lat;
    const lon = geoData[0].lon;

    // Then, use the latitude and longitude to find nearby shops
    const placesUrl =
      "https://api.geoapify.com/v2/places?" +
      "categories=service.vehicle,commercial.vehicle" +
      "&filter=circle:" +
      lon +
      "," +
      lat +
      ",8000" +
      "&bias=proximity:" +
      lon +
      "," +
      lat +
      "&limit=10" +
      "&apiKey=" +
      process.env.GEOAPIFY_KEY;

    const placesResponse = await fetch(placesUrl);
    const placesData = await placesResponse.json();

    res.json({
      location: geoData[0].display_name,
      lat: lat,
      lon: lon,
      shops: placesData.features,
    });
  } catch (error) {
    res.status(500).json({ error: "Could not load nearby shops" });
  }
});

// Start Server
app.listen(PORT, function () {
  console.log("http://localhost:" + PORT);
});
