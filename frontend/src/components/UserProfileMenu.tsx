import { useState, useRef, useEffect, useCallback, memo } from "react";
import { LogOut, Settings, User } from "lucide-react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { useAuth } from "../hooks/useAuth";
import ProfileAccountModal from "./ProfileAccountModal";
import { getInitials } from "../utilities/textFormat";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v0";

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
  const [modalOpen, setModalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const [avatar, setAvatar] = useState<string | undefined>(user?.avatar);

  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token is required");

  async function fetchUser() {
    try {
      const res = await fetch(`${API_BASE_URL}/account/${user?.username}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await res.json();
      setAvatar(result.data.avatar);
    } catch (error) {
      console.error(error);
    }
  }

  const onLogout = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      logout();
      navigate("/", { replace: true });
    },
    [logout, navigate]
  );

  useEffect(() => {
    fetchUser();

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

  return (
    <div className="relative" ref={menuRef}>
      <div>
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="flex items-center justify-center"
          aria-haspopup="true"
          aria-expanded={open}
        >
          <span className="">
            {avatar ? (
              <img
                src={avatar}
                alt={user && user.username}
                className="rounded-full object-cover w-10 h-10"
              />
            ) : (
              <div className="rounded-full bg-gray-200 hover:bg-gray-300 transition text-gray-600 font-bold w-10 h-10 flex items-center justify-center">
                {getInitials(user?.username)}
              </div>
            )}
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

        <DropdownItem
          icon={<Settings className="w-4 h-4" />}
          label="Account"
          onClick={() => {
            setOpen(false);
            setModalOpen(true);
          }}
          borderTop
        />

        <form method="post" onSubmit={onLogout}>
          <DropdownItem
            icon={<LogOut className="w-4 h-4" />}
            label={t("logout")}
            onClick={() => {}}
            borderTop
          />
        </form>
      </div>

      <ProfileAccountModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          fetchUser();
        }}
      />
    </div>
  );
}

export default UserProfileMenu;
