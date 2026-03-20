# Project Plan — London → Brighton Training App

**Target event:** BHF London to Brighton Bike Ride — 21 June 2026
**Stack:** React (Vite) + Vercel + Polar Accesslink API v3

---

## Phases

### Phase 1 — Standalone Plan App ✅
- [x] FTP-derived power zone calculator
- [x] 15-week polarised road cycling training plan
- [x] Workout detail with zone timeline charts and segment tables
- [x] Weekly 80/20 aerobic balance tracker
- [x] localStorage persistence
- [x] Deployed to Vercel at https://disc-cycle.vercel.app

### Phase 2 — Polar Read Integration
- [ ] OAuth2 login UI (connect/disconnect button in app)
- [ ] OAuth2 callback handler (`api/polar-auth.js` — scaffolded, not wired to UI)
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
| Vercel deploy | Live | https://disc-cycle.vercel.app |
| Polar credentials | Configured | Client ID/Secret set in Vercel env vars |
| Polar OAuth UI | Not started | `usePolar.js` hook ready, no UI wired yet |
| Polar read | Not started | Phase 2 |
| Polar write | Not started | Phase 3 |

---

## Key Files

| File | Purpose |
|------|---------|
| `src/app.jsx` | Main React app |
| `src/data/workouts.js` | All workout definitions |
| `src/data/weeks.js` | 15-week plan structure |
| `src/utils/zones.js` | Zone calculation logic |
| `src/utils/storage.js` | localStorage helpers |
| `src/polar/usePolar.js` | Polar OAuth hook (login, logout, push, pull) |
| `api/polar-auth.js` | OAuth callback handler (Vercel serverless) |
| `api/polar-push.js` | Push workout to Polar (Vercel serverless) |
| `api/polar-pull.js` | Pull activity from Polar (Vercel serverless) |

---

## Environment Variables

Set in Vercel dashboard and local `.env`:

```
POLAR_CLIENT_ID=d7d30865-14f5-4460-af5a-03ee76d54bb9
POLAR_CLIENT_SECRET=84b1d0f0-9358-417e-adb4-33c1fc335dd8
POLAR_REDIRECT_URI=https://disc-cycle.vercel.app/api/polar-auth
VITE_POLAR_CLIENT_ID=d7d30865-14f5-4460-af5a-03ee76d54bb9
VITE_POLAR_REDIRECT_URI=https://disc-cycle.vercel.app/api/polar-auth
```

---

## Next Actions

1. Build Phase 2 OAuth UI — connect/disconnect button, show Polar connection status
2. Wire `usePolar.js` hook into `app.jsx`
3. Implement activity pull and session matching
