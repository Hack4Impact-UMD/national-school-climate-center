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
  // create an invitation document 
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

export async function updateMemberRole(id: string, role: Role) {
  const d = doc(db, 'members', id)
  await updateDoc(d, { role })
}

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
