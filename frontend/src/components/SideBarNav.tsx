import { useTranslation } from "react-i18next";
import SideNavItem from "./SideNavItem";
import { useParams } from "react-router";

const SideBarNav = () => {
  const { t } = useTranslation();
  const { id } = useParams();

  const navItems = [{ label: t("resume_summary"), to: `/resumes/${id}` }];

  return (
    <nav>
      <ul className="space-y-1">
        {navItems.map((item) => (
          <SideNavItem key={item.label} item={item} />
        ))}
      </ul>
    </nav>
  );
};

export default SideBarNav;
