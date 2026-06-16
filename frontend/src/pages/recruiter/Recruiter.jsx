import { useState } from "react";

import api from "../../api/axios";

import Navbar from "../../components/layout/Navbar";

import "../../styles/recruiter/recruiter.css";

import {
  FaCloudUploadAlt,
  FaFileAlt,
  FaUserTie,
  FaEye,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

function Recruiter() {
  const [file, setFile] = useState(null);

  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(false);

  const [dragging, setDragging] = useState(false);

  // Validate uploaded file
  const validateFile = (uploadedFile) => {
    if (!uploadedFile) return;

    const allowedTypes = ["application/pdf", "image/png", "image/jpeg"];

    if (!allowedTypes.includes(uploadedFile.type)) {
      alert("Only PDF, PNG and JPG files are allowed");
      return;
    }

    setFile(uploadedFile);
  };

  // Verify certificate
  const handleVerify = async () => {
    if (!file) {
      alert("Please select a certificate file");
      return;
    }

    const formData = new FormData();

    formData.append("file", file);

    try {
      setLoading(true);

      const response = await api.post("/recruiter/verify-file", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setResult(response.data);
    } catch (error) {
      console.error("Verification Error:", error);

      alert(error.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  // Reset page state
  const handleReset = () => {
    setFile(null);
    setResult(null);
  };

  return (
    <div className="recruiter-page">
      <Navbar />

      <div className="recruiter-container">
        <div className="verify-panel">
          <h2>
            <FaUserTie />
            Recruiter Verification
          </h2>

          <label
            className={`drop-zone ${dragging ? "dragging" : ""}`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();

              setDragging(false);

              validateFile(e.dataTransfer.files?.[0]);
            }}
          >
            <FaCloudUploadAlt className="upload-icon" />

            <p className="drop-title">Drag & Drop Certificate</p>

            <p className="drop-sub">or click to upload</p>

            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={(e) => validateFile(e.target.files?.[0])}
            />
          </label>

          {file && (
            <>
              <div className="file-name">
                <FaFileAlt />
                {file.name}
              </div>

              <div className="file-size">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </div>
            </>
          )}

          <button onClick={handleVerify} disabled={loading}>
            {loading ? "Verifying..." : "Verify Certificate"}
          </button>

          <button className="reset-btn" onClick={handleReset}>
            Reset
          </button>

          {result && (
            <div className="result-box">
              {result.success ? (
                <div className="badge success">
                  <FaCheckCircle />
                  VERIFIED
                </div>
              ) : (
                <div className="badge error">
                  <FaTimesCircle />
                  INVALID CERTIFICATE
                </div>
              )}
              <p>
                <strong>Certificate Hash:</strong>
                {result.certificateHash}
              </p>

              <p>
                <strong>Transaction Hash:</strong>
                {result.transactionHash}
              </p>

              <a
                href={`https://sepolia.etherscan.io/tx/${result.transactionHash}`}
                target="_blank"
                rel="noreferrer"
              >
                View on Etherscan
              </a>

              <p className="hash-text">
                <strong>Hash:</strong> {result.hash}
              </p>
            </div>
          )}
        </div>

        <div className="preview-panel">
          {!result && (
            <div className="empty-preview">
              Upload a certificate to preview verification
            </div>
          )}

          {result?.success && (
            <div className="certificate-card">
              <h3>
                <FaFileAlt />
                Certificate Details
              </h3>

              <div className="detail-row">
                <span>Certificate</span>

                <strong>{result.certificate.name}</strong>
              </div>

              <div className="detail-row">
                <span>Student</span>

                <strong>{result.certificate.studentName}</strong>
              </div>

              <div className="detail-row">
                <span>Email</span>

                <strong>{result.certificate.studentEmail}</strong>
              </div>

              <div className="hash-section">
                <p className="hash-label">
                  <strong>Hash:</strong>
                </p>

                <div className="hash-box">{result.certificate.hash}</div>
              </div>

              <h4>
                <FaEye />
                Certificate Preview
              </h4>

              <div className="pdf-wrapper">
                <iframe src={result.certificate.fileUrl} title="certificate" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Recruiter;
