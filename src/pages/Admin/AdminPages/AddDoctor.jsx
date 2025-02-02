import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { FaUserDoctor } from "react-icons/fa6";

function AddDoctor() {
  const fields = "flex flex-col gap-2 w-80"; // Shared styles for field container
  const inputFields = "outline-none h-5 border rounded px-2"; // Shared styles for inputs

  const [formValues, setFormValues] = useState({
    name: "",
    specialization: "",
    experience: "",
    default_price: "",
    bio: "",
    email: "",
    password: "",
    password_confirmation: "",
    image: "",
    gender: "",
    date_of_birth: "",
    phone_number: "",
    location: "",
    role: "doctor",
  });

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
    setFormValues({ ...formValues, image: file });
  };

  const submit = async () => {
    const formData = new FormData();
    Object.entries(formValues).forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
      const response = await fetch("http://127.0.0.1:8000/api/doctors", {
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
      specialization: "",
      experience: "",
      default_price: "",
      bio: "",
      email: "",
      password: "",
      password_confirmation: "",
      image: "",
      gender: "",
      date_of_birth: "",
      phone_number: "",
      location: "",
      role: "doctor",

        // Reset error state
    
    });
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
          console.log(formValues.default_price);
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
          <input
            type="text"
            name="location"
            id="location"
            placeholder="Enter location"
            className={inputFields}
            value={formValues.location}
            onChange={handleInputChange}
          />
        </div>

        {/* Specialty */}
        <div className={fields}>
          <label htmlFor="speciality">Specialty</label>
          <input
            type="text"
            name="specialization"
            id="speciality"
            placeholder="Enter specialty"
            className={inputFields}
            value={formValues.specialization}
            onChange={handleInputChange}
          />
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
            name="default_price"
            id="fee"
            placeholder="Enter fee"
            className={inputFields}
            value={formValues.default_price}
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

        {/* About */}
        {/* <div className={fields}>
          <label htmlFor="about">About</label>
          <textarea
            name="about"
            id="about"
            placeholder="Enter details about the doctor"
            className={`${inputFields} h-20 resize-none`}
            value={formValues.about}
            onChange={handleInputChange}
          ></textarea>
        </div> */}

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
