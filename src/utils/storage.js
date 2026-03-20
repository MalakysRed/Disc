export function storageGet(key) {
  try {
    const v = localStorage.getItem(key)
    return v ? JSON.parse(v) : null
  } catch {
    return null
  }
}

export function storageSet(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch {
    // storage unavailable
  }
}
