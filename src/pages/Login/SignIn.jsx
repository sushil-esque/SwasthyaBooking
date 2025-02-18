import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Signin.css";
import { NavLink, useNavigate } from "react-router-dom";
import {
  faUser,
  faLock,
  faEyeSlash,
  faEye,
  faEnvelope,
  faPhone,
  faMap,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { toast } from "@/hooks/use-toast";

function SignIn() {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [passVis, setPassvis] = useState(false);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const [location, setLocation] = useState(null); // Stores coordinates
  const [locationName, setLocationName] = useState(""); // Stores location name
  const [searchQuery, setSearchQuery] = useState(""); // Stores search input
  const [searchResults, setSearchResults] = useState([]); // Stores search results

  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const patient = "patient";
  const navigate = useNavigate();

  // Toggle password visibility
  function showpw() {
    setPassvis(!passVis);
  }

  // Fetch location name (Reverse Geocoding)
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

  // Handle form submission
  const submit = async () => {
      // Validation checks
  if (!name.trim()) {
    alert("Name is required.");
    return;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    toast({
      title: "plese enter a valid email address",
      variant: "destructive",
    });
    return;
  }

  if (phone.length !== 10) {
    toast({
      title: "Phone number must be at least 10 digits.",
      variant: "destructive", 
    })
    return;
  }

  if (!birthDate) {
    toast({
      title: "Please select your date of birth.",
      variant: "destructive",
    })
    return;
  }

  if (!gender) {
    toast({
      title: "Please select your gender.",
      variant: "destructive",
    })
    return;
  }

  if (password.length < 6) {
    toast({
      title: "Password must be at least 6 characters.",
      variant: "destructive",
    })
    return;
  }

  if (password !== passwordConfirmation) {
    toast({
      title: "Passwords do not match.",
      variant: "destructive",
    })
    return;
  }

  if (!location) {
    toast({
      title: "Please select a location on the map.",
      variant: "destructive",
    })
    return;
  }
    

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("password_confirmation", passwordConfirmation);
    formData.append("date_of_birth", birthDate);
    formData.append("profile_picture", profileImage);
    formData.append("phone_number", phone);
    formData.append("gender", gender);
    formData.append("location_name", locationName); // Use location name
    formData.append("latitude", location.lat); // Add latitude
    formData.append("longitude", location.lng); // Add longitude

    try {
      const rawData = await fetch(BASE_URL + "register", {
        method: "POST",
        body: formData,
      });
      if (!rawData.ok) {
        throw new Error("Registration Failed!!!");
      }
      const data = await rawData.json();
      console.log("Registration successful:", data);
      alert("User registered successfully!");
      navigate("/login");
    } catch (error) {
      console.error("Error registering user:", error);
      console.log(formData);
    }
  };

  return (
    <div className="signinWrapper">
      {console.log(locationName)}
      <div className="siginPage">
        <div>
          <h2>Create an account</h2>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          {/* Name */}
          <div className="userName">
            <label htmlFor="username">Name</label>
            <div className="user">
              <FontAwesomeIcon icon={faUser} />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                id="username"
                placeholder="Create a username"
                required
              />
            </div>
            <hr />
          </div>

          {/* Email */}
          <div className="userName">
            <label htmlFor="email">Email</label>
            <div className="user">
              <FontAwesomeIcon icon={faEnvelope} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                id="email"
                placeholder="Enter your email"
                required
              />
            </div>
            <hr />
          </div>

          {/* Phone Number */}
          <div className="userName">
            <label htmlFor="phone">Phone number</label>
            <div className="user">
              <FontAwesomeIcon icon={faPhone} />
              <input
                type="number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                id="phone"
                placeholder="Enter your phone no."
                required
              />
            </div>
            <hr />
          </div>

          {/* Date of Birth */}
          <div className="userName">
            <label htmlFor="birthDate">Date of birth</label>
            <div className="user">
              <FontAwesomeIcon icon={faUser} />
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                id="birthDate"
                required
              />
            </div>
            <hr />
          </div>

          {/* Gender */}
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

          {/* Password */}
          <div className="Password">
            <label htmlFor="password">Password</label>
            <div className="user">
              <FontAwesomeIcon icon={faLock} />
              <input
                type={passVis ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id="password"
                placeholder="Create a password"
                required
              />
              <button onClick={showpw} type="button">
                {passVis ? (
                  <FontAwesomeIcon icon={faEye} />
                ) : (
                  <FontAwesomeIcon icon={faEyeSlash} />
                )}
              </button>
            </div>
            <hr />
          </div>

          {/* Confirm Password */}
          <div className="Password">
            <label htmlFor="password_confirmation">Confirm Password</label>
            <div className="user">
              <FontAwesomeIcon icon={faLock} />
              <input
                type={passVis ? "text" : "password"}
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                id="password_confirmation"
                placeholder="Confirm your password"
                required
              />
              <button onClick={showpw} type="button">
                {passVis ? (
                  <FontAwesomeIcon icon={faEye} />
                ) : (
                  <FontAwesomeIcon icon={faEyeSlash} />
                )}
              </button>
            </div>
            <hr />
          </div>

          {/* Profile Picture */}
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
                    setProfileImage(file);
                  }
                }}
                required
              />
            </div>
            <hr />
          </div>

          {/* Location Search and Map */}
          <div className="userName">
            <label htmlFor="location">Location</label>
            <div className="user">
              <FontAwesomeIcon icon={faMap} />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                id="location"
                placeholder="Search for a location..."
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
            <hr />
          </div>

          {/* Map Container */}
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

          {/* Submit Button */}
          <div className="btn">
            <button type="submit">Create account</button>
          </div>
        </form>

        {/* Link to Login Page */}
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
