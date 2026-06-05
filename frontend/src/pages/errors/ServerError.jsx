import { useNavigate } from "react-router-dom";

import { HiOutlineRefresh, HiOutlineHome } from "react-icons/hi";

import "../../styles/errors/ServerError.css";

export default function ServerError() {
  const navigate = useNavigate();

  return (
    <div className="scene500">
      {/* Background */}
      <img
        src="/textures/space-servererro-bg.png"
        alt="Space Background"
        className="bg"
      />

      {/* Ground */}
      <img
        src="/textures/space-servererro-ground.png"
        alt="Planet Surface"
        className="ground"
      />

      {/* Content */}
      <div className="error-content">
        <h1 className="error-code">500</h1>

        <h2 className="title">Oops! Something went wrong in our universe.</h2>

        <p className="desc">
          Our system crashed during the mission. We’re working to fix it.
        </p>

        <div className="buttons">
          <button
            type="button"
            className="btn primary"
            onClick={() => window.location.reload()}
          >
            <HiOutlineRefresh className="icon" />
            Retry
          </button>

          <button
            type="button"
            className="btn outline"
            onClick={() => navigate("/")}
          >
            <HiOutlineHome className="icon" />
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}
