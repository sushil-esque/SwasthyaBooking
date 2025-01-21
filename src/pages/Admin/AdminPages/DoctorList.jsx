import { useQuery } from "@tanstack/react-query";
import { getDoctors } from "../../../api/user";
import { useState } from "react";

function DoctorList() {
  const { data } = useQuery({
    queryKey: ["doctorList"],
    queryFn: getDoctors,
    retry: 3,
  });

  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // Sort function
  const sortedData = () => {
    if (!data) return [];

    const sortedArray = [...data];
    if (sortConfig.key) {
      sortedArray.sort((a, b) => {
        const valueA = a[sortConfig.key];
        const valueB = b[sortConfig.key];

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
      {/* Up Arrow */}
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
      {/* Down Arrow */}
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
                scope="col"
                className="px-6 py-3 cursor-pointer"
                onClick={() => requestSort("Image")}
              >
                Image
                <SortArrows columnKey="Image" />
              </th>
              <th
                scope="col"
                className="px-6 py-3 cursor-pointer"
                onClick={() => requestSort("Name")}
              >
                Name
                <SortArrows columnKey="Name" />
              </th>
              <th
                scope="col"
                className="px-6 py-3 cursor-pointer"
                onClick={() => requestSort("Email")}
              >
                Email
                <SortArrows columnKey="Email" />
              </th>
              <th
                scope="col"
                className="px-6 py-3 cursor-pointer"
                onClick={() => requestSort("Phone")}
              >
                Phone
                <SortArrows columnKey="Phone" />
              </th>
              <th
                scope="col"
                className="px-6 py-3 cursor-pointer"
                onClick={() => requestSort("Speciality")}
              >
                Speciality
                <SortArrows columnKey="Speciality" />
              </th>
              <th
                scope="col"
                className="px-6 py-3 cursor-pointer"
               
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {finalData?.map((doctors) => (
              <tr
                key={doctors.id}
                className="bg-white border-b"
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                >
                  {doctors.id}
                </th>
                <td className="px-6 py-4">
                  <div><img src={doctors.Image} alt="" className="w-10 h-10" /></div>
                 
                </td>
                <td className="px-6 py-4">
                    {doctors.Name}
                </td>
                <td className="px-6 py-4">{doctors.Email}</td>
                <td className="px-6 py-4">{doctors.Phone}</td>
                <td className="px-6 py-4">{doctors.Speciality}</td>


                <td className="px-6 py-4 text-right">
                  <a
                    href="#"
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                  >
                    Edit
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DoctorList;
