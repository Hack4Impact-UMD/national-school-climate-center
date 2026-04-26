import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import { InactiveLogout } from "./InactiveLogout"
import { Logout } from "./LogoutWarning"

export default function Layout() {
  const {popUp, countdown} = InactiveLogout()
  return (
    <div className="flex h-screen overflow-hidden">
      <NavBar />
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>

      <Logout show={popUp} count={countdown}/>
    </div>
  )
}
