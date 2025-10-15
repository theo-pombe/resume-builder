import { useTranslation } from "react-i18next";
import SectionHeader from "../../components/SectionHeader";
import SectionDivider from "../../components/ui/SectionDivider";
import { useEffect, useState, useCallback } from "react";
import type { AlertType } from "app-ui";
import Spinner from "../../components/ui/Spinner";
import Alert from "../../components/ui/Alert";
import { logAlert } from "../../utilities/logging";
import {
  addPerson,
  editPerson,
  getPerson,
} from "../../services/sections/personalInfo";
import { useParams } from "react-router";
import PersonalInfoForm from "../../features/forms/PersonalInfoForm";
import type {
  PersonalInfoFormDataValues,
  PersonalInfoType,
} from "app-personalinfo";

const PersonalInfo = () => {
  const { t } = useTranslation();
  const { id: resumeId } = useParams();
  const [personalInfo, setPersonalInfo] = useState<PersonalInfoType | undefined>();
  const [loading, setLoading] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [alert, setAlert] = useState<AlertType | undefined>();

  const fetchPersonalInfo = useCallback(async () => {
    if (!resumeId) return;

    setLoading(true);
    try {
      const { success, message, person } = await getPerson(resumeId);

      if (!success) {
        logAlert({ success, message }, setAlert);
        setPersonalInfo(undefined);
        // allow user to add new info if none exists
        setIsEditing(true);
        return;
      }

      setPersonalInfo(person);
      logAlert({ success, message }, setAlert);

      // if there is no person data, open the form so user can add
      if (!person) {
        setIsEditing(true);
      }
    } catch (error) {
      console.error("Can't get personal information", error);
      logAlert(
        { success: false, message: t("failed_to_fetch_personal_info") },
        setAlert
      );
      setPersonalInfo(undefined);
      setIsEditing(true);
    } finally {
      setLoading(false);
    }
  }, [resumeId, t]);

  useEffect(() => {
    fetchPersonalInfo();
  }, [fetchPersonalInfo]);

  const addPersonalInfo = async (data: PersonalInfoFormDataValues) => {
    if (!resumeId) return;

    setLoading(true);
    try {
      const { success, message, person } = await addPerson(resumeId, data);

      if (!success) {
        logAlert({ success, message }, setAlert);
        return;
      }

      setPersonalInfo(person);
      logAlert({ success, message }, setAlert);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to add personal info:", error);
      logAlert(
        { success: false, message: t("failed_to_add_personal_info") },
        setAlert
      );
    } finally {
      setLoading(false);
    }
  };

  const updatePersonalInfo = async (data: PersonalInfoFormDataValues) => {
    if (!resumeId) return;

    setLoading(true);
    try {
      const { success, message, person } = await editPerson(resumeId, data);

      if (!success) {
        logAlert({ success, message }, setAlert);
        return;
      }

      setPersonalInfo(person);
      logAlert({ success, message }, setAlert);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update personal info:", error);
      logAlert(
        { success: false, message: t("failed_to_update_personal_info") },
        setAlert
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[90vh] flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="relative p-6">
      <SectionHeader title={t("personal_information")} />

      <div className="absolute right-0 top-0">
        {alert && <Alert alert={alert} setAlert={setAlert} />}
      </div>

      <SectionDivider title={t("personal_details")} />

      <PersonalInfoForm
        id={personalInfo?.id ?? ""}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        addPersonalInfo={addPersonalInfo}
        updatePersonalInfo={updatePersonalInfo}
        initialValues={personalInfo}
      />
    </div>
  );
};

export default PersonalInfo;
