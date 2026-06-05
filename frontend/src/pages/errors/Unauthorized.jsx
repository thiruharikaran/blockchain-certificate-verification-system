import { useNavigate, useLocation } from "react-router-dom";

import {
  FaLock,
  FaExclamationTriangle,
  FaHeart,
  FaHome,
  FaLightbulb,
} from "react-icons/fa";

import { BiSolidLock } from "react-icons/bi";
import { FaXmark } from "react-icons/fa6";

import "../../styles/errors/Unauthorized.css";

export default function Unauthorized() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="space401-container">
      {/* Background */}
      <img
        src="/textures/space-bg.png"
        alt="Space Background"
        className="space-bg"
      />

      {/* Spaceship */}
      <img
        src="/textures/spaceship-scene.png"
        alt="Spaceship Scene"
        className="spaceship-scene"
      />

      {/* Hologram */}
      <img
        src="/textures/hologram.png"
        alt="Hologram Display"
        className="hologram"
      />

      <div className="holo-beam" />

      {/* Hologram Lock */}
      <div className="holo-lock">
        <BiSolidLock size={50} />
      </div>

      {/* Spaceship Title */}
      <div className="ship-title">
        MY SPACESHIP
        <div className="ship-title-span">MISSION HUB</div>
      </div>

      {/* Door Warning */}
      <div className="door-warning">
        <div className="door-panel" />

        <div className="door-warning-lock">
          <BiSolidLock size={80} />
        </div>

        <div className="door-warning-text-access">ACCESS</div>

        <div className="door-warning-text-required">REQUIRED</div>

        <div className="door-warning-text-login-first">LOGIN FIRST</div>

        <FaExclamationTriangle className="door-warning-symbol" size={38} />
      </div>

      {/* Robot Screen */}
      <div className="robot-panel" />

      <div className="robot-screen">
        LOGIN TO
        <br />
        CONTINUE
      </div>

      {/* Robot Heart */}
      <div className="robot-heart">
        <FaHeart size={18} />
      </div>

      {/* Access Card */}
      <div className="access-card">
        ACCESS
        <br />
        CARD
        <div>
          <FaXmark className="access-x" size={30} />
        </div>
      </div>

      {/* Main Content */}
      <div className="space401-content">
        <h1 className="space401-code">401</h1>

        <h2 className="space401-title">UNAUTHORIZED ACCESS</h2>

        <p className="space401-text">
          You need to login to access your spaceship.
        </p>

        <p className="space401-url">Requested URL: {location.pathname}</p>

        <div className="space401-buttons">
          <button
            type="button"
            className="login-btn"
            onClick={() => navigate("/login")}
          >
            <FaLock size={16} />
            Login
          </button>

          <button
            type="button"
            className="home-btn"
            onClick={() => navigate("/")}
          >
            <FaHome size={16} />
            Back to Home
          </button>
        </div>

        <div className="space401-indicator">
          <FaLightbulb />
          Please sign in to continue your journey.
        </div>
      </div>

      <div className="suitcase-text">
        <b>MY JOURNEY</b>
      </div>
    </div>
  );
}
