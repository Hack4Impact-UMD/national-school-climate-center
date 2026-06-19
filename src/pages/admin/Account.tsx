import { type ReactNode } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import type { Role } from "@/types/auth"

function accountTypeLabel(role: Role | null): string {
  switch (role) {
    case "super_admin":
      return "NSCC Admin"
    case "admin":
      return "School Admin"
    case "school_personnel":
      return "District Admin"
    default:
      return "N/A"
  }
}

function DetailRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <tr className="border-t border-gray-100">
      <th className="bg-blue-50 px-6 py-3 text-sm font-semibold text-gray-600 w-48 align-top">
        {label}
      </th>
      <td className="px-6 py-3 font-body text-body">{children}</td>
    </tr>
  )
}

export default function Account() {
  const { user, role } = useAuth()
  const navigate = useNavigate()
  const displayName = user?.displayName ?? "N/A"

  return (
    <div className="p-6">
      <h1 className="font-heading text-4xl font-bold text-heading mb-4">
        Account
      </h1>
      <p className="font-body text-lg text-body mb-6">
        Your account details.
      </p>

      <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm max-w-2xl">
        <table className="w-full text-left">
          <tbody>
            <DetailRow label="Account Type">{accountTypeLabel(role)}</DetailRow>
            <DetailRow label="Name">{displayName}</DetailRow>
            <DetailRow label="Email">{user?.email}</DetailRow>
            <DetailRow label="Password">
              <div className="flex items-center gap-2">
                <span className="tracking-widest">••••••••</span>
              </div>
            </DetailRow>
          </tbody>
        </table>
      </div>

      <Button
        onClick={() => navigate("/account/change-password")}
        className="bg-primary hover:bg-primary/90 text-primary-foreground mt-6 cursor-pointer"
      >
        Change Password
      </Button>
    </div>
  )
}
