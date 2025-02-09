import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import "./doctorPage.css";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaLocationDot } from "react-icons/fa6";
import { MdFavorite } from "react-icons/md";
import { useMutation, useQuery } from "@tanstack/react-query";
import { addFavorite, bookAppointment } from "@/api/user";
import AuthContext from "@/components/AuthContext";
import { toast } from "@/hooks/use-toast";

function DocProfile() {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const params = useParams();
  const { id: doctorId } = params; // Doctor ID from URL
  const navigate = useNavigate();
  const {isAuthenticated} = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const { mutate: favoriteMutate, isPending } = useMutation({
    mutationFn: addFavorite,
    onSuccess: () => {
      console.log("successfully added to favorites");
      toast({
        title: "Successfully added to favorites",
        variant: "default",
      })
    },
  });

  const { mutate: bookAppointmentMutate, isLoading: isBooking } = useMutation({
    mutationFn: bookAppointment,
    onSuccess: () => {
      alert("Appointment booked successfully");
    },
    onError: () => {
      alert("Failed to book appointment");
    },
  });

  // console.log(newParams);
  const fetchDoctorById = async (id) => {
    const response = await fetch(`${BASE_URL}doctor/${id}`);
    if (!response.ok) {
      throw new Error("Error fetching doctor data");
    }
    return response.json();
  };

  const {
    data: doctor,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["doctor", doctorId], // Unique query key
    queryFn: () => fetchDoctorById(doctorId), // Fetch function
    retry: 3, // Retry if API fails
  });

  // console.log(curdata);
  if (isLoading) return <div>Loading doctor details...</div>;
  if (error) return <div>Error fetching doctor details</div>;

  // Ensure curdata is defined before rendering details

  const selectedDate = watch("selectedDate");
  const onSubmit = (data) => {
    if (!isAuthenticated) {
      alert("Please login to book an appointment.");
      navigate("/login");
      return;
    }

    const appointmentData = {
      doctor_id: parseInt(doctorId),
      date: data.selectedDate,
      time: data.selectedTime,
    };

    console.log(appointmentData);
    bookAppointmentMutate(appointmentData);
  };

  return (
    <>
      <div style={{}}>
        <div className="docProfileBody">
          <div
            style={{
              display: "flex",
              gap: "20px",
            }}
          >
            <div className="docProfileImage">
              <img
                src={
                  doctor?.profile_picture
                    ? `${BASE_URL}${doctor.profile_picture}`
                    : "/public/doctorPic.jpg"
                }
                alt="Doctor"
                style={{
                  height: "288px",
                  width: "288px",
                  borderRadius: "10px",
                  objectFit: "cover",
                }}
              />
            </div>

            <div className="docProfileDesc">
              <p style={{ fontSize: "1.875rem", margin: "0" }}>
                Dr. {doctor.name}{" "}
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  style={{ color: "blue" }}
                />
              </p>
              <div className="spec-exp">
                <p style={{ margin: "0" }}>{doctor.Speciality}</p>
                <button>{doctor.experience} years</button>
              </div>
              <div className="docAbout">
                <h5>
                  About <FontAwesomeIcon icon={faCircleInfo} />{" "}
                </h5>
                <p style={{ color: "rgb(75 85 99 )", marginTop: "4px" }}>
                  {doctor.bio}
                </p>
              </div>
              <div style={{ fontSize: "1.1em" }}>
                <span
                  style={{
                    color: "rgb(75 85 99 )",
                  }}
                >
                  Appointment fee:NPR {doctor.fee}
                </span>
              </div>
              <div className="mt-4 text-l font-bold text-slate-500 flex items-center">
                <FaLocationDot className="text-2xl" />
                {doctor.location_name}
                {
                  isAuthenticated && (
                    <button
                    className="ml-auto flex justify-center items-center p-1 bg-white border-none hover:text-slate-600"
                    onClick={() => favoriteMutate(doctor.id)} // Pass doctor ID
                    disabled={isPending} // Disable button while adding
                  >
                    <MdFavorite className="text-xl" />{" "}
                    {isPending ? "Adding..." : "Add to Favorites"}
                  </button>
                  )
                }
               
              </div>
            </div>
          </div>
          <form className="availability" onSubmit={handleSubmit(onSubmit)}>
            <h4>Available Appointments:</h4>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "20px" }}
            >
              {console.log(doctor.doctor_available)}
              {doctor.doctor_available?.map((slot) => (
                <div key={slot.id} style={{ display: "flex", gap: "30px" }}>
                  <label>
                    <input
                      type="radio"
                      value={slot.date}
                      {...register("selectedDate", { required: true })}
                    />
                    {slot.date}
                  </label>
                  {selectedDate === slot.date && (
                    <div className="time-slots">
                      {slot.available_times?.map(({ id, time }) => (
                        <label key={id}>
                          <input
                            type="radio"
                            value={time}
                            {...register(`selectedTime`, { required: true })}
                          />
                          {time}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            {errors.selectedDate && <p>Please select a date</p>}
            {errors.selectedTime && <p>Please select a time slot</p>}
            <div className="appointmentButton">
              <button type="submit">Book appointment</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default DocProfile;
