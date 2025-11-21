import type { Timestamp } from 'firebase/firestore'

export type Role = 'super_admin' | 'admin' | 'student' | 'school_personnel'

export type Action = 'read' | 'create' | 'update' | 'delete' | 'manage_users'

export type Member = {
  id: string
  email?: string
  role: Role
  joinedAt?: Timestamp | null
  displayName?: string
}
