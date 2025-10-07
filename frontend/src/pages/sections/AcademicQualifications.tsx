import { useTranslation } from "react-i18next";
import SectionHeader from "../../components/SectionHeader";
import SectionDivider from "../../components/ui/SectionDivider";

const AcademicQualifications = () => {
  const { t } = useTranslation();

  return (
    <div className="relative p-6">
      <SectionHeader title={t("education_background")} mandatory={false} />

      <SectionDivider title={t("academic_qualifications")} />
    </div>
  );
};

export default AcademicQualifications;
