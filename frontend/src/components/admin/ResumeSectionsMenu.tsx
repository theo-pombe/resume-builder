import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router";
import {
  Briefcase,
  BookOpen,
  Star,
  Users,
  User,
  Minus,
  Plus,
  Layers,
  GraduationCap,
  Plug,
} from "lucide-react";

const ResumeSectionsMenu = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const menuItems = [
    {
      to: "/admin/sections/personal-informations",
      label: "Personal informations",
      icon: <User size={18} />,
    },
    {
      to: "/admin/sections/school-qualifications",
      label: "School Qualifications",
      icon: <BookOpen size={16} />,
    },
    {
      to: "/admin/sections/academic-qualifications",
      label: "Academic Qualifications",
      icon: <GraduationCap size={19} />,
    },
    {
      to: "/admin/sections/projects",
      label: "Projects",
      icon: <Star size={16} />,
    },
    {
      to: "/admin/sections/work-experiences",
      label: "Work Experiences",
      icon: <Briefcase size={16} />,
    },
    {
      to: "/admin/sections/skills",
      label: "Skills",
      icon: <Plug size={17} />,
    },
    {
      to: "/admin/sections/referees",
      label: "Referees",
      icon: <Users size={16} />,
    },
  ];

  useEffect(() => {
    if (menuItems.some((item) => location.pathname.startsWith(item.to))) {
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
          <Layers size={18} />
          Sections
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
          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-200 text-nowrap ${
                  isActive ? "bg-gray-200 font-semibold" : ""
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResumeSectionsMenu;
