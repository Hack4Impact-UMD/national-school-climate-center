import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div>
      <header className="border-b p-4">
        <nav className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">National School Climate Center</h1>
          <div className="space-x-4">
            <Link to="/" className="hover:underline">Home</Link>
            <Link to="/about" className="hover:underline">About</Link>
          </div>
        </nav>
      </header>

      <main className="p-8">
        <h2 className="text-3xl font-bold mb-4">Welcome</h2>
        <p className="text-gray-600 mb-6">
          This is the home page of your application.
        </p>
        <Link to="/about" className="text-blue-600 hover:underline">
          Learn more about us →
        </Link>
      </main>
    </div>
  )
}