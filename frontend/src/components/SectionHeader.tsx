import { useTranslation } from "react-i18next";

const SectionHeader = ({
  title,
  mandatory = true,
}: {
  title: string;
  mandatory?: boolean;
}) => {
  const { t } = useTranslation();

  return (
    <article>
      <h2 className="font-medium text-sm text-gray-600">{title}</h2>
      <p className="text-xs text-gray-600">
        ({mandatory ? t("mandatory_step") : t("optional_step")})
      </p>
    </article>
  );
};

export default SectionHeader;
