import type {
  GradeDivision,
  SchoolAward,
  SchoolFormDataValues,
  SchoolLevel,
  SchoolType,
} from "app-school";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Select from "../../components/form/Select";
import Label from "../../components/form/Label";
import TextInput from "../../components/form/TextInput";
import ActionButton from "../../components/ui/ActionButton";
import { Plus, Edit2 } from "lucide-react";
import FileInput from "../../components/form/FileInput";
import SectionDivider from "../../components/ui/SectionDivider";

interface SchoolFormProps {
  schools: SchoolType[];
  setSchools: React.Dispatch<React.SetStateAction<SchoolType[]>>;
  editing?: SchoolType | null;
  setEditing?: React.Dispatch<React.SetStateAction<SchoolType | null>>;
  onSave: (school: SchoolFormDataValues, id?: string) => void;
  saving?: boolean;
}

const defaultSchool: SchoolFormDataValues = {
  level: "",
  award: "",
  school: { name: "", location: "" },
  startYear: "",
  endYear: "",
  grade: { division: "", points: "" },
  certificate: "",
};

const SchoolForm = ({ editing, onSave, saving }: SchoolFormProps) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<SchoolFormDataValues>(defaultSchool);

  // Initialize form when editing changes
  useEffect(() => {
    if (editing) {
      setFormData({
        level: editing.level,
        award: editing.award,
        school: { ...editing.school },
        startYear: editing.startYear,
        endYear: editing.endYear,
        grade: editing.grade ?? { division: "", points: "" },
        certificate: editing.certificate ?? "",
      });
    } else {
      setFormData(defaultSchool);
    }
  }, [editing]);

  const updateNestedField = <T extends keyof SchoolFormDataValues>(
    field: T,
    value: SchoolFormDataValues[T]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateSchoolField = (
    field: keyof SchoolFormDataValues["school"],
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      school: { ...prev.school, [field]: value },
    }));
  };

  const updateGradeField = (
    field: keyof NonNullable<SchoolFormDataValues["grade"]>,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      grade: {
        ...(prev.grade ?? { division: "", points: "" }),
        [field]: value,
      },
    }));
  };

  const onFileChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const file = ev.target.files?.[0];
    if (!file) setFormData((prev) => ({ ...prev, certificate: file || "" }));
  };

  const onSubmitHandler = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    onSave(formData, editing?.id);
    setFormData(defaultSchool);
  };

  return (
    <>
      <SectionDivider
        title={editing ? t("edit_qualification") : t("new_qualification")}
      />

      <form onSubmit={onSubmitHandler}>
        <div className="grid grid-cols-5 gap-3 gap-x-5">
          {/* Level */}
          <div className="flex flex-col gap-1 col-span-1">
            <Label text={t("level")} htmlFor="level" />
            <Select
              label={t("select_level")}
              name="level"
              value={formData.level}
              onChange={(e) =>
                updateNestedField("level", e.target.value as SchoolLevel)
              }
            >
              <option value="Primary">{t("primary")}</option>
              <option value="O-Level">{t("o_level")}</option>
              <option value="A-Level">{t("a_level")}</option>
            </Select>
          </div>

          {/* School Name */}
          <div className="flex flex-col gap-1 col-span-2">
            <Label text={t("school_name")} htmlFor="schoolName" />
            <TextInput
              name="schoolName"
              value={formData.school.name}
              onChange={(e) => updateSchoolField("name", e.target.value)}
            />
          </div>

          {/* School Location */}
          <div className="flex flex-col gap-1 col-span-2">
            <Label text={t("school_location")} htmlFor="schoolLocation" />
            <TextInput
              name="schoolLocation"
              value={formData.school.location}
              onChange={(e) => updateSchoolField("location", e.target.value)}
            />
          </div>
        </div>

        {/* Start & End Year */}
        <div className="grid grid-cols-5 gap-3 gap-x-5 mt-5">
          <div className="flex flex-col gap-1 col-span-1">
            <Label text={t("start_year")} htmlFor="startYear" />
            <TextInput
              name="startYear"
              value={formData.startYear.toString()}
              onChange={(e) => updateNestedField("startYear", e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1 col-span-1">
            <Label text={t("end_year")} htmlFor="endYear" />
            <TextInput
              name="endYear"
              value={formData.endYear.toString()}
              onChange={(e) => updateNestedField("endYear", e.target.value)}
            />
          </div>

          {/* Award */}
          <div className="flex flex-col gap-1 col-span-3">
            <Label text={t("award")} htmlFor="award" />
            <Select
              label={t("select_award")}
              name="award"
              value={formData.award}
              onChange={(e) =>
                updateNestedField("award", e.target.value as SchoolAward)
              }
            >
              <option value="Primary School Leaving Examination (PSLE)">
                {t("primary_school_leaving_examination")}
              </option>
              <option value="The Certificate of Secondary Education Examination (CSEE)">
                {t("certificate_of_secondary_education")}
              </option>
              <option value="Advanced Certificate of Secondary Education Examination (ACSEE)">
                {t("advanced_certificate_of_secondary_education")}
              </option>
            </Select>
          </div>
        </div>

        {/* Grade */}
        <div className="grid grid-cols-1 gap-3 gap-x-5 mt-5">
          <div className="flex gap-x-8">
            <div className="flex flex-col gap-1">
              <Label text={t("grade_division")} htmlFor="division" />
              <TextInput
                name="division"
                value={formData?.grade?.division ?? ""}
                onChange={(e) =>
                  updateGradeField("division", e.target.value as GradeDivision)
                }
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label text={t("grade_points")} htmlFor="points" />
              <TextInput
                name="points"
                value={String(formData?.grade?.points) ?? ""}
                onChange={(e) => updateGradeField("points", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Certificate */}
        <div className="mt-5 flex flex-col gap-1 relative">
          <Label text={t("certificate")} htmlFor="certificate" />
          <FileInput name="certificate" onChange={onFileChange} />
          <p className="text-xs text-gray-500 absolute left-0 -bottom-5">
            Only PDF
          </p>
        </div>

        {/* Submit */}
        <ActionButton
          text={editing ? t("update") : t("add")}
          theme="bg-violet-600"
          icon={editing ? <Edit2 size={16} /> : <Plus size={16} />}
          disabled={saving}
        />
      </form>
    </>
  );
};

export default SchoolForm;
