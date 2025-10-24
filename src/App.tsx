import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Login from './pages/auth/Login'
import Admin from './pages/Admin'
import Layout from './components/Layout'
import { AdminOnlyRoute } from './components/AdminOnlyRoute'

function App() {
  return (
    <div className="flex">
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />

          {/* Protected admin routes - only accessible by admin role */}
          <Route element={<AdminOnlyRoute />}>
            <Route path="/admin" element={<Admin />} />
          </Route>
        </Route>
      </Routes>
    </div>
  )
}

export default App
