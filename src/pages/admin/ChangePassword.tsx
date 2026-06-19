import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth"
import { Eye, EyeOff } from "lucide-react"
import { auth } from "@/firebase/config"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { setStoredPassword } from "@/lib/accountPassword"

const MIN_PASSWORD_LENGTH = 6

export default function ChangePassword() {
  const navigate = useNavigate()
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setError(null)

    if (!currentPassword) {
      setError("Please enter your current password.")
      return
    }
    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`)
      return
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    const currentUser = auth.currentUser
    if (!currentUser || !currentUser.email) {
      setError("You must be signed in to change your password.")
      return
    }

    setSaving(true)
    try {
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        currentPassword
      )
      await reauthenticateWithCredential(currentUser, credential)

      await updatePassword(currentUser, newPassword)
      setStoredPassword(newPassword)
      navigate("/account")
    } catch (err) {
      console.error("Failed to update password:", err)
      if (err instanceof Error && "code" in err) {
        const code = (err as { code: string }).code
        if (
          code === "auth/wrong-password" ||
          code === "auth/invalid-credential"
        ) {
          setError("Current password is incorrect.")
          return
        }
      }
      setError("Could not update password. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-6">
      <h1 className="font-heading text-4xl font-bold text-heading mb-4">
        Change Password
      </h1>
      <p className="font-body text-lg text-body mb-6">
        Enter and confirm your new password.
      </p>

      <div className="border border-gray-200 rounded-lg shadow-sm max-w-md p-6 space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="current-password" className="font-body">
            Current Password
          </Label>
          <Input
            id="current-password"
            type={showPassword ? "text" : "password"}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter current password"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="new-password" className="font-body">
            New Password
          </Label>
          <div className="relative">
            <Input
              id="new-password"
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="pr-9"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-2 top-2 text-gray-500 hover:text-primary transition-colors cursor-pointer"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirm-password" className="font-body">
            Re-enter New Password
          </Label>
          <Input
            id="confirm-password"
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter new password"
          />
        </div>

        {error && <p className="font-body text-sm text-destructive">{error}</p>}

        <div className="flex items-center gap-3 pt-2">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer"
          >
            Save New Password
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/account")}
            disabled={saving}
            className="cursor-pointer"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}
