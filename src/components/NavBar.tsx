import React from 'react';

const NavBar: React.FC = () => {
    return (
        <nav className="bg-primary text-primary-foreground min-h-screen w-80"> 
        <div className = "flex">
            <div className="w-15 h-15 rounded-full bg-gray-300 overflow-hidden m-3 p-5">
                <img
                    src=""
                    className="w-full h-full object-cover"
                />
            </div>
            <div className = "pt-5 ml-3">
                <h3 className="font-heading text-2xl text-heading text-white">
                    Username
                </h3>
                <p className="font-body text-base text-body text-white">
                    NSCC Admin
                </p>
            </div>
        </div>
        <div className = "ml-5 text-white mt-30 text-white">
            <p className="font-body text-base text-body text-white">
                Survey Creation
            </p>
            <div className = "mt-3 ml-7 text-lg mb-20">
                <div className = "flex">
                    <h3 className="font-heading text-2xl text-heading text-white mb-4">
                        Survey Builder
                    </h3>
                    <h3 className="font-heading text-2xl text-heading text-white ml-15">
                        ᐳ
                    </h3>
                </div>
                <div className = "flex">
                    <h3 className="font-heading text-2xl text-heading text-white mb-4">
                         All Surveys
                    </h3>
                    <h3 className="font-heading text-2xl text-heading text-white ml-24">
                        ᐳ
                    </h3>
                </div>
                <div className = "flex">
                    <h3 className="font-heading text-2xl text-heading text-white">
                        Survey Analytics
                    </h3>
                    <h3 className="font-heading text-2xl text-heading text-white ml-10">
                        ᐳ
                    </h3>
                </div>
            </div>
            <p className="font-body text-base text-body text-white">
                Settings
            </p>
            <div className = "mt-3 ml-7 text-lg">
                <div className = "flex">
                    <h3 className="font-heading text-2xl text-heading text-white mb-4">
                        General
                    </h3>
                    <h3 className="font-heading text-2xl text-heading text-white ml-32">
                        ᐳ
                    </h3>
                </div>
                <div className = "flex">
                    <h3 className="font-heading text-2xl text-heading text-white mb-4">
                        Manage Users
                    </h3>
                    <h3 className="font-heading text-2xl text-heading text-white ml-14">
                        ᐳ
                    </h3>
                </div>
            </div>
        </div>
      </nav>
    );
  };
export default NavBar;