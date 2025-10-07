import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Spinner from "../../../components/ui/Spinner";
import SearchFilter from "../../../components/admin/SearchFilter";
import Pagination from "../../../components/admin/Pagination";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v0/admin";

const Resumes = () => {
  const { t } = useTranslation();
  const [resumes, setResumes] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token is required");

  const fetchResumes = async () => {
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/resumes`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await res.json();

      setResumes(result.data);
    } catch (error) {
      console.error("❌ Failed to fetch resumes", error);
      setResumes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const filtered = resumes.filter((ref) => {
    const searchTerm = search.toLowerCase();
    const fieldsToSearch = [ref.title, ref.summary];

    const matchesSearch = fieldsToSearch.some((field) =>
      field?.toLowerCase().includes(searchTerm)
    );

    const matchesFilter = filter === "" || ref.isActive === (filter === "true");
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
      <h2 className="text-2xl font-semibold text-cyan-800">Resumes</h2>

      <SearchFilter
        search={search}
        setSearch={setSearch}
        filter={filter}
        setFilter={setFilter}
        filterOptions={[
          { value: "", label: "All" },
          { value: "true", label: "Live" },
          { value: "false", label: "Archived" },
        ]}
      />

      <div className="overflow-x-auto flex-1">
        <table className="min-w-full table-fixed text-sm text-left text-gray-500">
          <thead className="text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="py-2 px-4"></th>
              <th className="py-2 px-4">Title</th>
              <th className="py-2 px-4">User</th>
              <th className="py-2 px-4">Summary</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4 text-nowrap">Updated At</th>
            </tr>
          </thead>

          <tbody>
            {paginatedItems.length > 0 ? (
              paginatedItems.map((resume, i) => {
                return (
                  <tr
                    key={startIndex + i + 1}
                    className="odd:bg-white even:bg-gray-50 border-b border-gray-300 hover:bg-gray-100 transition-colors"
                  >
                    <td className="py-2 px-4 text-center">
                      {startIndex + i + 1}
                    </td>
                    <td className="py-2 px-4">
                      <a
                        href={`/admin/resumes/${resume._id}`}
                        className="flex items-center gap-2 font-medium text-gray-900 text-nowrap"
                      >
                        {resume.displayAvatar ? (
                          <img
                            src={resume.displayAvatar}
                            alt={resume.title}
                            className="w-7 h-7 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-sm font-semibold text-gray-700">
                              {resume.title.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <span> {t(`${resume.title}`)}</span>
                      </a>
                    </td>
                    <td className="py-2 px-4">
                      <a
                        href={`/admin/users/${resume.user.username}`}
                        className="inline-flex items-center gap-2 px-2 py-1 rounded-md text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 transition-colors duration-200 truncate"
                        title={resume.user.username}
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
                            d="M5.121 17.804A9 9 0 1118.88 17.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <span className="truncate">{resume.user.username}</span>
                      </a>
                    </td>
                    <td className="py-2 px-4 text-gray-700">
                      <p className="line-clamp-1 max-w-lg">{resume.summary}</p>
                    </td>
                    <td className="py-2 px-4 text-gray-700">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          resume.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {resume.isActive ? "Live" : "Archived"}
                      </span>
                    </td>
                    <td className="py-2 px-4 text-nowrap text-gray-700">
                      {new Date(resume.updatedAt).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td className="py-2 px-4 text-amber-800">
                  No resumes have been added yet
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
        startIndex={startIndex}
        context="Resumes"
      />
    </div>
  );
};

export default Resumes;
