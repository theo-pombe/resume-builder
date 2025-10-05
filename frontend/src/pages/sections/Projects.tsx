import { useTranslation } from "react-i18next";
import SectionHeader from "../../components/SectionHeader";
import SectionDivider from "../../components/ui/SectionDivider";
import { useState } from "react";

const Projects = () => {
  const { t } = useTranslation();
  const [editing] = useState();

  return (
    <div className="relative p-6">
      <SectionHeader title={t("projects")} />

      <SectionDivider title={editing ? t("edit_project") : t("new_project")} />
    </div>
  );
};

export default Projects;
