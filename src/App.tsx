import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Login from './pages/auth/Login'
import Admin from './pages/Admin'
import Layout from './components/Layout'
import { Guard } from './components/ui/Guard'
import AccessDenied from '@/components/AccessDenied'


/* import SurveyBuilder from './pages/SurveyBuilder'
import AllSurveys from './pages/AllSurveys'
import SurveyAnalytics from './pages/SurveyAnalytics'
import General from './pages/General'
import ManageUsers from './pages/ManageUsers' */


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
             <Guard do="read" fallback={<AccessDenied />}>
               <SurveyBuilder />
             </Guard>
           }
         />


         <Route
           path="/allsurveys"
           element={
             <Guard do="read" fallback={<AccessDenied />}>
               <AllSurveys />
             </Guard>
           }
         />
        
         <Route
           path="/surveyanalytics"
           element={
             <Guard do="read" fallback={<AccessDenied />}>
               <SurveyAnalytics />
             </Guard>
           }
         />


         <Route
           path="/general"
           element={
             <Guard do="update" fallback={<AccessDenied />}>
               <General />
             </Guard>
           }
         />


         <Route
           path="/manageusers"
           element={
             <Guard do="manage_users" fallback={<AccessDenied />}>
               <ManageUsers />
             </Guard>
           }
         />
         */}
         
         <Route
           path="/admin"
           element={
             <Guard do="manage_users" fallback={<AccessDenied />}>
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