import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import LoginForm from "../../features/auth/LoginForm";

const Login = () => {
  const { t } = useTranslation();

  return (
    <main className="max-w-lg px-4 md:px-0 mx-auto py-16 pt-0 md:pt-16">
      <section className="space-y-8 bg-white p-8 shadow-md rounded-xl">
        <h2 className="text-2xl font-semibold text-center capitalize">
          {t("login_to_your_account")}
        </h2>

        <LoginForm />

        <div className="text-sm flex items-center space-x-1.5 mt-2">
          <p>{t("already_have_account")}</p>
          <Link to="/auth/register" className="text-teal-600 font-medium">
            {t("register")}
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Login;
