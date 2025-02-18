import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Loader from "@/components/Loader";

function AdminProfileUpdate() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const {
    data,
    isLoading: isFetching,
    isError: fetchError,
  } = useQuery({
    queryKey: ["adminProfile"],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}admin/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch admin data");
      }

      return response.json();
    },
  });
  useEffect(() => {
    if (data?.email) {
      setEmail(data.email); // Set initial email
    }
  }, [data]);

  const { mutate, isLoading, isError, error } = useMutation({
    mutationFn: async (formData) => {
      const response = await fetch(`${BASE_URL}admin/profileUpdate`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      return response.json();
    },
    onSuccess: () => {
      alert("Profile updated successfully!");
      // Reset form fields
      setEmail("");
      setPassword("");
      setPasswordConfirmation("");
    },
    onError: (error) => {
      console.error("Error updating profile:", error.message);
    },
  });
  if (isFetching) {
    return <Loader />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate password and confirmation
    if (password !== passwordConfirmation) {
      alert("Passwords do not match.");
      return;
    }

    // Prepare form data
    const formData = {
      email,
      password,
      password_confirmation: passwordConfirmation,
    };

    // Trigger mutation
    mutate(formData);
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Update Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-[95%] px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Password Field */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            New Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-[95%]  px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Password Confirmation Field */}
        <div>
          <label
            htmlFor="passwordConfirmation"
            className="block text-sm font-medium text-gray-700"
          >
            Confirm New Password
          </label>
          <input
            type="password"
            id="passwordConfirmation"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            className="w-[95%]  px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-[95%] l bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLoading ? "Updating..." : "Update Profile"}
          </button>
        </div>

        {/* Error Message */}
        {isError && (
          <div className="text-red-500 text-sm text-center">
            {error.message}
          </div>
        )}
      </form>
    </div>
  );
}

export default AdminProfileUpdate;
