import type { ReactNode } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { can, type Action } from '@/pages/auth/rbac'

export function Guard({
  do: action,
  fallback = null,
  children,
}: {
  do: Action
  fallback?: ReactNode
  children: ReactNode
}) {
  const { role } = useAuth()
  return can(role, action) ? <>{children}</> : <>{fallback}</>
}