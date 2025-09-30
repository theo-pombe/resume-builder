import { NavLink } from "react-router";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { useAuth } from "../hooks/useAuth";
import Logo from "../components/ui/Logo";
import TopNavBar from "../components/TopNavBar";

const Header = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const toggleNavBar = () => {
    const nav = document.getElementById("navbar-sticky");
    if (nav) nav.classList.toggle("hidden");
  };

  return (
    <header className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
      <div className="max-w-screen-2xl flex flex-wrap items-center mx-auto space-x-6 p-4">
        <Logo />

        <TopNavBar />

        <div className="flex ms-auto md:order-2 space-x-2">
          <LanguageSwitcher />

          {user !== undefined ? (
            <div className="flex space-x-2">{user.username}</div>
          ) : (
            <NavLink
              to="auth/login"
              className="border border-amber-800 rounded-lg font-medium py-1 px-4 text-center text-amber-800"
            >
              {t("login")}
            </NavLink>
          )}

          <button
            onClick={toggleNavBar}
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          >
            <span className="sr-only">{t("open_main_menu")}</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
