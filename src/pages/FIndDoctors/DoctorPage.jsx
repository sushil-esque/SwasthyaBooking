import "./doctorPage.css";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import {
  faFacebook,
  faInstagram,
  faInstagramSquare,
} from "@fortawesome/free-brands-svg-icons";
import { faTwitter } from "@fortawesome/free-brands-svg-icons/faTwitter";
import { useEffect, useState } from "react";
import Loader from "../../components/Loader";
function DoctorPage() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
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

  const docInfo = data.map((doctor, index) => (
    <NavLink to={`${doctor.id}`} key={index} className="docCard">
      <div key={index}>
        {/* <h3>Dr. {doctor.Name}</h3> */}
        <div className="docImage">
          <img src={doctor.Image} alt="" />
        </div>
        <div
          style={{
            color: "#b3b3b3",
            textTransform: "uppercase",
            fontWeight: "700",
            letterSpacing: "1px",
          }}
        >
          {doctor.Speciality}
        </div>
        <div className="doctorName">Dr. {doctor.Name}</div>

        {/* <div className="features"> */}

        {/* <div className="profileNav"> */}
        {/* <NavLink to={`${doctor.id}`}> */}
        {/* VIEW PROFILE */}
        {/* <button>VIEW PROFILE</button>
        </NavLink>
      </div> */}

        {/* </div> */}
        <div className="docDesc">{doctor.Bio}</div>
        <div className="socials">
          <FontAwesomeIcon icon={faInstagramSquare} />
          <FontAwesomeIcon icon={faFacebook} />
          <FontAwesomeIcon icon={faTwitter} />
        </div>
      </div>
    </NavLink>
  ));
  if (loading) {
    return <Loader />;
  }
  return (
    <div className="doctorPageBody">
      <div className="searchBar">
        <input
          type="text"
          placeholder="Doctors, conditions, or procedures..."
        />
        <FontAwesomeIcon icon={faMagnifyingGlass} />
      </div>
      <div className="title">
        <h1>The best doctors of Nepal</h1>
      </div>

      <div className="cardContainer">{docInfo}</div>
    </div>
  );
}

export default DoctorPage;
