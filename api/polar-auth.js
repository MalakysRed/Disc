// api/polar-auth.js
// Handles the Polar OAuth2 callback and token exchange
//
// Flow:
//   1. Frontend redirects user to Polar authorisation URL
//   2. Polar redirects back to this function with ?code=xxx
//   3. This function exchanges the code for an access token
//   4. Token is returned to the frontend via redirect with hash params

export default async function handler(req, res) {
  const { code, error } = req.query

  // Handle OAuth errors from Polar
  if (error) {
    return res.redirect(`/?polar_error=${encodeURIComponent(error)}`)
  }

  if (!code) {
    return res.status(400).json({ error: 'Missing authorisation code' })
  }

  const clientId     = process.env.POLAR_CLIENT_ID
  const clientSecret = process.env.POLAR_CLIENT_SECRET
  const redirectUri  = process.env.POLAR_REDIRECT_URI

  if (!clientId || !clientSecret) {
    return res.status(500).json({ error: 'Polar API credentials not configured' })
  }

  try {
    // Exchange authorisation code for access token
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

    const response = await fetch('https://polarremote.com/v2/oauth2/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: new URLSearchParams({
        grant_type:   'authorization_code',
        code,
        redirect_uri: redirectUri,
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error('Polar token exchange failed:', err)
      return res.redirect(`/?polar_error=token_exchange_failed`)
    }

    const tokenData = await response.json()

    // Register the user with Polar Accesslink (required before first API call)
    await registerUser(tokenData.access_token, tokenData.x_user_id)

    // Redirect back to app with token in hash (never in query string)
    const params = new URLSearchParams({
      access_token: tokenData.access_token,
      user_id:      tokenData.x_user_id,
    })

    return res.redirect(`/#polar_auth=${params.toString()}`)

  } catch (err) {
    console.error('Polar auth error:', err)
    return res.redirect(`/?polar_error=server_error`)
  }
}

async function registerUser(accessToken, userId) {
  try {
    await fetch('https://www.polaraccesslink.com/v3/users', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ 'member-id': String(userId) }),
    })
    // 409 Conflict means already registered — that's fine
  } catch {
    // Non-fatal — user may already be registered
  }
}
