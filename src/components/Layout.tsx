import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";

export default function Layout() {
    return (
        <div className="flex min-h-screen">
            <NavBar />
            <main className="flex-1 p-6">
                <Outlet />
            </main>
        </div>
    );
}