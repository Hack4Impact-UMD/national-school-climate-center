import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Login from './pages/auth/Login'
import ManageUsers from './pages/Admin'
import Settings from './pages/Settings'
import Analytics from './pages/Analytics'
import SurveyBuilder from './pages/SurveyBuilder'
import AllSurveys from './pages/surveys/AllSurveys'
import CreateSurvey from './pages/CreateSurvey'
import Layout from './components/Layout'
import { ProtectedRoute } from './components/ProtectedRoute'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />

        <Route element={<ProtectedRoute requireAuth />}>
          <Route path="/settings" element={<Settings />} />
        </Route>

        <Route element={<ProtectedRoute requiredAction="create" />}>
          <Route path="/surveys/builder" element={<SurveyBuilder />} />
          <Route path="/surveys" element={<AllSurveys />} />
          <Route path="/surveys/create" element={<CreateSurvey />} />
          <Route path="/analytics" element={<Analytics />} />
        </Route>

        <Route element={<ProtectedRoute requiredAction="manage_users" />}>
          <Route path="/manage-users" element={<ManageUsers />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
