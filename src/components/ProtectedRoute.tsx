import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { AlertTriangle } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { can, type Action } from '@/pages/auth/rbac'
import { LoadingSpinner } from '@/components/LoadingSpinner'

const UNAUTHORIZED_REDIRECT_DELAY_MS = 2000

interface ProtectedRouteProps {
  requiredAction?: Action
  requireAuth?: boolean
}

export function ProtectedRoute({
  requiredAction,
  requireAuth = true,
}: ProtectedRouteProps) {
  const { user, role, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  if (requireAuth && !user) {
    return <Navigate to="/login" replace />
  }

  if (requiredAction && !can(role, requiredAction)) {
    return <UnauthorizedMessage requiredAction={requiredAction} />
  }

  return <Outlet />
}

interface UnauthorizedMessageProps {
  requiredAction: Action
}

function UnauthorizedMessage({ requiredAction }: UnauthorizedMessageProps) {
  const actionMessages: Record<Action, string> = {
    manage_users: 'Admin access is required.',
    create: 'You need permission to create content.',
    update: 'You need permission to update content.',
    delete: 'You need permission to delete content.',
    read: 'You need permission to view this content.',
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full mx-auto p-6 text-center">
        <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-red-200">
          <div className="mb-4">
            <AlertTriangle className="mx-auto h-16 w-16 text-red-500" />
          </div>
          <h2 className="font-heading text-2xl font-bold text-heading mb-2">
            Not Authorized
          </h2>
          <p className="font-body text-body mb-6">
            {actionMessages[requiredAction]}
          </p>
          <p className="font-body text-sm text-body/70">
            Redirecting to login...
          </p>
        </div>
      </div>
      <RedirectToLogin />
    </div>
  )
}

function RedirectToLogin() {
  const [shouldRedirect, setShouldRedirect] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldRedirect(true)
    }, UNAUTHORIZED_REDIRECT_DELAY_MS)

    return () => clearTimeout(timer)
  }, [])

  if (shouldRedirect) {
    return <Navigate to="/login" replace />
  }

  return null
}
