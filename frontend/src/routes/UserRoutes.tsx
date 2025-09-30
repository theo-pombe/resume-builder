import { Route } from "react-router";
import AppLayout from "../layouts/AppLayout";
import Home from "../pages/Home";
import HowItWorks from "../pages/HowItWorks";
import Contact from "../pages/Contact";
import Resumes from "../pages/resumes/resumes";
import { UserGuard } from "../contexts/ProtectedRoutes";
import ResumeLayout from "../layouts/ResumeLayout";
import Templates from "../pages/templates/templates";
import Resume from "../pages/resumes/resume";
import Template from "../pages/templates/template";

const UserRoutes = () => {
  return (
    <Route path="/" element={<AppLayout />}>
      <Route index element={<Home />} />

      <Route
        path="resumes"
        element={
          <UserGuard>
            <Resumes />
          </UserGuard>
        }
      />

      <Route
        path="resumes/:id"
        element={
          <UserGuard>
            <ResumeLayout />
          </UserGuard>
        }
      >
        <Route index element={<Resume />} />
      </Route>

      <Route path="templates">
        <Route index element={<Templates />} />

        <Route
          path=":slug"
          element={
            <UserGuard>
              <Template />
            </UserGuard>
          }
        />
      </Route>

      <Route path="how-it-works" element={<HowItWorks />} />
      <Route path="contact" element={<Contact />} />
    </Route>
  );
};

export default UserRoutes;
