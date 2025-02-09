import { showSpecialities } from "@/api/admin";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { faMap } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FaUserDoctor } from "react-icons/fa6";
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from "react-leaflet";

function AddDoctor() {
  const fields = "flex flex-col gap-2 w-80"; // Shared styles for field container
  const inputFields = "outline-none h-5 border rounded px-2"; // Shared styles for inputs
  const { data: specialitiesData, isLoading, isSuccess } = useQuery({
    queryKey: ["specialities"],
    queryFn: showSpecialities,
    retry: 3,
  });

  isSuccess && console.log(specialitiesData?.data);

  const [location, setLocation] = useState(null); // Stores coordinates
  const [locationName, setLocationName] = useState(""); // Stores location name
  const [searchQuery, setSearchQuery] = useState(""); // Stores search input
  const [searchResults, setSearchResults] = useState([]); // Stores search results
  const [formValues, setFormValues] = useState({
    name: "",
    speciality_id: "",
    experience: "",
    fee: "",
    bio: "",
    email: "",
    password: "",
    password_confirmation: "",
    longitude: "",
    latitude: "",
    location_name: "",
    profile_picture: "",
    gender: "",
    date_of_birth: "",
    phone_number: "",
    location: "",
    status: "active",
    availability: [
      {
        date: "2025-02-10",
        times: ["09:00 AM", "02:00 PM"]
      },
      {
        date: "2025-02-11",
        times: ["10:00 AM", "03:00 PM"]
      }
    ],
  });

  const fetchLocationName = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await response.json();
      if (data.display_name) {
        setLocationName(data.display_name);
        setSearchQuery(data.display_name); // Update searchQuery with the location name
        setFormValues((prev) => ({
          ...prev,
          location_name: data.display_name,
          latitude: lat,
          longitude: lng,
        }));
      }
    } catch (error) {
      console.error("Error fetching location name:", error);
    }
  };

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

  const handleSearchSelect = (lat, lon, name) => {
    setLocation({ lat: parseFloat(lat), lng: parseFloat(lon) });
    setLocationName(name);
    setSearchQuery(name);
    setSearchResults([]);
    setFormValues((prev) => ({
      ...prev,
      locationName: name,
      latitude: lat,
      longitude: lon,
    }));
  };

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

  const [passVis, setPassVis] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState([]);

  const togglePasswordVisibility = () => {
    setPassVis(!passVis);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 255 * 1024) {
      alert("File size must be less than 255KB");
      return;
    }
    setFormValues({ ...formValues, profile_picture: file });
  };
  
  const submit = async () => {
    const formData = new FormData();
    Object.entries(formValues).forEach(([key, value]) => {
      if (key !== "availability") {
        formData.append(key, value);
    }
    });
    
  // Append availability properly (each date separately)
  formValues.availability.forEach((slot, index) => {
    formData.append(`availability[${index}][date]`, slot.date);
    slot.times.forEach((time, timeIndex) => {
        formData.append(`availability[${index}][times][${timeIndex}]`, time);
    });
});
console.log("FormData contents:");
for (let pair of formData.entries()) {
    console.log(pair[0], pair[1]);
}

    try {
      const response = await fetch("http://127.0.0.1:8000/api/admin/doctor", {
        method: "POST",
        body: formData,
        headers: {
          
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const responseData = await response.json(); // Parse response as JSON
      console.log(response);
      if (!response.ok) {
        if (response.status === 422) {
          console.log(responseData.message);
          setErrorMessage(responseData.message);
          setIsError(true);
        }
        throw new Error(responseData.message || "Registration failed!");
      }
      console.log("Registration successful:", responseData);
      alert("Doctor registered successfully!");
      // Reset form
      setFormValues({
        name: "",
        speciality_id: "",
        experience: "",
        fee: "",
        bio: "",
        email: "",
        password: "",
        password_confirmation: "",
        longitude: "",
        latitude: "",
        location_name: "",
        profile_picture: "",
        gender: "",
        date_of_birth: "",
        phone_number: "",
        location: "",
        availability: [
          {
            date: "2025-02-10",
            times: ["09:00 AM", "02:00 PM"]
          },
          {
            date: "2025-02-11",
            times: ["10:00 AM", "03:00 PM"]
          }
        ],
        status: "active",
      });
      setIsError(false);
      setErrorMessage([]);
    } catch (error) {
      console.error("Error submitting form:", error.message);
      alert("Error registering user. Please try again.");
    }
  };

  return (
    <div className="flex justify-start py-10 lg:px-40 sm:px-5 md:px-20 text-black bg-white">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          console.log(formValues);
          submit();
        }}
        className="flex flex-wrap gap-5"
      >
        {isError && (
          <span className="text-red-500 text-sm">
            {Object.values(errorMessage)
              .flat()
              .map((error, index) => (
                <div key={index}>{error}</div>
              ))}
          </span>
        )}
        {/* Profile Picture */}
        <div className="w-full flex flex-col gap-3">
          <div className="flex items-center justify-center h-28 w-28 border-4 border-black rounded-full bg-gray-100">
            <FaUserDoctor className="h-16 w-16 text-zinc-500" />
          </div>
          <label htmlFor="profilePicture">Profile picture</label>
          <input
            type="file"
            id="profilePic"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        {/* Doctor Name */}
        <div className={fields}>
          <label htmlFor="name">Doctor Name</label>
          <input
            type="text"
            placeholder="Enter doctor name"
            id="name"
            name="name"
            className={inputFields}
            value={formValues.name}
            onChange={handleInputChange}
          />
        </div>

        {/* Gender */}
        <div className={fields}>
          <label htmlFor="gender">Gender</label>
          <div>
            <label>
              <input
                type="radio"
                name="gender"
                value="male"
                checked={formValues.gender === "male"}
                onChange={handleInputChange}
              />
              Male
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="female"
                checked={formValues.gender === "female"}
                onChange={handleInputChange}
              />
              Female
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="other"
                checked={formValues.gender === "other"}
                onChange={handleInputChange}
              />
              Other
            </label>
          </div>
        </div>

        {/* Location */}
        <div className={fields}>
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
            <ul style={{ listStyle: "none", padding: 0, border: "1px solid #ccc" }}>
              {searchResults.map((result, index) => (
                <li
                  key={index}
                  style={{ padding: "5px", cursor: "pointer", borderBottom: "1px solid #ddd" }}
                  onClick={() => handleSearchSelect(result.lat, result.lon, result.display_name)}
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
          <MapContainer center={[27.7172, 85.324]} zoom={13} style={{ height: "100%", width: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationMarker />
          </MapContainer>
        </div>

        {/* Specialty */}
        <div className={fields}>
          <label htmlFor="speciality">Specialty</label>
          <select
            name="speciality_id"
            className={inputFields}
            onChange={handleInputChange}
            value={formValues.speciality_id}
          >
            <option value="">Select a specialty</option>
            {specialitiesData?.data.map((speciality) => (
              <option key={speciality.id} value={speciality.id}>
                {speciality.name}
              </option>
            ))}
          </select>
        </div>

        {/* Experience */}
        <div className={fields}>
          <label htmlFor="experience">Experience (Years)</label>
          <input
            type="number"
            name="experience"
            id="experience"
            placeholder="Enter experience"
            className={inputFields}
            value={formValues.experience}
            onChange={handleInputChange}
          />
        </div>

        {/* Appointment Fee */}
        <div className={fields}>
          <label htmlFor="fee">Appointment Fee</label>
          <input
            type="number"
            name="fee"
            id="fee"
            placeholder="Enter fee"
            className={inputFields}
            value={formValues.fee}
            onChange={handleInputChange}
          />
        </div>

        {/* Phone Number */}
        <div className={fields}>
          <label htmlFor="phone">Phone Number</label>
          <input
            type="number"
            name="phone_number"
            id="phone"
            placeholder="Enter phone number"
            className={inputFields}
            value={formValues.phone_number}
            onChange={handleInputChange}
          />
        </div>

        {/* Bio */}
        <div className={fields}>
          <label htmlFor="bio">Bio</label>
          <textarea
            name="bio"
            id="bio"
            placeholder="Enter bio"
            className={`${inputFields} h-10 resize-none`}
            value={formValues.bio}
            onChange={handleInputChange}
          ></textarea>
        </div>

        {/* Email */}
        <div className={fields}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Enter email"
            className={inputFields}
            value={formValues.email}
            onChange={handleInputChange}
          />
        </div>

        {/* Date of Birth */}
        <div className={fields}>
          <label htmlFor="birthDate">Date of Birth</label>
          <input
            type="date"
            name="date_of_birth"
            id="birthDate"
            className={inputFields}
            value={formValues.date_of_birth}
            onChange={handleInputChange}
          />
        </div>

        {/* Password */}
        <div className={fields}>
          <label htmlFor="password">Password</label>
          <div className="flex items-center gap-2">
            <input
              type={passVis ? "text" : "password"}
              name="password"
              id="password"
              placeholder="Enter password"
              className={inputFields}
              value={formValues.password}
              onChange={handleInputChange}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="border-0 bg-transparent"
            >
              {passVis ? (
                <FontAwesomeIcon icon={faEye} />
              ) : (
                <FontAwesomeIcon icon={faEyeSlash} />
              )}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className={fields}>
          <label htmlFor="passwordConfirmation">Confirm Password</label>
          <div className="flex items-center gap-2">
            <input
              type={passVis ? "text" : "password"}
              name="password_confirmation"
              id="passwordConfirmation"
              placeholder="Confirm password"
              className={inputFields}
              value={formValues.password_confirmation}
              onChange={handleInputChange}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="border-0 bg-transparent"
            >
              {passVis ? (
                <FontAwesomeIcon icon={faEye} />
              ) : (
                <FontAwesomeIcon icon={faEyeSlash} />
              )}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex w-full mt-4">
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddDoctor;