import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Login from './pages/auth/Login'
import ManageUsers from './pages/Admin'
import Analytics from './pages/Analytics'
import SurveyBuilder from './pages/SurveyBuilder'
import AllSurveys from './pages/surveys/AllSurveys'
import CreateChallengeSurvey from './pages/CreateChallengeSurvey'
import Layout from './components/Layout'
import { ProtectedRoute } from './components/ProtectedRoute'

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
            <Route
              path="/surveys/create/challenge"
              element={<CreateChallengeSurvey />}
            />
            <Route path="/surveys" element={<AllSurveys />} />
            <Route path="/analytics" element={<Analytics />} />
          </Route>

          <Route element={<ProtectedRoute requiredAction="manage_users" />}>
            <Route path="/manage-users" element={<ManageUsers />} />
          </Route>
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
