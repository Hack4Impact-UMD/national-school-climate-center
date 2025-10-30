import { Link, useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { useAuth } from '@/contexts/AuthContext'
import { can } from '@/pages/auth/rbac'
import { auth } from '@/firebase/config'

export default function NavBar() {
  const { user, role } = useAuth()
  const navigate = useNavigate()

  const getRoleLabel = () => {
    if (!role) return 'Guest'
    return role === 'admin' ? 'NSCC Admin' : 'School Personnel'
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      navigate('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <nav className="bg-primary text-primary-foreground min-h-screen w-80 pr-6">
      <div className="flex items-center p-4">
        <div className="w-16 h-16 rounded-full bg-gray-300 overflow-hidden">
          <img src="" alt="User avatar" className="w-full h-full object-cover" />
        </div>
        <div className="ml-4">
          <h3 className="font-heading text-2xl text-heading text-white">
            {user?.email?.split('@')[0] || 'Username'}
          </h3>
          <p className="font-body text-base text-body text-white">
            {getRoleLabel()}
          </p>
        </div>
      </div>

      <div className="ml-5 text-white mt-28">
        {can(role, 'create') && (
          <>
            <p className="font-body text-base text-body text-white">
              Survey Creation
            </p>
            <div className="mt-3 ml-7 text-lg mb-20 space-y-2">
              <Link
                to="/surveys/builder"
                className="flex items-center justify-between hover:opacity-80 transition-opacity"
              >
                <h3 className="font-heading text-2xl text-heading text-white mb-1">
                  Survey Builder
                </h3>
                <span className="font-heading text-2xl text-white">ᐳ</span>
              </Link>
              <Link
                to="/surveys"
                className="flex items-center justify-between hover:opacity-80 transition-opacity"
              >
                <h3 className="font-heading text-2xl text-heading text-white mb-1">
                  All Surveys
                </h3>
                <span className="font-heading text-2xl text-white">ᐳ</span>
              </Link>
              <Link
                to="/analytics"
                className="flex items-center justify-between hover:opacity-80 transition-opacity"
              >
                <h3 className="font-heading text-2xl text-heading text-white">
                  Survey Analytics
                </h3>
                <span className="font-heading text-2xl text-white">ᐳ</span>
              </Link>
            </div>
          </>
        )}

        {can(role, 'read') && (
          <>
            <p className="font-body text-base text-body text-white">
              {can(role, 'manage_users') ? 'Settings' : 'Dashboard'}
            </p>
            <div className="mt-3 ml-7 text-lg space-y-2">
              <Link
                to="/settings"
                className="flex items-center justify-between hover:opacity-80 transition-opacity"
              >
                <h3 className="font-heading text-2xl text-heading text-white mb-1">
                  General
                </h3>
                <span className="font-heading text-2xl text-white">ᐳ</span>
              </Link>
              {can(role, 'manage_users') && (
                <Link
                  to="/manage-users"
                  className="flex items-center justify-between hover:opacity-80 transition-opacity"
                >
                  <h3 className="font-heading text-2xl text-heading text-white mb-1">
                    Manage Users
                  </h3>
                  <span className="font-heading text-2xl text-white">ᐳ</span>
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center justify-between hover:opacity-80 transition-opacity w-full text-left"
              >
                <h3 className="font-heading text-2xl text-heading text-white mb-1">
                  Logout
                </h3>
                <span className="font-heading text-2xl text-white">ᐳ</span>
              </button>
            </div>
          </>
        )}
      </div>
    </nav>
  )
}