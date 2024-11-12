import "./doctorPage.css";
import data from "../../assets/data";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass
} from "@fortawesome/free-solid-svg-icons";
function DoctorPage() {
  const docInfo = data.map((doctor, index) => (
    <div key={index} className="docCard">
      <h3>Dr. {doctor.Name}</h3>
      <div className="docImage">
        <img src={doctor.Image} alt="" />
      </div>
      <div className="features">
      <div >
        <b>Speciality:</b>{doctor.Speciality}
      </div>
      <div>
        <b>Experience:</b>{doctor.Experience}
      </div>
      <div className="profileNav">
        <NavLink to={`${doctor.id}`}>
        VIEW PROFILE

        </NavLink>
      </div>
      </div>
      
    </div>
  ));
  return (
    <div className="doctorPageBody">
      <div className="searchBar">
            <input type="text" placeholder="Doctors, conditions, or procedures..." />
            <FontAwesomeIcon icon={faMagnifyingGlass} />
      </div>
      <div className="title">
        <h1>The best doctors of Nepal</h1>
      </div>
      <div className="cardContainer">
      {docInfo}
      </div>
     
    </div>
  );
}

export default DoctorPage;
