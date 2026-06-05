import { useState } from "react";
import { useNavigate } from "react-router-dom";

import logo from "../../assets/images/veriqore-logo.png";
import "../../styles/layout/navbar.css";

function Navbar() {
  const navigate = useNavigate();

  // Retrieve authenticated user details
  const name = localStorage.getItem("name") || "Master Admin";

  const email = localStorage.getItem("email") || "admin@certverify.com";

  const role = localStorage.getItem("role") || "MASTER_ADMIN";

  const [showProfile, setShowProfile] = useState(false);

  const firstLetter = name.charAt(0).toUpperCase();

  // Clear session and redirect to login
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <header className="navbar">
      {/* Application branding */}
      <div className="logo">
        <img src={logo} alt="VeriQore Logo" className="logo-img" />

        <span>
          Veri
          <span className="logo-q">Q</span>
          ore
        </span>
      </div>

      {/* User profile section */}
      <div className="profile">
        <button
          type="button"
          className="avatar"
          onClick={() => setShowProfile(true)}
        >
          {firstLetter}
        </button>

        <span className="name">{name}</span>

        <button type="button" className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Profile modal */}
      {showProfile && (
        <div className="profile-modal">
          <div className="profile-modal-content">
            <h3>Profile</h3>

            <div className="profile-card">
              <div className="avatar-large">{firstLetter}</div>

              <div className="profile-info">
                <p>
                  <strong>Name:</strong> {name}
                </p>

                <p>
                  <strong>Email:</strong> {email}
                </p>

                <p>
                  <strong>Role:</strong> {role}
                </p>
              </div>

              <button
                type="button"
                className="close-btn"
                onClick={() => setShowProfile(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
