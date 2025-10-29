import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Login from './pages/auth/Login'
import Admin from './pages/Admin'
import Layout from './components/Layout'
import SurveyBuilder from './pages/SurveyBuilder'
import CreateSurvey from './pages/CreateSurvey'

function App() {
  return (
    <div className="flex">
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/surveys/builder" element={<SurveyBuilder />} />
          <Route path="/surveys/create" element={<CreateSurvey />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
