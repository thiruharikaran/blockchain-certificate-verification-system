import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "../../styles/auth/login.css";
import logo from "../../assets/images/veriqore-logo.png";

const LOGIN_ENDPOINTS = {
  MASTER_ADMIN: "/master/login",
  COLLEGE_ADMIN: "/college/login",
  STUDENT: "/student/login",
  RECRUITER: "/recruiter/login",
};

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [role, setRole] = useState("");

  const [message, setMessage] = useState("");

  const goHome = () => {
    navigate("/");
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!role) {
      setMessage("Please select a role");
      return;
    }

    try {
      const endpoint = LOGIN_ENDPOINTS[role];

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Login failed");
        return;
      }

      // Store authentication details
      localStorage.setItem("token", data.token);

      localStorage.setItem("role", data.role);

      localStorage.setItem("name", data.name);

      localStorage.setItem("email", data.email);

      if (data.collegeId) {
        localStorage.setItem("collegeId", data.collegeId);
      }

      setMessage("Login successful");

      // Redirect based on role
      switch (data.role) {
        case "MASTER_ADMIN":
          navigate("/admin");
          break;

        case "COLLEGE_ADMIN":
          navigate("/college-admin");
          break;

        case "STUDENT":
          navigate("/student");
          break;

        case "RECRUITER":
          navigate("/recruiter");
          break;

        default:
          navigate("/login");
      }
    } catch (error) {
      console.error("Login Error:", error);

      setMessage("Unable to connect to server");
    }
  };

  return (
    <div className="login-page">
      <button type="button" className="back-home" onClick={goHome}>
        ← Back to Home
      </button>

      <div className="login-card">
        <img src={logo} alt="VeriQore Logo" className="login-logo" />

        <h1 className="login-title">
          Veri
          <span className="q-letter">Q</span>
          ore
        </h1>

        <p className="login-subtitle">
          Decentralized Academic Certificate Verification
        </p>

        <p className="login-description">
          {role === "STUDENT"
            ? "Access your verified certificates securely"
            : role === "RECRUITER"
              ? "Verify academic certificates instantly"
              : role === "COLLEGE_ADMIN"
                ? "Manage and issue blockchain certificates"
                : role === "MASTER_ADMIN"
                  ? "Manage institutions and platform access"
                  : "Secure role-based access to the VeriQore platform"}
        </p>

        <form onSubmit={handleLogin} className="login-form">
          <label>Role</label>

          <select
            value={role}
            onChange={(event) => setRole(event.target.value)}
          >
            <option value="">Select Role</option>

            <option value="STUDENT">Student</option>

            <option value="RECRUITER">Recruiter</option>

            <option value="COLLEGE_ADMIN">College Admin</option>

            <option value="MASTER_ADMIN">Master Admin</option>
          </select>

          <label>Email</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          <button type="submit">Login</button>

          <p className="login-help">
            Forgot password? Contact your administrator.
          </p>
        </form>

        {message && <p className="login-message">{message}</p>}
      </div>
    </div>
  );
}

export default Login;
