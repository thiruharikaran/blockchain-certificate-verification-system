import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import LandingNavbar from "../../components/layout/LandingNavbar";

import Globe from "../../components/animations/Globe";
import BackgroundStars from "../../components/animations/BackgroundStars";
import BackgroundCloud from "../../components/animations/BackgroundCloud";
import FloatingCube from "../../components/animations/FloatingCube";

import {
  FaLock,
  FaCloud,
  FaShieldAlt,
  FaUniversity,
  FaGraduationCap,
  FaBolt,
  FaGlobe,
  FaLink,
  FaFileAlt,
  FaSearch,
} from "react-icons/fa";

import { SiEthereum } from "react-icons/si";
import "../../styles/landing/landing.css";

function Landing() {
  return (
    <div className="landing">
      <BackgroundStars />
      <BackgroundCloud />

      <LandingNavbar />

      <section className="hero" id="home">
        <div className="hero-left">
          <h1>
            Blockchain Certificate <br />
            <span>Verification</span> <br />
            System
          </h1>

          <p>
            Secure academic certificate verification using SHA-256 hashing,
            Ethereum smart contracts, and cloud storage to prevent fraud and
            ensure authenticity.
          </p>
          <p className="hero-tech">
            Ethereum Sepolia • Smart Contracts • Cloudinary • MongoDB Atlas
          </p>

          <div className="hero-buttons">
            <Link to="/login">
              <button className="btn-primary">Live Demo</button>
            </Link>

            <a href="#how">
              <button className="btn-secondary">How It Works</button>
            </a>

            <a
              href="https://github.com/thiruharikaran/blockchain-certificate-verification-system"
              target="_blank"
              rel="noreferrer"
            >
              <button className="btn-secondary">GitHub</button>
            </a>
          </div>
        </div>

        <div className="hero-right">
          <div className="fog"></div>
          <Globe />
        </div>

        <FloatingCube />
      </section>

      <motion.section
        className="highlights-wrapper"
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="section-heading">
          <h2>Project Highlights</h2>

          <p>Core technologies and security features powering VeriQore.</p>
        </div>

        <div className="highlights">
          <div className="highlight-card">
            <FaLock className="feature-icon" />
            <h3>SHA-256 Hashing</h3>
            <p>Tamper-proof certificate integrity.</p>
          </div>

          <div className="highlight-card">
            <SiEthereum className="feature-icon" />
            <h3>Ethereum Smart Contracts</h3>
            <p>Blockchain-based certificate verification.</p>
          </div>

          <div className="highlight-card">
            <FaCloud className="feature-icon" />
            <h3>Cloudinary Storage</h3>
            <p>
              Secure PDF certificate storage and delivery using Cloudinary cloud
              infrastructure.
            </p>
          </div>

          <div className="highlight-card">
            <FaShieldAlt className="feature-icon" />
            <h3>Role-Based Authentication</h3>
            <p>
              JWT-powered access control for College Admins, Students, and
              Recruiters.
            </p>
          </div>
        </div>
      </motion.section>

      <motion.section
        id="features"
        className="features"
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2>Platform Features</h2>

        <p className="features-sub">
          A secure blockchain-powered system for issuing and verifying academic
          certificates.
        </p>

        <div className="features-grid">
          <div className="feature-card">
            <span>
              <FaLock className="feature-icon" />
            </span>
            <h3>Tamper-Proof Certificates</h3>
            <p>
              Certificate hashes stored on blockchain prevent alteration or
              fraud.
            </p>
          </div>

          <div className="feature-card">
            <span>
              <FaBolt className="feature-icon" />
            </span>
            <h3>Instant Verification</h3>
            <p>
              Recruiters can verify certificates instantly using blockchain
              records.
            </p>
          </div>

          <div className="feature-card">
            <span>
              <FaUniversity className="feature-icon" />
            </span>
            <h3>College Certificate Issuing</h3>
            <p>
              Institutions can upload and issue blockchain-secured certificates.
            </p>
          </div>

          <div className="feature-card">
            <span>
              <FaGraduationCap className="feature-icon" />
            </span>
            <h3>Student Dashboard</h3>
            <p>
              Students can view and manage their verified certificates securely.
            </p>
          </div>

          <div className="feature-card">
            <span>
              <SiEthereum className="feature-icon" />
            </span>
            <h3>Blockchain Storage</h3>
            <p>
              Certificate hashes are permanently stored on decentralized
              blockchain.
            </p>
          </div>

          <div className="feature-card">
            <span>
              <FaShieldAlt className="feature-icon" />
            </span>
            <h3>Secure Authentication</h3>
            <p>
              JWT authentication and role-based access control protect user
              data.
            </p>
          </div>

          <div className="feature-card">
            <span>
              <FaCloud className="feature-icon" />
            </span>
            <h3>Cloud Certificate Storage</h3>
            <p>
              Certificates are securely stored and delivered using Cloudinary
              cloud infrastructure.
            </p>
          </div>

          <div className="feature-card">
            <span>
              <FaLink className="feature-icon" />
            </span>
            <h3>Smart Contract Verification</h3>
            <p>
              Certificate authenticity is validated through Ethereum smart
              contracts deployed on the Sepolia network.
            </p>
          </div>

          <div className="feature-card">
            <span>
              <FaFileAlt className="feature-icon" />
            </span>
            <h3>Verification History</h3>
            <p>
              Students can track recruiter verification activities and
              certificate validation records.
            </p>
          </div>
        </div>
      </motion.section>

      <motion.section
        id="how"
        className="how-it-works"
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2>How It Works</h2>

        <p className="how-sub">
          A simple and secure blockchain verification process.
        </p>

        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Upload & Store Certificate</h3>
            <p>
              College administrators upload a student certificate to the system.
            </p>
          </div>

          <div className="step">
            <div className="step-number">2</div>
            <h3>Store Hash on Blockchain</h3>
            <p>
              The system generates a SHA-256 hash and stores it securely on the
              blockchain.
            </p>
          </div>

          <div className="step">
            <div className="step-number">3</div>
            <h3>Verify Certificate</h3>
            <p>
              Recruiters upload a certificate and the system validates the
              SHA-256 hash against the blockchain record.
            </p>
          </div>
        </div>
      </motion.section>

      <motion.section
        id="demo"
        className="demo-section"
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2>Try Demo Accounts</h2>

        <p className="demo-sub">Explore VeriQore using public demo accounts.</p>

        <div className="demo-grid">
          <div className="demo-card">
            <span>
              <FaUniversity className="feature-icon" />
            </span>

            <h3>College Admin</h3>

            <p>Email: demo_college@veriqore.com</p>

            <p>Password: demo123</p>

            <small>Upload and issue blockchain-secured certificates.</small>
          </div>

          <div className="demo-card">
            <span>
              <FaGraduationCap className="feature-icon" />
            </span>

            <h3>Student</h3>

            <p>Email: demo_student@veriqore.com</p>

            <p>Password: demo123</p>

            <small>View issued certificates and verification status.</small>
          </div>

          <div className="demo-card">
            <span>
              <FaSearch className="feature-icon" />
            </span>

            <h3>Recruiter</h3>

            <p>Email: demo_recruiter@veriqore.com</p>

            <p>Password: demo123</p>

            <small>
              Verify certificates instantly using blockchain records.
            </small>
          </div>
        </div>
      </motion.section>

      <motion.section
        id="demo-video"
        className="demo-video"
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2>Platform Demo</h2>

        <p className="video-sub">
          Watch how VeriQore issues and verifies blockchain-secured
          certificates.
        </p>

        <div className="video-wrapper">
          <iframe
            src="https://www.youtube.com/embed/VIDEO_ID"
            title="VeriQore Demo"
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </div>
      </motion.section>

      <motion.section
        id="tech"
        className="tech-stack"
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2>Technology Stack</h2>

        <p className="tech-sub">Modern technologies used to build VeriQore.</p>

        <div className="stack-grid">
          <div>React.js</div>
          <div>Node.js</div>
          <div>Express.js</div>
          <div>MongoDB Atlas</div>
          <div>Cloudinary</div>
          <div>Ethereum Sepolia</div>
          <div>Solidity</div>
          <div>JWT Authentication</div>
          <div>SHA-256 Hashing</div>
          <div>Web3.js</div>
          <div>Vercel</div>
          <div>Render</div>
        </div>
      </motion.section>

      <motion.section
        className="cta"
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="cta-grid"></div>

        <h2>Ready to Experience Blockchain Verification?</h2>

        <p>
          Secure academic certificate verification powered by blockchain.
          Prevent fraud and ensure authenticity with VeriQore.
        </p>

        <div className="cta-buttons">
          <Link to="/login">
            <button className="btn-primary">Launch Demo</button>
          </Link>
          <a href="#demo-video">
            <button className="btn-secondary">Watch Platform Tour</button>
          </a>
        </div>
      </motion.section>

      <footer className="footer">
        <div className="footer-grid">
          <div>
            <h3>VeriQore</h3>

            <p>
              Blockchain-powered certificate verification platform designed to
              prevent academic fraud.
            </p>
          </div>

          <div>
            <h4>Navigation</h4>
            <a
              href="https://github.com/thiruharikaran/blockchain-certificate-verification-system"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>

            <a href="#">Home</a>

            <a href="#features">Features</a>

            <a href="#demo">Demo</a>
          </div>

          <div>
            <h4>Technology</h4>

            <p>React.js</p>
            <p>Solidity</p>
            <p>MongoDB Atlas</p>
          </div>
        </div>

        <div className="footer-bottom">
          © 2026 VeriQore • Blockchain Certificate Verification System
        </div>
      </footer>
    </div>
  );
}

export default Landing;
