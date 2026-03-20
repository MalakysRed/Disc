// api/polar-push.js
// Pushes a structured workout to Polar Flow calendar
//
// Converts a plan session (with segments and target watts) into
// a Polar Training Plan phase workout that appears on the device

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method not allowed')
  }

  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing access token' })
  }

  const accessToken = authHeader.slice(7)
  const { workout, date, ftp } = req.body

  if (!workout || !date || !ftp) {
    return res.status(400).json({ error: 'Missing workout, date or ftp' })
  }

  try {
    // Convert plan segments into Polar training targets
    const polarWorkout = buildPolarWorkout(workout, date, ftp)

    const response = await fetch(
      'https://www.polaraccesslink.com/v3/training-plan-phases',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(polarWorkout),
      }
    )

    if (!response.ok) {
      const err = await response.text()
      throw new Error(`Polar push failed: ${response.status} — ${err}`)
    }

    const result = await response.json()
    return res.status(200).json({ success: true, polarId: result.id })

  } catch (err) {
    console.error('Polar push error:', err)
    return res.status(500).json({ error: err.message })
  }
}

// ─── BUILD POLAR WORKOUT FORMAT ──────────────────────────────────────────────

function buildPolarWorkout(workout, date, ftp) {
  const phases = workout.segs
    .filter(seg => seg.m > 0)
    .map(seg => buildPhase(seg, ftp))

  return {
    name: workout.title,
    sport: 'CYCLING',
    start: `${date}T00:00:00`,
    planned: true,
    exercises: [
      {
        name: workout.title,
        sport: 'CYCLING',
        phases,
      }
    ],
  }
}

function buildPhase(seg, ftp) {
  const durationSecs = Math.round(seg.m * 60)
  const zone = seg.z

  // Target power range from zone
  const powerTargets = {
    1: { lo: 0,               hi: Math.round(ftp * 0.55) },
    2: { lo: Math.round(ftp * 0.56), hi: Math.round(ftp * 0.75) },
    3: { lo: Math.round(ftp * 0.76), hi: Math.round(ftp * 0.90) },
    4: { lo: Math.round(ftp * 0.91), hi: Math.round(ftp * 1.05) },
    5: { lo: Math.round(ftp * 1.06), hi: Math.round(ftp * 1.30) },
  }

  const target = powerTargets[zone] || powerTargets[2]

  return {
    name: seg.lbl,
    duration: { seconds: durationSecs },
    'power-target': {
      min: target.lo,
      max: target.hi,
    },
  }
}
