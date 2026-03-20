// ─── RIDE STATS ───────────────────────────────────────────────────────────────

export function calcStats(segs, zones) {
  if (!segs?.length) return null
  const total = segs.reduce((a, s) => a + s.m, 0)
  const weighted = segs.reduce((a, s) => a + zones[s.z - 1].target * s.m, 0)
  const avgW = Math.round(weighted / total)
  const easyMins = segs.filter(s => s.z <= 2).reduce((a, s) => a + s.m, 0)
  return {
    avgW,
    totalMins: total,
    easyPct: Math.round((easyMins / total) * 100),
    kj: Math.round(avgW * total * 60 / 1000),
  }
}

export function timeStr(secs) {
  const m = Math.floor(secs / 60)
  const s = Math.round(secs % 60)
  return `${m}m ${s.toString().padStart(2, '0')}s`
}
