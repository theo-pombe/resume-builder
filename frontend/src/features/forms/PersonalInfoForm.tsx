import { useEffect, useState } from "react";
import ActionButton from "../../components/ui/ActionButton";
import { Edit, Plus, Save, X } from "lucide-react";
import Select from "../../components/form/Select";
import Label from "../../components/form/Label";
import TextInput from "../../components/form/TextInput";
import { useTranslation } from "react-i18next";
import SectionDivider from "../../components/ui/SectionDivider";
import type {
  Disability,
  PersonalInfoFormDataValues,
  PersonalInfoType,
} from "app-personalinfo";

const disabilityOptions: Disability[] = [
  "none",
  "visual",
  "hearing",
  "mobility",
  "cognitive",
  "other",
];

interface ResumeFormProps {
  id: string;
  initialValues?: PersonalInfoType;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  addPersonalInfo: (data: PersonalInfoFormDataValues) => Promise<void>;
  updatePersonalInfo: (data: PersonalInfoFormDataValues) => Promise<void>;
}

const PersonalInfoForm = ({
  id,
  initialValues,
  isEditing,
  setIsEditing,
  addPersonalInfo,
  updatePersonalInfo,
}: ResumeFormProps) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<PersonalInfoFormDataValues>({
    fullName: initialValues?.fullName || "",
    gender: initialValues?.gender || "",
    dateOfBirth: initialValues?.dateOfBirth || "",
    email: initialValues?.email || "",
    phone: initialValues?.phone || "",
    nationality: initialValues?.nationality || "",
    placeOfDomicile: initialValues?.placeOfDomicile || "",
    maritalStatus: initialValues?.maritalStatus || "",
    physicalAddress: initialValues?.physicalAddress || "",
    disabilities: initialValues?.disabilities || ["none"],
  });

  const onChangeHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onCheckBox = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value.trim() as Disability;
    const isChecked = e.target.checked;

    let updated = [...(formData.disabilities ?? [])];

    if (isChecked) {
      // If "none" is checked, remove others
      if (value === "none") {
        updated = ["none"];
      } else {
        updated = updated.filter((v) => v !== "none" && v !== value);
        updated.push(value);
      }
    } else {
      updated = updated.filter((v) => v !== value);
    }

    setFormData((prev) => ({ ...prev, disabilities: updated }));
  };

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = {
      ...formData,
      dateOfBirth: new Date(formData.dateOfBirth),
    };

    if (!id) {
      await addPersonalInfo(payload);
    } else {
      await updatePersonalInfo(payload);
    }

    setIsEditing(false);
  };

  useEffect(() => {
    if (!isEditing) {
      setFormData({
        fullName: initialValues?.fullName || "",
        gender: initialValues?.gender || "",
        dateOfBirth: initialValues?.dateOfBirth || "",
        email: initialValues?.email || "",
        phone: initialValues?.phone || "",
        nationality: initialValues?.nationality || "",
        placeOfDomicile: initialValues?.placeOfDomicile || "",
        maritalStatus: initialValues?.maritalStatus || "",
        physicalAddress: initialValues?.physicalAddress || "",
        disabilities: initialValues?.disabilities ?? ["none"],
      });
    }
  }, [initialValues, isEditing]);

  return (
    <form method="post" onSubmit={onSubmitHandler}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 gap-x-6">
        <div className="flex flex-col gap-1.5">
          <Label text={t("full_name")} htmlFor="fullName" />
          <TextInput
            name="fullName"
            placeholder={t("full_name")}
            onChange={onChangeHandler}
            value={formData.fullName}
            disabled={!isEditing}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label text={t("gender")} htmlFor="gender" />
          <Select
            label={t("choose_gender")}
            name="gender"
            onChange={onChangeHandler}
            value={formData.gender}
            disabled={!isEditing}
          >
            <option value="female">{t("female")}</option>
            <option value="male">{t("male")}</option>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label text={t("date_of_birth")} htmlFor="dateOfBirth" />
          <TextInput
            type="date"
            name="dateOfBirth"
            onChange={onChangeHandler}
            value={
              formData.dateOfBirth instanceof Date
                ? formData.dateOfBirth.toISOString().split("T")[0]
                : formData.dateOfBirth
                ? formData.dateOfBirth.split("T")[0]
                : ""
            }
            disabled={!isEditing}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label text={t("nationality")} htmlFor="nationality" />
          <Select
            name="nationality"
            label={t("choose_nationality")}
            onChange={onChangeHandler}
            value={formData.nationality}
            disabled={!isEditing}
          >
            <option value="tanzania">{t("tanzania")}</option>
            <option value="kenya">{t("kenya")}</option>
            <option value="uganda">{t("uganda")}</option>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label text={t("place_of_domicile")} htmlFor="placeOfDomicile" />
          <TextInput
            name="placeOfDomicile"
            placeholder={t("place_of_domicile_placeholder")}
            onChange={onChangeHandler}
            value={formData.placeOfDomicile ?? ""}
            disabled={!isEditing}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label text={t("marital_status")} htmlFor="maritalStatus" />
          <Select
            label={t("choose_marital_status")}
            name="maritalStatus"
            onChange={onChangeHandler}
            value={formData.maritalStatus ?? ""}
            disabled={!isEditing}
          >
            <option value="single">{t("single")}</option>
            <option value="married">{t("married")}</option>
            <option value="divorced">{t("divorced")}</option>
            <option value="widowed">{t("widowed")}</option>
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-1 max-w-xs my-5">
        <fieldset>
          <legend className="text-sm text-gray-600 capitalize mb-1">
            {t("disabilities")}
          </legend>
          <ul className="grid grid-cols-2 gap-1">
            {disabilityOptions.map((option) => (
              <li key={option} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="disabilities"
                  id={`disability-${option}`}
                  value={option}
                  checked={(formData.disabilities ?? []).includes(option)}
                  onChange={onCheckBox}
                  disabled={!isEditing}
                />
                <label htmlFor={`disability-${option}`}>{t(`${option}`)}</label>
              </li>
            ))}
          </ul>
        </fieldset>
      </div>

      <SectionDivider title={t("contact_details")} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 gap-x-6">
        <div className="flex flex-col gap-1.5">
          <Label text={t("email")} htmlFor="email" />
          <TextInput
            type="email"
            name="email"
            placeholder={t("email")}
            onChange={onChangeHandler}
            value={formData.email ?? ""}
            disabled={!isEditing}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label text={t("phone")} htmlFor="phone" />
          <TextInput
            type="tel"
            name="phone"
            placeholder={t("phone")}
            onChange={onChangeHandler}
            value={formData.phone ?? ""}
            disabled={!isEditing}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label text={t("physical_address")} htmlFor="physicalAddress" />
          <TextInput
            name="physicalAddress"
            placeholder={t("placeholder_physical_address")}
            onChange={onChangeHandler}
            value={formData.physicalAddress}
            disabled={!isEditing}
          />
        </div>
      </div>

      {!isEditing ? (
        <button
          type="button"
          className={`${
            id
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-emerald-600 hover:bg-emerald-700"
          } text-white rounded cursor-pointer px-5 py-1.5 flex items-center gap-x-2 mt-5`}
          onClick={() => setIsEditing(true)}
        >
          {id ? t("update") : t("add")}
          {id ? <Edit size={16} /> : <Plus size={16} />}
        </button>
      ) : (
        <div className="flex items-center justify-between">
          <button
            type="button"
            className="bg-slate-800 rounded-s text-white cursor-pointer px-3.5 py-1.5 flex items-center gap-x-2 mt-5"
            onClick={() => setIsEditing(false)}
          >
            <X size={16} />
            {t("cancel")}
          </button>
          <ActionButton
            text={t("save")}
            theme="bg-teal-600"
            icon={<Save size={16} />}
          />
        </div>
      )}
    </form>
  );
};

export default PersonalInfoForm;
