import { useState, useRef, useEffect, useCallback, memo } from "react";
import { LogOut, User } from "lucide-react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { useAuth } from "../hooks/useAuth";

interface DropdownItemProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  borderTop?: boolean;
}

const DropdownItem = memo(
  ({ icon, label, onClick, borderTop }: DropdownItemProps) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm ${
        borderTop ? "border-t" : ""
      }`}
    >
      {icon}
      {label}
    </button>
  )
);

function UserProfileMenu() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const onLogout = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      logout();
      navigate("/", { replace: true });
    },
    [logout, navigate]
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const getInitials = (name?: string) => {
    if (!name) return "U";
    const parts = name.split(" ");
    return parts.length > 1
      ? parts[0][0].toUpperCase() + parts[1][0].toUpperCase()
      : name[0].toUpperCase();
  };

  return (
    <div className="relative" ref={menuRef}>
      <div>
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition"
          aria-haspopup="true"
          aria-expanded={open}
        >
          <span className="text-gray-600 font-bold">
            {getInitials(user?.username)}
          </span>
        </button>
      </div>

      <div
        className={`absolute right-0 mt-2 w-48 bg-white border rounded-xl shadow-lg overflow-hidden z-50 transform transition-all duration-200 origin-top-right ${
          open
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
        }`}
        role="menu"
      >
        <div className="w-full flex items-center gap-2 px-4 py-2 text-gray-700 text-sm">
          <User className="w-4 h-4" />
          {user?.username}
        </div>

        <form method="post" onSubmit={onLogout}>
          <DropdownItem
            icon={<LogOut className="w-4 h-4" />}
            label={t("logout")}
            onClick={() => {}}
            borderTop
          />
        </form>
      </div>
    </div>
  );
}

export default UserProfileMenu;
