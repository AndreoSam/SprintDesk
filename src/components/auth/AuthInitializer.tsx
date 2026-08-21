import { useEffect, type ReactNode } from "react";

import { getCurrentUser, refreshAccessToken } from "../../api/authApi";

import { useAuthStore } from "../../stores/authStore";

interface AuthInitializerProps {
  children: ReactNode;
}

function AuthInitializer({ children }: AuthInitializerProps) {
  const setAuth = useAuthStore((state) => state.setAuth);

  const setInitializing = useAuthStore((state) => state.setInitializing);

  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    const restoreSession = async () => {
      const refreshToken = localStorage.getItem("sprintdesk-refresh-token");

      if (!refreshToken) {
        setInitializing(false);
        return;
      }

      try {
        const tokenResponse = await refreshAccessToken(refreshToken);

        localStorage.setItem(
          "sprintdesk-refresh-token",
          tokenResponse.refreshToken,
        );

        const user = await getCurrentUser(tokenResponse.accessToken);

        setAuth(user, tokenResponse.accessToken);
      } catch {
        logout();
      } finally {
        setInitializing(false);
      }
    };

    restoreSession();
  }, [logout, setAuth, setInitializing]);

  const isInitializing = useAuthStore((state) => state.isInitializing);

  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg font-medium">Loading SprintDesk...</p>
      </div>
    );
  }

  return children;
}

export default AuthInitializer;
