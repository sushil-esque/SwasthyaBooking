import { useState } from "react";
import axios from "axios";

function Schedule() {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("token");

  const [availability, setAvailability] = useState([]); // State for availability data
  const [copyPreviousTimes, setCopyPreviousTimes] = useState(false); // State for checkbox
  const [errors, setErrors] = useState({}); // State for validation errors
  const [isUpdating, setUpdating] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    availability.forEach((item, index) => {
      if (!item.date) {
        newErrors[`date-${index}`] = "Date is required";
      }

      item.times.forEach((time, timeIndex) => {
        if (!time) {
          newErrors[`time-${index}-${timeIndex}`] = "Time is required";
        }
      });
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const addAvailability = () => {
    let newAvailability = { date: "", times: [""] };

    if (copyPreviousTimes && availability.length > 0) {
      // Copy times from the last availability entry
      const lastAvailability = availability[availability.length - 1];
      newAvailability.times = [...lastAvailability.times];
    }

    setAvailability([...availability, newAvailability]);
  };

  const removeAvailability = (index) => {
    const updatedAvailability = availability.filter((_, i) => i !== index);
    setAvailability(updatedAvailability);
  };

  const handleDateChange = (index, value) => {
    const updatedAvailability = [...availability];
    updatedAvailability[index].date = value;
    setAvailability(updatedAvailability);

    // Clear date error if the user selects a date
    if (value) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[`date-${index}`];
        return newErrors;
      });
    }
  };

  const handleTimeChange = (availabilityIndex, timeIndex, value) => {
    const updatedAvailability = [...availability];
    updatedAvailability[availabilityIndex].times[timeIndex] = value;
    setAvailability(updatedAvailability);

    // Clear time error if the user selects a time
    if (value) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[`time-${availabilityIndex}-${timeIndex}`];
        return newErrors;
      });
    }
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

  const formattedAvailability = availability.map((item) => ({
    date: item.date,
    times: item.times.map((time) => convertTo12Hour(time)), // Convert each time to 12-hour format
  }));

  console.log(formattedAvailability);

  async function postAvailability() {
    const formattedAvailability = availability.map((item) => ({
      date: item.date,
      times: item.times.map((time) => convertTo12Hour(time)), // Convert each time to 12-hour format
    }));

    const payload = {
      availability: formattedAvailability,
    };

    try {
      setUpdating(true);
      const response = await axios.put(
        `${BASE_URL}doctor/profileUpdate`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status !== 200) {
        throw new Error(response.data.message || "Error ");
      }
      alert("Availability added successfully");
    } catch (error) {
      console.error("error updating schedule:", error);
      alert("Failed to add availability");
    } finally {
      setUpdating(false);
    }
  }

  const onSubmit = (e) => {
    e.preventDefault();

    // Validate the form before submitting
    if (!validateForm()) {
      alert("Please fill in all required fields.");
      return;
    }

    postAvailability();
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="mt-10 font-std mb-10 w-full rounded-2xl bg-white p-10 font-normal leading-relaxed text-gray-900 shadow-xl h-full">
        {/* Availability */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Availability
          </label>
          {availability.map((availabilityItem, availabilityIndex) => (
            <div key={availabilityIndex} className="space-y-4">
              <div className="flex gap-4 justify-center items-start">
                <div className="flex items-center gap-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Date
                  </label>
                  <input
                    type="date"
                    value={availabilityItem.date}
                    onChange={(e) =>
                      handleDateChange(availabilityIndex, e.target.value)
                    }
                    className="sm:w-[150px] lg:w-[300px] w-[100px] px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  {errors[`date-${availabilityIndex}`] && (
                    <p className="text-red-500 text-sm">
                      {errors[`date-${availabilityIndex}`]}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeAvailability(availabilityIndex)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Remove Availability
                </button>
              </div>
              <label className="block text-sm font-medium text-gray-700">
                Time Slots
              </label>
              <div className=" flex flex-wrap items-center gap-8">
                {availabilityItem.times.map((time, timeIndex) => (
                  <div
                    key={timeIndex}
                    className="flex flex-wrap gap-1 items-center"
                  >
                    <div className="">
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
                        className="w-[80px] px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      {errors[`time-${availabilityIndex}-${timeIndex}`] && (
                        <p className="text-red-500 text-sm">
                          {errors[`time-${availabilityIndex}-${timeIndex}`]}
                        </p>
                      )}
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
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={addAvailability}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Add Availability
            </button>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={copyPreviousTimes}
                onChange={(e) => setCopyPreviousTimes(e.target.checked)}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700">
                Copy times from previous availability
              </span>
            </label>
          </div>
        </div>
        <div className="flex items-end justify-center ">
          <button
            type="submit"
            className="w-[200px] px-4 py-2 bg-indigo-800 text-white rounded-lg hover:bg-indigo-700 mt-5"
          >
            {isUpdating ? "Updating..." : "Update Schedule"}
          </button>
        </div>
      </div>
    </form>
  );
}

export default Schedule;
