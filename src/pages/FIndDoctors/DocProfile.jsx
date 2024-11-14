import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import "./doctorPage.css";
import { useEffect, useState } from "react";

function DocProfile() {
  const params = useParams();
  const newParams = params.id;
  console.log(newParams);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  async function fetchDoctors() {
    try {
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
    }
  }
  useEffect(() => {
    fetchDoctors();
  }, []);
  const curdata = data.find((doctor) => `${doctor.id}` === newParams);
  console.log(curdata);
  if (error) {
    return <div>{error}</div>;
  }

  // Ensure curdata is defined before rendering details
  if (!curdata) {
    return <div>Loading...</div>;
  }
  return (
    <>
    <div style={{ }}>
    <div className="docProfileBody" style={{}}>
        <div
          style={{
            display: "flex",
            gap: "20px",
          }}
        >
          <div className="docProfileImage">
            <img
              src={curdata.Image}
              alt="docImage"
              style={{
                height: "288px",
                width: "288px",
                borderRadius: "10px",
                objectFit: "cover",
              }}
            />
          </div>

          <div className="docProfileDesc">
            <p style={{ fontSize: "1.875rem", margin: "0" }}>
              Dr. {curdata.Name}{" "}
              <FontAwesomeIcon icon={faCheckCircle} style={{ color: "blue" }} />
            </p>
            <div className="spec-exp">
              <p style={{ margin: "0" }}>{curdata.Speciality}</p>
              <button>{curdata.Experience} years</button>
            </div>
            <div className="docAbout">
              <h5>
                About <FontAwesomeIcon icon={faCircleInfo} />{" "}
              </h5>
              <p style={{ color: "rgb(75 85 99 )", marginTop: "4px" }}>
                {curdata.About}
              </p>
            </div>
            <div style={{ fontSize: "1.1em" }}>
              <span
                style={{
                  color: "rgb(75 85 99 )",
                }}
              >
                Appointment fee:{" "}
              </span>
              $15
            </div>
          </div>
        </div>
        <div className="availability">
        <h4>Available Appointments:</h4>
        <div style={{display:"flex", flexDirection:"column", gap:"20px"}}>
        {curdata.availability?.map((slot) => (
          <div key={slot.date} style={{display:"flex", gap:"30px"}}>
            <p>{slot.date}</p>
            <div className="time-slots">
              {slot.times.map((time) => (
                <button key={time} className="time-slot">
                  {time}
                </button>
              ))}
            </div>
          </div>
        ))}
        </div>
      <div className="appointmentButton">
        <button>Book appointment</button>
      </div>
      </div>
      </div>
     
    </div>
     
    </>
  );
}

export default DocProfile;
