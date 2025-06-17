import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getDoctorAppointments, updateAppointment } from "@/api/doctor";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FaCheck } from "react-icons/fa6";
import { GiCancel } from "react-icons/gi";
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
import { Input } from "@/components/ui/input";
import Loader from "@/components/Loader";

function DoctorAppointments() {

  const queryClient = useQueryClient(); // Initialize queryClient

  const { data: appointmentData, isLoading } = useQuery({
    queryKey: ["doctorAppointments"],
    queryFn: getDoctorAppointments,
    retry: 3,
  });

  const { mutate: statusMutate, isPending: statusPending } = useMutation({
    mutationFn: updateAppointment,
    onSuccess: (data, variables) => {
      // Update the cached data for the "doctorAppointments" query
      queryClient.setQueryData(["doctorAppointments"], (oldData) => {
        if (!oldData || !oldData.data) return oldData;
    
        // Find the index of the updated appointment in the cached data
        const updatedIndex = oldData.data.findIndex(
          (appointment) => appointment.id === variables.id
        );
    
        if (updatedIndex === -1) return oldData; // If the appointment is not found, return the old data
    
        // Create a copy of the old data and update the specific appointment
        const updatedData = [...oldData.data];
        updatedData[updatedIndex] = {
          ...updatedData[updatedIndex],
          status: variables.status, // Update the status
        };
    
        // Return the updated data
        return {
          ...oldData,
          data: updatedData,
        };
      });
    
      // Show a success toast
      toast({
        title: `Appointment ${variables.status} successfully`,
        variant: "default",
      });
    },
    onError: () => {
      toast({
        title: "Failed to update appointment",
        variant: "destructive",
      });
    },
  });

  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isRescheduleDialogOpen, setIsRescheduleDialogOpen] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  if (isLoading) {
    return <Loader />;
  }
  if (statusPending) {
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

  const handleShowPatientDetails = (appointment) => {
    setSelectedPatient({
      name: appointment.user.name,
      location: appointment.user.location_name,
      email: appointment.user.email,
      phone: appointment.user.phone_number,
    });
    setIsDialogOpen(true);
  };

  const handleAccept = (appointment) => {
    console.log("Appointment Data:", appointment);

    const acceptData = {
      id: appointment.id,
      doctor_id: appointment.doctor_id, // Ensure this field is included
      date: appointment.date, // Ensure this field is included
      time: appointment.time, // Ensure this field is included
      status: "confirmed", // Update the status
    };
    console.log("Accept Data:", acceptData);

    statusMutate(acceptData);
  };

  const handleReject = (appointment) => {
    const acceptData = {
      id: appointment.id,
      doctor_id: appointment.doctor_id, // Ensure this field is included
      date: appointment.date, // Ensure this field is included
      time: appointment.time, // Ensure this field is included
      status: "cancelled", // Update the status
    };
    console.log("Accept Data:", acceptData);

    statusMutate(acceptData);
  };

  const handleReschedule = (appointment) => {
    setSelectedAppointment(appointment);
    setIsRescheduleDialogOpen(true);
  };
  const handleRescheduleSubmit = () => {
    if (!newDate || !newTime) {
      toast({
        title: "Please provide a new date and time",
        variant: "destructive",
      });
      return;
    }
    function convertTo12Hour(time) {
      const [hours, minutes] = time.split(":");
      const h = parseInt(hours, 10);
      const ampm = h >= 12 ? "PM" : "AM";
      const convertedHours = h % 12 || 12; // Convert 0 to 12 for midnight
      return `${convertedHours}:${minutes} ${ampm}`;
    }

    const rescheduleData = {
      id: selectedAppointment.id,
      doctor_id: selectedAppointment.doctor_id,
      date: newDate,
      time: convertTo12Hour(newTime),
      status: "rescheduled",
    };

    // const formattedAvailability = rescheduleData.map((item) => ({
    //   date: item.date,
    //   times: item.time.map((time) => convertTo12Hour(time)), // Convert each time to 12-hour format
    // }));

    statusMutate(rescheduleData);
    setIsRescheduleDialogOpen(false);
    setNewDate("");
    setNewTime("");
  };

  return (
    <>
      {appointmentData && (
        <div>
          {/* Patient Details Dialog */}
          {selectedPatient && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Patient Details</DialogTitle>
                  <DialogDescription>
                    <p>
                      <span className=" text-black">Name: </span>{" "}
                      {selectedPatient.name}
                    </p>
                    <p>
                      <span className="text-black">Location: </span>{" "}
                      {selectedPatient.location}
                    </p>
                    <p>
                      <span className="text-black">Email: </span>
                      {selectedPatient.email}
                    </p>
                    <p>
                      <span className="text-black">Phone: </span>{" "}
                      {selectedPatient.phone}
                    </p>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          )}
          {/* Reschedule Dialog */}
          <Dialog
            open={isRescheduleDialogOpen}
            onOpenChange={setIsRescheduleDialogOpen}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Reschedule Appointment</DialogTitle>
                <DialogDescription>
                  <div className="space-y-4">
                    <Input
                      type="date"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      placeholder="Select new date"
                      className="w-[80%]"
                    />
                    <Input
                      type="time"
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                      placeholder="Select new time"
                      className="w-[80%]"
                    />
                    <Button onClick={handleRescheduleSubmit}>Submit</Button>
                  </div>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>

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
                    onClick={() => requestSort("name")}
                  >
                    Patient name
                    <SortArrows columnKey="name" />
                  </th>

                  <th
                    scope="col"
                    className="px-6 py-3 cursor-pointer"
                    onClick={() => requestSort("status")}
                  >
                    Appointment Status
                    <SortArrows columnKey="status" />
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
                      onClick={() => handleShowPatientDetails(appointment)}
                    >
                      {appointment.user?.name
                        ? appointment.user.name
                        : "Unknown"}
                    </td>

                    <td className="px-6 py-4">{appointment.status}</td>
                    <td className="px-6 py-4 text-right flex gap-2">
                      {/* Show Completed Badge only if status is "completed" */}
                      {appointment.status === "rescheduled" && (
                        <Badge variant="secondary">Accepted</Badge>
                      )}
                      {appointment.status === "confirmed" && (
                        <Badge variant="secondary">Accepted</Badge>
                      )}
                      {appointment.status === "cancelled" && (
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
                            onClick={() => handleReject(appointment)}
                          >
                            <GiCancel />
                          </Button>
                          <Button
                            variant="default"
                            className="bg-green-600 hover:bg-green-500"
                            onClick={() => handleReschedule(appointment)}
                          >
                            Reschedule
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
      )}
    </>
  );
}

export default DoctorAppointments;
