import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function AuthRoute() {
  const { status } = useAuth();
  if (status === "loading") return null;
  if (status === "unauthenticated") {
    return <Navigate to="/login" />;
  }
  return <Outlet />;
}

export default AuthRoute;
