import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Signin.css";
import { json, NavLink, useNavigate } from "react-router-dom";

import {
  faUser,
  faLock,
  faEyeSlash,
  faEye,
  faMailBulk,
  faEnvelope,
  faPhone,
  faMap,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
function SignIn() {
  const [passVis, setPassvis] = useState(false);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setemail] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const [location, setLocation] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const navigate = useNavigate();
  function showpw() {
    setPassvis(!passVis);
  }
  async function submit() {
    // const singinJson = {
    //   name: name,
    //   email: email,
    //   password: password,
    //   date_of_birth: birthDate,
    //   image: profileImage,
    //   phone_number: phone,
    //   gender: gender,
    //   location: location,
    // };
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("password_confirmation", passwordConfirmation);
    formData.append("date_of_birth", birthDate);
    formData.append("image", profileImage);
    formData.append("phone_number", phone);
    formData.append("gender", gender);
    formData.append("location", location);
    try {
      const rawData = await fetch("http://127.0.0.1:8000/api/register", {
        method: "Post",

        body: formData,
      });
      if (!rawData.ok) {
        throw new Error("Login Failed!!!");
      }
      const data = await rawData.json();
      console.log("Registration successful:", data);
      alert("User registered successfully!");
      navigate("/login");
    } catch (error) {
      console.log("error fetching data");
      // } finally {
      //   window.alert("created acccount successfully");
      // }
    }
  }
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      console.log("Enter key was pressed, but form submission is prevented.");
    }
  };
  console.log(password);
  console.log(name);
  return (
    <div className="signinWrapper">
      <div className="siginPage">
        <div>
          <h2>Create an account</h2>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
          onKeyDown={handleKeyDown}
        >
          <div className="userName">
            <label htmlFor="username">Name</label>
            <div className="user">
              <FontAwesomeIcon icon={faUser} />
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
                htmlFor="username"
                id="username"
                placeholder="Create a username"
              />
            </div>
            <hr />
          </div>
          <div className="userName">
            <label htmlFor="email">Email</label>
            <div className="user">
              <FontAwesomeIcon icon={faEnvelope} />
              <input
                type="text"
                value={email}
                onChange={(e) => {
                  setemail(e.target.value);
                }}
                htmlFor="Email"
                id="Email"
                placeholder="Enter your email"
              />
            </div>
            <hr />
          </div>
          <div className="userName">
            <label htmlFor="phone">Phone number</label>
            <div className="user">
              <FontAwesomeIcon icon={faPhone} />
              <input
                type="number"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                }}
                htmlFor="Email"
                id="Email"
                placeholder="Enter your phone no."
              />
            </div>
            <hr />
          </div>
          <div className="userName">
            <label htmlFor="birthDate">Date of birth</label>
            <div className="user">
              <FontAwesomeIcon icon={faUser} />
              <input
                type="date"
                value={birthDate}
                onChange={(e) => {
                  setBirthDate(e.target.value);
                }}
                htmlFor="Email"
                id="Email"
                placeholder="Enter your email"
              />
            </div>
            <hr />
          </div>
          <div className="userName">
            <label htmlFor="gender">Gender</label>
            <div className="gender-options">
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={gender === "male"}
                  onChange={(e) => setGender(e.target.value)}
                />
                Male
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={gender === "female"}
                  onChange={(e) => setGender(e.target.value)}
                />
                Female
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="other"
                  checked={gender === "other"}
                  onChange={(e) => setGender(e.target.value)}
                />
                Other
              </label>
            </div>
            <hr />
          </div>
          <div className="userName">
            <label htmlFor="location">Location</label>
            <div className="user">
              <FontAwesomeIcon icon={faMap} />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                id="location"
                placeholder="Enter your location"
              />
            </div>
            <hr />
          </div>

          <div className="Password">
            <label htmlFor="password">Password</label>
            <div className="user">
              <FontAwesomeIcon icon={faLock} />
              <input
                type={passVis ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                htmlFor="password"
                id="password"
                placeholder="Create a password"
              />
              <button onClick={showpw} type="button">
                {" "}
                {passVis ? (
                  <FontAwesomeIcon icon={faEye} />
                ) : (
                  <FontAwesomeIcon icon={faEyeSlash} />
                )}
              </button>
            </div>
            <hr />
          </div>
          <div className="Password">
            <label htmlFor="password_confirmation">Confirm Password</label>
            <div className="user">
              <FontAwesomeIcon icon={faLock} />
              <input
                type={passVis ? "text" : "password"}
                value={passwordConfirmation}
                onChange={(e) => {
                  setPasswordConfirmation(e.target.value);
                }}
                htmlFor="password_confirmation"
                id="password_confirmation"
                placeholder="Confirm your password"
              />
              <button onClick={showpw} type="button">
                {" "}
                {passVis ? (
                  <FontAwesomeIcon icon={faEye} />
                ) : (
                  <FontAwesomeIcon icon={faEyeSlash} />
                )}
              </button>
            </div>
            <hr />
          </div>
          <div className="userName">
            <label htmlFor="profilePic">Profile picture</label>
            <div className="user">
              <FontAwesomeIcon icon={faUser} />
              <input
                type="file"
                id="profilePic"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    // const reader = new FileReader();
                    // reader.onload = () => setProfileImage(reader.result); // Convert file to a data URL
                    // reader.readAsDataURL(file);
                    setProfileImage(file);
                  }
                }}
              />
              {profileImage && (
                <div className="imagePreview">
                  <img
                    src={profileImage}
                    alt="Profile Preview"
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "50%",
                    }}
                  />
                </div>
              )}
            </div>
            <hr />
          </div>

          <div className="btn">
            <button type="submit"> Create account</button>
          </div>
        </form>

        <div className="toLogin">
          Already have an account?{" "}
          <b>
            <NavLink to={"/login"}>Log in</NavLink>
          </b>{" "}
        </div>
      </div>
    </div>
  );
}

export default SignIn;
