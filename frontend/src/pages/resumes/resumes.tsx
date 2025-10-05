import type { AlertType } from "app-ui";
import { useEffect, useRef, useState } from "react";
import Alert from "../../components/ui/Alert";
import Spinner from "../../components/ui/Spinner";
import { Eye, MoreVertical, Plus, X } from "lucide-react";
import { Link } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { useTranslation } from "react-i18next";
import { getInitials } from "../../utilities/textFormat";
import type { ResumeType } from "app-resume";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v0/resumes";

const ResumeItem = ({ resume, t }: { resume: ResumeType; t: any }) => (
  <div className="flex items-center space-x-4 p-4 border border-gray-400 rounded-md mb-4 min-h-48 hover:shadow-sm transition-shadow">
    {resume.displayAvatar ? (
      <img
        src={resume.displayAvatar}
        alt={resume.title}
        className="rounded-full object-cover w-16 h-16"
      />
    ) : (
      <div className="rounded-full bg-gray-200 hover:bg-gray-300 transition text-gray-600 font-bold w-16 h-16 flex items-center justify-center">
        {getInitials(resume.title)}
      </div>
    )}
    <div className="flex-1">
      <p className="font-semibold capitalize">{t(`${resume.title}`)}</p>
      <p className="text-gray-500 text-sm">{resume.summary}</p>
    </div>
  </div>
);

const Resumes = () => {
  const [resumes, setResumes] = useState<ResumeType[]>([]);
  const [alert, setAlert] = useState<AlertType>();
  const [loading, setLoading] = useState<boolean>(true);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const { user } = useAuth();
  const { t } = useTranslation();

  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token is required");

  const handleClickOutside = (event: MouseEvent) => {
    const clickedInside = Object.values(dropdownRefs.current).some((ref) =>
      ref?.contains(event.target as Node)
    );
    if (!clickedInside) {
      setDropdownOpen(null);
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

  const deleteResume = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await res.json();

      if (!result.success) {
        return setAlert({
          success: false,
          messages: [result.message || "Failed to delete resume"],
        });
      }

      setAlert({
        success: true,
        messages: ["Resume deleted successfully"],
      });

      fetchResumes();
    } catch (error: any) {
      setAlert({
        success: false,
        messages: [error.message || "Something went wrong"],
      });
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

      <div className="flex flex-col items-end space-y-4 mb-4 py-2">
        <h1 className="text-lg sm:text-xl font-semibold text-gray-800 text-center sm:text-left">
          {t("welcome", { username: user?.username || "" })}
        </h1>

        <div className="fixed right-16 bottom-16">
          <Link
            to="/resumes/new"
            className="flex items-center space-x-1.5 bg-blue-200 text-blue-700 px-4 py-2 font-medium cursor-pointer rounded-md hover:bg-blue-200"
          >
            <Plus size={18} />
            <span>Add Resume</span>
          </Link>
        </div>
      </div>

      {resumes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {resumes.map((r) => (
            <div
              key={r.id}
              className="bg-white rounded-lg shadow-sm p-5 hover:shadow-md transition"
            >
              <ResumeItem resume={r} t={t} />
              <div className="mt-3 flex justify-between items-center">
                <p className="text-gray-500 text-sm">
                  Last updated:{" "}
                  {r.updatedAt
                    ? new Date(r.updatedAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : ""}
                </p>

                <div
                  className="relative"
                  ref={(el: HTMLDivElement | null) => {
                    dropdownRefs.current[r.id] = el;
                  }}
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDropdownOpen(dropdownOpen === r.id ? null : r.id);
                    }}
                  >
                    <MoreVertical />
                  </button>
                  {dropdownOpen === r.id && (
                    <div className="absolute right-0 mt-2 w-28 bg-white shadow z-10">
                      <Link
                        to={`/resumes/${r.id}`}
                        className="flex items-center gap-x-2 w-full text-left px-3 text-sm py-1.5 hover:bg-gray-100"
                      >
                        <Eye size={16} />
                        View
                      </Link>
                      <button
                        onClick={() => deleteResume(r.id)}
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
        </div>
      )}
    </div>
  );
};

export default Resumes;
