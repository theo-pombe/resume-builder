import { useTranslation } from "react-i18next";
import { Link } from "react-router";

function NotFound() {
  const { t } = useTranslation();

  return (
    <main className="flex flex-col items-center justify-center min-h-[70vh] p-12 text-center">
      <h1 className="text-5xl font-bold text-red-600">404</h1>
      <p className="mt-4 text-2xl text-gray-700">{t("page_not_found")}</p>
      <p className="mt-2 text-gray-500">{t("page_not_found_message")}</p>

      <Link
        to="/"
        className="mt-6 inline-block px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md transition"
      >
        {t("go_home")}
      </Link>
    </main>
  );
}

export default NotFound;
