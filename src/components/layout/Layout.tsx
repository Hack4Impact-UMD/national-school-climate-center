import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import { InactiveLogout } from "./InactiveLogout"

export default function Layout() {
  InactiveLogout()
  return (
    <div className="flex h-screen overflow-hidden">
      <NavBar />
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
