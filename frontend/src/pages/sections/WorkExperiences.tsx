import { useTranslation } from "react-i18next";
import SectionHeader from "../../components/SectionHeader";
import SectionDivider from "../../components/ui/SectionDivider";

const WorkExperiences = () => {
  const { t } = useTranslation();

  return (
    <div className="relative p-6">
      <SectionHeader title={t("work_experiences")} mandatory={false} />

      <SectionDivider title={t("experiences")} />
    </div>
  );
};

export default WorkExperiences;
