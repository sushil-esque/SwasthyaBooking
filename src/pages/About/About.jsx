import { useState } from "react";
import "./about.css";

function About() {
  const [showFullText, setShowFullText] = useState(false);

  const toggleText = () => {
    setShowFullText(!showFullText);
  };

  return (
    <div className="aboutPage">
      <div className="text">
        <div className="welcomeBox">
          <h4>SWASTHYA BOOKING</h4>
          <h1>Welcome!</h1>
        </div>
        <div className="actualText">
          <p>
            Welcome to Swasthya Booking, your trusted online platform for seamless doctor appointments. We are committed to making healthcare more accessible, efficient, and convenient for everyone. Our platform connects patients with experienced and qualified doctors across various specialties, allowing hassle-free appointment booking from the comfort of your home.
          </p>
          {showFullText && (
            <p>
              At Swasthya Booking, we believe in empowering patients with the right tools to manage their health effortlessly. Our user-friendly interface enables you to search for doctors, view their profiles, check availability, and schedule appointments with ease. Whether you need a routine checkup or specialized medical care, we ensure a smooth and secure booking experience.

              Our mission is to bridge the gap between patients and healthcare providers by leveraging technology to simplify the appointment process. With a focus on reliability, transparency, and quality service, Swasthya Booking aims to enhance the healthcare experience for both patients and doctors.

              Book your appointment today and take a step towards better health with Swasthya Booking!
            </p>
          )}
        </div>
        <div className="readmoreBtn">
          <button onClick={toggleText}>
            {showFullText ? "READ LESS" : "READ MORE"}
          </button>
        </div>
      </div>
      <div className="image">
        <img src="/public/ladyDoctor.jpg" alt="Doctor" />
      </div>
    </div>
  );
}

export default About;
