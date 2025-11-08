import { Outlet } from "react-router-dom";
import { Navbar } from "./NavBar";

/**
 * This component acts as a wrapper for all protected pages.
 * It renders the Navbar, and then "Outlet" renders the
 * specific page (e.g., DashboardPage, ProfilePage).
 */
export function HeaderLayout() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Outlet renders the child route defined in App.jsx */}
        <Outlet />
      </main>
    </div>
  );
}
