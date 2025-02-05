import { useMutation, useQuery } from "@tanstack/react-query";
import { acceptAppointments, getAppointments } from "../../../api/user";
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

function DoctorAppointments() {
  const { data, isLoading } = useQuery({
    queryKey: ["userAppointments"],
    queryFn: getAppointments,
    retry: 3,
  });
  



  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  if (isLoading) {
    return <Loader />;
  }
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
  const handleShowPatientDetails = (appointment) => {
    setSelectedPatient({
      name: appointment.patient_name,
      location: appointment.location,
      email: appointment.patient_email,
      phone: appointment.patient_phone,
    });
    setIsDialogOpen(true);
  };
  const handleAccept = (id) => {
    console.log(`Accepting appointment with ID: ${id}`);
   
    // Add logic for accepting the appointment
  };

  const handleReject = (id) => {
    console.log(`Rejecting appointment with ID: ${id}`);
    // Add logic for rejecting the appointment
  };
  console.log(selectedPatient)

  return (
    <div>
      {/* Patient Details Dialog */}
      {selectedPatient && (
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Patient Details</DialogTitle>
              <DialogDescription>
                <p>Name: {selectedPatient.name}</p>
                <p>Location: {selectedPatient.location}</p>
                <p>Email: {selectedPatient.email}</p>
                <p>Phone: {selectedPatient.phone}</p>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}
      

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 cursor-pointer"
                onClick={() => requestSort("appointment_id")}
              >
                Appointment ID
                <SortArrows columnKey="appointment_id" />
              </th>
              <th
                scope="col"
                className="px-6 py-3 cursor-pointer"
                onClick={() => requestSort("appointment_date")}
              >
                Appointment Date & Time
                <SortArrows columnKey="appointment_date" />
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
              <tr
                key={appointment.appointment_id}
                className="bg-white border-b"
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                >
                  {appointment.appointment_id}
                </th>
                <td className="px-6 py-4">
                  <div>{appointment.appointment_date}</div>
                  <div className="text-gray-500">
                    {appointment.appointment_time}
                  </div>
                </td>
                <td
                  className="px-6 py-4 cursor-pointer text-blue-500 hover:underline"
                  onClick={() => handleShowPatientDetails(appointment)
                     
                  }
                >
                  {appointment.patient_name}
                </td>

                <td className="px-6 py-4">${appointment.amount}</td>
                <td className="px-6 py-4">{appointment.appointment_status}</td>
                <td className="px-6 py-4 text-right flex gap-2">
                  {/* Show Completed Badge only if status is "completed" */}
                  {appointment.appointment_status === "completed" && (
                    <Badge variant="secondary">Completed</Badge>
                  )}
                  {appointment.appointment_status === "approved" && (
                    <Badge variant="secondary">Accepted</Badge>
                  )}
                  {appointment.appointment_status === "cancelled" && (
                    <Badge variant="secondary">cancelled</Badge>
                  )}

                  {/* Show Accept and Reject buttons only if status is "pending" */}
                  {appointment.appointment_status === "pending" && (
                    <>
                      <Button
                        variant="secondary"
                        onClick={() => handleAccept(appointment.appointment_id)}
                      >
                        <FaCheck />
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleReject(appointment.appointment_id)}
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

export default DoctorAppointments;
