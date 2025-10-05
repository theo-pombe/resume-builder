import { useTranslation } from "react-i18next";
import SectionHeader from "../../components/SectionHeader";
import SectionDivider from "../../components/ui/SectionDivider";
import { useState } from "react";

const SchoolQualifications = () => {
  const { t } = useTranslation();
  const [editing] = useState();

  return (
    <div className="relative p-6">
      <SectionHeader title={t("school_background")} />

      <SectionDivider
        title={editing ? t("edit_qualification") : t("new_qualification")}
      />
    </div>
  );
};

export default SchoolQualifications;
