import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { AlertTriangle } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { can } from '@/pages/auth/rbac'

export function AdminOnlyRoute() {
  const { user, role, loading } = useAuth()
  const [shouldShowUnauthorized, setShouldShowUnauthorized] = useState(false)

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-body font-body">Loading...</p>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Check if user has admin permissions
  const isAdmin = can(role, 'manage_users')

  // Show "Not Authorized" message then redirect
  if (!isAdmin) {
    if (!shouldShowUnauthorized) {
      setShouldShowUnauthorized(true)
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
              You do not have permission to access this page. Admin access is
              required.
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

  return <Outlet />
}

// Helper component to handle redirect after showing message
function RedirectToLogin() {
  const [shouldRedirect, setShouldRedirect] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldRedirect(true)
    }, 2000) // Show message for 2 seconds before redirecting

    return () => clearTimeout(timer)
  }, [])

  if (shouldRedirect) {
    return <Navigate to="/login" replace />
  }

  return null
}
