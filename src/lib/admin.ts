import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  serverTimestamp,
  onSnapshot,
  type DocumentData,
} from 'firebase/firestore'
import { db, auth } from '@/firebase/config'
import type { Role, Member } from '@/types/auth'

const membersCol = collection(db, 'members')
const invitationsCol = collection(db, 'invitations')

export async function getMembers(): Promise<Member[]> {
  const q = query(membersCol, orderBy('joinedAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as DocumentData) })) as Member[]
}

export function listenMembers(onChange: (members: Member[]) => void) {
  const q = query(membersCol, orderBy('joinedAt', 'desc'))
  const unsub = onSnapshot(q, (snap) => {
    const members = snap.docs.map((d) => ({ id: d.id, ...(d.data() as DocumentData) })) as Member[]
    onChange(members)
  })
  return unsub
}


export async function inviteMemberByEmail(email: string, role: Role) {
  // Check for duplicate pending invitations
  const q = query(
    invitationsCol,
    where('email', '==', email),
    where('status', '==', 'pending')
  )
  const existingInvites = await getDocs(q)

  if (!existingInvites.empty) {
    throw new Error('An invitation has already been sent to this email address')
  }

  const docRef = doc(invitationsCol)
  await setDoc(docRef, {
    email,
    role,
    invitedAt: serverTimestamp(),
    invitedBy: auth.currentUser?.uid ?? null,
    status: 'pending',
  })
  return docRef.id
}

// TODO: Implement UI for updating member roles in the Admin page
// Should allow super_admins to change any role, regular admins to only change school_personnel/student roles
export async function updateMemberRole(id: string, role: Role) {
  const d = doc(db, 'members', id)
  await updateDoc(d, { role })
}

// TODO: Implement UI for deleting members in the Admin page
// Should show confirmation dialog and respect role-based permissions
export async function deleteMember(id: string) {
  const d = doc(db, 'members', id)
  await deleteDoc(d)
}

export async function getMemberByUid(uid: string) {
  const d = doc(db, 'members', uid)
  const snap = await getDoc(d)
  if (!snap.exists()) return null
  return { id: snap.id, ...(snap.data() as DocumentData) } as Member
}
