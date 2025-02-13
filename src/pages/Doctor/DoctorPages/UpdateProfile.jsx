import { useQuery } from "@tanstack/react-query";
import { set, useForm } from "react-hook-form";
import Loader from "../../../components/Loader";
import { useEffect, useState } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMap } from "@fortawesome/free-solid-svg-icons";
import { getDoctorMe } from "@/api/doctor";
import UpdateMapCenter from "@/components/UpdateMapCenter";

function UpdateProfile() {
  const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;
  const token = localStorage.getItem("token");

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [isUpdating, setUpdating] = useState(false);
  const [profilePic, setProfilePic] = useState(null); // State for the selected profile picture file
  const [profilePicUrl, setProfilePicUrl] = useState(""); // State for the profile picture URL
  const [availability, setAvailability] = useState([]); // State for availability data
  const [location, setLocation] = useState(null); // Stores coordinates
  const [locationName, setLocationName] = useState(""); // Stores location name
  const [searchQuery, setSearchQuery] = useState(""); // Stores search input
  const [searchResults, setSearchResults] = useState([]); // Stores search results

  const fetchSpecialities = async () => {
    const response = await fetch(`${BASE_URL}speciality?active=true`);
    if (!response.ok) throw new Error("Error fetching specialities");
    return response.json();
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["fetchDocProfile"],
    queryFn: getDoctorMe,
    retry: 3,
  });
  const {
    data: specializationData,
    isLoading: specializationLoading,
    isSuccess,
  } = useQuery({
    queryKey: ["specializations"],
    queryFn: fetchSpecialities,
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
    if (data?.location_name) {
      // Set the initial location from the API response
      setLocationName(data.location_name || "");
      setSearchQuery(data.location_name || "");
    }
    if (data?.longitude && data?.latitude) {
      console.log(data.longitude, data.latitude);
      setLocation({
        lat: parseFloat(data.latitude),
        lng: parseFloat(data.longitude),
      });
    }
  }, [data]);
  if (isLoading || specializationLoading) return <Loader />;

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

  const onSubmit = async (formValues) => {
    const updatedData = {
      ...formValues,
      speciality_id: Number(formValues.speciality_id),
      longitude: location.lng.toString(), // Send the selected location coordinates, // Send the selected location coordinates
      latitude: location.lat.toString(),
      location_name: locationName, // Send the selected location name
    };
    console.log(updatedData); // Send this data to your backend
    try {
      const response = await fetch(`${BASE_URL}doctor/profileUpdate`, {
        method: "put",
        headers: {
          
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error updating profile");
      }
      if (profilePic) {
        const formData = new FormData();

        formData.append("profile_picture", profilePic);
        const profileResponse = await fetch(
          "http://127.0.0.1:8000/api/doctor/imageUpdate",
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

      setUpdating(true);

      alert("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);

      alert("Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  if (isLoading || isUpdating) {
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
                        `${IMAGE_BASE_URL}${data?.profile_picture}` ||
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
                  <div
                    style={{
                      height: "300px",
                      width: "100%",
                      marginBottom: "20px",
                    }}
                  >
                    <MapContainer
                      center={location ? location : [27.7172, 85.324]}
                      zoom={13}
                      style={{ height: "100%", width: "100%" }}
                    >
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      <LocationMarker />
                      <UpdateMapCenter location={location} />
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
                    defaultValue={data?.speciality_id || ""}
                    {...register("speciality_id")}
                  >
                    <option value="" disabled>
                      Select a specialization
                    </option>

                    {console.log(specializationData.data)}
                    {specializationData?.data.map((spec, id) => (
                      <option value={spec.id} key={id}>
                        {spec.name}
                      </option>
                    ))}
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
                      defaultValue={data?.fee}
                      {...register("fee")}
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
