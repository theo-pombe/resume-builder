import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import Spinner from "./ui/Spinner";
import AvatarUploader from "./form/AvatarUploader";

interface ProfileAccountModalProps {
  open: boolean;
  onClose: () => void;
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v0";

export default function ProfileAccountModal({
  open,
  onClose,
}: ProfileAccountModalProps) {
  const { user: authUser, logout } = useAuth();

  const [user, setUser] = useState<{
    _id: string;
    username: string;
    email: string;
    role: "admin" | "user";
    avatar?: File | string;
    password?: string;
  }>();
  const [username, setUsername] = useState<string | undefined>(
    authUser?.username
  );
  const [email, setEmail] = useState<string | undefined>(authUser?.email);
  const [avatar, setAvatar] = useState<File | string | undefined>(
    authUser?.avatar
  );
  const [password, setPassword] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);

  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token is required");

  async function fetchUser() {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/account/${authUser?.username}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await res.json();
      setUser(result.data);
      setUsername(result.data?.username);
      setEmail(result.data?.email);
      setAvatar(result.data?.avatar);
    } catch (error) {
      console.error(error);
      setUser(undefined);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();

    if (!user) return;

    try {
      const form = new FormData();
      let requiresLogout = false;

      // Only append fields that changed
      if (username && username !== user.username) {
        form.append("newUsername", username);
        requiresLogout = true;
      }
      if (email && email !== user.email) {
        form.append("newEmail", email);
      }
      if (password && password !== user.password) {
        form.append("newPassword", password);
        requiresLogout = true;
      }
      if (avatar instanceof File) {
        form.append("newAvatar", avatar);
      }

      const res = await fetch(`${API_BASE_URL}/account/${authUser?.username}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to update account");
      }

      if (requiresLogout) {
        // force logout if username or password changed
        logout();
        return;
      }

      setUser(result.user); // server returns updated user
      setPassword(undefined);
      onClose();
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (open) fetchUser();
  }, [open, authUser?.username]);

  if (!open) return null;
  if (loading) return <Spinner />;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl p-6 relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-800">
            Update Account
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleUpdate} className="space-y-5">
          <AvatarUploader avatar={avatar} setAvatar={setAvatar} />

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Role
            </label>
            <input
              type="text"
              value={authUser?.role || ""}
              readOnly
              className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
            />
          </div>

          <div className="pt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Change Username
            </h3>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter new username"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none"
            />
          </div>

          <div className="pt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Change Email
            </h3>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter new email"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none"
            />
          </div>

          <div className="pt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Change Password
            </h3>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New password"
              autoComplete="new-password"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
