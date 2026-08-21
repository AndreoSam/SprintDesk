import { NavLink, Outlet } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { useNavigate } from "react-router-dom";

function AppLayout() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded px-3 py-2 ${
      isActive ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100"
    }`;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between p-4">
          <h1 className="text-xl font-bold">SprintDesk</h1>

          <nav className="flex items-center gap-2">
            <NavLink to="/dashboard" className={linkClass}>
              Dashboard
            </NavLink>

            <NavLink to="/board" className={linkClass}>
              Board
            </NavLink>

            <NavLink to="/analytics" className={linkClass}>
              Analytics
            </NavLink>

            <button
              onClick={handleLogout}
              className="rounded bg-red-600 px-3 py-2 text-white"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl">
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
