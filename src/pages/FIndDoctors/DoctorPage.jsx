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
function DoctorPage() {
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

  // Filter doctors based on selected speciality
  // const filteredDoctors = speciality
  //   ? data.filter((doctor) => doctor.Speciality === speciality)
  //   : data;

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
    const filteredDoctors = data.filter((doctor) => {
      const matchesSpeciality = speciality ? doctor.Speciality === speciality : true;
      const matchesSearch =
        searchTerm === "" ||
        doctor.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.Location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.Speciality.toLowerCase().includes(searchTerm.toLowerCase());
  
      return matchesSpeciality && matchesSearch;
    });
  if (loading) {
    return <Loader />;
  }
  return (
    <div className="doctorPageBody">
      <div className="flex items-center justify-center gap-4 mb-10">
        <div className="searchBar">
          <input
            type="text"
            placeholder="Search by name, location, or specialty..."  
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}       />
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
              <option value="Cardiology">Cardiology</option>
              <option value="Neurology">Neurology</option>
              <option value="Pediatrics">Pediatrics</option>
              <option value="Dermatology">Dermatology</option>
              <option value="Gynecology">Gynaecology</option>
            </select>
          </div>
        </div>
      </div>
      {/* <div className="title">
        <h1>The best doctors of Nepal</h1>
      </div> */}

      <div className="cardContainer">
      {filteredDoctors.length > 0 ? (
          filteredDoctors.map((doctor, index) => (
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
          ))
        ) : (
          <p className="no-results">No doctors found.</p>
        )}
      </div>
    </div>
  );
}

export default DoctorPage;
