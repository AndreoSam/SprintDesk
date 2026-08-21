import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { lazy, Suspense } from "react";

import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import AppLayout from "./components/layout/AppLayout";

const Login = lazy(() => import("./pages/Login"));

const Dashboard = lazy(() => import("./pages/Dashboard"));

const Board = lazy(() => import("./pages/Board"));

const Analytics = lazy(() => import("./pages/Analytics"));

function PageLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <p className="text-sm text-gray-500">Loading page...</p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />

              <Route path="/board" element={<Board />} />

              <Route path="/analytics" element={<Analytics />} />
            </Route>
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
