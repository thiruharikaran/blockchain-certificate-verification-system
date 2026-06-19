import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../api/axios";

import Navbar from "../../components/layout/Navbar";
import Sidebar from "../../components/layout/Sidebar";

import "../../styles/student/studentDashboard.css";

import { FaFileAlt, FaFingerprint, FaCheckCircle } from "react-icons/fa";

function StudentDashboard() {
  const navigate = useNavigate();

  const [certificates, setCertificates] = useState([]);

  const [selectedCert, setSelectedCert] = useState(null);

  const [verifications, setVerifications] = useState([]);

  const [loading, setLoading] = useState(true);

  const student = {
    name: localStorage.getItem("name") || "Student",
  };

  // Fetch student certificates
  const fetchCertificates = async () => {
    try {
      const response = await api.get("/student/certificates");

      const certs = response.data.certificates || [];

      setCertificates(certs);

      if (certs.length > 0) {
        setSelectedCert(certs[0]);
      }
    } catch (error) {
      console.error("Fetch Certificates Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch verification history
  const fetchVerifications = async (certificateId) => {
    try {
      const response = await api.get(
        `/student/certificate-verifications/${certificateId}`,
      );

      setVerifications(response.data.verifications || []);
    } catch (error) {
      console.error("Fetch Verifications Error:", error);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  useEffect(() => {
    if (!selectedCert) return;

    fetchVerifications(selectedCert._id);
  }, [selectedCert]);

  // Logout user
  const logout = () => {
    localStorage.clear();

    navigate("/");
  };

  // Build PDF preview URL
  const pdfUrl = selectedCert?.certificateUrl || "";

  if (loading) {
    return <div className="page-loader">Loading certificates...</div>;
  }

  return (
    <div className="dashboard">
      <Navbar student={student} logout={logout} />

      <div className="dashboard-body">
        <Sidebar
          certificates={certificates}
          selectedCert={selectedCert}
          setSelectedCert={setSelectedCert}
        />

        <div className="content">
          {!selectedCert ? (
            <div className="empty">
              <h2>No Certificates</h2>
            </div>
          ) : (
            <div className="certificate-card">
              <h2 className="certificate-title">
                <FaFileAlt />
                Certificate Details
              </h2>

              <p>
                <strong>Name:</strong> {selectedCert.certificateName}
              </p>

              <p className="hash-p">
                <FaFingerprint />
                Hash
              </p>

              <div className="hash">{selectedCert.certificateHash}</div>

              <div className="pdf-viewer">
                <iframe src={pdfUrl} title="certificate" className="pdf" />
              </div>

              <h3 className="verification-title">
                <FaCheckCircle />
                Verification Activity ({verifications.length})
              </h3>

              {verifications.length === 0 ? (
                <p>No recruiter has verified this certificate yet.</p>
              ) : (
                verifications.map((verification) => (
                  <div key={verification._id} className="verification-item">
                    <p>
                      <strong>Verified By:</strong>{" "}
                      {verification.recruiterId?.name || "Unknown"}
                    </p>

                    <p className="verificat-Company">
                      <strong>Company:</strong>{" "}
                      {verification.recruiterCompany || "N/A"}
                    </p>

                    <p className="verificat-p">
                      <strong>Status:</strong>

                      <span
                        className={
                          verification.result === "VALID"
                            ? "status-valid"
                            : "status-invalid"
                        }
                      >
                        {verification.result}
                      </span>
                    </p>

                    <p className="verificat-Date">
                      <strong>Date:</strong>{" "}
                      {new Date(verification.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
