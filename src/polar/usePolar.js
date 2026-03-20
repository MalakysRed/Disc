// src/polar/usePolar.js
// React hook for Polar API integration
//
// Handles:
//   - OAuth2 login/logout
//   - Pushing workouts to Polar Flow
//   - Pulling completed activities

import { useState, useEffect, useCallback } from 'react'

const POLAR_CLIENT_ID    = import.meta.env.VITE_POLAR_CLIENT_ID
const POLAR_REDIRECT_URI = import.meta.env.VITE_POLAR_REDIRECT_URI
const STORAGE_KEY_TOKEN  = 'disc-cycle-polar-token'
const STORAGE_KEY_USER   = 'disc-cycle-polar-user'

export function usePolar() {
  const [accessToken, setAccessToken] = useState(null)
  const [userId,      setUserId]      = useState(null)
  const [loading,     setLoading]     = useState(false)
  const [error,       setError]       = useState(null)

  // ── Load saved token on mount ──────────────────────────────────────────────
  useEffect(() => {
    // Check for token returned in URL hash after OAuth redirect
    const hash = window.location.hash
    if (hash.includes('polar_auth=')) {
      const params = new URLSearchParams(hash.split('polar_auth=')[1])
      const token  = params.get('access_token')
      const uid    = params.get('user_id')
      if (token) {
        setAccessToken(token)
        setUserId(uid)
        try {
          localStorage.setItem(STORAGE_KEY_TOKEN, token)
          localStorage.setItem(STORAGE_KEY_USER, uid || '')
        } catch {}
        // Clean the hash from the URL
        window.history.replaceState({}, '', window.location.pathname)
      }
      return
    }

    // Load from storage
    try {
      const t = localStorage.getItem(STORAGE_KEY_TOKEN)
      const u = localStorage.getItem(STORAGE_KEY_USER)
      if (t) { setAccessToken(t); setUserId(u) }
    } catch {}
  }, [])

  // ── Login ──────────────────────────────────────────────────────────────────
  const login = useCallback(() => {
    if (!POLAR_CLIENT_ID) {
      setError('Polar Client ID not configured. Check your environment variables.')
      return
    }
    const params = new URLSearchParams({
      client_id:     POLAR_CLIENT_ID,
      response_type: 'code',
      redirect_uri:  POLAR_REDIRECT_URI,
      scope:         'accesslink.read_all',
    })
    window.location.href = `https://flow.polar.com/oauth2/authorization?${params}`
  }, [])

  // ── Logout ─────────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    setAccessToken(null)
    setUserId(null)
    try {
      localStorage.removeItem(STORAGE_KEY_TOKEN)
      localStorage.removeItem(STORAGE_KEY_USER)
    } catch {}
  }, [])

  // ── Push workout to Polar Flow ─────────────────────────────────────────────
  const pushWorkout = useCallback(async (workout, date, ftp) => {
    if (!accessToken) throw new Error('Not connected to Polar')
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/polar-push', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type':  'application/json',
        },
        body: JSON.stringify({ workout, date, ftp }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Push failed')
      }
      return await res.json()
    } finally {
      setLoading(false)
    }
  }, [accessToken])

  // ── Pull new activities from Polar ─────────────────────────────────────────
  const pullActivities = useCallback(async () => {
    if (!accessToken) throw new Error('Not connected to Polar')
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/polar-pull', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${accessToken}` },
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Pull failed')
      }
      return await res.json()
    } finally {
      setLoading(false)
    }
  }, [accessToken])

  return {
    isConnected: !!accessToken,
    userId,
    loading,
    error,
    login,
    logout,
    pushWorkout,
    pullActivities,
  }
}
