import { Link } from 'react-router-dom'

export default function About() {
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
        <h2 className="text-3xl font-bold mb-4">About Us</h2>
        <p className="text-gray-600 mb-6">
          This is the about page. Add your content here.
        </p>
        <Link to="/" className="text-blue-600 hover:underline">
          ← Back to Home
        </Link>
      </main>
    </div>
  )
}