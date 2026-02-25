# Conversion Tracking Demo Site

A demo e-commerce site for testing the Rebrandly Conversion Tracking API and SDK. It simulates a simple online store where every user interaction (page views, purchases, signups) is tracked via the SDK, with a built-in debug panel to inspect events in real time.

> **Note:** This site is currently configured to use the **test environment** APIs and SDK (`tracking.api.test.rebrandly.com` / `custom.test.rebrandly.com`). See the [Environment variables](#environment-variables) section to configure it.

## Features

- **Product catalog** — Browse and view product detail pages, triggering `page_view` events on navigation
- **Purchase flow** — "Buy Now" triggers a `purchase` event with order ID, product info, price and currency
- **Signup form** — Mock registration that fires a `signup` event
- **Deduplication testing** — "Buy Again (Fixed Order ID)" button and repeated email signup to verify dedup behavior
- **Debug panel** — Side panel with tabs for:
  - **Events** — Live log of all tracked events with status, duration, and expandable payload details
  - **Dedup** — Deduplication cache stats and per-event breakdown
  - **Queue** — Queued events and processor status
  - **Config** — Current SDK configuration, environment variables, and localStorage state
  - **Actions** — Utility actions (set test click ID, clear dedup cache, clear/process queue, trigger domain verification)

## Tech stack

- React 19, TypeScript, Vite 7
- Tailwind CSS 4
- React Router 7

## Getting started

### Prerequisites

- Node.js (v18+)
- npm

### Installation

```bash
npm install
```

### Environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `VITE_SDK_URL` | URL to the `rbly.js` SDK bundle. Use `/sdk/rbly.js` for local dev (served by Vite from the SDK project) or a full URL for test/production |
| `VITE_API_BASE` | Conversion Tracking API base URL (e.g. `http://localhost:3000` or `https://tracking.api.test.rebrandly.com`) |
| `VITE_API_KEY` | Rebrandly API key for SDK initialization |

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
npm run preview  # preview the production build locally
```
