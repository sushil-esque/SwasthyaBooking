import { useQuery } from "@tanstack/react-query";
import { getPatients } from "../../../api/user"; // Ensure you have this API call
import { useState } from "react";

function Patients() {
  const { data } = useQuery({
    queryKey: ["patientList"],
    queryFn: getPatients, // Replace with the correct function to fetch patients
    retry: 3,
  });

  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

  // Sort function
  const sortedData = () => {
    if (!data?.data) return [];

    const sortedArray = [...data.data]; // Access the array under `data.data`
    if (sortConfig.key) {
      sortedArray.sort((a, b) => {
        const valueA = a[sortConfig.key] || a.user[sortConfig.key]; // Handle nested keys
        const valueB = b[sortConfig.key] || b.user[sortConfig.key];

        if (valueA < valueB) return sortConfig.direction === "asc" ? -1 : 1;
        if (valueA > valueB) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sortedArray;
  };

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const finalData = sortedData();

  // Arrow Component
  const SortArrows = ({ columnKey }) => (
    <div className="inline-flex flex-col ml-1">
      <svg
        className={`w-3 h-3 ${
          sortConfig.key === columnKey && sortConfig.direction === "asc"
            ? "text-black"
            : "text-gray-400"
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M5 12l5-5 5 5H5z" />
      </svg>
      <svg
        className={`w-3 h-3 ${
          sortConfig.key === columnKey && sortConfig.direction === "desc"
            ? "text-black"
            : "text-gray-400"
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M5 8l5 5 5-5H5z" />
      </svg>
    </div>
  );

  return (
    <div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 cursor-pointer"
                onClick={() => requestSort("id")}
              >
                ID
                <SortArrows columnKey="id" />
              </th>
              <th
                              className="px-6 py-3"

              >Profile Picture</th>
              <th
                scope="col"
                className="px-6 py-3 cursor-pointer"
                onClick={() => requestSort("name")}
              >
                Name
                <SortArrows columnKey="name" />
              </th>
              <th
                scope="col"
                className="px-6 py-3 cursor-pointer"
                onClick={() => requestSort("email")}
              >
                Email
                <SortArrows columnKey="email" />
              </th>
              <th scope="col" className="px-6 py-3">
                Phone no.
              </th>
            </tr>
          </thead>
          <tbody>
            {finalData?.map((patient) => (
              <tr key={patient.id} className="bg-white border-b">
                <td
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                >
                  {patient.id}
                </td>
                <td className="px-6 py-4">
                  <img src={`${IMAGE_BASE_URL}${patient.profile_picture}`} className="w-10 h-10" alt="" />
                </td>

                <td className="px-6 py-4">{patient.name}</td>
                <td className="px-6 py-4">{patient.email}</td>
                <td className="px-6 py-4">{patient.phone_number}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Patients;
