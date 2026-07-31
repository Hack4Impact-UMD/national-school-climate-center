import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { auth } from '@/firebase/config'
import { getInvitationById, acceptInvitation } from '@/lib/admin'

type Invite = {
  email: string
  role: string
}

export default function AcceptInvite() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const inviteId = searchParams.get('id')

  const [status, setStatus] = useState<'loading' | 'ready' | 'invalid'>(
    'loading'
  )
  const [invite, setInvite] = useState<Invite | null>(null)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!inviteId) {
      setStatus('invalid')
      return
    }
    getInvitationById(inviteId).then((data) => {
      if (!data || data.status !== 'pending') {
        setStatus('invalid')
      } else {
        setInvite({ email: data.email, role: data.role })
        setStatus('ready')
      }
    })
  }, [inviteId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteId || !invite) return

    if (password.length < 8) {
      setFormError('Password must be at least 8 characters')
      return
    }
    if (password !== confirmPassword) {
      setFormError('Passwords do not match')
      return
    }

    setFormError(null)
    setIsLoading(true)

    try {
      const cred = await createUserWithEmailAndPassword(
        auth,
        invite.email,
        password
      )
      try {
        await acceptInvitation(inviteId, cred.user.uid)
      } catch (acceptError) {
        // Roll back the newly created auth account so the user can retry.
        await cred.user.delete().catch(() => {})
        throw acceptError
      }
      navigate('/home')
    } catch (error) {
      console.error('Error accepting invitation:', error)
      if (error instanceof Error && 'code' in error) {
        const firebaseError = error as { code: string }
        if (firebaseError.code === 'auth/email-already-in-use') {
          setFormError('An account with this email already exists')
        } else if (firebaseError.code === 'auth/weak-password') {
          setFormError('Password is too weak')
        } else {
          setFormError('Failed to create account. Please try again.')
        }
      } else {
        setFormError('Failed to create account. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center p-4">
        <p className="font-body text-body">Loading invitation...</p>
      </main>
    )
  }

  if (status === 'invalid') {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="w-full max-w-xl mx-auto text-center">
          <img
            src="/logo.png"
            alt="National School Climate Center"
            className="mx-auto h-32 w-auto"
          />
          <h1 className="font-heading text-3xl text-primary font-bold mb-2 px-6">
            Invitation not found
          </h1>
          <p className="font-body text-body mb-6">
            This invitation link is invalid or has already been used.
          </p>
          <Button
            type="button"
            onClick={() => navigate('/login')}
            className="w-1/3 bg-secondary hover:bg-secondary/90 text-secondary-foreground h-12 rounded-xl !font-light"
          >
            Go to Sign In
          </Button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-xl mx-auto">
        <div className="text-center">
          <img
            src="/logo.png"
            alt="National School Climate Center"
            className="mx-auto h-32 w-auto"
          />
        </div>
        <h1 className="font-heading text-3xl text-primary font-bold mb-1 px-6">
          Accept Your Invitation
        </h1>
        <p className="font-body text-body mb-4 px-6">
          You've been invited to join as{' '}
          <span className="font-bold text-primary">
            {invite?.role.replace('_', ' ')}
          </span>
          . Set a password to finish creating your account.
        </p>

        <form onSubmit={handleSubmit}>
          <Card className="shadow-none border-0 p-0">
            <CardContent className="space-y-3 pt-0 text-body font-body">
              {/* Email (locked) */}
              <div className="flex flex-col">
                <label className="text-base font-heading text-primary mb-2 mt-2">
                  Email
                </label>
                <Input
                  type="email"
                  value={invite?.email ?? ''}
                  disabled
                  className="w-full h-12 rounded-xl border-body font-body shadow-none bg-gray-100 text-body cursor-not-allowed"
                />
              </div>

              {/* Password */}
              <div className="flex flex-col">
                <label className="text-base font-heading text-primary mb-2">
                  Password<span className="text-primary text-xs">*</span>
                </label>
                <Input
                  type="password"
                  placeholder="Please enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 rounded-xl border-body focus:border-primary font-body shadow-none"
                />
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col mb-2">
                <label className="text-base font-heading text-primary mb-2">
                  Confirm Password<span className="text-primary text-xs">*</span>
                </label>
                <Input
                  type="password"
                  placeholder="Please enter your password again"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full h-12 rounded-xl border-body focus:border-primary font-body shadow-none"
                />
                {formError && (
                  <p className="text-sm text-red-500 font-body mt-2">
                    {formError}
                  </p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-center gap-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-1/3 bg-secondary hover:bg-secondary/90 text-secondary-foreground disabled:opacity-50 disabled:cursor-not-allowed h-12 rounded-xl !font-light"
              >
                {isLoading ? 'Creating...' : 'Accept & create account'}
              </Button>
            </CardFooter>
          </Card>
        </form>

        <div className="text-center">
          <span className="font-body text-secondary font-bold">
            Already have an account?{' '}
          </span>
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="font-body text-secondary underline cursor-pointer bg-transparent border-0 p-0 font-bold"
          >
            Sign In
          </button>
        </div>
      </div>
    </main>
  )
}