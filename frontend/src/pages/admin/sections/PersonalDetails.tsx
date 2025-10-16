import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getPersonById } from "../../../services/sections/personalInfo";
import type {
  Disability,
  PersonalInfoFormDataValues,
  PersonalInfoType,
} from "app-personalinfo";
import Spinner from "../../../components/ui/Spinner";
import { useTranslation } from "react-i18next";
import { logAlert } from "../../../utilities/logging";
import type { AlertType } from "app-ui";
import Alert from "../../../components/ui/Alert";

const disabilityOptions: Disability[] = [
  "none",
  "visual",
  "hearing",
  "mobility",
  "cognitive",
  "other",
];

const PersonalDetails = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const [personalInfo, setPersonalInfo] = useState<
    PersonalInfoType | undefined
  >();
  const [formData, setFormData] = useState<PersonalInfoFormDataValues>({
    dateOfBirth: "",
    disabilities: [],
    email: "",
    fullName: "",
    gender: "",
    maritalStatus: "",
    nationality: "",
    phone: "",
    physicalAddress: "",
    placeOfDomicile: "",
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [alert, setAlert] = useState<AlertType | undefined>();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const onCheckBox = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value.trim() as Disability;
    const isChecked = e.target.checked;

    const current = [...(formData?.disabilities ?? [])];

    let updated = current;

    if (isChecked) {
      if (value === "none") {
        updated = ["none"];
      } else {
        updated = current.filter((v) => v !== "none" && v !== value);
        updated.push(value);
      }
    } else {
      updated = current.filter((v) => v !== value);
      if (updated.length === 0) updated = ["none"];
    }

    setFormData({ ...formData, disabilities: updated });
  };

  const handleFetch = async () => {
    if (!id) return;

    setLoading(true);
    try {
      const { success, message, person } = await getPersonById(id);

      if (!success) {
        logAlert({ success, message }, setAlert);
        return;
      }

      setPersonalInfo(person);
      setFormData({
        dateOfBirth: person?.dateOfBirth ?? "",
        disabilities: person?.disabilities ?? [],
        email: person?.email ?? "",
        fullName: person?.fullName ?? "",
        gender: person?.gender ?? "",
        maritalStatus: person?.maritalStatus ?? "",
        nationality: person?.nationality ?? "",
        phone: person?.phone ?? "",
        physicalAddress: person?.physicalAddress ?? "",
        placeOfDomicile: person?.placeOfDomicile ?? "",
      });
    } catch (error) {
      console.error("❌ Failed to fetch personal info", error);
      setPersonalInfo(undefined);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetch();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[90vh] flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  if (!personalInfo || !formData) return <div>Personal info not found</div>;

  return (
    <div className="space-y-5 relative min-h-[84vh]">
      <h2 className="text-xl font-semibold text-cyan-800">Personal Details</h2>

      <div className="absolute right-0 top-0">
        {alert && <Alert alert={alert} setAlert={setAlert} />}
      </div>

      <form className="space-y-6 p-6 bg-white shadow-md rounded-lg">
        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Username</label>
            <input
              type="text"
              value={
                typeof personalInfo?.resume === "object"
                  ? personalInfo.resume.user.username
                  : ""
              }
              readOnly
              className="mt-1 w-full border border-gray-300 px-3 py-2 rounded-md bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Resume Title
            </label>
            <input
              type="text"
              value={
                typeof personalInfo?.resume === "object"
                  ? t(personalInfo.resume.title)
                  : ""
              }
              readOnly
              className="mt-1 w-full border border-gray-300 px-3 py-2 rounded-md bg-gray-100"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-5">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName || ""}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 px-3 py-2 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Gender</label>
            <select
              name="gender"
              value={formData.gender || ""}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 px-3 py-2 rounded-md"
            >
              <option value="female">{t("female")}</option>
              <option value="male">{t("male")}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Date of Birth
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={
                formData?.dateOfBirth instanceof Date
                  ? formData.dateOfBirth.toISOString().split("T")[0]
                  : formData?.dateOfBirth
                  ? formData.dateOfBirth.split("T")[0]
                  : ""
              }
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 px-3 py-2 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Nationality
            </label>
            <select
              name="nationality"
              value={formData.nationality || ""}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 px-3 py-2 rounded-md"
            >
              <option value="tanzania">{t("tanzania")}</option>
              <option value="kenya">{t("kenya")}</option>
              <option value="uganda">{t("uganda")}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Place of Domicile
            </label>
            <input
              type="text"
              name="placeOfDomicile"
              value={formData.placeOfDomicile || ""}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 px-3 py-2 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Marital Status
            </label>
            <select
              name="maritalStatus"
              value={formData.maritalStatus || ""}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 px-3 py-2 rounded-md"
            >
              <option value="single">{t("single")}</option>
              <option value="married">{t("married")}</option>
              <option value="divorced">{t("divorced")}</option>
              <option value="widowed">{t("widowed")}</option>{" "}
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-1.5 max-w-xs">
          <fieldset>
            <legend className="text-sm text-gray-600 capitalize mb-1">
              {t("disabilities")}
            </legend>
            <ul className="grid grid-cols-2 gap-1">
              {disabilityOptions.map((option) => (
                <li key={option} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name={option}
                    id={option}
                    value={option}
                    checked={(formData.disabilities ?? []).includes(option)}
                    onChange={onCheckBox}
                  />
                  <label htmlFor={option}>{t(`${option}`)}</label>
                </li>
              ))}
            </ul>
          </fieldset>
        </div>

        <div className="grid grid-cols-3 gap-5">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 px-3 py-2 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone || ""}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 px-3 py-2 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Physical Address
            </label>
            <input
              type="text"
              name="physicalAddress"
              value={formData.physicalAddress || ""}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 px-3 py-2 rounded-md"
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-5">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md transition"
          >
            Update
          </button>
          <button
            type="button"
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-md transition"
          >
            Delete
          </button>
        </div>
      </form>
    </div>
  );
};

export default PersonalDetails;
