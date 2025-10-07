import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import type { AlertType } from "app-ui";
import Spinner from "../../components/ui/Spinner";
import Alert from "../../components/ui/Alert";
import { useNavigate, useParams } from "react-router";
import SectionDivider from "../../components/ui/SectionDivider";
import { useAuth } from "../../hooks/useAuth";
import ResumeForm from "../../features/forms/ResumeForm";
import type { ResumeType } from "app-resume";
import { getInitials } from "../../utilities/textFormat";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v0/resumes";

const Resume = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [resume, setResume] = useState<ResumeType>();
  const [loading, setLoading] = useState<boolean>(true);
  const [alert, setAlert] = useState<AlertType>();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token is required");

  async function fetchResume() {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/${id}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await res.json();

      if (!res.ok) {
        setAlert({
          success: false,
          messages: [result.message || "Failed to fetch resumes"],
        });
        setResume(undefined);
      } else {
        setResume(result.data);
      }
    } catch (error: any) {
      setAlert({
        success: false,
        messages: [error.message || "Something went wrong"],
      });
      setResume(undefined);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate(formData: FormData): Promise<void> {
    if (!resume?.id) return;
    try {
      const res = await fetch(`${API_BASE_URL}/${resume.id}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const result = await res.json();
      if (!res.ok) {
        setAlert({ success: false, messages: [result.message] });
      } else {
        setResume(result.data);
        setIsEditing(false);
      }
    } catch (err: any) {
      setAlert({ success: false, messages: [err.message] });
    }
  }

  useEffect(() => {
    fetchResume();
  }, []);

  useEffect(() => {
    if (!loading && !resume) navigate("/resumes/new");
  }, [loading, resume, navigate]);

  const onNextHandler = async () => await navigate("personal-information");

  if (loading) {
    return (
      <div className="min-h-[90vh] flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  if (!resume) {
    return null;
  }

  return (
    <div className="p-6 relative min-h-[90vh]">
      {alert && (
        <div className="absolute right-0 top-0">
          <Alert alert={alert} setAlert={setAlert} />
        </div>
      )}

      <h1 className="text-lg sm:text-xl font-semibold text-gray-800 text-center sm:text-left mb-3">
        {t("welcome", { username: user?.username || "" })}
      </h1>

      <SectionDivider
        title={isEditing ? t("edit_resume") : t("resume_summary")}
      />

      {isEditing ? (
        <ResumeForm
          initialValues={{
            title: resume?.title,
            summary: resume?.summary,
            avatar: resume?.displayAvatar, // backend avatar URL
            declaration: resume?.declaration,
          }}
          onSubmit={handleUpdate}
          isUpdate={!!resume?.id}
          setIsEditing={setIsEditing}
        />
      ) : (
        <div className="flex gap-6 flex-wrap flex-col justify-between min-h-[57vh]">
          <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200 space-y-4">
            {resume.displayAvatar ? (
              <img
                src={resume.displayAvatar}
                alt="Resume Avatar"
                className="w-24 h-24 mt-4 rounded-full object-cover"
              />
            ) : (
              <div className="rounded-full bg-gray-200 hover:bg-gray-300 transition text-gray-600 font-bold w-16 h-16 flex items-center justify-center">
                {getInitials(resume.title)}
              </div>
            )}
            <h2 className="text-2xl font-bold text-gray-800">
              {t(`${resume.title}`)}
            </h2>
            <p className="text-gray-600 leading-relaxed">{resume.summary}</p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="flex items-center font-medium bg-yellow-500 hover:bg-yellow-400 text-gray-800 text-nowrap cursor-pointer px-3.5 py-1.5 gap-x-2 rounded"
            >
              <span className="capitalize">{t("edit")}</span>
            </button>

            <button
              type="button"
              onClick={onNextHandler}
              className="flex items-center font-medium bg-slate-700 hover:bg-slate-600 text-gray-200 text-nowrap cursor-pointer px-3.5 py-1.5 gap-x-2 rounded"
            >
              <span className="capitalize">{t("personal_information")}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Resume;
