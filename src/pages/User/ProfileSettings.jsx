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
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import { set } from "react-hook-form";
import Loader from "@/components/Loader";

function ProfileSettings() {
  const [data, setData] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const [location, setLocation] = useState({ lat: 27.7172, lng: 85.324 });
  const [locationName, setLocationName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState(null); // To display existing profile image
  const [loading, setLoading] = useState(false);

  const [profileImage, setProfileImage] = useState(null);

  const navigate = useNavigate();
  const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

  // Function to toggle password visibility
  function showpw() {
    setPassvis(!passVis);
  }
  const fetchLocationName = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await response.json();
      if (data.display_name) {
        setLocationName(data.display_name);
        setSearchQuery(data.display_name); // Update searchQuery with the location name
      }
    } catch (error) {
      console.error("Error fetching location name:", error);
    }
  };

  // Fetch search results (Forward Geocoding)
  const handleSearch = async (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value.length < 3) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${e.target.value}`
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  // Handle search selection
  const handleSearchSelect = (lat, lon, name) => {
    setLocation({ lat: parseFloat(lat), lng: parseFloat(lon) });
    setLocationName(name);
    setSearchQuery(name);
    setSearchResults([]);
  };

  // Handle user clicking on the map
  function LocationMarker() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setLocation({ lat, lng });
        fetchLocationName(lat, lng);
      },
    });

    return location ? (
      <Marker position={[location.lat, location.lng]}>
        <Popup>{locationName || "Your selected location"}</Popup>
      </Marker>
    ) : null;
  }

  // Fetch existing user data
  async function fetchUserData() {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/user/me", {
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
      setSearchQuery(data.location_name);
      setLocation({ lat: data.latitude, lng: data.longitude });
    } catch (error) {
      console.log("Error fetching user data:", error);
    }
  }
  // Update user profile
  async function updateProfile() {
    const payload = {
      name,
      email,
      date_of_birth: birthDate,
      phone_number: phone,
      gender,
      location_name: searchQuery,
      latitude: location.lat.toString(),
      longitude: location.lng.toString(),
    };

    try {
      const token = localStorage.getItem("token");
      setLoading(true);

      console.log("Form Data Before Sending:", payload);

      const response = await fetch(
        "http://127.0.0.1:8000/api/user/profileUpdate",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error updating profile");
      }

      const updatedData = await response.json();

      console.log("Profile updated successfully:", updatedData);
      if (profileImage) {
        const formData = new FormData();
        
        formData.append("profile_picture", profileImage);
        const profileResponse = await fetch(
          "http://127.0.0.1:8000/api/user/imageUpdate",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );

        if (!profileResponse.ok) {
          const errorData = await profileResponse.json();
          throw new Error(errorData.message || "Error uploading profile image");
        }
      }
      // else if (data.profile_picture) {
      //   // const existingImage = `${IMAGE_BASE_URL}${data.profile_picture}`;
      //   // console.log(existingImage);
      //   // const blob = await existingImage.blob();
      //   // const fileName = data.profile_picture.split("/").pop();
      //   // const fileType = blob.type;
      //   const file = new File([], data.profile_picture);
      //   const formData = new FormData();
      //   formData.append("profile_picture", file);
      
      //   const profileResponse = await fetch(
      //     "http://127.0.0.1:8000/api/user/imageUpdate",
      //     {
      //       method: "POST",
      //       headers: {
      //         Authorization: `Bearer ${token}`,
      //       },
      //       body: formData,
      //     }
      //   );
      
      //   if (!profileResponse.ok) {
      //     const errorData = await profileResponse.json();
      //     throw new Error(errorData.message || "Error uploading profile image");
      //   }
      // } else {
        console.log("No new profile picture selected");
      
      

      setData(updatedData);
      alert("User updated successfully!");
      window.location.reload();

    } catch (error) {
      console.log("Error updating profile:", error);
      alert(`Failed to update profile: ${error.message}`);
    } finally {
      setLoading(false);
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
  // if (loading) {
  //   return <Loader/>
  // }
  return (
    <div className="profile-settings-container">
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
                  : `${IMAGE_BASE_URL}${data?.profile_picture}` // Show existing image
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
                value={searchQuery}
                onChange={handleSearch}
                id="location"
                placeholder="Search for a location..."
                className="input-field"
              />
            </div>
            {searchResults.length > 0 && (
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  border: "1px solid #ccc",
                }}
              >
                {searchResults.map((result, index) => (
                  <li
                    key={index}
                    style={{
                      padding: "5px",
                      cursor: "pointer",
                      borderBottom: "1px solid #ddd",
                    }}
                    onClick={() =>
                      handleSearchSelect(
                        result.lat,
                        result.lon,
                        result.display_name
                      )
                    }
                  >
                    {result.display_name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div style={{ height: "300px", width: "100%", marginBottom: "20px" }}>
            <MapContainer
              center={[27.7172, 85.324]}
              zoom={13}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <LocationMarker />
            </MapContainer>
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
          <button type="submit" className="update-button" disabled={loading}>
            {loading ? "UPDATING..." : "UPDATE"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProfileSettings;
