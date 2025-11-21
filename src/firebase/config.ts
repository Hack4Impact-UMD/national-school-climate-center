import { initializeApp } from 'firebase/app'
import {
  initializeAppCheck,
  ReCaptchaV3Provider,
  getToken,
  type AppCheck,
} from 'firebase/app-check'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)

declare global {
  interface Window {
    FIREBASE_APPCHECK_DEBUG_TOKEN?: string | boolean
  }
}

const reCaptchaSiteKey = import.meta.env.VITE_FIREBASE_RECAPTCHA_SITE_KEY

if (window.location.hostname === 'localhost') {
  window.FIREBASE_APPCHECK_DEBUG_TOKEN = true
}
let appCheck: AppCheck | null = null

if (reCaptchaSiteKey) {
  appCheck = initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(reCaptchaSiteKey),
    isTokenAutoRefreshEnabled: true,
  })
} else {
  console.warn(
    'Firebase reCAPTCHA App Check is not initialized because VITE_FIREBASE_RECAPTCHA_SITE_KEY not set.'
  )
}

export const appCheckInitialized = (async () => {
  if (!appCheck) {
    return null
  }

  try {
    await getToken(appCheck)
  } catch (error) {
    console.warn('Firebase App Check token could not be acquired', error)
  }

  return appCheck
})()

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
export const googleProvider = new GoogleAuthProvider()
export default app
