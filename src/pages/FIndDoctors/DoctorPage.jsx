import "./doctorPage.css";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import {
  faFacebook,
  faInstagramSquare,
} from "@fortawesome/free-brands-svg-icons";
import { faTwitter } from "@fortawesome/free-brands-svg-icons/faTwitter";
import { useEffect, useState } from "react";
import Loader from "../../components/Loader";
import { CiLocationOn } from "react-icons/ci";
import { FaLocationDot } from "react-icons/fa6";
import { showSpecialities } from "@/api/admin";
import { useQuery } from "@tanstack/react-query";

function DoctorPage() {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [speciality, setSpeciality] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // State for search input

  const fetchDoctors = async () => {
    const response = await fetch(`${BASE_URL}doctor`);
    if (!response.ok) throw new Error("Error fetching doctors");
    return response.json();
  };

  const fetchSpecialities = async () => {
    const response = await fetch(`${BASE_URL}speciality?active=true`);
    if (!response.ok) throw new Error("Error fetching specialities");
    return response.json();
  };

  const {
    data: doctors,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["doctors"],
    queryFn: fetchDoctors,
    retry: 3,
  });

  const {
    data: specializationData,
    isLoading: specializationLoading,
    isSuccess,
  } = useQuery({
    queryKey: ["specializations"],
    queryFn: fetchSpecialities,
    retry: 3,
  });

  if (isLoading || specializationLoading) return <Loader />;
  if (error) return <p>Error fetching data</p>;
  const getSpecializationName = (id) => {
    if (!specializationData || !specializationData.data || !id)
      return "Unknown";
    const specialization = specializationData?.data.find(
      (spec) => spec.id.toString() === id
    );
    return specialization ? specialization.name : "Unknown Specialization";
  };

  // Filter doctors based on search term and selected specialty
  const filteredDoctors = doctors?.filter((doctor) => {
    const matchesSpeciality = speciality
      ? doctor?.speciality_id?.toString() === speciality.toString()
      : true;
    const matchesSearch =
      searchTerm === "" ||
      doctor?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doctor?.location_name &&
        doctor.location_name
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      getSpecializationName(doctor?.speciality_id)
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    return matchesSpeciality && matchesSearch;
  });

  return (
    <div className="doctorPageBody">
      <div className="flex items-center justify-center gap-4 mb-10">
        <div className="searchBar">
          <input
            type="text"
            placeholder="Search by name, location, or specialty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </div>
        <div>
          <div className="">
            <select
              className="mt-20 h-8 bg-white rounded-xl border-hidden"
              value={speciality}
              onChange={(e) => {
                console.log(e.target.value);
                setSpeciality(e.target.value);
              }}
            >
              <option value="">All Specialities</option>
              {specializationData?.data.map((speciality) => (
                <option key={speciality.id} value={speciality.id}>
                  {speciality.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="cardContainer">
        {filteredDoctors?.length > 0 ? (
          filteredDoctors?.map((doctor, index) => (
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
                        ? `${BASE_URL}${doctor.profile_picture}`
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

export default DoctorPage;
