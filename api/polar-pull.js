// api/polar-pull.js
// Fetches completed activities from Polar Accesslink API
//
// Called by the frontend after a ride to pull actual data
// and compare against the planned session

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method not allowed')
  }

  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing access token' })
  }

  const accessToken = authHeader.slice(7)

  try {
    // Step 1: Create a transaction to access new training data
    const txResponse = await fetch(
      'https://www.polaraccesslink.com/v3/users/transaction',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
        },
      }
    )

    if (txResponse.status === 204) {
      // No new data available
      return res.status(200).json({ activities: [], message: 'No new activities since last check' })
    }

    if (!txResponse.ok) {
      throw new Error(`Transaction failed: ${txResponse.status}`)
    }

    const transaction = await txResponse.json()
    const txResourceUrl = transaction['resource-uri']

    // Step 2: List activities in this transaction
    const listResponse = await fetch(txResourceUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
      },
    })

    if (!listResponse.ok) {
      throw new Error(`List activities failed: ${listResponse.status}`)
    }

    const listData = await listResponse.json()
    const activityUrls = listData?.exercises || []

    // Step 3: Fetch each activity's detail
    const activities = await Promise.all(
      activityUrls.map(async (url) => {
        const r = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json',
          },
        })
        return r.ok ? r.json() : null
      })
    )

    // Step 4: Commit the transaction
    await fetch(`${txResourceUrl}/commit`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${accessToken}` },
    })

    // Step 5: Extract the fields we care about
    const cleaned = activities
      .filter(Boolean)
      .map(a => ({
        id:           a.id,
        date:         a['start-time']?.split('T')[0],
        startTime:    a['start-time'],
        duration:     a.duration,
        sport:        a.sport,
        distance:     a.distance,
        calories:     a.calories,
        avgHR:        a['heart-rate']?.average,
        maxHR:        a['heart-rate']?.maximum,
        avgPower:     a['power']?.average,
        maxPower:     a['power']?.maximum,
        avgCadence:   a['cadence']?.average,
        ascent:       a['ascent'],
        trainingLoad: a['training-load'],
      }))

    return res.status(200).json({ activities: cleaned })

  } catch (err) {
    console.error('Polar pull error:', err)
    return res.status(500).json({ error: err.message })
  }
}
