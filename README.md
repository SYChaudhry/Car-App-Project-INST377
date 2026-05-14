# Gearly

## Description

Gearly is a car maintenance web application that helps car owners track vehicle information, maintenance reminders, service history, safety recalls, and nearby service places in one organized system.

Many car owners do not have a quick and easy way to track vehicle maintenance. They often have to check through messy, disorganized, or easily lost paper records. Some car brands provide their own websites or apps for garage setup, maintenance tracking, and service history, but those systems are usually brand-specific. If a person owns multiple cars from different brands, it can be difficult to manage all of that information in one place.

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

Gearly is designed for contemporary desktop browsers, including:

- Google Chrome
- Microsoft Edge
- Firefox
- Safari

The application is mainly designed for desktop use, but the CSS includes responsive styling for smaller screens.

## Developer Manual

The Developer Manual can be found here:

[Developer Manual](docs/developer-manual.md)