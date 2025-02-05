import "./login.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink, useNavigate } from "react-router-dom";

import {
  faUser,
  faLock,
  faEyeSlash,
  faEye,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import Loader from "../../components/Loader";
import { toast } from "@/hooks/use-toast";

function Login() {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [passVis, setPassvis] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function submit() {
    const loginJson = {
      email: email,
      password: password,
    };
    try {
      setLoading(true);
      const rawData = await fetch(BASE_URL + "login", {
        method: "Post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginJson),
      });
      if (!rawData.ok) {
        throw new Error("Login Failed!!!");
      }
      const data = await rawData.json();

      const { access_token, role, user_id } = data;
      if (access_token) {
        // alert("Login successful");
        toast({
          title: "Login successful",
          description: "You have logged in successfully",
        });
        localStorage.setItem("token", access_token);
        console.log("role:", role);

        if (user_id) {
          localStorage.setItem("user_id", user_id);
          console.log("User ID stored:", user_id);
        } else {
          console.warn("User ID not found in response");
        }
      } else {
        // window.alert("Bad credentials");
        toast({
          title: "Bad credentials",
          description: "credentials don't match",
        });
        console.warn("Access token not found in response");
      }

      // Redirect based on admin status
      if (role === "admin") {
        navigate("/adminDashboard");
      } else if (role === "doctor") {
        navigate("/doctorDashboard");
      } else {
        navigate("/home");
      }

      // window.location.reload();
      // navigate("/");
      // window.location.reload();
    } catch (error) {
      // window.alert("Bad credentials");
      toast({
        title: "Error logging in ",
        variant: "destructive",
      });

      console.error("error fetching data", error);
    } finally {
      setLoading(false);
    }
  }
  function showpw() {
    setPassvis(!passVis);
  }
  console.log(password);
  if (loading) {
    return <Loader />;
  }
  return (
    <div className="loginPageWrapper">
      <div className="loginPage">
        <div>
          <h2>Login</h2>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <div className="namePw">
            <label htmlFor="userName">Email </label>
            <div className="userInput">
              <FontAwesomeIcon icon={faEnvelope} />
              <input
                type="text"
                htmlFor="Username"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                id="userName"
                placeholder="Type your email"
              />
            </div>
            <hr />
          </div>
          <div className="namePw">
            <label htmlFor="password">Password </label>
            <div className="userInput">
              <FontAwesomeIcon icon={faLock} />
              <input
                type={passVis ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                htmlFor="password"
                id="password"
                placeholder="Type your password"
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
          <button className="loginBtn" type="submit">
            Log in
          </button>
        </form>

        <NavLink to={"/signin"}>
          <div className="createAc" style={{ margin: "10px", color: "black" }}>
            Create an account
          </div>
        </NavLink>
      </div>
    </div>
  );
}

export default Login;
