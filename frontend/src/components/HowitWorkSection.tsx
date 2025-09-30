import { useTranslation } from "react-i18next";
import { Link } from "react-router";

const HowitWorkSection = ({ children }: { children?: React.ReactNode }) => {
  const { t } = useTranslation();

  return (
    <section className="px-6 sm:px-12 py-12 space-y-12 max-w-7xl mx-auto">
      <header className="text-center space-y-4">
        <h1 className="text-3xl sm:text-4xl text-slate-700 font-semibold">
          {t("how_it_works_title")}
        </h1>
        <p className="text-lg text-gray-600 max-w-md mx-auto">
          {t("how_it_works_description")}
        </p>
      </header>

      {children}

      <div className="text-center pt-10">
        <Link
          to="/resumes"
          className="bg-amber-700 hover:bg-amber-800 text-white py-3 px-6 rounded-xl font-medium transition"
        >
          {t("start_building_resume")}
        </Link>
      </div>
    </section>
  );
};

export default HowitWorkSection;
