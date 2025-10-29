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
    <main className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="mb-4">
            <AlertTriangle className="mx-auto h-16 w-16 text-red-500" />
          </div>
          <h2 className="font-heading text-3xl font-bold text-primary mb-4">
            Not Authorized
          </h2>
          <p className="font-body text-lg text-body mb-2">
            {actionMessages[requiredAction]}
          </p>
          <p className="font-body text-sm text-body/70">
            Redirecting to login...
          </p>
        </div>
        <RedirectToLogin />
      </div>
    </main>
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
