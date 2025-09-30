import { UserPlus, LayoutTemplate, Edit3, Download } from "lucide-react";
import { useTranslation } from "react-i18next";
import GridWrapper from "./GridWrapper";

const StepCards = () => {
  const { t } = useTranslation();

  const steps = [
    {
      number: 1,
      title: t("step_1_title"),
      description: t("step_1_description"),
      icon: <UserPlus className="w-4 h-4 text-amber-800" />,
    },
    {
      number: 2,
      title: t("step_2_title"),
      description: t("step_2_description"),
      icon: <LayoutTemplate className="w-4 h-4 text-amber-800" />,
    },
    {
      number: 3,
      title: t("step_3_title"),
      description: t("step_3_description"),
      icon: <Edit3 className="w-4 h-4 text-amber-800" />,
    },
    {
      number: 4,
      title: t("step_4_title"),
      description: t("step_4_description"),
      icon: <Download className="w-4 h-4 text-amber-800" />,
    },
  ];

  return (
    <GridWrapper>
      {steps.map(({ icon, number, title, description }) => (
        <article
          key={number}
          className="shadow-md rounded-xl p-8 hover:shadow-lg transition-transform hover:-translate-y-1 bg-white"
        >
          <div className="flex gap-2">
            <span className="w-8 h-8 rounded-full border border-amber-800 flex items-center justify-center">
              {icon}
            </span>

            <div className="flex-1">
              <h3 className="font-medium text-amber-800">{title}</h3>
              <p className="text-sm">{description}</p>
            </div>
          </div>
        </article>
      ))}
    </GridWrapper>
  );
};

export default StepCards;
