/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import type { User } from 'firebase/auth'
import { auth } from '@/firebase/config'
import type { Role } from '@/types/auth'

type AuthState = { 
  user: User | null 
  role: Role | null  
  schoolId: string | null
  districtId: string | null 
  loading: boolean; logout: () => Promise<void>}

const AuthCtx = createContext<AuthState>({
  user: null,
  role: null,
  schoolId: null,
  districtId: null,
  loading: true,
  logout: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [role, setRole] = useState<Role | null>(null)
  const [schoolId, setSchoolId] = useState<string | null>(null)
  const [districtId, setDistrictId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u)
      if (!u) {
        setRole(null)
        setSchoolId(null)
        setDistrictId(null)
        setLoading(false)
        return
      }
      // TODO: Remove this testing override - defaults all users to admin
      // setRole('super_admin')
      // setLoading(false)
      // return

      // Original role fetching logic (disabled for testing)
      // const snap = await getDoc(doc(db, 'members', u.uid))
      // if (snap.exists()) {
      //   const roleData = snap.data()?.role
      //   const validRoles: Role[] = ['admin', 'school_personnel']
      //   setRole(validRoles.includes(roleData) ? roleData : null)
      // } else {
      //   setRole(null)
      // }
      // setLoading(false)
    })
    return unsub
  }, [])

  const logout = async () => {
    await signOut(auth)
  }

  return (
    <AuthCtx.Provider value={{ user, role, schoolId, districtId, loading, logout }}>
      {children}
    </AuthCtx.Provider>
  )
}
export const useAuth = () => useContext(AuthCtx)
