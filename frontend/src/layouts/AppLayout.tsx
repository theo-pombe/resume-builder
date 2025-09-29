import { Outlet } from "react-router";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { useTranslation } from "react-i18next";

const AppLayout = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1>{t("home")}</h1>

        <LanguageSwitcher />
      </div>

      <div className="mt-16 max-w-7xl mx-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AppLayout;
