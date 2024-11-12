import Card from "./Card";
import data from "../assets/data";
import { NavLink } from "react-router-dom";

function Doctors() {
  return (
    <div className="doctorWrapper">
      {data.map((item, index) => (
        <div className="doctorMain" key={index}>
          <div className="doctorCard">
            <div className="profilePic">
              <img src={item.Image} alt="" />
            </div>
            <div className="docDescription">
              <div className="docText">
                <Card
                  title={
                    <h4 style={{ margin: "0px", color: "#488eff" }}>
                      Dr. {item.Name}
                    </h4>
                  }
                  key={index}
                >
                  <div>Speciality: {item.Speciality} </div>
                  <div> Experience: {item.Experience}</div>
                </Card>
              </div>

              <NavLink to={`${item.id}`}>
                <button>View Profile</button>
              </NavLink>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Doctors;
