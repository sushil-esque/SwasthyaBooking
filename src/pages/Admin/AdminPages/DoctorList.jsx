import { useQuery } from "@tanstack/react-query";
import { showDoctors, showSpecialities } from "@/api/admin";
import { useState } from "react";
import Loader from "@/components/Loader";

function DoctorList() {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const {
    data,
    isLoading,
    isSuccess: doctorsSuccess,
  } = useQuery({
    queryKey: ["doctorList"],
    queryFn: showDoctors,
    retry: 3,
  });

  doctorsSuccess && console.log(data.data);

  const {
    data: specializationData,
    isLoading: specilizationLoading,
    isSuccess,
  } = useQuery({
    queryKey: ["specializations"],
    queryFn: showSpecialities,
    retry: 3,
  });

  isSuccess && console.log(specializationData?.data);

  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // Sort function
  const sortedData = () => {
    if (!data || !data.data) return [];

    const sortedArray = [...data.data];
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

  const getSpecializationName = (id) => {
    if (!specializationData || !specializationData.data || !id)
      return "Unknown";
    console.log("Looking for ID:", id);
    const specialization = specializationData?.data.find(
      (spec) => spec.id.toString() === id
    );
    console.log("Found Specialization:", specialization);
    return specialization ? specialization.name : "Unknown Specialization";
  };

  const finalData = sortedData();

  if (isLoading || specilizationLoading) {
    return <Loader />;
  }

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
              <th scope="col" className="px-6 py-3">
                Image
              </th>
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
              <th
                scope="col"
                className="px-6 py-3 cursor-pointer"
                onClick={() => requestSort("phone_number")}
              >
                Phone
                <SortArrows columnKey="phone_number" />
              </th>
              <th scope="col" className="px-6 py-3">
                Speciality
              </th>
              <th scope="col" className="px-6 py-3">
                Available Times
              </th>
            </tr>
          </thead>
          <tbody>
            {finalData?.map((doctor) => (
              <tr key={doctor.id} className="bg-white border-b">
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  {doctor.id}
                </td>
                <td className="px-6 py-4">
                  {console.log(
                    `http://127.0.0.1:8000${doctor.profile_picture}`
                  )}
                  <img
                    src={`http://127.0.0.1:8000${doctor.profile_picture}`}
                    alt="Profile"
                    className="w-10 h-10 rounded-full"
                  />
                </td>
                <td className="px-6 py-4">{doctor.name}</td>
                <td className="px-6 py-4">{doctor.email}</td>
                <td className="px-6 py-4">{doctor.phone_number}</td>
                <td className="px-6 py-4">
                  {getSpecializationName(doctor.speciality_id)}
                </td>
                <td className="px-6 py-4">
                  {doctor.doctor_available.map((availability) => (
                    <div key={availability.id}>
                      <p>{availability.date}</p>
                      <ul>
                        {availability.available_times.map((time) => (
                          <li key={time.id}>{time.time}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
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
