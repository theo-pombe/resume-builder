import { Navigate, Route } from "react-router";
import AdminLayout from "../layouts/admin/AdminLayout";
import Dashboard from "../pages/admin/dashboard";
import { AdminGuard } from "../contexts/ProtectedRoutes";
import Users from "../pages/admin/users/Users";
import UserDetails from "../pages/admin/users/UserDetails";
import Resumes from "../pages/admin/resumes/Resumes";
import ResumeDetails from "../pages/admin/resumes/ResumeDetails";
import PersonalInfos from "../pages/admin/sections/PersonalInfos";
import Referees from "../pages/admin/sections/Referees";
import Skills from "../pages/admin/sections/Skills";
import Experiences from "../pages/admin/sections/Experiences";
import Projects from "../pages/admin/sections/Projects";
import Academics from "../pages/admin/sections/Academics";
import Schools from "../pages/admin/sections/Schools";

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

      <Route path="sections">
        <Route path="personal-informations" element={<PersonalInfos />} />
        <Route path="school-qualifications" element={<Schools />} />
        <Route path="academic-qualifications" element={<Academics />} />
        <Route path="projects" element={<Projects />} />
        <Route path="work-experiences" element={<Experiences />} />
        <Route path="skills" element={<Skills />} />
        <Route path="referees" element={<Referees />} />
      </Route>
    </Route>
  );
};

export default AdminRoutes;
