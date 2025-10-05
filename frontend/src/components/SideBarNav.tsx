import { useTranslation } from "react-i18next";
import SideNavItem from "./SideNavItem";
import { useParams } from "react-router";

const SideBarNav = () => {
  const { t } = useTranslation();
  const { id } = useParams();

  const navItems = [
    { label: t("resume_summary"), to: `/resumes/${id}` },
    { label: t("personal_information"), to: "personal-information" },
    {
      label: t("education_background"),
      children: [
        {
          label: t("school_qualifications"),
          to: "school-qualifications",
        },
        {
          label: t("academic_qualifications"),
          to: "academic-qualifications",
        },
      ],
    },
    { label: t("projects"), to: "projects" },
    { label: t("work_experiences"), to: "work-experiences" },
    { label: t("skills"), to: "skills" },
    { label: t("referees"), to: "referees" },
    { label: t("preview_and_export"), to: "preview" },
  ];

  return (
    <nav>
      <ul className="space-y-1">
        {navItems.map((item) => (
          <SideNavItem key={item.label} item={item} />
        ))}
      </ul>
    </nav>
  );
};

export default SideBarNav;
