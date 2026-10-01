# SuntAici

A React and TypeScript safety-community prototype with a small Node.js API.

## Run locally

Requires Node.js 16 or later and npm.

```sh
npm install
npm run server
```

In a second terminal, from this directory:

```sh
npm run dev
```

Open the Vite URL printed in the terminal (normally `http://localhost:5173`). The frontend proxies `/api` requests to the API on port 3001. Override that port with `API_PORT` if needed.

## Deploy to Render

The `render.yaml` Blueprint builds the React app and serves it with the Node API as one web service. Push this project to a GitHub repository, then in Render choose **New > Blueprint**, connect the repository, and apply the `render.yaml` configuration. Render builds with `npm ci && npm run build`, starts with `npm start`, and checks `/api/health`.

The included Blueprint uses Render's free plan to avoid unexpected charges. Free services may sleep when idle and have cold starts; this prototype is not suitable for emergency response or reliable safety alerts.

## Included flows

- Safety check-in status
- Community outfit check-ins with an optional selfie preview
- Profile details and one trusted contact, held only in the current browser session
- Private incident reports with map pins and victim/abuser/action descriptions
- Domestic-violence notes with session-only evidence photo previews, a private journal, and abuse education cards
- Romanian emergency call links for 112 and the ANES domestic violence helpline at 0800 500 333
- Sample nearby police, hospitals, gynecology clinics, and pharmacies with external map directions

## Prototype limitations

This is not an emergency-response service. Profile, contact, incident, journal, evidence, and feed data are held only in browser memory; they are not password-protected and disappear when the session ends. Use a trusted device. OpenStreetMap receives requests for map tiles and the areas viewed, but this demo does not send report text or pin data to the map provider. Nearby locations and distances are sample Bucharest listings, not verified live results. The 16-hour reminder is shown as a concept only: there is no background monitoring, SMS, push notification, or trusted-contact alert. A production release needs secure accounts and storage, verified local listings, explicit consent, a reliable notification provider, and safety/privacy review.