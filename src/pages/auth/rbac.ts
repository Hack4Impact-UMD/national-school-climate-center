export type Role = 'super_admin' | 'admin' | 'student' | 'school_personnel'
export type Action = 'read' | 'create' | 'update' | 'delete' | 'manage_users'

const policy: Record<Role, Action[]> = {
  super_admin: ['read', 'create', 'update', 'delete', 'manage_users'],
  admin: ['read', 'create', 'update', 'delete', 'manage_users'],
  student: ['read'],
  school_personnel: ['read'],
}

export function can(role: Role | null | undefined, action: Action): boolean {
  if (!role) return false
  return policy[role].includes(action)
}
