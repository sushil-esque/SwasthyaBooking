import { useMutation, useQuery } from "@tanstack/react-query";
import { getDoctorAppointments, updateAppointment } from "@/api/doctor";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FaCheck } from "react-icons/fa6";
import { GiCancel } from "react-icons/gi";
import { Loader } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

function Appointments() {
  const { data: appointmentData, isLoading } = useQuery({
    queryKey: ["doctorAppointments"],
    queryFn: showappointments,
    retry: 3,
  });

  const { mutate: acceptMutate } = useMutation({
    mutationFn: updateAppointment,
    onSuccess: () => {
      toast({
        title: "Appointment accepted successfully",
        variant: "default",
      });
    },
    onError: () => {
      toast({
        title: "Failed to accept appointment",
        variant: "destructive",
      });
    },
  });

  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  if (isLoading) {
    return <Loader />;
  }

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
                onClick={() => requestSort("appointment_id")}
              >
                Patient name
                <SortArrows columnKey="appointment_id" />
              </th>
              <th
                scope="col"
                className="px-6 py-3 cursor-pointer"
                onClick={() => requestSort("amount")}
              >
                Amount
                <SortArrows columnKey="amount" />
              </th>
              <th
                scope="col"
                className="px-6 py-3 cursor-pointer"
                onClick={() => requestSort("appointment_status")}
              >
                Appointment Status
                <SortArrows columnKey="appointment_status" />
              </th>
              <th scope="col" className="px-6 py-3">
                Change Status
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
                <td
                  className="px-6 py-4 cursor-pointer text-blue-500 hover:underline"
                 
                >
                  {appointment.user_id}
                </td>

                <td className="px-6 py-4">${appointment.amount}</td>
                <td className="px-6 py-4">{appointment.status}</td>
                <td className="px-6 py-4 text-right flex gap-2">
                  {/* Show Completed Badge only if status is "completed" */}
                  {appointment.status === "rescheduled" && (
                    <Badge variant="secondary">rescheduled</Badge>
                  )}
                  {appointment.status === "confirmed" && (
                    <Badge variant="secondary">Accepted</Badge>
                  )}
                  {appointment.appointment_status === "cancelled" && (
                    <Badge variant="secondary">cancelled</Badge>
                  )}

                  {/* Show Accept and Reject buttons only if status is "pending" */}
                  {appointment.status === "pending" && (
                    <>
                      <Button
                        variant="secondary"
                        onClick={() => handleAccept(appointment)}
                      >
                        <FaCheck />
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleReject(appointment.id)}
                      >
                        <GiCancel />
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Appointments;