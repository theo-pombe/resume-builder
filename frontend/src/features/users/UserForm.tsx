import AvatarUploader from "../../components/form/AvatarUploader";

interface UserFormProps {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  handleUpdate: (e: React.FormEvent) => void;
  handleDelete: (e: React.MouseEvent) => void;
  avatar: File | string | undefined;
  setAvatar: (file: File | string | undefined) => void;
}

const UserForm: React.FC<UserFormProps> = ({
  formData,
  setFormData,
  handleUpdate,
  handleDelete,
  avatar,
  setAvatar,
}) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleUpdate} className="space-y-5">
      <AvatarUploader avatar={avatar} setAvatar={setAvatar} />

      {/* Username */}
      <div>
        <label
          htmlFor="username"
          className="block text-sm font-medium text-gray-700"
        >
          Username
        </label>
        <input
          type="text"
          id="username"
          name="username"
          placeholder="Enter username"
          value={formData.username || ""}
          onChange={handleChange}
          className="mt-1 w-full border border-gray-300 px-3 py-2 rounded-md 
                     focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Enter email"
          value={formData.email || ""}
          onChange={handleChange}
          className="mt-1 w-full border border-gray-300 px-3 py-2 rounded-md 
                     focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Role */}
      <div>
        <label
          htmlFor="role"
          className="block text-sm font-medium text-gray-700"
        >
          Role
        </label>
        <select
          id="role"
          name="role"
          value={formData.role || ""}
          onChange={handleChange}
          className="mt-1 w-full border border-gray-300 px-3 py-2 rounded-md 
                     focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md transition"
        >
          Update
        </button>

        <button
          type="button"
          onClick={handleDelete}
          className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-md transition"
        >
          Delete
        </button>
      </div>
    </form>
  );
};

export default UserForm;
