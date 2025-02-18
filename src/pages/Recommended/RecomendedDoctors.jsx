import { useForm } from "react-hook-form";
import { axiosWithAuth } from "@/api/interceptor";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Loader from "../../components/Loader";
import "../FIndDoctors/doctorPage.css";
import { NavLink } from "react-router-dom";
import { FaLocationDot } from "react-icons/fa6";
import { faFacebook, faInstagramSquare, faTwitter } from "@fortawesome/free-brands-svg-icons";

function RecommendedDoctors() {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const fetchSpecialities = async () => {
    const response = await fetch(`${BASE_URL}speciality?active=true`);
    if (!response.ok) throw new Error("Error fetching specialities");
    return response.json();
  };

  const { data: specializationData, isLoading: specializationLoading } =
    useQuery({
      queryKey: ["specializations"],
      queryFn: fetchSpecialities,
      retry: 3,
    });

  const { mutate: fetchRecommendations, isLoading: isPosting } = useMutation({
    mutationFn: (data) =>
      axiosWithAuth.post(`${BASE_URL}user/recommended-doctors`, data),
    onSuccess: (data) => {
      console.log("Recommendation data:", data);
      setRecommendations(data?.doctors);
    },
    onError: (error) => {
      console.log("Error fetching recommendation data:", error);
      alert("Something went wrong");
    },
  });
  function convertTo12Hour(time) {
    const [hours, minutes] = time.split(":");
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    const convertedHours = h % 12 || 12; // Convert 0 to 12 for midnight
    return `${convertedHours}:${minutes} ${ampm}`;
  }

  const onSubmit = (data) => {
    const payload = {
      date: data.date,
      time: convertTo12Hour(data.time),
      preferred_specialty: parseInt(data.preferred_specialty),
      min_fee: parseInt(data.min_fee),
      max_fee: parseInt(data.max_fee),
    };
    fetchRecommendations(payload);
  };
  const getSpecializationName = (id) => {
    if (!specializationData || !specializationData.data || !id)
      return "Unknown";
    const specialization = specializationData?.data.find(
      (spec) => spec.id.toString() === id
    );
    return specialization ? specialization.name : "Unknown Specialization";
  };

  if (specializationLoading) return <Loader />;
  if (error) return <p>Error fetching data</p>;

  return (
    <div className="doctorPageBody">
      <div className="flex items-center justify-center gap-4 mb-10">
        <div className="flex justify-center">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-wrap justify-between gap-4 mt-8 p-4 bg-white rounded-lg shadow-md"
          >
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">
                Your desired date
              </label>
              <input
                type="date"
                {...register("date")}
                className="w-48 px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.date && (
                <p className="text-red-500 text-sm">{errors.date.message}</p>
              )}
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">
                Your desired time
              </label>
              <input
                type="time"
                {...register("time")}
                className="w-48 px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.time && (
                <p className="text-red-500 text-sm">{errors.time.message}</p>
              )}
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">
                Your preferred specialty
              </label>
              <select
                {...register("preferred_specialty")}
                className="w-48 px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select Specialty</option>
                {specializationData?.data.map((speciality) => (
                  <option key={speciality.id} value={speciality.id}>
                    {speciality.name}
                  </option>
                ))}
              </select>
              {errors.preferred_specialty && (
                <p className="text-red-500 text-sm">
                  {errors.preferred_specialty.message}
                </p>
              )}
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">
                Minimum fee
              </label>
              <input
                type="number"
                {...register("min_fee")}
                className="w-48 px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.min_fee && (
                <p className="text-red-500 text-sm">{errors.min_fee.message}</p>
              )}
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">
                Maximum fee
              </label>
              <input
                type="number"
                {...register("max_fee")}
                className="w-48 px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.max_fee && (
                <p className="text-red-500 text-sm">{errors.max_fee.message}</p>
              )}
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Get Recommendations
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="title">
        <h1>Doctors near you</h1>
      </div>

     <div className="cardContainer">
             {recommendations?.length > 0 ? (
               recommendations?.map((doctor, index) => (
                 <NavLink
                   to={`/findDoctors/${doctor.id}`}
                   key={index}
                   className="docCard"
                 >
                   <div>
                     <div className="docImage">
                       <img
                         src={
                           doctor?.profile_picture
                             ? `${IMAGE_BASE_URL}${doctor.profile_picture}`
                             : "/public/doctorPic.jpg"
                         }
                         alt="Doctor"
                       />
                     </div>
                     <div className="docSpeciality">
                       {getSpecializationName(doctor?.speciality_id)}
                     </div>
                     <div className="doctorName">Dr. {doctor?.name}</div>
                     <div className="docDesc">
                       <FaLocationDot className="text-2xl" />{" "}
                       <span>
                         {doctor.location_name
                           ? doctor.location_name.split(" ").slice(0, 3).join(" ")
                           : "Location not available"}
                       </span>
                     </div>
                     <div className="text-sm text-gray-600 flex justify-center italic">
                       Distance from you: {doctor?.distance} KM
                     </div>
                     <div className="socials">
                       <FontAwesomeIcon icon={faInstagramSquare} />
                       <FontAwesomeIcon icon={faFacebook} />
                       <FontAwesomeIcon icon={faTwitter} />
                     </div>
                   </div>
                 </NavLink>
               ))
             ) : (
               <p className="no-results">No doctors found.</p>
             )}
           </div>
    </div>
  );
}

export default RecommendedDoctors;