import NavItem from "./ui/NavItem";
import { useTranslation } from "react-i18next";

const TopNavBar = () => {
  const { t } = useTranslation();

  const navLinks = [
    { to: "/", label: t("home") },
    { to: "/resumes", label: t("resumes") },
    { to: "/templates", label: t("templates") },
    { to: "/how-it-works", label: t("how_it_works") },
    { to: "/contact", label: t("contact") },
  ];

  return (
    <nav
      className="hidden items-center justify-between w-full md:flex md:w-auto md:order-1"
      id="navbar-sticky"
    >
      <ul className="flex flex-col p-4 mt-4 rounded-lg bg-amber-50 md:p-0 md:space-x-8 md:flex-row md:mt-0 md:bg-white w-full">
        {navLinks.map((link) => (
          <NavItem key={link.to} to={link.to} label={link.label} />
        ))}
      </ul>
    </nav>
  );
};

export default TopNavBar;
