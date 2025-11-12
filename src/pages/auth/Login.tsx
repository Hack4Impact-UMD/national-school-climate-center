import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth, googleProvider, db } from '@/firebase/config'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { signInWithPopup, signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { FcGoogle } from 'react-icons/fc' // npm install react-icons to make this work

interface LoginFormData {
  email: string
  password: string
}

export default function Login() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>()

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setAuthError(null)

    try {
      await signInWithEmailAndPassword(auth, data.email, data.password)
      navigate('/home')
    } catch (error) {
      // Handle Firebase authentication errors
      let errorMessage = 'An error occurred during login'

      if (error instanceof Error && 'code' in error) {
        const firebaseError = error as { code: string; message: string }

        switch (firebaseError.code) {
          case 'auth/user-not-found':
            errorMessage = 'No account found with this email'
            break
          case 'auth/wrong-password':
            errorMessage = 'Incorrect password'
            break
          case 'auth/invalid-email':
            errorMessage = 'Invalid email address'
            break
          case 'auth/user-disabled':
            errorMessage = 'This account has been disabled'
            break
          case 'auth/too-many-requests':
            errorMessage = 'Too many failed attempts. Please try again later'
            break
          case 'auth/invalid-credential':
            errorMessage = 'Invalid email or password'
            break
          default:
            errorMessage = firebaseError.message || 'Failed to login'
        }
      }

      setAuthError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  // Helper for getting the data from the members collection
  async function isMember(uid: string): Promise<boolean> {
    const snap = await getDoc(doc(db, 'members', uid))
    return snap.exists()
  }

  async function getMemberRole(uid: string): Promise<string | null> {
    const snap = await getDoc(doc(db, 'members', uid))
    return snap.exists() ? (snap.data().role as string) : null
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    setAuthError(null)
    try {
      const cred = await signInWithPopup(auth, googleProvider)
      const uid = cred.user.uid

      if (!(await isMember(uid))) {
        await signOut(auth)
        setAuthError(
          'Your Google account is not authorized to access this application.'
        )
        return
      }

      const role = await getMemberRole(uid)

      if (
        !role ||
        !['admin', 'school_personnel', 'super_admin'].includes(role)
      ) {
        await signOut(auth)
        setAuthError('Your account does not have sufficient permissions.')
        return
      }

      navigate('/home')
    } catch (e: any) {
      console.error('Sign in error:', e)
      setAuthError('Failed to login with Google. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center">
          <img
            src="/logo.png"
            alt="National School Climate Center"
            className="mx-auto h-32 w-auto mb-4"
          />
          <h1 className="font-heading text-3xl font-bold text-primary">
            Welcome!
          </h1>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card className="shadow-none border-0 p-4">
            <CardContent className="space-y-4 pt-6 text-body font-body">
              {authError && (
                <div
                  role="alert"
                  aria-live="polite"
                  className="p-3 rounded-lg bg-red-50 border border-red-200"
                >
                  <p className="text-sm text-red-600 font-heading">
                    {authError}
                  </p>
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-heading text-primary">
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="Please enter your email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  className="w-full h-12 rounded-xl border-body/30 focus:border-primary font-heading"
                />
                {errors.email && (
                  <p className="text-sm text-red-500 font-heading">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-heading text-primary">
                  Password
                </label>
                <Input
                  type="password"
                  placeholder="Please enter your password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                  className="w-full h-12 rounded-xl border-body/30 focus:border-primary font-heading"
                />
                {errors.password && (
                  <p className="text-sm text-red-500 font-heading">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-center gap-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-[165px] bg-secondary text-secondary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Logging in...' : 'Log in'}
              </Button>

              {/* Google sign-in button */}
              <Button
                type="button"
                onClick={handleGoogleSignIn}
                variant="outline"
                className="w-[165px] disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                <FcGoogle size={20} />
                Log in with Google
              </Button>
            </CardFooter>
          </Card>
        </form>

        <button
          type="button"
          className="font-heading text-md text-secondary underline text-center mt-4 font-bold w-full cursor-pointer bg-transparent border-0 p-0"
        >
          Forgot Password
        </button>
      </div>
    </main>
  )
}
