import { Routes, Route, Navigate } from 'react-router-dom'
import About from './pages/public/About'
import Analytics from './pages/public/Analytics'
import Login from './pages/auth/Login'
import CreateAccountNSCC from './pages/auth/CreateAccountNSCC'
import CreateAccountSchool from './pages/auth/CreateAccountSchool'
import ManageUsers from './pages/admin/ManageUsers'
import Account from './pages/admin/Account'
import ChangePassword from './pages/admin/ChangePassword'
import SurveyBuilder from './pages/survey/SurveyBuilder'
import CreateChallengeSurvey from './pages/survey/CreateChallengeSurvey'
import CreatePulseSurvey from './pages/survey/CreatePulseSurvey'
import AllSurveys from './pages/survey/AllSurveys'
import SurveyDetails from './pages/survey/SurveyDetails'
import Layout from './components/layout/Layout'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import ReviewSurveyPage from "./pages/survey/ReviewSurveyPage";
import SurveyLandingPage from './pages/public/SurveyLandingPage'
import TakeSurvey from './pages/survey/TakeSurvey'
import AcceptInvite from './pages/auth/AcceptInvite'

/**
 * Defines the application's top-level route map and routing structure.
 *
 * @returns The root React element that renders the application's route tree
 */
export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />
      <Route path="/create-account/nscc" element={<CreateAccountNSCC />} />
      <Route path="/create-account/school" element={<CreateAccountSchool />} />
      <Route path="/surveys/respond/:surveyId" element={<SurveyLandingPage />} />
      <Route path="/surveys/take/:surveyId" element={<TakeSurvey />} />
      <Route path="/accept-invite" element={<AcceptInvite />} />

      {/* Authenticated shell */}
      <Route element={<ProtectedRoute requireAuth />}>
        <Route element={<Layout />}>
          <Route index element={<Navigate to="/analytics" replace />} />
          <Route path="/home" element={<Navigate to="/analytics" replace />} />
          <Route path="/about" element={<About />} />

          {/* Action-gated */}
          <Route element={<ProtectedRoute requiredAction="create" />}>
            <Route path="/surveys/builder" element={<SurveyBuilder />} />
            <Route
              path="/surveys/create/challenge"
              element={<CreateChallengeSurvey />}
            />
            <Route
              path="/surveys/create/challenge/review"
              element={<ReviewSurveyPage defaultSurveyType="Challenge" />}
            />

            <Route
              path="/surveys/create/pulse"
              element={<CreatePulseSurvey />}
            />
            <Route
              path="/surveys/create/pulse/review"
              element={<ReviewSurveyPage defaultSurveyType="Pulse" />}
            />

            <Route path="/surveys" element={<AllSurveys />} />
          </Route>

          <Route element={<ProtectedRoute requiredAction="read" />}>
            <Route path="/analytics" element={<Analytics />} />
          </Route>

          <Route element={<ProtectedRoute requiredAction="read" />}>
            <Route path="/account" element={<Account />} />
            <Route
              path="/account/change-password"
              element={<ChangePassword />}
            />
          </Route>

          {/* NSCC admin-only */}
          <Route element={<ProtectedRoute requiredAction="manage_users" />}>
            <Route path="/surveys" element={<AllSurveys />} />
            <Route path="/surveys/:surveyId" element={<SurveyDetails />} />
            <Route path="/manage-users" element={<ManageUsers />} />
          </Route>
          {/* <Route path="/demo" element={<DatabaseDemo />} /> */}
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}