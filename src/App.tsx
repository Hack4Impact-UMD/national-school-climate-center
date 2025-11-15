import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/public/Home'
import About from './pages/public/About'
import Analytics from './pages/public/Analytics'
import Login from './pages/auth/Login'
import ManageUsers from './pages/admin/ManageUsers'
import General from './pages/admin/General'
import SurveyBuilder from './pages/survey/SurveyBuilder'
import CreateChallengeSurvey from './pages/survey/CreateChallengeSurvey'
import AllSurveys from './pages/survey/AllSurveys'
import Layout from './components/layout/Layout'
import { ProtectedRoute } from './components/auth/ProtectedRoute'

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />

      {/* Authenticated shell */}
      <Route element={<ProtectedRoute requireAuth />}>
        <Route element={<Layout />}>
          <Route index element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />

          {/* Action-gated */}
          <Route element={<ProtectedRoute requiredAction="create" />}>
            <Route path="/surveys/builder" element={<SurveyBuilder />} />
            <Route path="/surveys/create/challenge" element={<CreateChallengeSurvey />} />
            <Route path="/surveys" element={<AllSurveys />} />
            <Route path="/analytics" element={<Analytics />} />
          </Route>

          <Route element={<ProtectedRoute requiredAction="manage_users" />}>
            <Route path="/manage-users" element={<ManageUsers />} />
            <Route path="/general" element={<General />} />
          </Route>
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
