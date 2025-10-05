import { useState } from "react";
import { NavLink } from "react-router";

type NavItem = {
  label: string;
  to?: string;
  children?: NavItem[];
};

interface SideNavItemProps {
  item: NavItem;
}

const SideNavItem = ({ item }: SideNavItemProps) => {
  const [open, setOpen] = useState(true);

  if (item.children && item.children.length > 0) {
    return (
      <li>
        <button
          onClick={() => setOpen(!open)}
          className="w-full text-left px-2 py-1 text-sm text-slate-700 text-nowrap hover:text-amber-700 focus:outline-none"
        >
          {item.label} {open ? "−" : "+"}
        </button>
        {open && (
          <ul className="ml-4 mt-1 space-y-1">
            {item.children.map((child) => (
              <SideNavItem key={child.label} item={child} />
            ))}
          </ul>
        )}
      </li>
    );
  }

  return (
    <li>
      <NavLink
        to={item.to!}
        end
        className={({ isActive }) =>
          `block px-2 py-2 rounded text-sm text-nowrap ${
            isActive
              ? "text-amber-700 bg-amber-100"
              : "text-slate-700 hover:text-amber-700"
          }`
        }
      >
        {item.label}
      </NavLink>
    </li>
  );
};

export default SideNavItem;
