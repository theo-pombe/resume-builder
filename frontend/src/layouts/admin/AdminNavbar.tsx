import { Menu } from "lucide-react";
import UserProfileMenu from "../../components/UserProfileMenu";

const AdminNavbar = () => {
  return (
    <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6">
      <div>
        <Menu />
      </div>

      <UserProfileMenu />
    </header>
  );
};

export default AdminNavbar;
