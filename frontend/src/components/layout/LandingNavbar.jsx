import { Link } from "react-router-dom";

import "../../styles/landing/landing.css";
import logo from "../../assets/images/veriqore-logo.png";

function LandingNavbar() {
  return (
    <nav className="landing-navbar">
      {/* Brand logo */}
      <Link to="/" className="logo-container">
        <img src={logo} alt="VeriQore Logo" className="logo-img" />

        <div className="logo-text">
          Veri<span>Q</span>ore
        </div>
      </Link>

      {/* Navigation links */}
      <div className="nav-links">
        <a href="#home">Home</a>

        <a href="#features">Features</a>

        <a href="#how">How It Works</a>

        <a href="#demo">Demo</a>

        <a href="#tech">Tech Stack</a>

        <Link to="/login" className="btn-primary small">
          Log In
        </Link>
      </div>
    </nav>
  );
}

export default LandingNavbar;
