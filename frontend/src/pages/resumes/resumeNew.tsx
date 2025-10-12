import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useNavigate } from "react-router";
import ResumeForm from "../../features/forms/ResumeForm";
import type { AlertType } from "app-ui";
import Alert from "../../components/ui/Alert";
import { useAuth } from "../../hooks/useAuth";
import SectionDivider from "../../components/ui/SectionDivider";
import { createResume } from "../../services/resumesService";
import Spinner from "../../components/ui/Spinner";

const ResumeNew = () => {
  const { t } = useTranslation();
  const [alert, setAlert] = useState<AlertType>();
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token is required");

  async function handleCreate(formData: FormData) {
    setLoading(true);
    try {
      const { success, messages, resume } = await createResume(formData);

      if (!success) setAlert({ success: false, messages });
      else navigate(`/resumes/${resume?.id}`);
    } catch (err: any) {
      setAlert({ success: false, messages: [err.message] });
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-[90vh] flex justify-center items-center">
        <Spinner />
      </div>
    );
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
          }}
          onSubmit={handleCreate}
          isUpdate={false}
          setIsEditing={() => {}} // not needed in create mode
        />
      </div>
    </div>
  );
};

export default ResumeNew;
