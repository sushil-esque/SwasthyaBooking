import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import "./doctorPage.css";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaLocationDot } from "react-icons/fa6";
import { MdFavorite } from "react-icons/md";

function DocProfile() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => console.log(data);

  const params = useParams();
  const newParams = params.id;
  // console.log(newParams);
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
  // console.log(curdata);
  if (error) {
    return <div>{error}</div>;
  }

  // Ensure curdata is defined before rendering details
  if (!curdata) {
    return <div>Loading...</div>;
  }
  const selectedDate = watch("selectedDate");
  return (
    <>
      <div style={{}}>
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
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  style={{ color: "blue" }}
                />
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
              <div className="mt-4 text-l font-bold text-slate-500 flex items-center">
              <FaLocationDot className="text-2xl" /> 
                {curdata.Location}
                <button className="ml-auto flex justify-center items-center p-1 bg-white border-none hover:text-slate-600"><MdFavorite className="text-xl" />Add to favourites</button>

              </div>
              
             
            </div>
          </div>
          <form className="availability" onSubmit={handleSubmit(onSubmit)}>
            <h4>Available Appointments:</h4>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "20px" }}
            >
              {curdata.availability?.map((slot) => (
                <div key={slot.date} style={{ display: "flex", gap: "30px" }}>
                  <label>
                    <input
                      type="radio"
                      value={slot.date}
                      {...register("selectedDate", { required: true })}
                    />
                    {slot.date}
                  </label>
                  {selectedDate === slot.date &&
                    <div className="time-slots">
                      {slot.times.map((time) => (
                        <label key={time}>
                          <input
                            type="radio"
                            value={time}
                            {...register(`selectedTime`, { required: true })}
                          />
                          {time}
                        </label>
                      ))}
                    </div>
                  }
                </div>
              ))}
            </div>
            {errors.selectedDate && <p>Please select a date</p>}
            {errors.selectedTime && <p>Please select a time slot</p>}
            <div className="appointmentButton">
              <button type="submit">Book appointment</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default DocProfile;
