import { useEffect, useState, type ReactNode } from "react"
import { useNavigate } from "react-router-dom"
import { doc, getDoc } from "firebase/firestore"
import { Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { db } from "@/firebase/config"
import { Button } from "@/components/ui/button"
import type { Member, Role } from "@/types/auth"

function accountTypeLabel(role: Role | null): string {
  switch (role) {
    case "super_admin":
      return "NSCC Admin"
    case "admin":
      return "District Admin"
    case "school_personnel":
      return "School Admin"
    default:
      return "N/A"
  }
}

function Row({ label, children }: { label: string; children: ReactNode }) {
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

  const [member, setMember] = useState<Member | null>(null)
  const [loading, setLoading] = useState(true)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (!user) {
      setMember(null)
      setLoading(false)
      return
    }

    let active = true
    setLoading(true);
    (async () => {
      try {
        const snap = await getDoc(doc(db, "members", user.uid))
        if (active) {
          if (snap.exists()) {
            const data = { id: snap.id, ...snap.data() }
            console.log("Current user member fields:", data)
            setMember(data as Member)
          } else {
            console.log("No member document found for uid:", user.uid)
            setMember(null)
          }
        }
      } catch (err) {
        console.error("Failed to load member:", err)
        if (active) setMember(null)
      } finally {
        if (active) setLoading(false)
      }
    })()

    return () => {
      active = false
    }
  }, [user])

  const memberRole = member?.role ?? role
  const displayName = member?.displayName ?? user?.displayName ?? "N/A"
  const email = member?.email ?? user?.email ?? "N/A"
  const password = member?.password ?? ""

  return (
    <div className="p-6">
      <h1 className="font-heading text-4xl font-bold text-heading mb-4">
        Account
      </h1>
      <p className="font-body text-lg text-body mb-6">Your account details.</p>

      <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm max-w-2xl">
        <table className="w-full text-left">
          <tbody>
            <Row label="Account Type">{accountTypeLabel(memberRole)}</Row>
            <Row label="Name">{loading ? "Loading…" : displayName}</Row>
            <Row label="Email">{loading ? "Loading…" : email}</Row>

            {memberRole === "admin" || memberRole === "school_personnel" ? (
              <Row label="District ID">
                {loading ? "Loading…" : member?.district_id ?? "N/A"}
              </Row>
            ) : null}

            {memberRole === "school_personnel" ? (
              <Row label="School ID">
                {loading ? "Loading…" : member?.school_id ?? "N/A"}
              </Row>
            ) : null}

            <Row label="Password">
              <div className="flex items-center gap-2">
                <span className={password && showPassword ? "" : "tracking-widest"}>
                  {loading
                    ? "Loading…"
                    : password
                      ? showPassword
                        ? password
                        : "••••••••"
                      : "N/A"}
                </span>
                {!loading && password ? (
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="text-gray-500 hover:text-primary transition-colors cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                ) : null}
              </div>
            </Row>
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
