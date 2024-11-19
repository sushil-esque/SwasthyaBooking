import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import {
  faUser,
  faLock,
  faEyeSlash,
  faEye,
  faEnvelope,
  faPhone,
  faMap,
  faPencil,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

function ProfileSettings() {
  const [passVis, setPassvis] = useState(false);
  const [data, setData] = useState([]);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const [location, setLocation] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState(null); // To display existing profile image
  const navigate = useNavigate();

  // Function to toggle password visibility
  function showpw() {
    setPassvis(!passVis);
  }

  // Fetch existing user data
  async function fetchUserData() {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error fetching user data");
      }

      const data = await response.json();
      setData(data);
      // Populate state with existing user data
      setName(data.name);
      setEmail(data.email);
      setPhone(data.phone_number);
      setBirthDate(data.date_of_birth);
      setGender(data.gender);
      setLocation(data.location);
      setProfileImageUrl(data.image); // Assuming the API returns the image URL
    } catch (error) {
      console.log("Error fetching user data:", error);
    }
  }

  // Update user profile
  async function updateProfile() {
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
      const token = localStorage.getItem("token");

      const response = await fetch("http://127.0.0.1:8000/api/me", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          // "Content-Type": "application/json",
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error updating profile");
      }

      const updatedData = await response.json();
      console.log("Profile updated successfully:", updatedData);
      alert("User updated successfully!");
      navigate("/UserDashboard");
    } catch (error) {
      console.log("Error updating profile:", error);
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      console.log("Enter key was pressed, but form submission is prevented.");
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);
  return (
    <div className="profile-settings-container">
      {/* <div className="profile-settings-header">
        <img
          src={
            profileImageUrl
              ? `http://127.0.0.1:8000/storage/${profileImageUrl}`
              : "default-profile.png" // Fallback image
          }
          alt="Profile"
          className="profile-picture"
        />
      </div> */}

      
      

      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateProfile();
        }}
        onKeyDown={handleKeyDown}
      >
         <div className="profile-settings-header">
        <div className="profile-picture-wrapper">
          <img
            src={
              profileImage
                ? URL.createObjectURL(profileImage) // Show selected image
                : `${data?.image_url}` // Show existing image
            }
            alt="Profile"
            className="UserProfile-picture"
          />
          <label htmlFor="profilePic" className="edit-icon">
            <FontAwesomeIcon icon={faPencil} />
          </label>
          <input
            type="file"
            id="profilePic"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setProfileImage(file); // Update profile image
              }
            }}
            className="file-input-hidden" // Hide the default file input
          />
        </div>
      </div> 
        <div className="profile-settings-form">
          <div className="form-field">
            <label htmlFor="username">Name</label>
            <div className="input-group">
              <FontAwesomeIcon icon={faUser} className="input-icon" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                id="username"
                placeholder="Enter your name"
                className="input-field"
              />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="email">Email</label>
            <div className="input-group">
              <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                id="email"
                placeholder="Enter your email"
                className="input-field"
              />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="phone">Phone number</label>
            <div className="input-group">
              <FontAwesomeIcon icon={faPhone} className="input-icon" />
              <input
                type="number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                id="phone"
                placeholder="Enter your phone number"
                className="input-field"
              />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="birthDate">Date of Birth</label>
            <div className="input-group">
              <FontAwesomeIcon icon={faUser} className="input-icon" />
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                id="birthDate"
                className="input-field"
              />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="gender">Gender</label>
            <div className="gender-options">
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={gender === "male"}
                  onChange={(e) => setGender(e.target.value)}
                  className="radio-input"
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
                  className="radio-input"
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
                  className="radio-input"
                />
                Other
              </label>
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="location">Location</label>
            <div className="input-group">
              <FontAwesomeIcon icon={faMap} className="input-icon" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                id="location"
                placeholder="Enter your location"
                className="input-field"
              />
            </div>
          </div>
          {/* 
        <div className="form-field">
          <label htmlFor="profilePic">Profile Picture</label>
          <div className="input-group">
            <FontAwesomeIcon icon={faUser} className="input-icon" />
            <input
              type="file"
              id="profilePic"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setProfileImage(file);
                }
              }}
              className="file-input"
            />
          
          </div>
        </div> */}
        </div>
        <div className="form-actions">
          <button type="submit" className="update-button">
            UPDATE
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProfileSettings;
