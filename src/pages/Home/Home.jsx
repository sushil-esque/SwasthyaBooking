import { NavLink } from "react-router-dom";
import DoctorPage from "../FIndDoctors/DoctorPage";
import "./home.css";

function Home() {
  return (
    <>
      <div className="homeMain">
        <div className="desc">
          <p
            style={{
              fontSize: "1.125rem",
              letterSpacing: "4px",
              margin: "0px",
            }}
          >
            WELCOME TO
          </p>
          <p
            style={{
              fontSize: "3rem",
              margin: "20px 0px 0px",
            }}
          >
            Swasthya Booking
          </p>
          <div
            style={{
              fontSize: "1.125rem",
              lineHeight: "1.5",
              fontStyle: "italic",
            }}
          >
            <p>Find Trusted Doctors in Your Area Effortlessly</p>
            <p>Browse Doctor Profiles and Specialties with Ease</p>
            <p>Get Personalized Doctor Recommendations Instantly</p>
            <p>View Available Appointment Slots and Book Seamlessly</p>
          </div>
          <NavLink to={"/findDoctors"}>
            <button>BOOK NOW</button>
          </NavLink>
        </div>
        <div className="imageContainer">
          <img src="/public/doctors.png" alt="" />
        </div>
      </div>
      <DoctorPage />
    </>
  );
}

export default Home;
