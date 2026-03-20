// ─── ZONE DEFINITIONS ────────────────────────────────────────────────────────

export function buildZones(ftp, maxHR) {
  return [
    {
      z: 1, name: 'Recovery', short: 'Z1', color: '#94a3b8',
      lo: 0,                     hi: Math.round(ftp * 0.55),
      hrLo: 0,                   hrHi: Math.round(maxHR * 0.60),
      target: Math.round(ftp * 0.50), pct: '<55%',
    },
    {
      z: 2, name: 'Endurance', short: 'Z2', color: '#4ade80',
      lo: Math.round(ftp * 0.56), hi: Math.round(ftp * 0.75),
      hrLo: Math.round(maxHR * 0.60), hrHi: Math.round(maxHR * 0.70),
      target: Math.round(ftp * 0.65), pct: '56-75%',
    },
    {
      z: 3, name: 'Tempo', short: 'Z3', color: '#fbbf24',
      lo: Math.round(ftp * 0.76), hi: Math.round(ftp * 0.90),
      hrLo: Math.round(maxHR * 0.70), hrHi: Math.round(maxHR * 0.80),
      target: Math.round(ftp * 0.83), pct: '76-90%',
    },
    {
      z: 4, name: 'Threshold', short: 'Z4', color: '#f97316',
      lo: Math.round(ftp * 0.91), hi: Math.round(ftp * 1.05),
      hrLo: Math.round(maxHR * 0.80), hrHi: Math.round(maxHR * 0.90),
      target: Math.round(ftp * 0.98), pct: '91-105%',
    },
    {
      z: 5, name: 'VO2 Max', short: 'Z5', color: '#f87171',
      lo: Math.round(ftp * 1.06), hi: 9999,
      hrLo: Math.round(maxHR * 0.90), hrHi: maxHR,
      target: Math.round(ftp * 1.15), pct: '>106%',
    },
  ]
}
