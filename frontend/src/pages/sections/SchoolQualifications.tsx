import { useTranslation } from "react-i18next";
import SectionHeader from "../../components/SectionHeader";
import SectionDivider from "../../components/ui/SectionDivider";

const SchoolQualifications = () => {
  const { t } = useTranslation();

  return (
    <div className="relative p-6">
      <SectionHeader title={t("education_background")} />

      <SectionDivider title={t("school_qualifications")} />
    </div>
  );
};

export default SchoolQualifications;
