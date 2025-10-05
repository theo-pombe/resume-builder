import { useState } from "react";
import Select from "../../components/form/Select";
import { useTranslation } from "react-i18next";

const Preview = () => {
  const { t } = useTranslation();
  const [template, setTemplate] = useState<"minimal" | "classic" | "modern">(
    "classic"
  );

  const handleTemplateChange = (value: "minimal" | "classic" | "modern") => {
    setTemplate(value);
    localStorage.setItem("resume_template", value);
  };

  const handlePrint = () => {};

  return (
    <div className="p-6 relative">
      <div className="flex items-center justify-between absolute right-6 left-6 -top-2">
        <Select
          name="template"
          value={template}
          onChange={(e) => handleTemplateChange(e.target.value as any)}
        >
          <option value="minimal">{t("minimal_template")}</option>
          <option value="classic">{t("classic_template")}</option>
          <option value="modern">{t("modern_template")}</option>
        </Select>

        <button
          className="px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
          onClick={handlePrint}
        >
          {t("print_save_pdf")}
        </button>
      </div>
    </div>
  );
};

export default Preview;
