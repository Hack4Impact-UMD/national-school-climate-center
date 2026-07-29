import { useEffect, useMemo, useState } from 'react'
import { Search, Plus, Pencil, X } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  getMembers,
  listenMembers,
  inviteMemberByEmail,
  getInvitations,
  listenInvitations,
  updateInvitationRole,
  cancelInvitation,
} from '@/lib/admin'
import type { Invitation } from '@/firebase/interfaces'
import { isValidEmail, formatTimestamp } from '@/lib/utils'
import type { Role, Member } from '@/types/auth'

type Row =
  | {
    kind: 'member'
    id: string
    displayName: string | null
    email: string | null
    date: Member['joinedAt']
    role: Role | null
    status: 'active'
  }
  | {
    kind: 'invitation'
    id: string
    displayName: null
    email: string
    date: Invitation['invitedAt']
    role: Role
    status: Invitation['status']
  }

export default function ManageUsers() {
  const [open, setOpen] = useState(false)
  const { role: currentRole } = useAuth()
  const [members, setMembers] = useState<Member[]>([])
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [loading, setLoading] = useState(true)

  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<Role>('admin')
  const [inviteLoading, setInviteLoading] = useState(false)
  const [inviteError, setInviteError] = useState<string | null>(null)
  const [inviteSuccess, setInviteSuccess] = useState<string | null>(null)

  const [editingInvite, setEditingInvite] = useState<Invitation | null>(null)
  const [editRole, setEditRole] = useState<Role>('admin')
  const [editLoading, setEditLoading] = useState(false)
  const [editError, setEditError] = useState<string | null>(null)

  const availableRoles = useMemo(() => {
    const all: { value: Role; label: string }[] = [
      { value: 'super_admin', label: 'Super Admin' },
      { value: 'admin', label: 'Admin' },
      { value: 'school_personnel', label: 'School Personnel' },
      { value: 'student', label: 'Student' },
    ]
    if (currentRole === 'super_admin') return all
    // regular admins (and anyone else) only get school_personnel/student,
    // matching the invitations create rule in firestore.rules
    return all.filter((r) => r.value === 'school_personnel' || r.value === 'student')
  }, [currentRole])

  // default the invite/edit role pickers to the first option this admin can actually pick,
  // rather than always defaulting to 'admin' (which a regular admin can't invite)
  useEffect(() => {
    if (availableRoles.length && !availableRoles.some((r) => r.value === inviteRole)) {
      setInviteRole(availableRoles[0].value)
    }
  }, [availableRoles])

  const roleLabel = (r?: Role | null) => {
    if (!r) return '-'
    const map: Record<string, string> = {
      super_admin: 'Super Admin',
      admin: 'Admin',
      student: 'Student',
      school_personnel: 'School Personnel',
    }
    return map[r] ?? r
  }

  const statusLabel = (s: Row['status']) => {
    const map: Record<Row['status'], string> = {
      active: 'Active',
      pending: 'Pending',
      accepted: 'Active',
      cancelled: 'Cancelled',
    }
    return map[s] ?? s
  }

  const statusStyle = (s: Row['status']) => {
    if (s === 'active' || s === 'accepted') return 'bg-green-100 text-green-700'
    if (s === 'pending') return 'bg-yellow-100 text-yellow-700'
    return 'bg-gray-100 text-gray-500'
  }

  useEffect(() => {
    Promise.all([getMembers(), getInvitations()])
      .then(([m, i]) => {
        setMembers(m)
        setInvitations(i)
      })
      .catch(console.error)
      .finally(() => setLoading(false))

    const unsubMembers = listenMembers((m) => setMembers(m))
    const unsubInvites = listenInvitations((i) => setInvitations(i))
    return () => {
      unsubMembers && unsubMembers()
      unsubInvites && unsubInvites()
    }
  }, [])

  const rows: Row[] = useMemo(() => {
    const memberRows: Row[] = members.map((m) => ({
      kind: 'member',
      id: m.id,
      displayName: m.displayName ?? null,
      email: m.email ?? null,
      date: m.joinedAt,
      role: m.role ?? null,
      status: 'active',
    }))

    // Don't show invitations that have already been accepted — that person
    // now shows up as a member row instead, so this avoids duplicate rows.
    const invitationRows: Row[] = invitations
      .filter((i) => i.status === 'pending') // only show active, unresolved invites
      .map((i) => ({
        kind: 'invitation',
        id: i.id,
        displayName: null,
        email: i.email,
        date: i.invitedAt,
        role: i.role,
        status: i.status,
      }))

    return [...memberRows, ...invitationRows]
  }, [members, invitations])

  const openEditDialog = (invite: Invitation) => {
    setEditingInvite(invite)
    setEditRole(invite.role)
    setEditError(null)
  }

  const handleSaveEdit = async () => {
    if (!editingInvite) return
    setEditLoading(true)
    setEditError(null)
    try {
      console.log('Updating invitation role', editingInvite.id, editRole, 'current role', currentRole)
      await updateInvitationRole(editingInvite.id, editRole)
      setEditingInvite(null)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      setEditError(msg)
    } finally {
      setEditLoading(false)
    }
  }

  const handleCancelInvite = async (id: string) => {
    try {
      await cancelInvitation(id)
      setEditingInvite(null)
    } catch (err) {
      console.error('Cancel invite failed', err)
    }
  }

  return (
    <div className="p-6">
      <h1 className="font-heading text-4xl font-bold text-heading mb-4">
        Manage Access
      </h1>
      <div className="flex justify-between items-center mb-6">
        <p className="font-body text-lg text-body">Users</p>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search by name"
              className="p1-8 bg-gray-100 w-64 cursor-text"
            />
            <Search className="absolute right-2 top-2.5 w-4 h-4 text-gray-500" />
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setOpen(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Invite users
            </Button>
          </div>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-blue-50">
            <tr>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Name</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Email</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Date</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Role</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Status</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-primary border-r-transparent"></div>
                    <span className="text-body font-body">Loading users...</span>
                  </div>
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-body font-body">
                  No users found
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={`${r.kind}-${r.id}`} className="border-t border-gray-100 h-12">
                  <td className="px-6">{r.displayName ?? '-'}</td>
                  <td className="px-6">{r.email ?? '-'}</td>
                  <td className="px-6">{formatTimestamp(r.date)}</td>
                  <td className="px-6">{roleLabel(r.role)}</td>
                  <td className="px-6">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${statusStyle(r.status)}`}
                    >
                      {statusLabel(r.status)}
                    </span>
                  </td>
                  <td className="px-6">
                    {r.kind === 'invitation' && r.status === 'pending' ? (
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            openEditDialog(
                              invitations.find((i) => i.id === r.id) as Invitation
                            )
                          }
                          className="text-gray-500 hover:text-primary cursor-pointer"
                          aria-label="Edit invitation"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCancelInvite(r.id)}
                          className="text-gray-500 hover:text-red-600 cursor-pointer"
                          aria-label="Cancel invitation"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-300">-</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Invite dialog (unchanged) */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-primary text-2xl font-semibold">
              Invite Users
            </DialogTitle>
            <DialogDescription>
              Invite users and manage access in workspace.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 border-t border-gray-200 pt-4">
            <p className="font-medium mb-2">Invite new users</p>
            <p className="text-sm text-gray-600 mb-3">Add new users by email.</p>

            <div className="flex gap-2 mb-4">
              <div className="relative flex-grow">
                <Input
                  type="email"
                  placeholder="Email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="pr-8 bg-gray-100 cursor-text"
                />
                <Search className="absolute right-2 top-2.5 w-4 h-4 text-gray-500" />
              </div>
              <Select defaultValue={inviteRole} onValueChange={(v: string) => setInviteRole(v as Role)}>
                <SelectTrigger className="w-36 bg-gray-50 cursor-pointer">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {availableRoles.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                disabled={inviteLoading}
                onClick={async () => {
                  if (!inviteEmail) return
                  if (!isValidEmail(inviteEmail)) {
                    setInviteError('Please enter a valid email address')
                    return
                  }
                  const email = inviteEmail
                  setInviteError(null)
                  setInviteSuccess(null)
                  setInviteLoading(true)
                  try {
                    await inviteMemberByEmail(email, inviteRole)
                    setInviteEmail('')
                    setInviteSuccess(`Invite sent to ${email}`)
                    setTimeout(() => setInviteSuccess(null), 5000)
                  } catch (err: unknown) {
                    console.error('Invite failed', err)
                    const msg = err instanceof Error ? err.message : String(err)
                    setInviteError('Invite failed: ' + msg)
                  } finally {
                    setInviteLoading(false)
                  }
                }}
                className="bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer"
              >
                {inviteLoading ? 'Sending…' : 'Send Invite'}
              </Button>
            </div>

            {inviteSuccess && <div className="mt-2 text-sm text-green-600">{inviteSuccess}</div>}
            {inviteError && <div className="mt-2 text-sm text-red-600">{inviteError}</div>}
          </div>

          <DialogFooter>
            <Button
              onClick={() => setOpen(false)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground mt-4 w-full cursor-pointer"
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit invitation dialog */}
      <Dialog open={!!editingInvite} onOpenChange={(o) => !o && setEditingInvite(null)}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-primary text-2xl font-semibold">
              Edit Invitation
            </DialogTitle>
            <DialogDescription>
              {editingInvite?.email}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-2">
            <label className="text-sm font-medium text-gray-600 mb-2 block">Role</label>
            <Select defaultValue={inviteRole} onValueChange={(v: string) => setInviteRole(v as Role)}>
              <SelectTrigger className="w-36 bg-gray-50 cursor-pointer">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {availableRoles.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {editError && <div className="mt-2 text-sm text-red-600">{editError}</div>}
          </div>

          <DialogFooter className="flex gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => editingInvite && handleCancelInvite(editingInvite.id)}
              className="w-1/2 border-red-300 text-red-600 hover:bg-red-50 cursor-pointer"
            >
              Revoke Invite
            </Button>
            <Button
              disabled={editLoading}
              onClick={handleSaveEdit}
              className="w-1/2 bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer"
            >
              {editLoading ? 'Saving…' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}