import { useNavigate, useLocation } from "react-router-dom";

import { FiAlertTriangle, FiLock } from "react-icons/fi";

import { HiOutlineHome } from "react-icons/hi2";

import { HiOutlineChevronRight } from "react-icons/hi";

import "../../styles/errors/Forbidden.css";

export default function Forbidden() {
  const navigate = useNavigate();

  const location = useLocation();

  return (
    <div className="scene403">
      {/* Background */}
      <img
        src="/textures/space-bg-forbidden.png"
        alt="Space Background"
        className="bg-space"
      />

      {/* Portal */}
      <img src="/textures/portal.png" alt="Portal" className="portal" />

      {/* Radar */}
      <div className="radar">
        <img src="/textures/radar.png" alt="Radar" />

        <div className="radar-line"></div>
      </div>

      {/* Center Card */}
      <div className="circle-card">
        <p className="circle-title">FORBIDDEN ACCESS</p>

        <h1 className="circle-code">403</h1>
      </div>

      {/* Drones */}
      <img
        src="/textures/drone-1.png"
        alt="Security Drone"
        className="drone drone-left"
      />

      <img
        src="/textures/drone-2.png"
        alt="Security Drone"
        className="drone drone-right"
      />

      {/* Ship */}
      <img src="/textures/ship.png" alt="Spaceship" className="ship" />

      {/* Rocks */}
      <img src="/textures/rock-left.png" alt="Asteroid" className="rock-left" />

      <img
        src="/textures/rock-left.png"
        alt="Asteroid"
        className="rock-left-2"
      />

      <img
        src="/textures/rock-left.png"
        alt="Asteroid"
        className="rock-left-3"
      />

      <img
        src="/textures/rock-right.png"
        alt="Asteroid"
        className="rock-right"
      />

      <div className="ui-left">
        {/* Main Panel */}
        <div className="panel">
          <h1 className="code">403</h1>

          <h2>FORBIDDEN ACCESS</h2>

          <p className="auth">Authentication Required</p>

          <p className="url">
            Requested URL: <span>{location.pathname}</span>
          </p>

          <div className="buttons">
            <button type="button" className="btn" onClick={() => navigate(-1)}>
              <FiLock className="btn-icon" />
              Back
            </button>

            <button
              type="button"
              className="btn outline"
              onClick={() => navigate("/")}
            >
              <HiOutlineHome className="btn-icon" />
              Go Home
            </button>
          </div>
        </div>

        {/* Status Box */}
        <div className="status-box">
          <h3>ACCESS STATUS</h3>

          <hr />

          <p>
            <HiOutlineChevronRight className="OutlineChevronRight" />
            AUTH LEVEL :<span className="danger">LOW</span>
          </p>

          <p>
            <HiOutlineChevronRight className="OutlineChevronRight" />
            CLEARANCE :<span className="danger">DENIED</span>
          </p>

          <p>
            <HiOutlineChevronRight className="OutlineChevronRight" />
            GATE : STATION 077
          </p>

          <br />

          {/* Security Alert */}
          <div className="alert-box">
            <FiAlertTriangle className="alert-icon" />

            <div>
              <h3>SECURITY ALERT</h3>

              <span>CLEARANCE REQUIRED</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
