export type Role = 'admin' | 'school_personnel'
export type Action = 'read' | 'create' | 'update' | 'delete' | 'manage_users'

const policy: Record<Role, Action[]> = {
  admin: ['read', 'create', 'update', 'delete', 'manage_users'],
  school_personnel: ['read'],
}

export function can(role: Role | null | undefined, action: Action): boolean {
  if (!role) return false // deny by default
  return policy[role].includes(action)
}
