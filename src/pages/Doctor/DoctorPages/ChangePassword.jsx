import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
function ChangePassword() {
  const [passVis, setPassvis] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");

  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [data, setData] = useState();

  async function changePassword() {
    const token = localStorage.getItem("token");
    const passwordJson = {
      current_password: currentPassword,
      new_password: newPassword,
      new_password_confirmation: confirmPassword,
    };

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/change-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(passwordJson),
        }
      );
      const data = await response.json();

      if (!response.ok) {
        // Match the error and details from the response
        let errorMessage = data.error || "An error occurred.";
        if (data.details && Array.isArray(data.details)) {
          errorMessage += "\n" + data.details.join("\n");
        }
        alert(errorMessage);
        return;
      }

      alert(data.message);
      setData(data);
      // console.log(data.current_password);
      // alert("Password updated successfully!");
      // Populate state with existing user data
    } catch (error) {
      console.log(error);
    }
  }

  function showpw() {
    setPassvis(!passVis);
  }

  return (
    <div className="ChangePasswordContainer">
      <form
        className="changePasswordForm"
        onSubmit={(e) => {
          e.preventDefault(), changePassword();
        }}
      >
        <h3>Change Password</h3>
        <div className="form-field">
          <label htmlFor="password">Current Password</label>
          <div className="input-group">
            <FontAwesomeIcon icon={faLock} className="input-icon" />
            <input
              type={passVis ? "text" : "password"}
              value={currentPassword || ""}
              onChange={(e) => setCurrentPassword(e.target.value)}
              id="password"
              placeholder="Old password"
              className="input-field"
            />
            <button
              onClick={showpw}
              type="button"
              className="show-password-btn"
            >
              {passVis ? (
                <FontAwesomeIcon icon={faEye} />
              ) : (
                <FontAwesomeIcon icon={faEyeSlash} />
              )}
            </button>
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="newpassword">New Password</label>
          <div className="input-group">
            <FontAwesomeIcon icon={faLock} className="input-icon" />
            <input
              type={passVis ? "text" : "password"}
              value={newPassword || ""}
              onChange={(e) => setNewPassword(e.target.value)}
              id="newpassword"
              placeholder="New password"
              className="input-field"
            />
            <button
              onClick={showpw}
              type="button"
              className="show-password-btn"
            >
              {passVis ? (
                <FontAwesomeIcon icon={faEye} />
              ) : (
                <FontAwesomeIcon icon={faEyeSlash} />
              )}
            </button>
          </div>
        </div>
        <div className="form-field">
          <label htmlFor="password_confirmation">Confirm Password</label>
          <div className="input-group">
            <FontAwesomeIcon icon={faLock} className="input-icon" />
            <input
              type={passVis ? "text" : "password"}
              value={confirmPassword || ""}
              onChange={(e) => setConfirmPassword(e.target.value)}
              id="password_confirmation"
              placeholder="Confirm password"
              className="input-field"
            />
            <button
              onClick={showpw}
              type="button"
              className="show-password-btn"
            >
              {passVis ? (
                <FontAwesomeIcon icon={faEye} />
              ) : (
                <FontAwesomeIcon icon={faEyeSlash} />
              )}
            </button>
          </div>
        </div>
        <button className="updateButton" type="submit">
          Update
        </button>
      </form>
    </div>
  );
}

export default ChangePassword;
