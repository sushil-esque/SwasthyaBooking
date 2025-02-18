import "../FIndDoctors/doctorPage.css";
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
import { FaLocationDot } from "react-icons/fa6";
import { useMutation, useQuery } from "@tanstack/react-query";
import { deleteFavorite, getFavorites } from "@/api/user";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
function Favorites() {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  async function fetchDoctors() {
    try {
      setLoading(true);
      const rawData = await fetch(
        `${BASE_URL}doctor`
      );
      if (!rawData.ok) {
        throw new Error("error fetching data");
      }
      const data = await rawData.json();
      setData(data);
    } catch (error) {
      setError("error fetching data");
      console.log(error);
    } finally {
      setLoading(false);
    }
  }
  const fetchSpecialities = async () => {
    const response = await fetch(`${BASE_URL}speciality?active=true`);
    if (!response.ok) throw new Error("Error fetching specialities");
    return response.json();
  };
  useEffect(() => {
    fetchDoctors();
  }, []);
  const {
    data: specializationData,
    isLoading: specializationLoading,
  } = useQuery({
    queryKey: ["specializations"],
    queryFn: fetchSpecialities,
    retry: 3,
  });

  const{
    data: favoriteData,
    isLoading: favoriteLoading,
  }= useQuery({
    queryKey: ["favorites"],
    queryFn: getFavorites,
    retry: 3,
  })
  console.log(favoriteData);
  const favoriteDoctors = data?.filter((doctor) => 
    favoriteData?.data.some((favorite) => favorite.doctor_id === doctor.id)
  )
 const{mutate: deleteFavoriteMutate, isPending} = useMutation({
    mutationFn: deleteFavorite,
    onSuccess: () => {
      toast({
        title: "Favorite deleted successfully",
        variant: "default",
      })
    }
  });

  const getSpecializationName = (id) => {
    if (!specializationData || !specializationData.data || !id)
      return "Unknown";
    const specialization = specializationData?.data.find(
      (spec) => spec.id.toString() === id
    );
    return specialization ? specialization.name : "Unknown Specialization";
  };
 
 
  if (loading  || favoriteLoading || specializationLoading || isPending) {
    return <Loader />;
  }
  return (
    <div className="profile-settings-container">
      
     
<div className="text-2xl m-5 px-5 py-1 w-full italic">Your Favorite Doctors:</div>
      <div className="flex flex-wrap gap-11 justify-center">

        { 
          favoriteDoctors?.map((doctor, index) => (
            <div               key={index}
>
            <NavLink
              to={`/findDoctors/${doctor.id}`}
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
                <div className="socials">
                  <FontAwesomeIcon icon={faInstagramSquare} />
                  <FontAwesomeIcon icon={faFacebook} />
                  <FontAwesomeIcon icon={faTwitter} />
                </div>
              </div>
            </NavLink>
            <Button variant={"destructive" } onClick={() => deleteFavoriteMutate(doctor.id)} className="w-full">Delete from favorites</Button>

            </div>
          ))
        }
      </div>
    </div>
  );
}

export default Favorites;
