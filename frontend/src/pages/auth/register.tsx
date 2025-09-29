import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import RegisterForm from "../../features/auth/RegisterForm";

const Register = () => {
  const { t } = useTranslation();

  return (
    <main className="max-w-3xl px-4 md:px-0 mx-auto py-16 pt-0 md:pt-16">
      <section className="space-y-8 bg-white p-8 shadow-md rounded-xl">
        <h2 className="text-2xl font-semibold text-center capitalize">
          {t("register_new_account")}
        </h2>

        <RegisterForm />

        <div className="flex items-center space-x-1.5 mt-2">
          <p>{t("dont_have_account")}</p>
          <Link to="/auth/login" className="text-teal-600 font-medium">
            {t("login")}
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Register;
