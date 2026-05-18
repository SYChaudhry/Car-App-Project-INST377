# Developer Manual

## Overview

Gearly is a car maintenance web application. It allows users to save vehicles, track service history, view maintenance recommendations, check vehicle recalls, and search for nearby service shops. This manual is for future developers who may work on the project.

## How to Install the Application

1. Clone the GitHub repository.
2. Move into the project folder: cd Car-App-Project-INST377
3. Install dependencies: npm install

The main dependencies are:

- express
- dotenv
- @supabase/supabase-js
- nodemon (dev only)

## Environment Variables

Create a .env file in the main project folder with the following keys:

- SUPABASE_URL=your_supabase_project_url
- SUPABASE_KEY=your_supabase_key
- GEOAPIFY_KEY=your_geoapify_key
- PORT=3000

Make sure .env is listed in .gitignore.

## How to Run the Application

Run locally with auto-reload: npm run dev

Then open: http://localhost:3000

Run without nodemon: npm start

## How to Run Tests

There are no automated tests written for this project yet. The project was tested manually by checking that users can:

- Add, edit, and delete vehicles
- Add, edit, and delete service records
- View vehicles on the dashboard
- Check recall information
- Search nearby shops
- View shop results on the map

## Server API Endpoints

### Page Routes

| Method | Path | Purpose |
|---|---|---|
| GET | `/` | Loads the Dashboard page |
| GET | `/garage` | Loads the Garage page |
| GET | `/service-history` | Loads the Service History page |
| GET | `/nearby-shops` | Loads the Nearby Shops page |
| GET | `/about` | Loads the About page |

### Vehicle API

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/vehicles` | Get all saved vehicles |
| POST | `/api/vehicles` | Add a new vehicle |
| PUT | `/api/vehicles/:id` | Update a saved vehicle |
| DELETE | `/api/vehicles/:id` | Delete a saved vehicle |

### Service History API

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/service-history` | Get all saved service records |
| POST | `/api/service-history` | Add a service record |
| PUT | `/api/service-history/:id` | Update a service record |
| DELETE | `/api/service-history/:id` | Delete a service record |

### External API Routes

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/recalls/:year/:make/:model` | Recall data from NHTSA |
| GET | `/api/nearby-shops?location=<location>` | Nearby shops via Nominatim + Geoapify |

## Known Bugs and Limitations

- Recall checks use year/make/model, not VIN
- Maintenance recommendations are based on simple mileage thresholds
- Nearby shop results depend on external map and place data
- The app does not have user login yet
- Deleting a vehicle does not automatically delete its service records

## Future Development Roadmap

- Add user login
- Add VIN-based recall checks
- Add better maintenance reminders
- Add a maintenance calendar
- Improve mobile styling
- Add automated tests
