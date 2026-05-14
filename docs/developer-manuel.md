# Gearly Developer Manual

## Overview

Gearly is a car maintenance web application. It lets users save vehicles, track service history, view basic maintenance recommendations, check vehicle recalls, and search for nearby service shops.

This manual is for future developers who may work on the project.

## How to Install the Application

First, clone the GitHub repository:

```bash
git clone <your-github-repo-link>
cd Car-App-Project-INST377
```

Then install all dependencies:

```bash
npm install
```

The main dependencies used in this project are:

- express
- dotenv
- @supabase/supabase-js
- nodemon

## Environment Variables

Create a `.env` file in the main project folder.

Add the following:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_key
GEOAPIFY_KEY=your_geoapify_key
PORT=3000
```

Make sure `.env` is included in `.gitignore` so API keys are not pushed to GitHub.

## How to Run the Application

To run the app locally with nodemon:

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

To run the app without nodemon:

```bash
npm start
```

## How to Run Tests

There are no automated tests written for this project yet.

For now, testing is done manually by checking that these features work:

- Add, edit, and delete vehicles
- Add, edit, and delete service records
- View saved vehicles on the dashboard
- View maintenance recommendations
- View recall checks
- Search nearby shops
- Confirm the map markers appear

The current test command is:

```bash
npm test
```

## Server API Endpoints

### Page Routes

```text
GET /
```

Loads the Dashboard page.

```text
GET /garage
```

Loads the Garage page.

```text
GET /service-history
```

Loads the Service History page.

```text
GET /nearby-shops
```

Loads the Nearby Shops page.

```text
GET /about
```

Loads the About page.

## Vehicle API

```text
GET /api/vehicles
```

Gets all saved vehicles from the Supabase `vehicles` table.

```text
POST /api/vehicles
```

Adds a new vehicle to the Supabase `vehicles` table.

Example body:

```json
{
  "year": 2020,
  "make": "Honda",
  "model": "Civic",
  "mileage": 45000
}
```

```text
PUT /api/vehicles/:id
```

Updates a saved vehicle by ID.

```text
DELETE /api/vehicles/:id
```

Deletes a saved vehicle by ID.

## Service History API

```text
GET /api/service-history
```

Gets all saved service records from the Supabase `service_history` table.

```text
POST /api/service-history
```

Adds a new service record to the Supabase `service_history` table.

Example body:

```json
{
  "vehicle": "2020 Honda Civic",
  "service_type": "Oil Change",
  "service_date": "2026-05-13",
  "mileage": 45000,
  "cost": 65,
  "notes": "Replaced oil and filter"
}
```

```text
PUT /api/service-history/:id
```

Updates a saved service record by ID.

```text
DELETE /api/service-history/:id
```

Deletes a saved service record by ID.

## External API Routes

```text
GET /api/recalls/:year/:make/:model
```

Gets recall information from the NHTSA Recall API using the vehicle year, make, and model.

Example:

```text
/api/recalls/2020/Honda/Civic
```

```text
GET /api/nearby-shops?location=<location>
```

Finds nearby vehicle service shops.

This route uses:

- Nominatim to convert the location into latitude and longitude
- Geoapify Places API to find nearby vehicle service places

Example:

```text
/api/nearby-shops?location=College%20Park%2C%20MD
```

## Known Bugs and Limitations

- Maintenance recommendations are based on simple mileage rules, not manufacturer-specific maintenance schedules.
- Recall checks use year, make, and model, so they are not as specific as VIN-based recall checks.
- Nearby shop results depend on Geoapify and OpenStreetMap data, so some results may be incomplete.
- The app does not have user login yet.
- Deleting a vehicle does not automatically delete service records connected to that vehicle.
- The app is mostly designed for desktop browsers.

## Future Development Roadmap

Future improvements could include:

- Add user login and user-specific data
- Add VIN-based recall checks
- Add manufacturer-specific maintenance schedules
- Add due soon and overdue labels
- Add time-based maintenance reminders
- Add a maintenance calendar
- Improve mobile styling
- Add automated tests
- Connect nearby shops to saved service records
- Add better error handling for failed API requests

## Deployment Notes

This project is intended to be deployed on Vercel.

Before deployment:

1. Push the project to a public GitHub repository.
2. Make sure `.env` is not pushed to GitHub.
3. Add environment variables in Vercel:
   - `SUPABASE_URL`
   - `SUPABASE_KEY`
   - `GEOAPIFY_KEY`
   - `PORT`
4. Deploy the project on Vercel.
5. Test all pages and API features on the deployed link.