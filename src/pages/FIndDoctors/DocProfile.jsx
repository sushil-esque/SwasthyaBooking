import { useParams } from "react-router-dom";
import data from "../../assets/data";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { faCheckCircle, faCircleInfo} from "@fortawesome/free-solid-svg-icons";
import "./doctorPage.css";

function DocProfile() {
  const params = useParams();
  const newParams = params.id;
  console.log(newParams);
  const curdata = data.filter((doctor) => `${doctor.id}` === newParams)[0];
  console.log(curdata);
  return (
    <>
    
    <div className="docProfileBody" style={{}}>
      <div
        style={{
          display: "flex",
          gap:"20px"
        }}
      >
        <div className="docProfileImage">
          <img
            src={curdata.Image}
            alt="docImage"
            style={{ height: "288px", width: "288px", borderRadius: "10px", objectFit:"cover"}}
          />
        </div>
        <div className="docProfileDesc">
          <p style={{fontSize:"1.875rem", margin:"0"}}>
            Dr. {curdata.Name}{" "}
            <FontAwesomeIcon icon={faCheckCircle} style={{ color: "blue" }} />
          </p>
          <div className="spec-exp">
            <p style={{margin:"0"}}>{curdata.Speciality}</p>
            <button>{curdata.Experience}</button>
          </div>
          <div className="docAbout">
              <h5>About <FontAwesomeIcon icon={faCircleInfo}/> </h5>
              <p style={{color: "rgb(75 85 99 )", marginTop:"4px"}}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur sit qui repellat culpa numquam, pariatur minus debitis temporibus! Sequi reiciendis excepturi aperiam accusantium aliquid nam dolores praesentium voluptates iste veniam.</p>
          </div>
          <div style={{ fontSize:"1.1em"}}>
            <span style={{
              color:"rgb(75 85 99 )"
            }}>Appointment fee: </span>$15
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default DocProfile;
