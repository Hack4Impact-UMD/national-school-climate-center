import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Login from './pages/auth/Login'
import Admin from './pages/Admin'
import Layout from './components/Layout'
import { Guard } from './components/ui/Guard'
<<<<<<< Updated upstream
<<<<<<< Updated upstream
import AccessDenied from '@/components/AccessDenied'


/* import SurveyBuilder from './pages/SurveyBuilder'
import AllSurveys from './pages/AllSurveys'
import SurveyAnalytics from './pages/SurveyAnalytics'
import General from './pages/General'
import ManageUsers from './pages/ManageUsers' */
=======
=======
>>>>>>> Stashed changes


{/* import SurveyBuilder from './pages/SurveyBuilder'
import AllSurveys from './pages/AllSurveys'
import SurveyAnalytics from './pages/SurveyAnalytics'
import General from './pages/General'
import ManageUsers from './pages/ManageUsers' */}
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes


function App() {
 return (
   <div className="flex">
     <Routes>
       <Route element={<Layout />}>
         <Route path="/" element={<Home />} />
         <Route path="/about" element={<About />} />
         <Route path="/login" element={<Login />} />
         {/*
         <Route
           path="/surveybuilder"
           element={
<<<<<<< Updated upstream
<<<<<<< Updated upstream
             <Guard do="read" fallback={<AccessDenied />}>
=======
             <Guard do="read" fallback={<p>Signed-in users only</p>}>
>>>>>>> Stashed changes
=======
             <Guard do="read" fallback={<p>Signed-in users only</p>}>
>>>>>>> Stashed changes
               <SurveyBuilder />
             </Guard>
           }
         />


         <Route
           path="/allsurveys"
           element={
<<<<<<< Updated upstream
<<<<<<< Updated upstream
             <Guard do="read" fallback={<AccessDenied />}>
=======
             <Guard do="read" fallback={<p>Signed-in users only</p>}>
>>>>>>> Stashed changes
=======
             <Guard do="read" fallback={<p>Signed-in users only</p>}>
>>>>>>> Stashed changes
               <AllSurveys />
             </Guard>
           }
         />
        
         <Route
           path="/surveyanalytics"
           element={
<<<<<<< Updated upstream
<<<<<<< Updated upstream
             <Guard do="read" fallback={<AccessDenied />}>
=======
             <Guard do="read" fallback={<p>Signed-in only</p>}>
>>>>>>> Stashed changes
=======
             <Guard do="read" fallback={<p>Signed-in only</p>}>
>>>>>>> Stashed changes
               <SurveyAnalytics />
             </Guard>
           }
         />


         <Route
           path="/general"
           element={
<<<<<<< Updated upstream
<<<<<<< Updated upstream
             <Guard do="update" fallback={<AccessDenied />}>
=======
             <Guard do="update" fallback={<p>Admins only</p>}>
>>>>>>> Stashed changes
=======
             <Guard do="update" fallback={<p>Admins only</p>}>
>>>>>>> Stashed changes
               <General />
             </Guard>
           }
         />


         <Route
           path="/manageusers"
           element={
<<<<<<< Updated upstream
<<<<<<< Updated upstream
             <Guard do="manage_users" fallback={<AccessDenied />}>
=======
             <Guard do="manage_users" fallback={<p>Admins only</p>}>
>>>>>>> Stashed changes
=======
             <Guard do="manage_users" fallback={<p>Admins only</p>}>
>>>>>>> Stashed changes
               <ManageUsers />
             </Guard>
           }
         />
         */}
<<<<<<< Updated upstream
<<<<<<< Updated upstream
         
         <Route
           path="/admin"
           element={
             <Guard do="manage_users" fallback={<AccessDenied />}>
=======
=======
>>>>>>> Stashed changes


         <Route
           path="/admin"
           element={
             <Guard do="manage_users" fallback={<p>Admins only</p>}>
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
               <Admin />
             </Guard>
           }
         />
       </Route>
     </Routes>
   </div>
 )
}


export default App