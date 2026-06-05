import { FaCertificate } from "react-icons/fa";

import "../../styles/layout/sidebar.css";

function Sidebar({ certificates, selectedCert, setSelectedCert }) {
  return (
    <aside className="sidebar">
      {/* Certificate list header */}
      <h3>
        <FaCertificate />
        <span>My Certificates</span>
      </h3>

      {/* Empty state */}
      {certificates.length === 0 ? (
        <p>No certificates available</p>
      ) : (
        certificates.map((certificate) => (
          <button
            key={certificate._id}
            type="button"
            className={`cert-item ${
              selectedCert?._id === certificate._id ? "active" : ""
            }`}
            onClick={() => setSelectedCert(certificate)}
          >
            <FaCertificate className="cert-icon" />

            <span>{certificate.certificateName}</span>
          </button>
        ))
      )}
    </aside>
  );
}

export default Sidebar;
