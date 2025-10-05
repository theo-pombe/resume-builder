import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import Spinner from "../../../components/ui/Spinner";
import { useTranslation } from "react-i18next";
import ActionButton from "../../../components/ui/ActionButton";
import { Save } from "lucide-react";
import TextInput from "../../../components/form/TextInput";
import Label from "../../../components/form/Label";
import TextArea from "../../../components/form/TextArea";
import Select from "../../../components/form/Select";
import type { UserType } from "app-auth";
import type { ResumeType } from "app-resume";

export const jobTitles = [
  "house_painter",
  "electrician",
  "plumber",
  "carpenter",
  "construction_worker",
  "mechanic",
  "auto_electrician",
  "tailor",
  "computer_technician",
  "charcoal_seller",
  "shopkeeper",
  "sign_painter",
  "chef",
  "electrical_equipment_technician",
  "driver",
  "vegetable_vendor",
  "fish_seller",
  "fruit_seller",
  "sports_teacher",
  "business_consultant",
];

interface Declaration {
  statement?: string;
  signature?: string;
  date?: string;
}

interface FormDataState {
  user: UserType;
  title: string;
  summary: string;
  avatarFile: File | null;
  avatarPreview: string;
  declaration: Declaration;
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v0/admin";

const BASE_URL_UPLOAD = API_BASE_URL.replace("/api/v0/admin", "/uploads");

const ResumeDetails = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [resume, setResume] = useState<ResumeType | null>(null);
  const [formData, setFormData] = useState<FormDataState>({
    user: {} as UserType,
    title: "",
    summary: "",
    avatarFile: null,
    avatarPreview: "",
    declaration: {
      statement: "",
      signature: "",
      date: "",
    },
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [changes, setChanges] = useState<Partial<FormDataState>>({});

  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token is required");

  const fetchResume = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/resumes/${id}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      if (!result.success) {
        alert(result.message || "Failed to update resume");
        return;
      }

      setResume(result.data);
      setFormData({
        user: result.data.user,
        title: result.data.title,
        summary: result.data.summary,
        avatarFile: null,
        avatarPreview: result.data.displayAvatar || "",
        declaration: {
          ...result.data.declaration,
          date: result.data.declaration?.date
            ? new Date(result.data.declaration.date).toISOString().split("T")[0]
            : "",
        },
      });
    } catch (error) {
      console.error("❌ Failed to fetch resume", error);
      setResume(null);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name.startsWith("declaration.")) {
      const key = name.split(".")[1] as keyof Declaration;
      setFormData((prev) => ({
        ...prev,
        declaration: {
          ...prev.declaration,
          [key]: value,
        },
      }));
      setChanges((prev) => ({
        ...prev,
        declaration: {
          ...prev.declaration,
          [key]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      setChanges((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prev) => ({
        ...prev,
        avatarFile: file,
        avatarPreview: URL.createObjectURL(file),
      }));
      setChanges((prev) => ({ ...prev, avatarFile: file }));
    }
  };

  const handleDelete = async () => {
    if (!confirm(t("confirm_delete_resume"))) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/resumes/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      if (!result.success) {
        alert(result.message || "Failed to update resume");
        return;
      }

      navigate("/admin/resumes");
    } catch (error) {
      console.error("❌ Failed to delete resume", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    fetchResume().then(() => {
      if (!active) return;
    });
    return () => {
      active = false;
    };
  }, [id]);

  useEffect(() => {
    if (!loading && !resume) navigate("/admin/resumes");
  }, [loading, resume, navigate]);

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
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Edit Resume</h2>

      <form className="pb-6 space-y-5">
        <div className="flex flex-col gap-1 lg:max-w-sm">
          <Label text="User" htmlFor="user" />
          <input
            type="text"
            value={formData?.user?.username || ""}
            readOnly
            className="mt-1 w-full border border-gray-300 px-3 py-2 rounded-md bg-gray-100"
          />
        </div>

        <div className="flex flex-col gap-1 lg:max-w-sm">
          <Label text={t("job_title")} htmlFor="title" />
          <Select
            label={t("select_job_title")}
            name="title"
            value={formData.title}
            onChange={handleChange}
            required={true}
          >
            {jobTitles.map((job) => (
              <option key={job} value={job}>
                {t(job)}
              </option>
            ))}
          </Select>
        </div>

        <div className="flex flex-col gap-1">
          <Label text={t("professional_summary")} htmlFor="summary" />
          <TextArea
            name="summary"
            required={true}
            placeholder={t("professional_summary_placeholder")}
            value={formData.summary}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col gap-1 w-fit">
          <Label text={t("avatar")} htmlFor="avatar" />
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="border rounded p-2"
          />

          {formData.avatarPreview && (
            <img
              src={
                formData.avatarPreview.startsWith("http") ||
                formData.avatarPreview.startsWith("blob:")
                  ? formData.avatarPreview
                  : `${BASE_URL_UPLOAD}/${formData.avatarPreview}`
              }
              alt="Avatar Preview"
              className="w-24 h-24 mt-2 rounded-full object-cover"
            />
          )}
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="statement" text={t("statement")} />
          <TextArea
            name="declaration.statement"
            value={formData.declaration.statement ?? ""}
            onChange={handleChange}
            placeholder="Declaration statement..."
          />
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="signature" text={t("signature")} />
          <TextInput
            name="declaration.signature"
            type="text"
            value={formData.declaration.signature ?? ""}
            onChange={handleChange}
            placeholder="Signature"
          />
        </div>

        <div className="flex flex-col gap-1 w-fit">
          <Label htmlFor="signature" text={t("date")} />
          <TextInput
            name="declaration.date"
            type="date"
            value={
              formData.declaration.date
                ? new Date(formData.declaration.date)
                    .toISOString()
                    .split("T")[0]
                : ""
            }
            onChange={handleChange}
          />
        </div>

        <div className="flex items-center justify-between mt-5">
          <ActionButton
            text={t("update_resume")}
            theme="bg-emerald-700 hover:bg-slate-600"
            icon={<Save size={16} />}
            disabled={loading || Object.keys(changes).length === 0}
          />
          {resume.isActive && (
            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-md transition"
            >
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ResumeDetails;
