import { useQuery } from "@tanstack/react-query";
import { getAppointments } from "../../api/user";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function UserAppointments() {
  const { data: appointmentData, isLoading } = useQuery({
    queryKey: ["userAppointments"],
    queryFn: getAppointments,
    retry: 3,
  });

  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const navigate = useNavigate();
  if (isLoading) return "Loading...";

  // Sort function
  const sortedData = () => {
    if (!appointmentData?.data) return [];

    const sortedArray = [...appointmentData.data];
    if (sortConfig.key) {
      sortedArray.sort((a, b) => {
        let valueA, valueB;

        // Handle nested keys (e.g., "doctor.name")
        if (sortConfig.key.includes(".")) {
          const keys = sortConfig.key.split(".");
          valueA = keys.reduce((obj, key) => obj[key], a);
          valueB = keys.reduce((obj, key) => obj[key], b);
        } else {
          valueA = a[sortConfig.key];
          valueB = b[sortConfig.key];
        }

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
                Appointment ID
                <SortArrows columnKey="id" />
              </th>
              <th
                scope="col"
                className="px-6 py-3 cursor-pointer"
                onClick={() => requestSort("date")}
              >
                Appointment Date & Time
                <SortArrows columnKey="date" />
              </th>
              <th
                scope="col"
                className="px-6 py-3 cursor-pointer"
                onClick={() => requestSort("doctor.name")}
              >
                Doctor
                <SortArrows columnKey="doctor.name" />
              </th>
              <th
                scope="col"
                className="px-6 py-3 cursor-pointer"
                onClick={() => requestSort("fee")}
              >
                Amount
                <SortArrows columnKey="fee" />
              </th>
              <th
                scope="col"
                className="px-6 py-3 cursor-pointer"
                onClick={() => requestSort("status")}
              >
                Appointment Status
                <SortArrows columnKey="status" />
              </th>
              
            </tr>
          </thead>
          <tbody>
            {finalData?.map((appointment) => (
              <tr key={appointment.id} className="bg-white border-b">
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                >
                  {appointment.id}
                </th>
                <td className="px-6 py-4">
                  <div>{appointment.date}</div>
                  <div className="text-gray-500">{appointment.time}</div>
                </td>
                <td className="px-6 py-4 text-blue-600 cursor-pointer hover:underline"                   onClick={() => navigate(`/findDoctors/${appointment.doctor.id}`)}
                >
                  {appointment.doctor.name}
                </td>
                <td className="px-6 py-4">${appointment.doctor.fee}</td>
                <td className="px-6 py-4">{appointment.status}</td>
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserAppointments;