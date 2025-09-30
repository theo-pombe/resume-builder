import { NavLink } from "react-router";

const NavItem = ({ to, label }: { to: string; label: string }) => {
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          isActive
            ? "text-amber-800 hover:text-amber-700 border-b-2 border-amber-400 block mx-2 py-2 md:mx-0 md:p-0.5"
            : "block border-b-2 border-amber-50 md:border-white mx-2 py-2 md:mx-0 md:p-0.5"
        }
      >
        <span>{label}</span>
      </NavLink>
    </li>
  );
};

export default NavItem;
