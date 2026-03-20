const STORAGE_KEY = 'l2b-user-settings'

export function storageGet() {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    return v ? JSON.parse(v) : null
  } catch {
    return null
  }
}

export function storageSet(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // storage unavailable
  }
}
