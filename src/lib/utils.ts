import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Timestamp } from 'firebase/firestore'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function formatTimestamp(timestamp: Timestamp | null | undefined): string {
  if (!timestamp || typeof timestamp !== 'object' || !('seconds' in timestamp)) {
    return '-'
  }
  return new Date(timestamp.seconds * 1000).toLocaleString()
}
