# Project Plan — London → Brighton Training App

**Target event:** BHF London to Brighton Bike Ride — 21 June 2026
**Stack:** React (Vite) + Netlify + Polar Accesslink API v3

---

## Phases

### Phase 1 — Standalone Plan App ✅
- [x] FTP-derived power zone calculator
- [x] 15-week polarised road cycling training plan
- [x] Workout detail with zone timeline charts and segment tables
- [x] Weekly 80/20 aerobic balance tracker
- [x] localStorage persistence

### Phase 2 — Polar Read Integration
- [ ] OAuth2 login flow (Netlify function: `polar-auth`)
- [ ] Pull completed activities from Polar Accesslink API
- [ ] Auto-match completed rides to plan sessions
- [ ] Show actual vs planned comparison per session
- [ ] Auto-tick completed sessions

### Phase 3 — Polar Write Integration
- [ ] Push structured workouts to Polar Flow calendar
- [ ] Segments with target watts and HR zones on Polar device
- [ ] Auto-mark sessions complete after ride detected

---

## Current Status

| Area | Status | Notes |
|------|--------|-------|
| Training plan UI | Done | All 15 weeks, FTP calculator, charts |
| Polar OAuth | Not started | Needs Client ID/Secret from developer.polar.com |
| Polar read | Not started | Phase 2 |
| Polar write | Not started | Phase 3 |
| Vercel deploy | Ready | `vercel.json` configured |

---

## Key Files

| File | Purpose |
|------|---------|
| `src/app.jsx` | Main React app |
| `src/data/workouts.js` | All workout definitions |
| `src/data/weeks.js` | 15-week plan structure |
| `src/utils/zones.js` | Zone calculation logic |
| `src/polar/auth.js` | OAuth2 flow |
| `src/polar/workouts.js` | Push workouts to Polar Flow |
| `src/polar/activities.js` | Pull completed activities |
| `api/polar-auth.js` | OAuth callback handler |
| `api/polar-push.js` | Push workout to Polar |
| `api/polar-pull.js` | Pull activity from Polar |

---

## Environment Variables Required

```
POLAR_CLIENT_ID=
POLAR_CLIENT_SECRET=
POLAR_REDIRECT_URI=https://YOUR-SITE.vercel.app/api/polar-auth
```

---

## Next Actions

1. Register app at developer.polar.com and obtain Client ID / Secret
2. Deploy to Netlify and set environment variables
3. Implement Phase 2 OAuth flow and activity pull
