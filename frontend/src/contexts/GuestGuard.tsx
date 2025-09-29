import { Navigate, useLocation } from "react-router";
import { useAuth } from "../hooks/useAuth";

const GuestGuard = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();

  const location = useLocation();

  // If coming from ProtectedRoute
  const from = location.state?.from?.pathname || "/";

  if (user) {
    // Redirect based on role
    switch (user.role) {
      case "admin":
        return <Navigate to="/admin/dashboard" replace />;
      case "user":
        return <Navigate to="/resumes" replace />;
      default:
        return <Navigate to={from} replace />;
    }
  }

  return children;
};

export default GuestGuard;
