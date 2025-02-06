import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { getMe } from "../../../api/user";
import Loader from "../../../components/Loader";
import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from "react-leaflet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMap } from "@fortawesome/free-solid-svg-icons";

function UpdateProfile() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [profilePic, setProfilePic] = useState(null); // State for the selected profile picture file
  const [profilePicUrl, setProfilePicUrl] = useState(""); // State for the profile picture URL
  const [availability, setAvailability] = useState([]); // State for availability data
  const [location, setLocation] = useState(null); // Stores coordinates
  const [locationName, setLocationName] = useState(""); // Stores location name
  const [searchQuery, setSearchQuery] = useState(""); // Stores search input
  const [searchResults, setSearchResults] = useState([]); // Stores search results

  const { data, isLoading, isError } = useQuery({
    queryKey: ["fetchDocProfile"],
    queryFn: getMe,
    retry: 3,
  });

  useEffect(() => {
    if (data?.image_url) {
      // Set the current profile picture URL from the API response
      setProfilePicUrl(data.image_url);
    }
    if (data?.availability) {
      // Set the availability data from the API response
      setAvailability(data.availability);
    }
    if (data?.location) {
      // Set the initial location from the API response
      setLocation(data.location);
      setLocationName(data.location_name || "");
      setSearchQuery(data.location_name || "");
    }
  }, [data]);

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file); // Set the selected file
      setProfilePicUrl(URL.createObjectURL(file)); // Create a URL for the selected file
    }
  };

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
  };

  function LocationMarker() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        if (lat && lng) {
          setLocation({ lat, lng });
          fetchLocationName(lat, lng);
        }
      },
    });

    return location ? (
      <Marker position={[location.lat, location.lng]}>
        <Popup>{locationName || "Your selected location"}</Popup>
      </Marker>
    ) : null;
  }

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

  const onSubmit = (formData) => {
    const updatedData = {
      ...formData,
      availability, // Send the availability data to the backend
      profile_picture: profilePic, // Send the selected profile picture file
      location, // Send the selected location coordinates
      location_name: locationName, // Send the selected location name
    };
    console.log(updatedData); // Send this data to your backend
  };

  if (isLoading) {
    return <Loader />;
  }
  if (isError) {
    return <div>Error...</div>;
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="font-std mb-10 w-full rounded-2xl bg-white p-10 font-normal leading-relaxed text-gray-900 shadow-xl">
            <div className="flex flex-col">
              <div className="flex flex-col md:flex-row justify-between mb-5 items-start">
                <h2 className="mb-5 text-4xl font-bold text-blue-900">
                  Update Profile
                </h2>
                <div className="text-center">
                  <div>
                    {/* Profile Picture */}
                    <img
                      src={
                        profilePicUrl ||
                        data?.image_url ||
                        "https://i.pravatar.cc/300"
                      } // Use the current profile picture URL or a fallback
                      alt="Profile Picture"
                      className="rounded-full w-32 h-32 mx-auto border-4 border-indigo-800 mb-4 transition-transform duration-300 hover:scale-105 ring ring-gray-300"
                    />
                    <input
                      type="file"
                      name="profile"
                      id="upload_profile"
                      hidden
                      onChange={handleProfilePicChange} // Handle file selection
                      accept="image/*" // Allow only image files
                    />
                    <label
                      htmlFor="upload_profile"
                      className="inline-flex items-center px-4 py-2 bg-indigo-800 text-white rounded-lg hover:bg-indigo-700 cursor-pointer"
                    >
                      Change Profile Picture
                    </label>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    defaultValue={data?.name}
                    {...register("name")}
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Location
                  </label>
                  <div className="user">
                    <FontAwesomeIcon icon={faMap} />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={handleSearch}
                      placeholder="Search for a location..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
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
                </div>

                {/* About */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    About
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    defaultValue={data?.bio}
                    {...register("bio")}
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    defaultValue={data?.email}
                    {...register("email")}
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    defaultValue={data?.phone_number}
                    {...register("phone_number")}
                  />
                </div>

                {/* Specialization */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Specialization
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    defaultValue={data?.specialization}
                    {...register("specialization")}
                  >
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Dermatology">Dermatology</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Gynecology">Gynecology</option>
                    <option value="Ophthalmology">Ophthalmology</option>
                    <option value="Psychiatry">Psychiatry</option>
                    <option value="Radiology">Radiology</option>
                    <option value="Urology">Urology</option>
                    <option value="Oncology">Oncology</option>
                    <option value="ENT">ENT</option>
                    <option value="Gastroenterology">Gastroenterology</option>
                    <option value="Nephrology">Nephrology</option>
                    <option value="Hematology">Hematology</option>
                    <option value="Anesthesiology">Anesthesiology</option>
                    <option value="General">General</option>
                    <option value="Pulmonology">Pulmonology</option>
                  </select>
                </div>

                {/* Fee and Experience */}
                <div className="flex w-full gap-20 flex-wrap">
                  <div className="w-1/3">
                    <label className="block text-sm font-medium text-gray-700">
                      Fee in NPR
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      defaultValue={data?.price}
                      {...register("price")}
                    />
                  </div>
                  <div className="w-1/3">
                    <label className="block text-sm font-medium text-gray-700">
                      Experience in years
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      defaultValue={data?.experience}
                      {...register("experience")}
                    />
                  </div>
                </div>

                {/* Availability */}
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Availability
                  </label>
                  {availability.map((availabilityItem, availabilityIndex) => (
                    <div key={availabilityIndex} className="space-y-4">
                      <div className="flex flex-wrap gap-4 items-end">
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
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
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
                              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
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

                {/* Save and Cancel Buttons */}
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-800 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default UpdateProfile;