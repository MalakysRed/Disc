// ─── 15-WEEK PLAN ─────────────────────────────────────────────────────────────
//
// Day layout: Mon(0) Tue(1) Wed(2) Thu(3) Fri(4) Sat(5) Sun(6)
//
// Rules:
//   • All Sundays = rest (original Sunday session moved to Monday)
//   • FTP test weeks: Fri = [ftp_test, sc_X] — no separate interval session
//   • Normal weeks: Fri = [interval, sc_X]
//   • Recovery weeks: follow original BHF PDF layout exactly
//     Mon=rest, Tue=SC, Wed=rest, Thu=hard_bursts, Fri=rest, Sat=easy/long, Sun=rest
//   • Recovery weeks sit immediately before each FTP test week
//
// FTP TEST FRIDAYS: W1 13 Mar · W5 10 Apr · W9 8 May · W13 5 Jun
// RECOVERY WEEKS:  W4 (before W5) · W8 (before W9) · W12 (before W13)

export const WEEKS = [
  { n:1,  dates:'9–15 Mar',    phase:'BASE',       ftpWeek:true,
    days:['easy_45','easy_30','rest','long_45',['ftp_test','sc_30'],'long_60_flat','rest'] },

  { n:2,  dates:'16–22 Mar',   phase:'BUILD',
    days:['easy_60','easy_30','rest','rest',['hard_45_bursts','sc_30'],'long_90','rest'] },

  { n:3,  dates:'23–29 Mar',   phase:'BUILD',
    days:['easy_60','easy_45','rest','rest',['hard_45_bursts','sc_30'],'steady_2hr','rest'] },

  { n:4,  dates:'30 Mar–5 Apr',phase:'RECOVERY',   recoveryWeek:true,
    days:['rest','sc_30','rest','hard_45_bursts','rest','long_90','rest'] },

  { n:5,  dates:'6–12 Apr',    phase:'BUILD',      ftpWeek:true,
    days:['long_60_rolling','rest','easy_45','rest',['ftp_test','sc_45'],'steady_2hr30','rest'] },

  { n:6,  dates:'13–19 Apr',   phase:'PEAK',
    days:['long_60_rolling','rest','easy_45','rest',['hard_45_4x5','sc_45'],'steady_3hr','rest'] },

  { n:7,  dates:'20–26 Apr',   phase:'PEAK',
    days:['long_60_rolling','rest','easy_45','rest',['hard_45_4x5','sc_45'],'practice_3hr','rest'] },

  { n:8,  dates:'27 Apr–3 May',phase:'RECOVERY',   recoveryWeek:true,
    days:['rest','sc_45','rest','hard_45_bursts','rest','easy_60','rest'] },

  { n:9,  dates:'4–10 May',    phase:'PRACTICE',   ftpWeek:true,
    days:['long_90_rolling','rest','rest','easy_30',['ftp_test','sc_60'],'practice_3hr30','rest'] },

  { n:10, dates:'11–17 May',   phase:'PEAK',
    days:['long_90_rolling','rest','rest','easy_30',['hard_60_5x5','sc_60'],'practice_4hr30','rest'] },

  { n:11, dates:'18–24 May',   phase:'PEAK',
    days:['long_90_rolling','rest','rest','easy_30',['hard_60_6x5','sc_60'],'practice_5hr','rest'] },

  { n:12, dates:'25–31 May',   phase:'RECOVERY',   recoveryWeek:true,
    days:['rest','sc_60','rest','hard_45_bursts','rest','easy_60','rest'] },

  { n:13, dates:'1–7 Jun',     phase:'BUILD DOWN', ftpWeek:true,
    days:['long_90_rolling','rest','rest','easy_30',['ftp_test','sc_60'],'practice_3hr','rest'] },

  { n:14, dates:'8–14 Jun',    phase:'TAPER',
    days:['easy_60','rest','rest','easy_30',['steady_30_brisk','sc_30'],'long_90_taper','rest'] },

  { n:15, dates:'15–21 Jun',   phase:'EVENT WEEK',
    days:['rest','steady_45','rest','rest','easy_30_sprints','easy_30','event'] },
]

export const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']

export const PHASE_COLORS = {
  'BASE':       '#60a5fa',
  'BUILD':      '#4ade80',
  'RECOVERY':   '#6b7280',
  'PEAK':       '#f87171',
  'PRACTICE':   '#34d399',
  'BUILD DOWN': '#fbbf24',
  'TAPER':      '#c084fc',
  'EVENT WEEK': '#fbbf24',
}

export const TYPE_COLORS = {
  EASY:     '#4ade80',
  LONG:     '#60a5fa',
  STEADY:   '#fbbf24',
  HARD:     '#f87171',
  SC:       '#c084fc',
  PRACTICE: '#34d399',
  REST:     '#374151',
  EVENT:    '#fbbf24',
  FTP:      '#e879f9',
}
