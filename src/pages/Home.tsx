import { signOut } from 'firebase/auth'
import { auth } from '@/firebase/config'

export default function Home() {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-4">Welcome</h2>
      <p className="text-gray-600 mb-6">
        This is the home page of your application.
      </p>
      <button onClick={() => signOut(auth)}>Force Sign Out</button>
    </div>
  )
}
