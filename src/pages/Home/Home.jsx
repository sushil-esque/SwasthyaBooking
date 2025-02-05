import { Button } from "@/components/ui/button";
import FindDoctors from "../FindDoctors";
import DoctorPage from "../FIndDoctors/DoctorPage";
import "./home.css";
import { NavLink } from "react-router-dom";

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
            <p>Find Top-Rated Doctors Near You</p>
            <p>Get Personalized Healthcare Recommendations</p>
            <p>Book Appointments Instantly</p>
            <p>Access Expert Medical Advice Anytime</p>
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
