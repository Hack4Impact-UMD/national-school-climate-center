// Firebase Auth never returns a user's password to the client, so the
// "view password" feature on the Account page has no real value to show.
// We mirror the most recently set password in localStorage purely so the UI
// can display it after a change.
//
// SECURITY NOTE: storing a plaintext password in localStorage is NOT secure
// and should not be relied on for anything beyond this display affordance.
const STORAGE_KEY = 'nscc_account_password'

export function getStoredPassword(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

export function setStoredPassword(password: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, password)
  } catch {
    // ignore storage failures (e.g. private mode / quota)
  }
}
