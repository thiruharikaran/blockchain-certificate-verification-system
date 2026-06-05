import { useNavigate, useLocation } from "react-router-dom";

import "../../styles/errors/NotFound.css";

export default function NotFound() {
  const navigate = useNavigate();

  const location = useLocation();

  return (
    <div className="space404-container">
      {/* Background Planet */}
      <img src="/textures/planet.png" alt="Planet" className="planet" />

      {/* UFO */}
      <img src="/textures/ufo.png" alt="UFO" className="ufo" />

      {/* UFO Light */}
      <div className="ufo-light" />

      {/* Floating Rocks */}
      <img
        src="/textures/rock-single.png"
        alt="Asteroid"
        className="rock-single"
      />

      <img
        src="/textures/rock-double.png"
        alt="Asteroid"
        className="rock-double"
      />

      <div className="space404-content">
        <div className="space404-code">
          <span className="four-left">4</span>

          <span className="zero">0</span>

          <span className="four-right">4</span>
        </div>

        <h2 className="space404-title">PAGE NOT FOUND</h2>

        <p className="space404-text">
          Oops! Looks like this page drifted into space.
        </p>

        <p className="space404-url">
          Requested URL: <span>{location.pathname}</span>
        </p>

        <div className="space404-actions">
          <button
            type="button"
            className="space404-button"
            onClick={() => navigate("/")}
          >
            Back to Home
          </button>

          <button
            type="button"
            className="space404-button-secondary"
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
