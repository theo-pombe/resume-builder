import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useNavigate } from "react-router";
import ResumeForm from "../../features/forms/ResumeForm";
import type { AlertType } from "app-ui";
import Alert from "../../components/ui/Alert";
import { useAuth } from "../../hooks/useAuth";
import SectionDivider from "../../components/ui/SectionDivider";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v0/resumes";

const ResumeNew = () => {
  const { t } = useTranslation();
  const [alert, setAlert] = useState<AlertType>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token is required");

  async function createResume(formData: FormData) {
    try {
      const res = await fetch(`${API_BASE_URL}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const result = await res.json();

      if (!result.success)
        setAlert({ success: false, messages: [result.message] });
      else navigate(`/resumes/${result.data.id}`);
    } catch (err: any) {
      setAlert({ success: false, messages: [err.message] });
    }
  }

  return (
    <div className="p-8 my-6 max-w-5xl mx-auto">
      {alert && (
        <div className="absolute right-0 top-0">
          <Alert alert={alert} setAlert={setAlert} />
        </div>
      )}

      <h1 className="text-lg sm:text-xl font-semibold mb-6">
        {t("create_resume")}
      </h1>

      <SectionDivider title={t("new_resume")} />

      <div className="shadow-md p-8">
        <ResumeForm
          initialValues={{
            title: "",
            summary: "",
            avatar: user?.avatar,
            declaration: { statement: "", signature: "", date: "" },
          }}
          onSubmit={createResume}
          isUpdate={false}
          setIsEditing={() => {}} // not needed in create mode
        />
      </div>
    </div>
  );
};

export default ResumeNew;
