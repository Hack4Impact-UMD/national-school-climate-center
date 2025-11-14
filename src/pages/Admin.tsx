import { useEffect, useState } from 'react'
import { Search, Plus } from 'lucide-react'
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
import { getMembers, listenMembers, inviteMemberByEmail, type Member } from '@/lib/admin'
import { isValidEmail } from '@/lib/utils'
import type { Role } from '@/pages/auth/rbac'

export default function ManageUsers() {
  const [open, setOpen] = useState(false);
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<Role>('admin')
  const [inviteLoading, setInviteLoading] = useState(false)
  const [inviteError, setInviteError] = useState<string | null>(null)
  const [inviteSuccess, setInviteSuccess] = useState<string | null>(null)
  
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
  

  useEffect(() => {
    let unsub: (() => void) | undefined
    getMembers().then(setMembers).catch(console.error)
    unsub = listenMembers((m) => setMembers(m))
    return () => unsub && unsub()
  }, [])

  

  return (
    <div className="p-6">
      <h1 className="font-heading text-4xl font-bold text-heading mb-4">
        Manage Access
      </h1>
      <div className="flex justify-between items-center mb-6">
        <p className="font-body text-lg text-body">
          Users
        </p>
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
              className="bg-[#4C7FCC] hover:bg-[#3c68b3] text-white flex items-center gap-2 cursor-pointer"
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
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Joined</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Role</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id} className="border-t border-gray-100 h-12">
                <td className="px-6">{(m as unknown as { name?: string }).name ?? m.displayName ?? '-'}</td>
                <td className="px-6">{m.email ?? '-'}</td>
                <td className="px-6">{m.joinedAt ? new Date(m.joinedAt.seconds * 1000).toLocaleString() : '-'}</td>
                <td className="px-6">{roleLabel(m.role)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-[#4C7FCC] text-2xl font-semibold">
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
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="school_personnel">School Personnel</SelectItem>
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
                className="bg-[#4C7FCC] hover:bg-[#3c68b3] text-white cursor-pointer"
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
              className="bg-[#4C7FCC] hover:bg-[#3c68b3] text-white mt-4 w-full cursor-pointer"
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
