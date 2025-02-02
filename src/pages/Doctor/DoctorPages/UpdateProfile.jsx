import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { getMe } from "../../../api/user";
import Loader from "../../../components/Loader";
import { useEffect, useState } from "react";

function UpdateProfile() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [timeSlots, setTimeSlots] = useState([""]); // Initialize with one empty slot
  const [profilePic, setProfilePic] = useState(null); // State for the selected profile picture file
  const [profilePicUrl, setProfilePicUrl] = useState(""); // State for the profile picture URL

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
      // Assuming availability is an array of time slots
      setTimeSlots(data.availability);
    }
  }, [data]);

  const addTimeSlot = () => {
    setTimeSlots([...timeSlots, ""]); // Add an empty time slot
  };

  const removeTimeSlot = (index) => {
    const updatedSlots = timeSlots.filter((_, i) => i !== index);
    setTimeSlots(updatedSlots);
  };

  const handleTimeSlotChange = (index, value) => {
    const updatedSlots = [...timeSlots];
    updatedSlots[index] = value;
    setTimeSlots(updatedSlots);
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file); // Set the selected file
      setProfilePicUrl(URL.createObjectURL(file)); // Create a URL for the selected file
    }
  };

  const onSubmit = (formData) => {
    const updatedData = {
      ...formData,
      availability: timeSlots, // Send the time slots to the backend
      profile_picture: profilePic, // Send the selected profile picture file
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
                      src={profilePicUrl || data?.image_url || "https://i.pravatar.cc/300"} // Use the current profile picture URL or a fallback
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
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    defaultValue={data?.location}
                    {...register("location")}
                  />
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

                {/* Time Slots */}
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Time Slots
                  </label>
                  {timeSlots.map((slot, index) => (
                    <div key={index} className="flex flex-wrap gap-4 items-end">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={slot}
                          onChange={(e) =>
                            handleTimeSlotChange(index, e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="Enter time slot (e.g., 10:00 AM)"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeTimeSlot(index)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addTimeSlot}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    Add Time Slot
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