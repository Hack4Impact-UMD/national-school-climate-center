import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  verifyBeforeUpdateEmail,
  updatePassword,
} from 'firebase/auth'
import { db } from '@/firebase/config'
import { doc, getDoc } from 'firebase/firestore'
import { useForm } from 'react-hook-form'

export default function ManageUsers() {
  const [loading, setLoading] = useState(true)
  const [schoolId, setSchoolId] = useState<string | null>(null)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [passError, setPassError] = useState<string | null>(null)
  const [emailSuccess, setEmailSuccess] = useState<string | null>(null)
  const [passSuccess, setPassSuccess] = useState<string | null>(null)
  const { user, role } = useAuth()

  useEffect(() => {
    if (!user) return
    setLoading(false)

    async function getSchoolName() {
      if (user) {
        const d = doc(db, 'members', user.uid)
        const snap = await getDoc(d)

        if (!snap.exists()) return null

        const data = snap.data()

        if (!data.school_id) return null

        return data.school_id
      }
    }

    async function loadSchool() {
      try {
        const id = await getSchoolName()
        setSchoolId(id)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadSchool()
  }, [user])

  interface ChangeEmailFormData {
    email: string
    password: string
  }

  interface ChangePassFormData {
    password: string
    newPassword: string
    confirmPassword: string
  }

  const emailForm = useForm<ChangeEmailFormData>()
  const passForm = useForm<ChangePassFormData>()

  const changeEmailSubmit = async (data: ChangeEmailFormData) => {
    if (!user || !user.email) return

    try {
      const cred = EmailAuthProvider.credential(user.email, data.password)
      await reauthenticateWithCredential(user, cred)
      await verifyBeforeUpdateEmail(user, data.email)
      setEmailSuccess(`Verification email sent to ${data.email}`)
      setEmailError(null)
    } catch (err) {
      setEmailError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  const changePassSubmit = async (data: ChangePassFormData) => {
    if (!user || !user.email) return
    if (data.newPassword !== data.confirmPassword) {
      setPassError('Passwords do not match')
      return
    }

    try {
      const cred = EmailAuthProvider.credential(user.email, data.password)
      await reauthenticateWithCredential(user, cred)

      await updatePassword(user, data.newPassword)
      setPassSuccess('Password successfully changed')
      setPassError(null)
    } catch (err) {
      setPassError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  return (
    <div className="p-6">
      <h1 className="font-heading text-4xl font-bold text-heading mb-4">
        Manage Account
      </h1>
      <div className="flex flex-col mb-5 space-y-4">
        <div>
          <p className="font-body text-lg text-body">
            Welcome, {user?.email?.split('@')[0] || 'Username'}.
          </p>
          {!loading && role && (
            <p className="font-body text-lg text-body">
              {schoolId ?? 'No school found'}
            </p>
          )}
        </div>
        <p className="font-body text-lg text-body">Change Email</p>
        <form onSubmit={emailForm.handleSubmit(changeEmailSubmit)}>
          <Card className="shadow-none border-0 bg-secondary/10 p-5">
            <CardContent className="space-y-4 pt-6 text-body font-body">
              <label className="text-sm font-body text-primary">Email</label>
              <Input
                type="email"
                placeholder="Enter your new email"
                {...emailForm.register('email', {
                  required: 'New email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
                className="w-full h-12 rounded-xl border-body focus:border-primary font-body shadow-none"
              />
              <label className="text-sm font-body text-primary">Password</label>
              <Input
                type="password"
                placeholder="Please enter your password"
                {...emailForm.register('password', {
                  required: 'Password is required',
                })}
                className="w-full h-12 rounded-xl border-body focus:border-primary font-body shadow-none"
              />
              {emailError && (
                <p className="text-sm font-body text-primary">{emailError}</p>
              )}
              {emailSuccess && (
                <p className="text-sm font-body text-primary">{emailSuccess}</p>
              )}
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                disabled={emailForm.formState.isSubmitting}
                className="w-[165px] bg-secondary text-secondary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Change Email
              </Button>
            </CardFooter>
          </Card>
        </form>
        <p className="font-body text-lg text-body">Change Password</p>
        <form onSubmit={passForm.handleSubmit(changePassSubmit)}>
          <Card className="shadow-none border-0 bg-secondary/10 p-5">
            <CardContent className="space-y-4 pt-6 text-body font-body">
              <label className="text-sm font-body text-primary">
                Current Password
              </label>
              <Input
                type="password"
                placeholder="Please enter your password"
                {...passForm.register('password', {
                  required: 'Password is required',
                })}
                className="w-full h-12 rounded-xl border-body focus:border-primary font-body shadow-none"
              />
              <label className="text-sm font-body text-primary">
                New Password
              </label>
              <Input
                type="password"
                placeholder="Please enter your new password"
                {...passForm.register('newPassword', {
                  required: 'New password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
                className="w-full h-12 rounded-xl border-body focus:border-primary font-body shadow-none"
              />
              <Input
                type="password"
                placeholder="Confirm new password"
                {...passForm.register('confirmPassword', {
                  required: 'Please confirm password',
                })}
                className="w-full h-12 rounded-xl border-body focus:border-primary font-body shadow-none"
              />
              {passError && (
                <p className="text-sm font-body text-primary">{passError}</p>
              )}
              {passSuccess && (
                <p className="text-sm font-body text-primary">{passSuccess}</p>
              )}
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                disabled={passForm.formState.isSubmitting}
                className="w-[165px] bg-secondary text-secondary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Change Password
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  )
}
