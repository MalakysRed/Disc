# London → Brighton Training Plan

A personal cycling training plan app with Polar API integration.

## Features

- 15-week 80/20 polarised training plan for the BHF London to Brighton Off Road Bike Ride (21 June 2026)
- Dynamic FTP/HR zone calculator — update your FTP and all workouts recalculate instantly
- Zone timeline charts and segment tables for every session
- Weekly 80/20 aerobic balance tracker
- **Polar API integration** (Phase 2):
  - Push structured workouts to Polar Flow calendar
  - Pull completed ride data and compare against plan
  - Auto-tick completed sessions

---

## Project Structure

```
l2b-plan/
├── src/
│   ├── app.jsx          # Main React app
│   ├── data/
│   │   ├── workouts.js  # All workout definitions
│   │   └── weeks.js     # 15-week plan structure
│   ├── components/
│   │   ├── FTPPanel.jsx
│   │   ├── DayCard.jsx
│   │   ├── ZoneChart.jsx
│   │   ├── SegTable.jsx
│   │   ├── EightyTwenty.jsx
│   │   └── WeekNav.jsx
│   ├── utils/
│   │   ├── zones.js     # Zone calculation logic
│   │   └── stats.js     # Ride stats helpers
│   └── polar/
│       ├── auth.js      # OAuth2 flow
│       ├── workouts.js  # Push workouts to Polar Flow
│       └── activities.js # Pull completed activities
├── public/
│   └── index.html
├── netlify/
│   └── functions/
│       ├── polar-auth.js      # OAuth callback handler
│       ├── polar-push.js      # Push workout to Polar
│       └── polar-pull.js      # Pull activity from Polar
├── .env.example
├── netlify.toml
├── package.json
└── README.md
```

---

## Setup

### 1. Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/l2b-plan.git
cd l2b-plan
npm install
npm run dev
```

### 2. Polar API credentials

1. Go to [developer.polar.com](https://developer.polar.com)
2. Create an account and register a new application
3. Set the OAuth callback URL to: `https://YOUR-SITE.netlify.app/.netlify/functions/polar-auth`
4. Copy your Client ID and Client Secret

### 3. Environment variables

Copy `.env.example` to `.env` and fill in:

```
POLAR_CLIENT_ID=your_client_id_here
POLAR_CLIENT_SECRET=your_client_secret_here
POLAR_REDIRECT_URI=https://YOUR-SITE.netlify.app/.netlify/functions/polar-auth
```

### 4. Deploy to Netlify

```bash
npm install -g netlify-cli
netlify init
netlify deploy --prod
```

Set the same environment variables in Netlify dashboard under Site → Environment variables.

---

## Polar API Scope

This app uses the [Polar Accesslink API v3](https://www.polar.com/accesslink-api/).

**Permissions required:**
- `accesslink.read_all` — read completed training data
- Push workouts via the Training Plan API

---

## Development Phases

### Phase 1 — Standalone plan app ✅
- FTP-derived power zones
- 15-week plan with workout detail
- localStorage persistence

### Phase 2 — Polar read integration
- OAuth2 login with Polar
- Pull completed activities after each ride
- Auto-match rides to plan sessions
- Show actual vs planned comparison per session

### Phase 3 — Polar write integration
- Push structured workouts to Polar Flow calendar
- Segments with target watts and HR zones appear on Polar device
- Mark sessions complete automatically

---

## Tech Stack

- **React** (Vite)
- **Netlify** — hosting + serverless functions for Polar OAuth
- **Polar Accesslink API v3**
- No other dependencies — intentionally lightweight
