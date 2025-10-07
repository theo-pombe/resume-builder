import { useTranslation } from "react-i18next";
import SectionHeader from "../../components/SectionHeader";
import SectionDivider from "../../components/ui/SectionDivider";

const Projects = () => {
  const { t } = useTranslation();

  return (
    <div className="relative p-6">
      <SectionHeader title={t("projects")} />

      <SectionDivider title={t("projects")} />
    </div>
  );
};

export default Projects;
