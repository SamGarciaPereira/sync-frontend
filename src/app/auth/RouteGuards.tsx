import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Logo } from "../components/Logo";
import { useAuth } from "./authContext";

function FullScreenLoading() {
  return (
    <div className="app-shell flex min-h-svh items-center justify-center">
      <div className="text-center text-heading">
        <Logo size="lg" />
        <p className="mt-3 text-muted">Carregando...</p>
      </div>
    </div>
  );
}

/** Only logged-in users get through; others go to /entrar (and come back after). */
export function RequireAuth() {
  const { status } = useAuth();
  const location = useLocation();

  if (status === "checking") return <FullScreenLoading />;
  if (status === "guest") {
    return (
      <Navigate to="/entrar" replace state={{ from: location.pathname + location.search }} />
    );
  }
  return <Outlet />;
}

/** Welcome, sign-in and sign-up: a logged-in user goes straight to the app. */
export function GuestOnly() {
  const { status } = useAuth();
  const location = useLocation();

  if (status === "checking") return <FullScreenLoading />;
  if (status === "authenticated") {
    const from = (location.state as { from?: string } | null)?.from ?? "/app";
    return <Navigate to={from} replace />;
  }
  return <Outlet />;
}
