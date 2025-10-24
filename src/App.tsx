import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Login from './pages/auth/Login'
import Admin from './pages/Admin'
import Layout from './components/Layout'
import DatabaseDemo from './pages/DatabaseDemo'

function App() {
  return (
    <div className="flex">
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          {/* <Route path="/demo" element={<DatabaseDemo />} /> */}
        </Route>
      </Routes>
    </div>
  )
}

export default App
