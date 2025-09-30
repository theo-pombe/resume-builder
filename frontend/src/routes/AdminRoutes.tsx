import { Navigate, Route } from "react-router";
import AdminLayout from "../layouts/admin/AdminLayout";
import Dashboard from "../pages/admin/dashboard";
import { AdminGuard } from "../contexts/ProtectedRoutes";
import Users from "../pages/admin/users/Users";
import UserDetails from "../pages/admin/users/UserDetails";
import Resumes from "../pages/admin/resumes/Resumes";
import ResumeDetails from "../pages/admin/resumes/ResumeDetails";

const AdminRoutes = () => {
  return (
    <Route
      path="/admin"
      element={
        <AdminGuard>
          <AdminLayout />
        </AdminGuard>
      }
    >
      <Route index element={<Navigate to="dashboard" replace />} />

      <Route path="dashboard" element={<Dashboard />} />

      <Route path="users">
        <Route index element={<Users />} />
        <Route path=":username" element={<UserDetails />} />
      </Route>

      <Route path="resumes">
        <Route index element={<Resumes />} />
        <Route path=":id" element={<ResumeDetails />} />
      </Route>
    </Route>
  );
};

export default AdminRoutes;
