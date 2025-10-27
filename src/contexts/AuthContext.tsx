import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import type { User } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '@/firebase/config'
import type { Role } from '@/pages/auth/rbac'


const SUPER_ADMIN_EMAILS = [
 'cvillenas@schoolclimate.org',
 'ajacobs@schoolclimate.org',
]


type AuthState = { user: User | null; role: Role | null; loading: boolean }
const AuthCtx = createContext<AuthState>({
 user: null,
 role: null,
 loading: true,
})


export function AuthProvider({ children }: { children: React.ReactNode }) {
 const [user, setUser] = useState<User | null>(null)
 const [role, setRole] = useState<Role | null>(null)
 const [loading, setLoading] = useState(true)


 useEffect(() => {
   const unsub = onAuthStateChanged(auth, async (u) => {
     setUser(u)
     if (!u) {
       setRole(null)
       setLoading(false)
       return
     }


     if (u.email && SUPER_ADMIN_EMAILS.includes(u.email)) {
       setRole('super_admin')
       setLoading(false)
       return
     }


     const snap = await getDoc(doc(db, 'members', u.uid))
     if (snap.exists()) {
       const roleData = snap.data()?.role as Role | undefined
       const validRoles: Role[] = ['super_admin','admin', 'school_personnel']
       setRole(validRoles.includes(roleData as Role) ? (roleData as Role) : null)
     } else {
       setRole(null)
     }
     setLoading(false)
   })
   return unsub
 }, [])


 return (
   <AuthCtx.Provider value={{ user, role, loading }}>
     {children}
   </AuthCtx.Provider>
 )
}
export const useAuth = () => useContext(AuthCtx)
