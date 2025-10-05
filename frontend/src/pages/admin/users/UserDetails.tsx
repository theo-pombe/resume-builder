import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router";
import Spinner from "../../../components/ui/Spinner";
import UserForm from "../../../features/users/UserForm";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v0/admin";

const Userdetails = () => {
  const { t } = useTranslation();
  const { username } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);
  const [formData, setFormData] = useState<any>({});
  const [avatar, setAvatar] = useState<File | string | undefined>();

  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token is required");

  const fetchUser = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/users/${username}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      setUser(result.data);
      setFormData(result.data);
      setAvatar(result.data.avatar); // preload avatar
    } catch (error) {
      console.error("❌ Failed to fetch user", error);
      setUser(undefined);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const form = new FormData();

      // Only append fields that changed
      if (formData.username !== user.username) {
        form.append("username", formData.username);
      }
      if (formData.email !== user.email) {
        form.append("email", formData.email);
      }
      if (formData.role !== user.role) {
        form.append("role", formData.role);
      }
      if (avatar instanceof File) {
        form.append("avatar", avatar);
      }

      // If nothing changed, just return
      if (form.entries().next().done) {
        setLoading(false);
        return;
      }

      const res = await fetch(`${API_BASE_URL}/users/${user.username}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      const result = await res.json();
      if (!result.success) return;

      navigate("/admin/users");
    } catch (error) {
      console.error("❌ Failed to update user", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/users/${username}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      if (!result.success) return;
      navigate("/admin/users");
    } catch (error) {
      console.error("❌ Failed to delete user", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner />;
  if (!user) return <div>User not found</div>;

  return (
    <div className="bg-white shadow-md rounded-lg flex justify-between gap-8 min-h-[70vh]">
      <div className="basis-1/2 p-8">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Edit User</h2>

        <UserForm
          formData={formData}
          setFormData={setFormData}
          handleUpdate={handleUpdate}
          handleDelete={handleDelete}
          avatar={avatar}
          setAvatar={setAvatar}
        />
      </div>

      <div className="basis-1/3 p-8 bg-gray-50">
        <h2 className="border-b pb-1 text-lg font-semibold">Resumes</h2>

        {user.resumes.length > 0 ? (
          <ul className="space-y-2">
            {user.resumes.map((u: any) => (
              <li key={u.id} className="space-x-2 list-decimal list-inside">
                <span> {t(u.title)}</span>
                <span>-</span>
                <span>
                  {new Date(u.updatedAt ?? u.createdAt).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="py-3 text-gray-500">No resume added yet.</p>
        )}
      </div>
    </div>
  );
};

export default Userdetails;
