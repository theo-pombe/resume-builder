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
import ResumeNew from "../pages/resumes/resumeNew";
import WorkExperiences from "../pages/sections/WorkExperiences";
import PersonalInfo from "../pages/sections/PersonalInfo";
import SchoolQualifications from "../pages/sections/SchoolQualifications";
import AcademicQualifications from "../pages/sections/AcademicQualifications";
import Preview from "../pages/resumes/Preview";
import Referees from "../pages/sections/Referees";
import Projects from "../pages/sections/Projects";
import Skills from "../pages/sections/Skills";

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
        path="resumes/new"
        element={
          <UserGuard>
            <ResumeNew />
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

        <Route path="personal-information" element={<PersonalInfo />} />

        <Route
          path="school-qualifications"
          element={<SchoolQualifications />}
        />
        <Route
          path="academic-qualifications"
          element={<AcademicQualifications />}
        />

        <Route path="projects" element={<Projects />} />
        <Route path="work-experiences" element={<WorkExperiences />} />
        <Route path="skills" element={<Skills />} />
        <Route path="referees" element={<Referees />} />

        <Route path="preview" element={<Preview />} />
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
