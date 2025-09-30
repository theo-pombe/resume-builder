import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { useAuth } from "../../hooks/useAuth";

const Logo = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="text-lg font-bold text-slate-800 p-2">
      {user?.role === "admin" ? (
        <Link to="/admin/dashboard">{t("logo")}</Link>
      ) : (
        <Link to="/">{t("logo")}</Link>
      )}
    </div>
  );
};

export default Logo;
