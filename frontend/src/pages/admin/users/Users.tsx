import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Spinner from "../../../components/ui/Spinner";
import SearchFilter from "../../../components/admin/SearchFilter";
import Pagination from "../../../components/admin/Pagination";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v0/admin";

const Users = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token is required");

  const fetchUsers = async () => {
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/users`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await res.json();

      setUsers(result.data);
    } catch (error) {
      console.error("❌ Failed to fetch users", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filtered = users.filter((ref) => {
    const matchesSearch = ref.username
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesFilter = filter === "" || ref.role === filter;
    return matchesSearch && matchesFilter;
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filtered.slice(startIndex, startIndex + itemsPerPage);

  if (loading) return <Spinner />;

  return (
    <div className="relative min-h-[84vh]">
      <h2 className="text-2xl font-semibold text-cyan-800">Users</h2>

      <SearchFilter
        search={search}
        setSearch={setSearch}
        filter={filter}
        setFilter={setFilter}
        filterOptions={[
          { value: "", label: "All Roles" },
          { value: "user", label: "User" },
          { value: "admin", label: "Admin" },
        ]}
      />

      <div className="overflow-x-auto flex-1">
        <table className="min-w-full table-fixed text-sm text-left text-gray-500">
          <thead className="text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="py-2 px-4"></th>
              <th className="py-2 px-4">Username</th>
              <th className="py-2 px-4">Resumes</th>
              <th className="py-2 px-4">Email</th>
              <th className="py-2 px-4">Role</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4 text-nowrap">Updated At</th>
            </tr>
          </thead>

          <tbody>
            {paginatedItems.length ? (
              paginatedItems.map((user, i) => (
                <tr
                  key={user.username}
                  className="odd:bg-white even:bg-gray-50 border-b border-gray-300 hover:bg-gray-100 transition-colors"
                >
                  <td className="py-2 px-4">{startIndex + i + 1}</td>
                  <td className="py-2 px-4">
                    <a
                      href={`/admin/users/${user.username}`}
                      className="flex items-center gap-2 font-medium text-gray-900"
                    >
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.username}
                          className="w-7 h-7 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-sm font-semibold text-gray-700">
                            {user.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <span>{t(user.username)}</span>
                    </a>
                  </td>

                  <td className="py-2 px-4 text-gray-700">
                    {user.totalResume ? (
                      <p>{t(`${user.totalResume}`)}</p>
                    ) : (
                      <p>{"-"}</p>
                    )}
                  </td>
                  <td className="py-2 px-4 text-gray-700 max-w-xs">
                    <a
                      href={`mailto:${user.email}`}
                      className="inline-flex items-center gap-2 px-2 py-1 rounded-md text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 transition-colors duration-200 truncate"
                      title={user.email}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-3 h-3 text-blue-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 12H8m8-4H8m2 8h4m6 0V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2z"
                        />
                      </svg>
                      <span className="truncate">{user.email}</span>
                    </a>
                  </td>

                  <td className="py-2 px-4 text-gray-700">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>

                  <td className="py-2 px-4 text-gray-700">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        user.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-2 px-4 text-nowrap text-gray-700">
                    {new Date(user.updatedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="py-2 px-4 text-amber-800">
                  No users have been added yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={filtered.length}
        totalPaginatedItems={paginatedItems.length}
        startIndex={startIndex} context="Users"
      />
    </div>
  );
};

export default Users;
