import type { SchoolType } from "app-school";
import { Edit, Loader, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import FileLink from "../../components/ui/FileLink";

interface SchoolTableProps {
  schools: SchoolType[];
  editing?: SchoolType | null;
  onEdit: (school: SchoolType) => void;
  onDelete: (id: string) => void;
  deletingId?: string | null;
}

const SchoolTable = ({
  schools,
  onEdit,
  onDelete,
  editing,
  deletingId = null,
}: SchoolTableProps) => {
  const { t } = useTranslation();

  const handleDelete = (school: SchoolType) => {
    const award = school.award ?? t("school_qualification");
    const schoolName = school.school?.name ?? t("school");
    const confirmMessage = t("confirm_delete_school", {
      award,
      school: schoolName,
    });
    // fallback to window.confirm for now; you can replace with modal later
    if (window.confirm(confirmMessage)) {
      if (school.id) onDelete(school.id);
    }
  };

  return (
    <div className="overflow-x-auto pb-5">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th className="py-4">{t("year")}</th>
            <th className="ps-4 py-4">{t("award")}</th>
            <th className="ps-4 py-4">{t("school")}</th>
            <th className="ps-4 py-4">{t("certification")}</th>
            <th className="ps-4 py-4 sr-only">{t("action")}</th>
          </tr>
        </thead>

        <tbody>
          {schools.length > 0 ? (
            schools.map((school) => {
              const isEditing = editing?.id === school.id;
              const isDeleting = deletingId === school.id;

              return (
                <tr
                  key={
                    school.id ??
                    `${school.startYear}-${school.endYear}-${school.school?.name}`
                  }
                  className={`odd:bg-white even:bg-gray-50 border-b ${
                    isEditing ? "bg-yellow-100" : ""
                  }`}
                >
                  <td className="py-4 whitespace-nowrap">
                    {school.startYear ?? ""}{" "}
                    {school.endYear ? `- ${school.endYear}` : ""}
                  </td>

                  <td className="ps-4 py-4 whitespace-normal">
                    {school.award ?? ""}
                  </td>

                  <td className="ps-4 py-4">
                    <div className="flex flex-col">
                      <span className="truncate">
                        {school.school?.name ?? ""}
                      </span>
                      {school.school?.location && (
                        <span className="italic text-xs text-gray-600">
                          {school.school.location}
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="ps-4 py-4">
                    {school.certificate ? (
                      <FileLink
                        fileUrl={school.certificate}
                        label={t("certificate")}
                      />
                    ) : (
                      <span className="text-xs text-gray-400">
                        {t("no_certificate")}
                      </span>
                    )}
                  </td>

                  <td className="ps-4 py-4">
                    <div className="flex items-center space-x-4">
                      <button
                        type="button"
                        title={t("edit")}
                        aria-label={t("edit")}
                        className="cursor-pointer hover:text-violet-600 focus:outline-none"
                        onClick={() => onEdit(school)}
                      >
                        <Edit size={14} />
                      </button>

                      <button
                        type="button"
                        title={t("delete")}
                        aria-label={t("delete")}
                        className="cursor-pointer hover:text-amber-700 focus:outline-none"
                        onClick={() => handleDelete(school)}
                        disabled={isDeleting}
                      >
                        {isDeleting ? (
                          <div className="w-4 h-4 flex items-center justify-center">
                            <Loader />
                          </div>
                        ) : (
                          <X size={14} />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={5} className="py-6 text-center text-amber-800">
                {t("no_school_qualifications_added")}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SchoolTable;
