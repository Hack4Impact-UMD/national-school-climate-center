import React from 'react';
import { NavLink } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
<<<<<<< Updated upstream
<<<<<<< Updated upstream
=======
import { Guard } from '@/components/ui/Guard'

>>>>>>> Stashed changes
=======
import { Guard } from '@/components/ui/Guard'

>>>>>>> Stashed changes

const NavBar: React.FC = () => {
   const { role } = useAuth()

<<<<<<< Updated upstream
<<<<<<< Updated upstream
=======
=======
>>>>>>> Stashed changes

   const canSeeSurvey = role === 'super_admin' || role === 'admin' || role === 'school_personnel'
   const canSeeSettings = role === 'super_admin' || role === 'admin'


<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
   return (
       <nav className="bg-primary text-primary-foreground min-h-screen w-80 pr-6">
       <div className = "flex items-center p-4">
           <div className="w-16 h-16 rounded-full bg-gray-300 overflow-hidden">
               <img
                   src=""
                   className="w-full h-full object-cover"
               />
           </div>
           <div className = "ml-4">
               <h3 className="font-heading text-2xl text-heading text-white">
                   Username
               </h3>
               <p className="font-body text-base text-body text-white">
                   {role ? role.replace('_',' ') : 'Guest'}
               </p>
           </div>
       </div>


       <div className = "ml-5 text-white mt-28">
<<<<<<< Updated upstream
<<<<<<< Updated upstream
            <p className="font-body text-base text-body text-white">
                Survey Creation
            </p>
            <div className = "mt-3 ml-7 text-lg mb-20 space-y-2">
                <NavLink to="/surveybuilder" className = "flex items-center cursor-pointer justify-between">
                    <h3 className="font-heading text-2xl text-heading text-white mb-1">
                        Survey Builder
                    </h3>
                    <span className="font-heading text-2xl text-white">
                        ᐳ
                    </span>
                </NavLink>
                <NavLink to="/allsurveys" className = "flex items-center cursor-pointer justify-between">
                    <h3 className="font-heading text-2xl text-heading text-white mb-1">
                        All Surveys
                    </h3>
                    <span className="font-heading text-2xl text-white">
                        ᐳ
                    </span>
                </NavLink>
                <NavLink to="/surveyanalytics" className = "flex items-center cursor-pointer justify-between">
                    <h3 className="font-heading text-2xl text-heading text-white">
                        Survey Analytics
                    </h3>
                    <span className="font-heading text-2xl text-white">
                        ᐳ
                    </span>
                </NavLink>
            </div>

            <p className="font-body text-base text-body text-white">
                Settings
            </p>
            <div className = "mt-3 ml-7 text-lg space-y-2">
                <NavLink to="/general" className = "flex items-center cursor-pointer justify-between">
                    <h3 className="font-heading text-2xl text-heading text-white mb-1">
                        General
                    </h3>
                    <span className="font-heading text-2xl text-white">
                        ᐳ
                    </span>
                </NavLink>
                <NavLink to="/manageusers" className = "flex items-center cursor-pointer justify-between">
                    <h3 className="font-heading text-2xl text-heading text-white mb-1">
                        Manage Users
                    </h3>
                    <span className="font-heading text-2xl text-white">
                        ᐳ
                    </span>
                </NavLink>
            </div>
=======
=======
>>>>>>> Stashed changes
           {canSeeSurvey && (
               <>
                   <p className="font-body text-base text-body text-white">
                       Survey Creation
                   </p>
                   <div className = "mt-3 ml-7 text-lg mb-20 space-y-2">
                       <NavLink to="/surveybuilder" className = "flex items-center justify-between">
                           <h3 className="font-heading text-2xl text-heading text-white mb-1">
                               Survey Builder
                           </h3>
                           <span className="font-heading text-2xl text-white">
                               ᐳ
                           </span>
                       </NavLink>
                       <NavLink to="/allsurveys" className = "flex items-center justify-between">
                           <h3 className="font-heading text-2xl text-heading text-white mb-1">
                               All Surveys
                           </h3>
                           <span className="font-heading text-2xl text-white">
                               ᐳ
                           </span>
                       </NavLink>
                       <NavLink to="/surveyanalytics" className = "flex items-center justify-between">
                           <h3 className="font-heading text-2xl text-heading text-white">
                               Survey Analytics
                           </h3>
                           <span className="font-heading text-2xl text-white">
                               ᐳ
                           </span>
                       </NavLink>
                   </div>
               </>
           )}
           {canSeeSettings && (
               <>
                   <p className="font-body text-base text-body text-white">
                       Settings
                   </p>
                   <div className = "mt-3 ml-7 text-lg space-y-2">
                       <NavLink to="/general" className = "flex items-center justify-between">
                           <h3 className="font-heading text-2xl text-heading text-white mb-1">
                               General
                           </h3>
                           <span className="font-heading text-2xl text-white">
                               ᐳ
                           </span>
                       </NavLink>
                       <Guard do="manage_users">
                       <NavLink to="/manageusers" className = "flex items-center justify-between">
                           <h3 className="font-heading text-2xl text-heading text-white mb-1">
                               Manage Users
                           </h3>
                           <span className="font-heading text-2xl text-white">
                               ᐳ
                           </span>
                       </NavLink>
                       </Guard>
                   </div>
               </>
           )}
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
       </div>
     </nav>
   );
 };
<<<<<<< Updated upstream
<<<<<<< Updated upstream
export default NavBar;
=======
export default NavBar;
>>>>>>> Stashed changes
=======
export default NavBar;
>>>>>>> Stashed changes
