import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import App from "./App";
import AuthInitializer from "./components/auth/AuthInitializer";
import "./index.css";
import ToastContainer from "./components/ui/ToastContainer";
import ThemeInitializer from "./components/theme/ThemeInitializer";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      retry: 1,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthInitializer>
        <ThemeInitializer>
          <App />
          <ToastContainer />
        </ThemeInitializer>
      </AuthInitializer>
    </QueryClientProvider>
  </StrictMode>,
);
