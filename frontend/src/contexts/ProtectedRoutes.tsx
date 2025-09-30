import { Navigate, useLocation } from "react-router";
import { useAuth } from "../hooks/useAuth";

type ProtectedRouteProps = {
  children: React.ReactNode;
  allowedRoles: string[];
};

/**
 * ProtectedRoute checks:
 * 1. If user is authenticated
 * 2. If user role is allowed
 * 3. Redirects to /login or /unauthorized as needed
 */
const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user } = useAuth();
  const location = useLocation();

  // Not authenticated → redirect to login with original location
  if (!user) {
    return <Navigate to="/auth/login" replace state={{ from: location }} />;
  }

  // Role not allowed → redirect to unauthorized page
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Authorized → render children
  return <>{children}</>;
};

export default ProtectedRoute;

// --- Optional role-specific wrappers for cleaner routes ---
export const UserGuard = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute allowedRoles={["user"]}>{children}</ProtectedRoute>
);

export const AdminGuard = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute allowedRoles={["admin"]}>{children}</ProtectedRoute>
);
