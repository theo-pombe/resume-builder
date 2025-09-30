import { FileText, LayoutDashboard, PanelTop, Users } from "lucide-react";
import Logo from "../../components/ui/Logo";
import { NavLink } from "react-router";

const AdminSidebar = () => {
  return (
    <aside className="w-72 bg-white shadow-md flex flex-col">
      <div className="h-16 flex items-center ms-4 font-bold text-lg">
        <Logo />
      </div>

      <nav className="flex-1 p-4 space-y-2 border-t border-gray-300">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            `flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-200 ${
              isActive ? "bg-gray-200 font-semibold" : ""
            }`
          }
        >
          <LayoutDashboard size={18} />
          Dashboard
        </NavLink>
        <NavLink
          to="/admin/resumes"
          className={({ isActive }) =>
            `flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-200 ${
              isActive ? "bg-gray-200 font-semibold" : ""
            }`
          }
        >
          <FileText size={18} />
          Resumes
        </NavLink>

        {/* ResumeSectionsMenu */}

        <NavLink
          to="/admin/templates"
          className={({ isActive }) =>
            `hidden items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-200 ${
              isActive ? "bg-gray-200 font-semibold" : ""
            }`
          }
        >
          <PanelTop size={18} />
          Templates
        </NavLink>
        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            `flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-200 ${
              isActive ? "bg-gray-200 font-semibold" : ""
            }`
          }
        >
          <Users size={18} />
          Users
        </NavLink>
        {/* SystemMenu */}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
