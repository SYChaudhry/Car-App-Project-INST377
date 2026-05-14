# Developer Manual

## Overview

Gearly is a car maintenance web application. It allows users to save vehicles, track service history, view maintenance recommendations, check vehicle recalls, and search for nearby service shops.

This manual is for future developers who may work on the project.

## How to Install the Application

First, clone the GitHub repository

Then go into the project folder

cd Car-App-Project-INST377

Install the project dependencies:

npm install

The main dependencies are:

- express
- dotenv
- @supabase/supabase-js
- nodemon

## Environment Variables

Create a .env file in the main project folder.

Add the following:

SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_key
GEOAPIFY_KEY=your_geoapify_key
PORT=3000

Make sure .env is listed in .gitignore.

## How to Run the Application

To run the application locally:

npm run dev

Then open:

http://localhost:3000

To run the application without nodemon:

npm start

## How to Run Tests

There are no automated tests written for this project yet.

The project was tested manually by checking that users can:

- Add, edit, and delete vehicles
- Add, edit, and delete service records
- View vehicles on the dashboard
- Check recall information
- Search nearby shops
- View shop results on the map

## Server API Endpoints

### Page Routes

GET /
Loads the Dashboard page.

GET /garage
Loads the Garage page.

GET /service-history
Loads the Service History page.

GET /nearby-shops
Loads the Nearby Shops page.

GET /about
Loads the About page.

### Vehicle API

GET /api/vehicles
Gets all saved vehicles from the Supabase database.

POST /api/vehicles
Adds a new vehicle to the Supabase database.

PUT /api/vehicles/:id
Updates a saved vehicle.

DELETE /api/vehicles/:id
Deletes a saved vehicle.

### Service History API

GET /api/service-history
Gets all saved service records from the Supabase database.

POST /api/service-history
Adds a new service record to the Supabase database.

PUT /api/service-history/:id
Updates a saved service record.

DELETE /api/service-history/:id
Deletes a saved service record.

### External API Routes

GET /api/recalls/:year/:make/:model
Gets recall information from the NHTSA Recall API.

GET /api/nearby-shops?location=<location>
Uses Nominatim and Geoapify to find nearby vehicle service shops.

## Known Bugs and Limitations

- Recall checks use year, make, and model instead of VIN.
- Maintenance recommendations are based on simple mileage rules.
- Nearby shop results depend on external map and place data.
- The app does not have user login yet.
- Deleting a vehicle does not automatically delete its service records.

## Future Development Roadmap

Future improvements could include:

- Add user login
- Add VIN-based recall checks
- Add better maintenance reminders
- Add a maintenance calendar
- Improve mobile styling
- Add automated tests