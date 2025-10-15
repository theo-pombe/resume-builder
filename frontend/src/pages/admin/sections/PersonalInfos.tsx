import { useCallback, useEffect, useState } from "react";
import Spinner from "../../../components/ui/Spinner";
import SearchFilter from "../../../components/admin/SearchFilter";
import Pagination from "../../../components/admin/Pagination";
import { Mail, MapPin, Phone } from "lucide-react";
import { getPersons } from "../../../services/sections/personalInfo";
import type { PersonalInfoType } from "app-personalinfo";
import type { AlertType } from "app-ui";
import { logAlert } from "../../../utilities/logging";
import Alert from "../../../components/ui/Alert";
import { Link } from "react-router";

const PersonalInfos = () => {
  const [personalInfos, setPersonalInfos] = useState<PersonalInfoType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [alert, setAlert] = useState<AlertType | undefined>();

  const getPersonalInfos = useCallback(async () => {
    setLoading(true);
    try {
      const { success, message, persons } = await getPersons();
      if (!success) {
        logAlert({ success, message }, setAlert);
        setPersonalInfos([]);
        return;
      }
      setPersonalInfos(persons ?? []);
      logAlert({ success, message }, setAlert);
    } catch (error) {
      console.error("❌ Failed to fetch personal informations", error);
      setPersonalInfos([]);
      logAlert(
        { success: false, message: "Failed to fetch personal informations" },
        setAlert
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getPersonalInfos();
  }, [getPersonalInfos]);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  const filtered = personalInfos.filter((ref) => {
    const searchTerm = search.toLowerCase();
    const fieldsToSearch = [ref.fullName, ref.phone, ref.email];

    const matchesSearch = fieldsToSearch.some((field) =>
      field?.toLowerCase().includes(searchTerm)
    );

    const matchesFilter = filter === "" || ref.gender === filter;
    return matchesSearch && matchesFilter;
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filtered.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filter]);

  if (loading) {
    return (
      <div className="min-h-[90vh] flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="relative min-h-[84vh]">
      <h2 className="text-xl font-semibold text-cyan-800">
        Personal Informations
      </h2>

      <div className="absolute right-0 top-0">
        {alert && <Alert alert={alert} setAlert={setAlert} />}
      </div>

      <SearchFilter
        search={search}
        setSearch={setSearch}
        filter={filter}
        setFilter={setFilter}
        filterOptions={[
          { value: "", label: "All Genders" },
          { value: "female", label: "Female" },
          { value: "male", label: "Male" },
        ]}
      />

      <table className="min-w-full table-fixed text-sm text-left text-gray-500">
        <thead className="text-gray-700 uppercase text-xs bg-gray-50">
          <tr>
            <th className="py-2 px-4"></th>
            <th scope="col" className="py-2 px-4">
              Full Name
            </th>
            <th className="py-2 px-4">Gender</th>
            <th className="py-2 px-4">Email</th>
            <th className="py-2 px-4">Phone</th>
            <th className="py-2 px-4">Physical Address</th>
          </tr>
        </thead>

        <tbody>
          {paginatedItems.length > 0 ? (
            paginatedItems.map((person, i) => {
              return (
                <tr
                  key={person.id}
                  className="odd:bg-white even:bg-gray-50 border-b border-gray-300 hover:bg-gray-100 transition-colors"
                >
                  <td className="py-2 px-4">{startIndex + i + 1}</td>
                  <td className="py-2 px-4">
                    <Link
                      to={`/admin/sections/personal-informations/${person.id}`}
                      className="font-medium text-gray-900"
                    >
                      {person.fullName}
                    </Link>
                  </td>
                  <td className="py-2 px-4">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full capitalize
                      ${
                        person.gender === "male"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-pink-100 text-pink-700"
                      }`}
                    >
                      {person.gender}
                    </span>
                  </td>
                  <td className="py-2 px-4 text-gray-700 max-w-xs">
                    <a
                      href={`mailto:${person.email}`}
                      className="inline-flex items-center text-xs gap-2 px-2 py-1 rounded-md font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 transition-colors duration-200 truncate"
                      title={person.email}
                    >
                      <Mail className="w-3 h-3 text-blue-500" />
                      <span className="truncate">{person.email}</span>
                    </a>
                  </td>
                  <td className="py-2 px-4">
                    <a
                      href={`tel:${person.phone}`}
                      className="inline-flex items-center text-xs gap-2 text-green-600 hover:text-green-700 transition-colors duration-200"
                    >
                      <Phone className="w-3 h-3" />
                      <span>{person.phone}</span>
                    </a>
                  </td>
                  <td className="py-2 px-4 max-w-xs">
                    <div
                      className="inline-flex items-center text-xs gap-2 px-2 py-1 rounded-md bg-purple-50 text-purple-700 font-medium truncate"
                      title={person.physicalAddress}
                    >
                      <MapPin className="w-3 h-3 text-purple-500" />
                      <span className="truncate">{person.physicalAddress}</span>
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td className="py-4 px-4 text-amber-800 text-center" colSpan={6}>
                No personal infos found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        startIndex={startIndex}
        totalItems={filtered.length}
        totalPaginatedItems={paginatedItems.length}
        context="Personal Informations"
      />
    </div>
  );
};

export default PersonalInfos;
