import { NavLink, Outlet, useNavigate } from "react-router-dom";

import { useState } from "react";

import { useAuthStore } from "../../stores/authStore";

import { useThemeStore } from "../../stores/themeStore";

import NotificationBell from "../notifications/NotificationBell";
import Button from "../ui/Button";

function AppLayout() {
  const navigate = useNavigate();

  const logout = useAuthStore((state) => state.logout);

  const theme = useThemeStore((state) => state.theme);

  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition ${
      isActive
        ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
        : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
    }`;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              SprintDesk
            </h1>

            <nav className="hidden items-center gap-1 md:flex">
              <NavLink to="/dashboard" className={linkClass}>
                Dashboard
              </NavLink>

              <NavLink to="/board" className={linkClass}>
                Board
              </NavLink>

              <NavLink to="/analytics" className={linkClass}>
                Analytics
              </NavLink>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="rounded-lg px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {theme === "light" ? "🌙" : "☀️"}
            </button>

            <NotificationBell />

            <div className="hidden md:block">
              <Button variant="danger" onClick={handleLogout}>
                Logout
              </Button>
            </div>

            <button
              type="button"
              aria-label="Open navigation"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((current) => !current)}
              className="rounded-lg p-2 text-xl hover:bg-gray-100 dark:hover:bg-gray-800 md:hidden"
            >
              ☰
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="border-t border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-900 md:hidden">
            <nav className="flex flex-col gap-2">
              <NavLink
                to="/dashboard"
                className={linkClass}
                onClick={() => setMobileOpen(false)}
              >
                Dashboard
              </NavLink>

              <NavLink
                to="/board"
                className={linkClass}
                onClick={() => setMobileOpen(false)}
              >
                Board
              </NavLink>

              <NavLink
                to="/analytics"
                className={linkClass}
                onClick={() => setMobileOpen(false)}
              >
                Analytics
              </NavLink>

              <Button variant="danger" onClick={handleLogout} fullWidth>
                Logout
              </Button>
            </nav>
          </div>
        )}
      </header>

      <main className="mx-auto max-w-7xl">
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
