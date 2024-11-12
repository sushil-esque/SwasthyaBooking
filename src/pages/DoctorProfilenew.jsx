import { useParams } from "react-router-dom";
import data from "../assets/data";
function DoctorProfilenew() {
    const params = useParams();
  
  console.log(params);
  const intParams = parseInt(params.ids);
  const currData = data.filter((item)=> item.id === intParams)[0];

  console.log(params);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      {/* <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: "0px 0px 6px gray",
          margin: "50px",
          width: "300px",
          height: "300px",
        }}
      >
        <div>I am Dr.{data[intParams - 1].Name}</div>
        <div>I specialize in {data[intParams - 1].Speciality}</div>
        <div>I have an experience of {currData.Experience}</div>
      </div> */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: "0px 0px 6px gray",
          margin: "50px",
          width: "300px",
          height: "300px",
        }}
      >
        <div>I am Dr.{currData.Name}</div>
        <div>I specialize in {currData.Speciality}</div>
        <div>I have an experience of {currData.Experience}</div>
      </div>
    </div>
  )
}

export default DoctorProfilenew