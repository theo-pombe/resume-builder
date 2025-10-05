import { useTranslation } from "react-i18next";
import SectionHeader from "../../components/SectionHeader";
import SectionDivider from "../../components/ui/SectionDivider";

const PersonalInfo = () => {
  const { t } = useTranslation();

  return (
    <div className="relative p-6">
      <SectionHeader title={t("personal_information")} />

      <SectionDivider title={t("personal_details")} />
    </div>
  );
};

export default PersonalInfo;
