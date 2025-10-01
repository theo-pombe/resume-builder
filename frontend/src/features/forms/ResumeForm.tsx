import { Plus, Save, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import Label from "../../components/form/Label";
import Select from "../../components/form/Select";
import TextArea from "../../components/form/TextArea";
import ActionButton from "../../components/ui/ActionButton";
import TextInput from "../../components/form/TextInput";

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

interface ResumeFormProps {
  initialValues?: {
    title?: string;
    summary?: string;
    avatar?: string; // existing image URL
    declaration?: Declaration;
  };
  onSubmit: (formData: FormData) => Promise<void>;
  isUpdate?: boolean;
  setIsEditing?: React.Dispatch<React.SetStateAction<boolean>>;
}

interface FormDataState {
  title: string;
  summary: string;
  avatarFile: File | null;
  avatarPreview: string;
  declaration: Declaration;
}

const ResumeForm: React.FC<ResumeFormProps> = ({
  initialValues,
  onSubmit,
  isUpdate = false,
  setIsEditing,
}) => {
  const { t } = useTranslation();
  const [formDataState, setFormDataState] = useState<FormDataState>({
    title: initialValues?.title || "",
    summary: initialValues?.summary || "",
    avatarFile: null,
    avatarPreview: initialValues?.avatar || "",
    declaration: {
      statement: initialValues?.declaration?.statement || "",
      signature: initialValues?.declaration?.signature || "",
      date: initialValues?.declaration?.date || "",
    },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Track changes for PATCH requests
  const [changes, setChanges] = useState<Partial<FormDataState>>({});

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name.startsWith("declaration.")) {
      const key = name.split(".")[1] as keyof Declaration;
      setFormDataState((prev) => ({
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
      setFormDataState((prev) => ({ ...prev, [name]: value }));
      setChanges((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormDataState((prev) => ({
        ...prev,
        avatarFile: file,
        avatarPreview: URL.createObjectURL(file),
      }));
      setChanges((prev) => ({ ...prev, avatarFile: file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isUpdate) {
      // Create: enforce required fields
      if (!formDataState.title || !formDataState.summary) {
        alert(t("title_and_summary_required"));
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();

      if (isUpdate) {
        // Only send changed fields for PATCH
        if (changes.title) formData.append("title", changes.title);
        if (changes.summary) formData.append("summary", changes.summary);
        if (changes.avatarFile) formData.append("avatar", changes.avatarFile);
        if (changes.declaration)
          formData.append("declaration", JSON.stringify(changes.declaration));
      } else {
        // Create: send all required + optional
        formData.append("title", formDataState.title);
        formData.append("summary", formDataState.summary);
        if (formDataState.avatarFile)
          formData.append("avatar", formDataState.avatarFile);
        formData.append(
          "declaration",
          JSON.stringify(formDataState.declaration)
        );
      }

      await onSubmit(formData);
      setChanges({}); // reset tracked changes
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="pb-6 space-y-5">
      {/* Job Title */}
      <div className="flex flex-col gap-1 lg:max-w-sm">
        <Label text={t("job_title")} htmlFor="title" />
        <Select
          label={t("select_job_title")}
          name="title"
          value={formDataState.title}
          onChange={handleChange}
          required={!isUpdate}
        >
          {jobTitles.map((job) => (
            <option key={job} value={job}>
              {t(job)}
            </option>
          ))}
        </Select>
      </div>

      {/* Summary */}
      <div className="flex flex-col gap-1">
        <Label text={t("professional_summary")} htmlFor="summary" />
        <TextArea
          name="summary"
          required={!isUpdate} // required only for create
          placeholder={t("professional_summary_placeholder")}
          value={formDataState.summary}
          onChange={handleChange}
        />
      </div>

      {/* Avatar */}
      <div className="flex flex-col gap-1 w-fit">
        <Label text={t("avatar")} htmlFor="avatar" />
        <input
          type="file"
          accept="image/*"
          onChange={handleAvatarChange}
          className="border rounded p-2"
        />
        {formDataState.avatarPreview && (
          <img
            src={
              formDataState.avatarPreview
                ? formDataState.avatarPreview.startsWith("http")
                  ? formDataState.avatarPreview
                  : `http://localhost:8080/uploads/${formDataState.avatarPreview}`
                : ""
            }
            alt="Avatar Preview"
            className="w-24 h-24 mt-2 rounded-full object-cover"
          />
        )}
      </div>

      {/* Declaration */}
      <div className="flex flex-col gap-1">
        <Label htmlFor="statement" text={t("statement")} />
        <TextArea
          name="declaration.statement"
          value={formDataState.declaration.statement ?? ""}
          onChange={handleChange}
          placeholder="Declaration statement..."
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="signature" text={t("signature")} />
        <TextInput
          name="declaration.signature"
          type="text"
          value={formDataState.declaration.signature ?? ""}
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
            formDataState.declaration.date
              ? new Date(formDataState.declaration.date)
                  .toISOString()
                  .split("T")[0]
              : ""
          }
          onChange={handleChange}
        />
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-between mt-5">
        {isUpdate && setIsEditing && (
          <button
            type="button"
            className="bg-slate-800 text-white px-3.5 py-1.5 rounded flex items-center gap-x-2 mt-5"
            onClick={() => setIsEditing(false)}
          >
            <X size={16} /> {t("cancel")}
          </button>
        )}
        <ActionButton
          text={isUpdate ? t("update_resume") : t("create_resume")}
          theme="bg-emerald-700 hover:bg-slate-600"
          icon={isUpdate ? <Save size={16} /> : <Plus size={16} />}
          disabled={isSubmitting}
        />
      </div>
    </form>
  );
};

export default ResumeForm;
