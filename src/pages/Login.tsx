import { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
//   const [isLoading, setIsLoading] = useState(false)
//   const [error, setError] = useState('')

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()
//     setIsLoading(true)
//     setError('')

//     // Simulate form submission
//     console.log('Login attempt:', { email, password })
//     setTimeout(() => {
//       setIsLoading(false)
//     }, 1000)
//   }

  return (

    <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="max-w-2xl mx-auto">
        <div className="text-center">
           <img 
             src="/logo.png" 
             alt="National School Climate Center" 
             className="mx-auto h-20 w-auto mb-4"
             />
           <h1 className="font-heading text-4xl font-bold text-primary">
             Welcome!
           </h1>
         </div>
            <Card className="shadow-none border-0">
            <CardHeader>
            </CardHeader>
            <CardContent className="space-y-4">
            <div className="space-y-2">
                <label className="text-sm font-heading text-primary">Email</label>
                <Input 
                type="email" 
                placeholder="Please enter your email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-heading text-primary">Password</label>
                <Input 
                type="password" 
                placeholder="Pleasenter your password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                />
            </div>
            </CardContent>
            <CardFooter>
            <Button className="w-full bg-secondary text-secondary-foreground">Login</Button>
            </CardFooter>
        </Card>
        <p className="font-heading text-md text-secondary underline text-center mt-4">Forgot Password</p>
        </div>
    </div>

  )
}
