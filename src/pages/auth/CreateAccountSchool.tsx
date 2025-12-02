import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { Check, X } from 'lucide-react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface CreateAccountFormData {
  firstName: string
  lastName: string
  school: string
  district: string
  email: string
  password: string
  confirmPassword: string
}

interface PasswordRequirements {
  hasSpecialChar: boolean
  hasUppercase: boolean
  hasLowercase: boolean
  hasMinLength: boolean
}

export default function CreateAccountSchool() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateAccountFormData>()

  const watchPassword = watch('password', '')

  const checkPasswordRequirements = (pwd: string): PasswordRequirements => {
    return {
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
      hasUppercase: /[A-Z]/.test(pwd),
      hasLowercase: /[a-z]/.test(pwd),
      hasMinLength: pwd.length >= 8,
    }
  }

  const passwordReqs = checkPasswordRequirements(watchPassword)

  const onSubmit = async (data: CreateAccountFormData) => {
    setIsLoading(true)

    try {
      console.log('Form data:', {
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        school: data.school.trim(),
        district: data.district.trim(),
        email: data.email.trim(),
        password: data.password,
      })
      // TODO: Add Firebase account creation in Phase 2
      alert('Account created successfully! (Check console for data)')
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
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
          Create Account
        </h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card className="shadow-none border-0 p-0">
            <CardContent className="space-y-3 pt-0 text-body font-body">
              {/* First Name and Last Name - Two Column Layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-base font-heading text-primary mb-2 mt-2">
                    First Name<span className="text-primary text-xs">*</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="Please enter your first name"
                    {...register('firstName', {
                      required: 'First name is required',
                      validate: (value) =>
                        value.trim().length > 0 ||
                        'First name cannot be empty',
                    })}
                    className="w-full h-12 rounded-xl border-body focus:border-primary font-body shadow-none"
                  />
                  {errors.firstName && (
                    <p className="text-sm text-red-500 font-body">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-base font-heading text-primary mb-2 mt-2">
                    Last Name<span className="text-primary text-xs">*</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="Please enter your last name"
                    {...register('lastName', {
                      required: 'Last name is required',
                      validate: (value) =>
                        value.trim().length > 0 || 'Last name cannot be empty',
                    })}
                    className="w-full h-12 rounded-xl border-body focus:border-primary font-body shadow-none"
                  />
                  {errors.lastName && (
                    <p className="text-sm text-red-500 font-body">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              {/* School and District - Two Column Layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-base font-heading text-primary mb-2">
                    School<span className="text-primary text-xs">*</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="Please enter your school"
                    {...register('school', {
                      required: 'School is required',
                      validate: (value) =>
                        value.trim().length > 0 || 'School cannot be empty',
                    })}
                    className="w-full h-12 rounded-xl border-body focus:border-primary font-body shadow-none"
                  />
                  {errors.school && (
                    <p className="text-sm text-red-500 font-body">
                      {errors.school.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-base font-heading text-primary mb-2">
                    District<span className="text-primary text-xs">*</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="Please enter your district"
                    {...register('district', {
                      required: 'District is required',
                      validate: (value) =>
                        value.trim().length > 0 || 'District cannot be empty',
                    })}
                    className="w-full h-12 rounded-xl border-body focus:border-primary font-body shadow-none"
                  />
                  {errors.district && (
                    <p className="text-sm text-red-500 font-body">
                      {errors.district.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col">
                <label className="text-base font-heading text-primary mb-2">
                  Email<span className="text-primary text-xs">*</span>
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
                  className="w-full h-12 rounded-xl border-body focus:border-primary font-body shadow-none"
                />
                {errors.email && (
                  <p className="text-sm text-red-500 font-body">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="flex flex-col">
                <label className="text-base font-heading text-primary mb-2">
                  Password<span className="text-primary text-xs">*</span>
                </label>
                <Input
                  type="password"
                  placeholder="Please enter your password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters',
                    },
                    validate: () => {
                      const reqs = checkPasswordRequirements(watchPassword)
                      if (
                        !reqs.hasSpecialChar ||
                        !reqs.hasUppercase ||
                        !reqs.hasLowercase ||
                        !reqs.hasMinLength
                      ) {
                        return 'Password must meet all requirements'
                      }
                      return true
                    },
                  })}
                  className="w-full h-12 rounded-xl border-body focus:border-primary font-body shadow-none"
                />
                {errors.password && (
                  <p className="text-sm text-red-500 font-body">
                    {errors.password.message}
                  </p>
                )}

                {/* Password Requirements */}
                <div className="text-sm text-body mt-2 ml-6">
                  <p className="font-body mb-1">Password requires:</p>
                  <div className="space-y-1 font-body">
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          'w-4 h-4 rounded-full flex items-center justify-center',
                          passwordReqs.hasSpecialChar
                            ? 'bg-primary'
                            : 'bg-gray-300'
                        )}
                      >
                        {passwordReqs.hasSpecialChar ? (
                          <Check className="w-3 h-3 text-white" />
                        ) : (
                          <X className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <span>One special key</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          'w-4 h-4 rounded-full flex items-center justify-center',
                          passwordReqs.hasUppercase
                            ? 'bg-primary'
                            : 'bg-gray-300'
                        )}
                      >
                        {passwordReqs.hasUppercase ? (
                          <Check className="w-3 h-3 text-white" />
                        ) : (
                          <X className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <span>One uppercase letter</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          'w-4 h-4 rounded-full flex items-center justify-center',
                          passwordReqs.hasLowercase
                            ? 'bg-primary'
                            : 'bg-gray-300'
                        )}
                      >
                        {passwordReqs.hasLowercase ? (
                          <Check className="w-3 h-3 text-white" />
                        ) : (
                          <X className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <span>One lowercase letter</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          'w-4 h-4 rounded-full flex items-center justify-center',
                          passwordReqs.hasMinLength ? 'bg-primary' : 'bg-gray-300'
                        )}
                      >
                        {passwordReqs.hasMinLength ? (
                          <Check className="w-3 h-3 text-white" />
                        ) : (
                          <X className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <span>8 character length</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col mb-2">
                <label className="text-base font-heading text-primary mb-2">
                  Confirm Password<span className="text-primary text-xs">*</span>
                </label>
                <Input
                  type="password"
                  placeholder="Please enter your password again"
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (value) =>
                      value === watchPassword || 'Passwords do not match',
                  })}
                  className="w-full h-12 rounded-xl border-body focus:border-primary font-body shadow-none"
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500 font-body">
                    {errors.confirmPassword.message}
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
                {isLoading ? 'Creating...' : 'Create account'}
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
