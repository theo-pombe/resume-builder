import { useTranslation } from "react-i18next";
import SectionHeader from "../../components/SectionHeader";
import SectionDivider from "../../components/ui/SectionDivider";

const Skills = () => {
  const { t } = useTranslation();

  return (
    <div className="relative p-6">
      <SectionHeader title={t("skills")} mandatory={false} />

      <SectionDivider title={t("skills")} />
    </div>
  );
};

export default Skills;
