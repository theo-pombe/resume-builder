import { useTranslation } from "react-i18next";
import SectionHeader from "../../components/SectionHeader";
import SectionDivider from "../../components/ui/SectionDivider";
import { useState } from "react";

const WorkExperiences = () => {
  const { t } = useTranslation();
  const [editing] = useState();

  return (
    <div className="relative p-6">
      <SectionHeader title={t("work_experiences")} mandatory={false} />

      <SectionDivider
        title={editing ? t("edit_experience") : t("new_experience")}
      />
    </div>
  );
};

export default WorkExperiences;
