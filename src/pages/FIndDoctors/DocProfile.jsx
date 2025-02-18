import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import "./doctorPage.css";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaLocationDot } from "react-icons/fa6";
import { MdFavorite } from "react-icons/md";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addFavorite, bookAppointment, getFavorites } from "@/api/user";
import AuthContext from "@/components/AuthContext";
import { toast } from "@/hooks/use-toast";
import Loader from "@/components/Loader";

function DocProfile() {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;
  const queryClient = useQueryClient(); // Initialize queryClient
  const params = useParams();
  const { id: doctorId } = params; // Doctor ID from URL
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const fetchSpecialities = async () => {
    const response = await fetch(`${BASE_URL}speciality?active=true`);
    if (!response.ok) throw new Error("Error fetching specialities");
    return response.json();
  };
  const { mutate: favoriteMutate, isPending } = useMutation({
    mutationFn: addFavorite,
    onSuccess: () => {
      console.log("successfully added to favorites");
      // Optimistically update the cache without reloading
      queryClient.setQueryData(["favorites"], (oldData) => {
        if (!oldData || !oldData.data) return oldData;
        return {
          ...oldData,
          data: [...oldData.data, { doctor_id: doctorId }], // Add the new favorite to the cached data
        };
      });
      toast({
        title: "Successfully added to favorites",
        variant: "default",
      });
    },
  });

  const { mutate: bookAppointmentMutate, isPending: isBooking } = useMutation({
    mutationFn: bookAppointment,
    onSuccess: () => {
      toast({
        title: "Successfully requested for an appointment",
        variant: "default",
      });
    },
    onError: () => {
      toast({
        title: "Failed to request for an appointment",
        variant: "destructive",
      });
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
  const { data: specializationData, isLoading: specializationLoading } =
    useQuery({
      queryKey: ["specializations"],
      queryFn: fetchSpecialities,
      retry: 3,
    });

  const { data: favoriteData, isLoading: favoriteLoading } = useQuery({
    queryKey: ["favorites"],
    queryFn: getFavorites,
    retry: 3,
    enabled: isAuthenticated, // Only run when the user is authenticated
  });

  // console.log(curdata);

  if (isLoading || specializationLoading) return;
  <Loader />;

  if (error) return <div>Error fetching doctor details</div>;

  // Ensure curdata is defined before rendering details

  const selectedDate = watch("selectedDate");

  const currentDate = new Date().toISOString().split("T")[0];
  const filteredAvailableDates = doctor.doctor_available?.filter((slot) => {
    const slotDate = new Date(slot.date).toISOString().split("T")[0];
    return slotDate >= currentDate;
  });
  console.log("Filtered available dates:", filteredAvailableDates);
  const isDoctorFavorited = () => {
    if (!favoriteData || !favoriteData.data || !doctorId) return false;
    return favoriteData.data.some(
      (favorite) => favorite.doctor_id.toString() === doctorId
    );
  };
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
  const getSpecializationName = (id) => {
    if (!specializationData || !specializationData.data || !id)
      return "Unknown";
    const specialization = specializationData?.data.find(
      (spec) => spec.id.toString() === id
    );
    return specialization ? specialization.name : "Unknown Specialization";
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
                    ? `${IMAGE_BASE_URL}${doctor.profile_picture}`
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
                <p style={{ margin: "0" }}>
                  {getSpecializationName(doctor.speciality_id)}
                </p>
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
              <div className="mt-4 text-l font-bold text-slate-500 flex items-center ">
                <FaLocationDot className="text-2xl" />
                <div className="w-[60%] ml-1">{doctor.location_name}</div>
                {isAuthenticated && (
                  <button
                    className="ml-auto flex justify-center items-center p-1 bg-white border-none hover:text-slate-600"
                    onClick={() => favoriteMutate(doctorId)} // Pass doctor ID
                    disabled={isPending || isDoctorFavorited()} // Disable button while adding
                  >
                    <MdFavorite
                      className="text-xl"
                      style={{ color: isDoctorFavorited() ? "red" : "inherit" }}
                    />{" "}
                    {isPending
                      ? "Adding..."
                      : isDoctorFavorited()
                      ? "favorited"
                      : "Add to Favorites"}
                  </button>
                )}
              </div>
            </div>
          </div>
          <form className="availability" onSubmit={handleSubmit(onSubmit)}>
            <h4>Available Appointments:</h4>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "20px" }}
            >
              {console.log(doctor.doctor_available)}
              {filteredAvailableDates?.map((slot) => (
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
                      {slot.available_times?.map(({ id, time, booked }) => (
                        <label key={id}>
                          <input
                            type="radio"
                            value={time}
                            {...register(`selectedTime`, { required: true })}
                            disabled={booked}
                          />
                          {time} {booked && "(Booked)"}
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
              <button type="submit">
                {isBooking ? "Requesting..." : "Request to book"}
              </button>
              {}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default DocProfile;
