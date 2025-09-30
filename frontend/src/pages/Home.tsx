import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

const Home = () => {
  const { t } = useTranslation();

  return (
    <>
      <section className="sm:px-6 lg:px-20 pt-10 pb-20 flex flex-col-reverse md:flex-row items-center gap-12">
        <article className="space-y-6 text-center md:text-left md:basis-1/2">
          <div className="space-y-3 max-w-md md:max-w-lg">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900">
              {t("cta_title")}
            </h2>
            <p className="text-lg text-gray-500 leading-snug">
              {t("cta_description")}
            </p>
          </div>

          <Link
            to="/resume"
            className="inline-flex items-center gap-2 bg-amber-800 text-white hover:bg-slate-800 transition-colors rounded-lg font-medium px-8 py-3"
          >
            {t("cta_button")}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </article>

        <article className="w-full max-w-sm lg:max-w-md">
          <img
            src="images/cta-image.svg"
            alt={t("cta_image_alt")}
            className="w-full h-auto object-contain"
          />
        </article>
      </section>
    </>
  );
};

export default Home;
