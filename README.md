# Gearly

## Description

Gearly is a car maintenance web application that helps car owners track vehicle information, maintenance reminders, service history, safety recalls, and nearby service places in one centralized system.

Many car owners do not have a quick and easy way to track vehicle maintenance. They often have to check through messy, disorganized, or easily lost paper records. Some car brands provide their own websites or apps for garage setup, maintenance tracking, and service history, but those systems are usually reserved for their brand. If a person owns multiple cars from different brands, it can be difficult to manage all of that information in one place.

Gearly addresses this problem by helping users add vehicles by year, make, model, and mileage, view mileage-based maintenance recommendations, log service history, check recall information, and search for nearby auto service shops. The app is designed for everyday car owners, student drivers, first-time car owners, DIY car users, and drivers who use repair shops or dealerships and want a clear history of work done.

## Main Features

- Add, view, edit, and delete vehicles in a saved garage
- Track vehicle year, make, model, and current mileage
- View mileage-based maintenance recommendations
- Log service history, including service type, date, mileage, cost, and notes
- Edit or delete service records when needed
- Check vehicle recall information using NHTSA recall data
- Search for nearby service shops using location-based APIs
- View nearby service places on an interactive map

## Technology Used

Gearly uses HTML, CSS, JavaScript, Node.js, Express, Supabase, Fetch API, SweetAlert2, Leaflet.js, NHTSA Recall API, Nominatim, and Geoapify Places API.

The frontend sends form data to the backend, the backend stores and retrieves user data from Supabase, and external APIs provide recall and nearby shop information. The backend then sends processed data back to the frontend so the app can display vehicles, maintenance recommendations, service records, recalls, and nearby shop results.

## Target Browsers

Gearly is designed for desktop browsers, including:

- Google Chrome
- Microsoft Edge
- Firefox
- Safari

The application is mainly designed for desktop use, but the CSS includes styling for smaller screens.

## Developer Manual

The Developer Manual can be found here:
[Developer Manual](docs/developer-manual.md)



-------------------------------------------------

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

