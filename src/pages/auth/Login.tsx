import { useForm } from 'react-hook-form'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface LoginFormData {
  email: string
  password: string
}

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>()

  const onSubmit = (data: LoginFormData) => {
    console.log('Login attempt:', data)
    // TODO: Implement Firebase authentication here
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
            <CardFooter className="flex justify-center">
              <Button
                type="submit"
                className="w-[165px] bg-secondary text-secondary-foreground"
              >
                Log in
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
