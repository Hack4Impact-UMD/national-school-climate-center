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
import type { Invitation } from '@/firebase/interfaces'


// Builds HTML template for user invitation email
function buildInviteEmailHtml(role: Role, acceptUrl: string) {
  return `
    <div style="background-color:#ffffff; padding:24px; font-family:Arial, Helvetica, sans-serif;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:576px; margin:0 auto;">
        <tr>
          <td style="text-align:center; padding-bottom:8px;">
            <h1 style="font-size:24px; font-weight:700; color:#1E3A5F; margin:0; padding:0 24px;">
              You've been invited
            </h1>
          </td>
        </tr>
        <tr>
          <td style="text-align:center; padding:0 24px 24px;">
            <p style="font-size:16px; color:#4B5563; line-height:1.5; margin:0;">
              You've been invited to join as a
              <strong style="color:#1E3A5F;">${role.replace('_', ' ')}</strong>.
              Click below to set up your account.
            </p>
          </td>
        </tr>
        <tr>
          <td style="text-align:center; padding-bottom:24px;">
            <a href="${acceptUrl}" style="display:inline-block; background-color:#2F855A; color:#ffffff; font-size:16px; font-weight:500; text-decoration:none; padding:14px 32px; border-radius:12px;">
              Accept your invitation
            </a>
          </td>
        </tr>
      </table>
    </div>
  `
}

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


const mailCol = collection(db, 'mail')

export async function inviteMemberByEmail(email: string, role: Role) {
  const q = query(
    invitationsCol,
    where('email', '==', email),
    where('status', '==', 'pending')
  )
  const existingInvites = await getDocs(q)

  if (!existingInvites.empty) {
    throw new Error('An invitation has already been sent to this email address')
  }

  const inviteRef = doc(invitationsCol)
  await setDoc(inviteRef, {
    email,
    role,
    invitedAt: serverTimestamp(),
    invitedBy: auth.currentUser?.uid ?? null,
    status: 'pending',
  })

  const acceptUrl = `${window.location.origin}/accept-invite?id=${inviteRef.id}`
  await setDoc(doc(mailCol), {
    to: [email],
    from: 'pulse@schoolclimate.org',
    message: {
      subject: "You've been invited",
      html: buildInviteEmailHtml(role, acceptUrl),
    },
  })

  return inviteRef.id
}

// Helper function to get the invitation from Firsestore by ID
export async function getInvitationById(inviteId: string) {
  const d = doc(db, 'invitations', inviteId)
  const snap = await getDoc(d)
  if (!snap.exists()) return null
  return { id: snap.id, ...(snap.data() as DocumentData) } as {
    id: string
    email: string
    role: Role
    status: 'pending' | 'accepted' | string
  }
}


// Accepts a user invitaiton. Gets the invitation from firestore, updates members docs, 
// and sets invitaiton status to accepted.
export async function acceptInvitation(inviteId: string, uid: string) {
  const inviteRef = doc(db, 'invitations', inviteId)
  const inviteSnap = await getDoc(inviteRef)

  if (!inviteSnap.exists()) {
    throw new Error('This invitation could not be found')
  }

  const invite = inviteSnap.data() as DocumentData
  if (invite.status !== 'pending') {
    throw new Error('This invitation has already been used or is no longer valid')
  }


  await setDoc(doc(db, 'members', uid), {
    email: invite.email,
    role: invite.role,
    joinedAt: serverTimestamp(),
    inviteId,
  })

  await updateDoc(inviteRef, {
    status: 'accepted',
    acceptedAt: serverTimestamp(),
    acceptedBy: uid,
  })
}

// TODO: Implement UI for updating member roles in the Admin page
// Should allow super_admins to change any role, regular admins to only change school_personnel/student roles
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

export async function getInvitations(): Promise<Invitation[]> {
  const q = query(invitationsCol, orderBy('invitedAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as DocumentData) })) as Invitation[]
}

export function listenInvitations(onChange: (invites: Invitation[]) => void) {
  const q = query(invitationsCol, orderBy('invitedAt', 'desc'))
  const unsub = onSnapshot(q, (snap) => {
    const invites = snap.docs.map((d) => ({ id: d.id, ...(d.data() as DocumentData) })) as Invitation[]
    onChange(invites)
  })
  return unsub
}

export async function updateInvitationRole(id: string, role: Role) {
  const d = doc(db, 'invitations', id)
  const snap = await getDoc(d)
  if (!snap.exists()) throw new Error('Invitation not found')
  if (snap.data().status !== 'pending') {
    throw new Error('Only pending invitations can be edited')
  }
  await updateDoc(d, { role })
}

export async function cancelInvitation(id: string) {
  const d = doc(db, 'invitations', id)
  const snap = await getDoc(d)
  if (!snap.exists()) throw new Error('Invitation not found')
  if (snap.data().status !== 'pending') {
    throw new Error('Only pending invitations can be cancelled')
  }
  await updateDoc(d, { status: 'expired' })
}