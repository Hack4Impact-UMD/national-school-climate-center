import { Link, useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { useAuth } from '@/contexts/AuthContext'
import { can } from '@/pages/auth/rbac'
import { auth } from '@/firebase/config'
import { ClipboardList, CheckSquare, BarChart3, Settings, Users } from "lucide-react"

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
    <nav className="bg-primary text-primary-foreground min-h-screen w-80 flex flex-col">
        <div className="flex items-center bg-white border border-r-primary p-2 w-80 justify-center">
            <img
                src="/logo.png"
                alt="Logo"
                className="w-56 h-auto object-contain my-5"
            />
        </div>

      <div className="px-6 text-white mt-8">
        {can(role, 'create') && (
          <>
            <h3 className="font-heading text-2xl text-heading text-white">
              Survey Creation
            </h3>
            <div className="mt-3 text-lg mb-16 space-y-2">
              <Link
                to="/surveys/builder"
                className="flex items-center gap-3 text-white hover:bg-background hover:text-body transition-colors p-2 rounded-md"
              >
                <ClipboardList className="w-5 h-5" />
                <h3 className="font-heading text-2xl text-inherit">
                  Survey Builder
                </h3>
              </Link>
              <Link
                to="/surveys"
                className="flex items-center gap-3 text-white hover:bg-background hover:text-body transition-colors p-2 rounded-md"
              >
                <CheckSquare className="w-5 h-5" />
                <h3 className="font-heading text-2xl text-inherit">
                  All Surveys
                </h3>
              </Link>
              <Link
                to="/analytics"
                className="flex items-center gap-3 text-white hover:bg-background hover:text-body transition-colors p-2 rounded-md"
              >
                <BarChart3 className="w-5 h-5" />
                <h3 className="font-heading text-2xl text-inherit">
                  Survey Analytics
                </h3>
              </Link>
            </div>
          </>
        )}

        {can(role, 'read') && (
          <>
            <p className="font-heading text-2xl text-heading text-white">
              {can(role, 'manage_users') ? 'Settings' : 'Dashboard'}
            </p>
            <div className="mt-3 text-lg space-y-2">
              <Link
                to="/general"
                className="flex items-center gap-3 text-white hover:bg-background hover:text-body transition-colors p-2 rounded-md"
              >
                <Settings className="w-5 h-5" />
                <h3 className="font-heading text-2xl text-inherit">
                  General
                </h3>
              </Link>
              {can(role, 'manage_users') && (
                <Link
                  to="/manage-users"
                  className="flex items-center gap-3 text-white hover:bg-background hover:text-body transition-colors p-2 rounded-md"
                >
                  <Users className="w-5 h-5" />
                  <h3 className="font-heading text-2xl text-inherit">
                    Manage Users
                  </h3>
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center text-white hover:bg-background hover:text-body transition-colors p-2 rounded-md w-full"
              >
                <h3 className="font-heading text-2xl text-inherit">
                  Logout
                </h3>
              </button>
            </div>
          </>
        )}
      </div>
        <div className="mt-auto">
            <div className="flex bg-background items-center gap-4 p-4 w-full rounded-t-2xl">
                <div className="w-16 h-16 rounded-full bg-gray-300 overflow-hidden">
                    <img src="" alt="User avatar" className="w-full h-full object-cover" />
                </div>
                <div>
                    <h3 className="font-heading text-2xl text-body">
                        {user?.email?.split('@')[0] || 'Username'}
                    </h3>
                    <p className="font-body text-base text-body">{getRoleLabel()}</p>
                </div>
            </div>
        </div>
    </nav>
  )
}
