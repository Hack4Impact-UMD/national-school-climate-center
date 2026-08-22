/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import type { User } from 'firebase/auth'
import { doc, getDoc, onSnapshot, type Unsubscribe } from 'firebase/firestore'
import { auth, db } from '@/firebase/config'
import type { Role } from '@/types/auth'

type AuthState = {
  user: User | null
  role: Role | null
  schoolId: string | null
  districtId: string | null
  loading: boolean
  logout: () => Promise<void>
  refreshUserData: () => Promise<void> 
}

const AuthCtx = createContext<AuthState>({
  user: null,
  role: null,
  schoolId: null,
  districtId: null,
  loading: true,
  logout: async () => {},
  refreshUserData: async () => {}
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [role, setRole] = useState<Role | null>(null)
  const [schoolId, setSchoolId] = useState<string | null>(null)
  const [districtId, setDistrictId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let memberUnsub: Unsubscribe | null = null

    const authUnsub = onAuthStateChanged(auth, (u) => {
      setUser(u)

      if (memberUnsub) {
        memberUnsub()
        memberUnsub = null
      }

      if (!u) {
        setRole(null)
        setSchoolId(null)
        setDistrictId(null)
        setLoading(false)
        return
      }

      setLoading(true)
      memberUnsub = onSnapshot(
        doc(db, 'members', u.uid),
        (snap) => {
          if (snap.exists()) {
            const data = snap.data()
            const roleData = data?.role
            const validRoles: Role[] = [
              'super_admin',
              'admin',
              'school_personnel',
              'student',
            ]
            setRole(validRoles.includes(roleData) ? (roleData as Role) : null)
            setSchoolId(data?.school_id ?? null)
            setDistrictId(data?.district_id ?? null)
          } else {
            setRole(null)
            setSchoolId(null)
            setDistrictId(null)
          }
          setLoading(false)
        },
        (error) => {
          console.error('Error listening to member document:', error)
          setRole(null)
          setSchoolId(null)
          setDistrictId(null)
          setLoading(false)
        }
      )
    })

    return () => {
      if (memberUnsub) memberUnsub()
      authUnsub()
    }
  }, [])

  const fetchMemberData = async (u: User) => {
    try {
      const snap = await getDoc(doc(db, 'members', u.uid))
      if (snap.exists()) {
        const data = snap.data()
        const roleData = data?.role
        const validRoles: Role[] = ['super_admin', 'admin', 'school_personnel', 'student']
        setRole(validRoles.includes(roleData) ? (roleData as Role) : null)
        setSchoolId(data?.school_id ?? null)
        setDistrictId(data?.district_id ?? null)
      } else {
        setRole(null)
        setSchoolId(null)
        setDistrictId(null)
      }
    } catch {
      setRole(null)
      setSchoolId(null)
      setDistrictId(null)
    }
  }

  const refreshUserData = async () => {
    if (auth.currentUser) {
      await fetchMemberData(auth.currentUser)
    }
  }

  const logout = async () => {
    await signOut(auth)
  }

  return (
    <AuthCtx.Provider value={{ user, role, schoolId, districtId, loading, logout, refreshUserData }}>
      {children}
    </AuthCtx.Provider>
  )
}
export const useAuth = () => useContext(AuthCtx)
