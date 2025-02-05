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
function Favorites() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [speciality, setSpeciality] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  async function fetchDoctors() {
    try {
      setLoading(true);
      const rawData = await fetch(
        "https://6734b250a042ab85d11b42b1.mockapi.io/api/swasthya/Doctors"
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
  useEffect(() => {
    fetchDoctors();
  }, []);


  // const docInfo = filteredDoctors.map((doctor, index) => (
  //   <NavLink to={`${doctor.id}`} key={index} className="docCard">
  //     <div key={index}>
  //       {/* <h3>Dr. {doctor.Name}</h3> */}
  //       <div className="docImage">
  //         <img src={doctor.Image} alt="" />
  //       </div>
  //       <div
  //         style={{
  //           color: "#b3b3b3",
  //           textTransform: "uppercase",
  //           fontWeight: "700",
  //           letterSpacing: "1px",
  //         }}
  //       >
  //         {doctor.Speciality}
  //       </div>
  //       <div className="doctorName">Dr. {doctor.Name}</div>

  //       <div className="docDesc">
  //         <FaLocationDot className="text-2xl" /> <span>{doctor.Location}</span>
  //       </div>
  //       <div className="socials">
  //         <FontAwesomeIcon icon={faInstagramSquare} />
  //         <FontAwesomeIcon icon={faFacebook} />
  //         <FontAwesomeIcon icon={faTwitter} />
  //       </div>
  //     </div>
  //   </NavLink>
  // ));
    // Filter doctors based on search term and selected specialty
  
  if (loading) {
    return <Loader />;
  }
  return (
    <div className="profile-settings-container">
      
     

      <div className="cardContainer">
        {data.map((doctor, index) => (
          <NavLink to={`/findDoctors/${doctor.id}`} key={index} className="docCard">
          <div>
            <div className="docImage">
              <img src={doctor.Image} alt="" />
            </div>
            <div className="docSpeciality">{doctor.Speciality}</div>
            <div className="doctorName">Dr. {doctor.Name}</div>
            <div className="docDesc">
              <FaLocationDot className="text-2xl" /> <span>{doctor.Location}</span>
            </div>
            <div className="socials">
              <FontAwesomeIcon icon={faInstagramSquare} />
              <FontAwesomeIcon icon={faFacebook} />
              <FontAwesomeIcon icon={faTwitter} />
            </div>
          </div>
        </NavLink>
        ))}
      
      </div>
    </div>
  );
}

export default Favorites;
