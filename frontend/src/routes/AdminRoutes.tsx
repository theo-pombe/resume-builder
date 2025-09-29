import { Navigate, Route } from "react-router";
import AdminLayout from "../layouts/admin/AdminLayout";
import Dashboard from "../pages/admin/dashboard";

const AdminRoutes = () => {
  return (
    <Route path="/admin" element={<AdminLayout />}>
      <Route index element={<Navigate to="dashboard" replace />} />

      <Route path="dashboard" element={<Dashboard />} />
    </Route>
  );
};

export default AdminRoutes;
