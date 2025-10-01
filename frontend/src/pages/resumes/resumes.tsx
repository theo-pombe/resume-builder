import type { AlertType } from "app-ui";
import { useEffect, useRef, useState } from "react";
import Alert from "../../components/ui/Alert";
import Spinner from "../../components/ui/Spinner";
import { Edit, Eye, MoreVertical, Plus, X } from "lucide-react";
import { Link } from "react-router";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v0/resumes";

const ResumeItem = ({ resume }: { resume: any }) => (
  <div className="flex items-center space-x-4 p-4 border border-gray-400 rounded-md mb-4 min-h-48 hover:shadow-sm transition-shadow">
    <img
      src={resume.avatar || "/default-avatar.png"}
      alt={resume.title}
      className="w-16 h-16 rounded-full object-cover"
    />
    <div className="flex-1">
      <p className="font-semibold capitalize">{resume.title}</p>
      <p className="text-gray-500 text-sm">{resume.summary}</p>
    </div>
  </div>
);

const Resumes = () => {
  const [resumes, setResumes] = useState<any[]>([]);
  const [alert, setAlert] = useState<AlertType>();
  const [loading, setLoading] = useState<boolean>(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token is required");

  const handleClickOutside = (event: MouseEvent) => {
    const clickedInside = Object.values(dropdownRefs.current).some((ref) =>
      ref?.contains(event.target as Node)
    );
    if (!clickedInside) {
      setDropdownOpen(false);
    }
  };

  const fetchResumes = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await res.json();

      if (!res.ok) {
        setAlert({
          success: false,
          messages: [result.message || "Failed to fetch resumes"],
        });
        setResumes([]);
      } else {
        setResumes(result.data);
      }
    } catch (error: any) {
      setAlert({
        success: false,
        messages: [error.message || "Something went wrong"],
      });
      setResumes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  if (loading)
    return (
      <div className="min-h-[90vh] flex justify-center items-center">
        <Spinner />
      </div>
    );

  return (
    <div className="p-6 relative min-h-[90vh]">
      {alert && (
        <div className="absolute right-0 top-0">
          <Alert alert={alert} setAlert={setAlert} />
        </div>
      )}

      <div className="flex justify-end mb-6 py-6">
        <div>
          {resumes.length > 0 && (
            <Link
              to="/resumes/new"
              className="flex items-center space-x-1.5 bg-blue-100 text-blue-600 px-4 py-2 font-medium cursor-pointer rounded-md hover:bg-blue-200"
            >
              <Plus size={18} />
              <span>Add Resume</span>
            </Link>
          )}
        </div>
      </div>

      {resumes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {resumes.map((r) => (
            <div
              key={r._id}
              className="bg-white rounded-lg shadow-sm p-5 hover:shadow-md transition"
            >
              <ResumeItem resume={r} />
              <div className="mt-3 flex justify-between items-center">
                <p className="text-gray-500 text-sm">
                  Last updated: {new Date(r.updatedAt).toLocaleDateString()}
                </p>

                <div
                  className="relative"
                  ref={(el: HTMLDivElement | null) => {
                    dropdownRefs.current[r._id] = el;
                  }}
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDropdownOpen(dropdownOpen === r._id ? null : r._id);
                    }}
                  >
                    <MoreVertical />
                  </button>
                  {dropdownOpen === r._id && (
                    <div className="absolute right-0 mt-2 w-28 bg-white shadow z-10">
                      <Link
                        to={`/resumes/${r.id}`}
                        className="flex items-center gap-x-2 w-full text-left px-3 text-sm py-1.5 hover:bg-gray-100"
                      >
                        <Eye size={16} />
                        View
                      </Link>
                      <Link
                        to={`/resumes/${r.id}/edit`}
                        className="flex items-center gap-x-2 w-full text-left px-3 text-sm py-1.5 hover:bg-gray-100"
                      >
                        <Edit size={15} /> Update
                      </Link>
                      <button
                        // onClick={handleDelete}
                        className="flex items-center gap-x-2 w-full text-left px-3 text-sm py-1.5 cursor-pointer hover:bg-gray-100 text-red-600"
                      >
                        <X size={17} /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center mt-12">
          <p className="text-gray-500 mb-4 text-lg">
            You haven't added any resumes yet.
          </p>
          <Link
            to="/resumes/new"
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
          >
            Create Resume
          </Link>
        </div>
      )}
    </div>
  );
};

export default Resumes;
