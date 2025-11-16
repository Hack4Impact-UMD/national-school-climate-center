import type { Role, Action } from '@/types/auth'

export type { Role, Action }

const policy: Record<Role, Action[]> = {
  super_admin: ['read', 'create', 'update', 'delete', 'manage_users'],
  admin: ['read', 'create', 'update', 'delete', 'manage_users'],
  student: ['read'],
  school_personnel: ['read'],
}

export function can(role: Role | null | undefined, action: Action): boolean {
  if (!role) return false // deny by default
  return policy[role].includes(action)
}
