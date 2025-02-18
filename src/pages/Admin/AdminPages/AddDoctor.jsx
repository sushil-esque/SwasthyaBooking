import { showSpecialities } from "@/api/admin";
import Loader from "@/components/Loader";
import { toast, useToast } from "@/hooks/use-toast";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { faMap } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FaUserDoctor } from "react-icons/fa6";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from "react-leaflet";

function AddDoctor() {
  const fields = "flex flex-col gap-2 w-80"; // Shared styles for field container
  const inputFields = "outline-none h-5 border rounded px-2"; // Shared styles for inputs
  const {
    data: specialitiesData,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: ["specialities"],
    queryFn: showSpecialities,
    retry: 3,
  });

  isSuccess && console.log(specialitiesData?.data);

  const [location, setLocation] = useState(null); // Stores coordinates
  const [locationName, setLocationName] = useState(""); // Stores location name
  const [searchQuery, setSearchQuery] = useState(""); // Stores search input
  const [searchResults, setSearchResults] = useState([]); // Stores search results
  const [availability, setAvailability] = useState([]); // State for availability data
  const [loading, setLoading] = useState(false);
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
    gender: "",
    date_of_birth: "",
    phone_number: "",
    status: "active",
    availability: [],
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
      location_name: name,
      latitude: lat.toString(),
      longitude: lon.toString(),
    }));
  };
  console.log(location?.lng.toString());

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

  console.log("Form data:", formValues);

  const validateForm = () => {
    const errors = [];

    // Name validation
    if (!formValues.name.trim()) {
      errors.push("Name is required.");
    }

    // Gender validation
    if (!formValues.gender) {
      errors.push("Gender is required.");
    }

    // Location validation
    if (!location) {
      errors.push("Please select a location on the map.");
    }

    // Specialty validation
    if (!formValues.speciality_id) {
      errors.push("Specialty is required.");
    }

    // Experience validation
    if (!formValues.experience) {
      errors.push("Experience is required.");
    } else if (isNaN(formValues.experience) || formValues.experience < 0) {
      errors.push("Experience must be a valid number.");
    }

    // Fee validation
    if (!formValues.fee) {
      errors.push("Appointment fee is required.");
    } else if (isNaN(formValues.fee) || formValues.fee < 0) {
      errors.push("Fee must be a valid number.");
    }

    // Phone number validation
    if (!formValues.phone_number) {
      errors.push("Phone number is required.");
    } else if (!/^\d{10}$/.test(formValues.phone_number)) {
      errors.push("Phone number must be 10 digits.");
    }

    // Bio validation
    if (!formValues.bio.trim()) {
      errors.push("Bio is required.");
    }

    // Email validation
    if (!formValues.email) {
      errors.push("Email is required.");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email)) {
      errors.push("Invalid email address.");
    }

    // Date of birth validation
    if (!formValues.date_of_birth) {
      errors.push("Date of birth is required.");
    }

    // Password validation
    if (!formValues.password) {
      errors.push("Password is required.");
    } else if (formValues.password.length < 6) {
      errors.push("Password must be at least 6 characters.");
    }

    // Confirm password validation
    if (!formValues.password_confirmation) {
      errors.push("Confirm password is required.");
    } else if (formValues.password !== formValues.password_confirmation) {
      errors.push("Passwords do not match.");
    }

    return errors;
  };

  const submit = async () => {
    const errors = validateForm();
    if (errors.length > 0) {
      setIsError(true);
      setErrorMessage(errors);
      return;
    }

    const availabilityJson = JSON.stringify(availability);
    console.log("availability json", availabilityJson);
    console.log("Availability before submit: ", availability);

    const formattedAvailability = availability.map((slot) => ({
      ...slot,
      times: slot.times.map((time) => convertTo12Hour(time)),
    }));

    const payload = {
      ...formValues,
      longitude: formValues.longitude.toString(), // Ensure longitude is a string
      latitude: formValues.latitude.toString(), // Ensure latitude is a string
      speciality_id: Number(formValues.speciality_id), // Ensure speciality_id is a number
      experience: Number(formValues.experience),
      // availability: JSON.stringify(availability), // Serialize availability as JSON
      availability: formattedAvailability,
    };

    console.log("Payload:", payload);

    try {
      setLoading(true);

      const response = await fetch("http://127.0.0.1:8000/api/admin/doctor", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const responseData = await response.json();
      console.log(response);
      if (!response.ok) {
        if (response.status === 422) {
          console.log(responseData.message);
          // setErrorMessage(responseData.message);
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
        gender: "",
        date_of_birth: "",
        phone_number: "",
        location: "",
        availability: [],
        status: "active",
      });
      setAvailability([]);
      setIsError(false);
      setErrorMessage([]);
    } catch (error) {
      console.error("Error submitting form:", error.message);
      alert("Error registering user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const addAvailability = () => {
    // Add a new availability object with an empty date and times array
    setAvailability([...availability, { date: "", times: [""] }]);
  };

  const removeAvailability = (index) => {
    const updatedAvailability = availability.filter((_, i) => i !== index);
    setAvailability(updatedAvailability);
  };

  const handleDateChange = (index, value) => {
    const updatedAvailability = [...availability];
    updatedAvailability[index].date = value;
    setAvailability(updatedAvailability);
  };

  const handleTimeChange = (availabilityIndex, timeIndex, value) => {
    const updatedAvailability = [...availability];
    updatedAvailability[availabilityIndex].times[timeIndex] = value;
    setAvailability(updatedAvailability);
  };

  const addTimeSlot = (availabilityIndex) => {
    const updatedAvailability = [...availability];
    updatedAvailability[availabilityIndex].times.push("");
    setAvailability(updatedAvailability);
  };

  const removeTimeSlot = (availabilityIndex, timeIndex) => {
    const updatedAvailability = [...availability];
    updatedAvailability[availabilityIndex].times = updatedAvailability[
      availabilityIndex
    ].times.filter((_, i) => i !== timeIndex);
    setAvailability(updatedAvailability);
  };
  function convertTo12Hour(time) {
    const [hours, minutes] = time.split(":");
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    const convertedHours = h % 12 || 12; // Convert 0 to 12 for midnight
    return `${convertedHours}:${minutes} ${ampm}`;
  }
  useEffect(() => {
    if (isError && errorMessage.length > 0) {
      errorMessage.forEach((error) => {
        toast({
          title: "Error",
          description: error,
          status: "error",
          duration: 5000,
          isClosable: true,
          variant: "destructive",
        });
      });
    }
  }, [isError, errorMessage]);

  if (loading) {
    return <Loader />;
  }

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
        {isError && <span className="text-red-500 text-sm"></span>}
        {/* Profile Picture
        <div className="w-full flex flex-col gap-3">
          <div className="flex items-center justify-center h-28 w-28 border-4 border-black rounded-full bg-gray-100">
            {profileImage ? (
              <img
                src={profileImage}
                className="h-full w-full border-4 border-black rounded-full object-cover"
              />
            ) : (
              <FaUserDoctor className="h-16 w-16 text-zinc-500" />
            )}
          </div>

          <label htmlFor="profilePicture">Profile picture</label>
          <input
            type="file"
            id="profilePic"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div> */}

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
          <div className="w-full   rounded-md  flex items-center">
            <FontAwesomeIcon icon={faMap} />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              id="location"
              placeholder="Search for a location..."
              className="w-full outline-none border-none"
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
        <div className="flex flex-col flex-shrink w-[77%]">
          <label htmlFor="bio">Bio</label>
          <textarea
            name="bio"
            id="bio"
            placeholder="Enter bio"
            className={`w-full h-20 resize-none outline-none border px-2 rounded`}
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
        {/* Availability */}
        <div className={fields}>
          <label>Availability</label>
          {availability.map((availabilityItem, availabilityIndex) => (
            <div key={availabilityIndex} className="space-y-4">
              <div className="flex flex-wrap gap-5 items-end">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Date
                  </label>
                  <input
                    type="date"
                    value={availabilityItem.date}
                    onChange={(e) =>
                      handleDateChange(availabilityIndex, e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeAvailability(availabilityIndex)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 ml-3"
                >
                  Remove Availability
                </button>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Time Slots
                </label>
                {availabilityItem.times.map((time, timeIndex) => (
                  <div
                    key={timeIndex}
                    className="flex flex-wrap gap-4 items-end"
                  >
                    <div className="flex-1">
                      <input
                        type="time"
                        value={time}
                        onChange={(e) =>
                          handleTimeChange(
                            availabilityIndex,
                            timeIndex,
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        removeTimeSlot(availabilityIndex, timeIndex)
                      }
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 ml-3"
                    >
                      Remove Time
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addTimeSlot(availabilityIndex)}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Add Time Slot
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addAvailability}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Add Availability
          </button>
        </div>

        {/* Submit Button */}
        <div className="flex w-full mt-4">
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Doctor"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddDoctor;
