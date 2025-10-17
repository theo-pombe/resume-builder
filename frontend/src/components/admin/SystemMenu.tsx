import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router";
import { HelpCircle, Mail, Minus, Plus, Settings } from "lucide-react";

const SystemMenu = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const menuLinks = [
    { to: "/admin/system/faqs", label: "FAQs", icon: <HelpCircle size={16} /> },
    {
      to: "/admin/system/messages",
      label: "Messages",
      icon: <Mail size={16} />,
    },
  ];

  useEffect(() => {
    if (menuLinks.some((link) => location.pathname.startsWith(link.to))) {
      setOpen(true);
    }
  }, [location.pathname]);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-3 py-2 rounded-md hover:bg-gray-200 cursor-pointer"
      >
        <span className="flex items-center gap-2">
          <Settings size={18} />
          System
        </span>
        <span className="text-xs">
          {open ? (
            <Minus className="text-red-500" size={14} />
          ) : (
            <Plus className="text-gray-500" size={14} />
          )}
        </span>
      </button>

      {open && (
        <div className="ml-6 mt-1 flex flex-col space-y-1">
          {menuLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-200 text-nowrap ${
                  isActive ? "bg-gray-200 font-semibold" : ""
                }`
              }
            >
              {link.icon}
              {link.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
};

export default SystemMenu;
