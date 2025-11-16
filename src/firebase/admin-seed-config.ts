// src/firebase/admin-seed-config.ts
import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import fs from 'node:fs'
import path from 'node:path'

// Resolve path to service account JSON
const serviceAccountPath = path.resolve(
  process.cwd(),
  'src/firebase/service-account.json'
)

if (!fs.existsSync(serviceAccountPath)) {
  throw new Error(`Service account file not found at: ${serviceAccountPath}`)
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'))

// Initialize Admin SDK
const app = initializeApp({
  credential: cert(serviceAccount),
})

export const db = getFirestore(app)
