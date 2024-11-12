import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Signin.css"
import { NavLink } from "react-router-dom";

import {
  faUser,
  faLock,
  faEyeSlash,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
function SignIn() {
  const[passVis, setPassvis] = useState(false);
  function showpw(){
    setPassvis(!passVis)
  }
  return (
    <div className="signinWrapper">
<div className="siginPage">
      <div>
        <h2>Create an account</h2>
      </div>
      <div className="userName">
        <label htmlFor="username">Username</label>
        <div className="user">
          <FontAwesomeIcon icon={faUser} />
          <input
            type="text"
            htmlFor="username"
            id="username"
            placeholder="Create a username"
          />
        </div>
        <hr />
      </div>
      <div className="Password">
        <label htmlFor="password">Password</label>
        <div className="user">
          <FontAwesomeIcon icon={faLock} />
          <input
       
            type={passVis? "text":"password"}
            htmlFor="username"
            id="username"
            placeholder="Create a password"
          />
         <button onClick={showpw}>  {passVis?<FontAwesomeIcon icon={faEye}/>:<FontAwesomeIcon icon={faEyeSlash}/>}</button>
          
        </div>
        <hr />
      </div>
      <div className="btn">
        <button>Create account</button>
      </div>
      <div className="toLogin">
Already have an account? <b><NavLink to={"/login"}>Log in</NavLink></b>   </div>
    </div>
    </div>
    
  );
}

export default SignIn;
