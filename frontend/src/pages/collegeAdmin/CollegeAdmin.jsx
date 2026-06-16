import { useEffect, useRef, useState } from "react";

import api from "../../api/axios";

import { addCertificate } from "../../blockchain/certificate";

import Navbar from "../../components/layout/Navbar";

import {
  FaUniversity,
  FaUserGraduate,
  FaFileAlt,
  FaUpload,
  FaLink,
  FaCloudUploadAlt,
} from "react-icons/fa";

import "../../styles/collegeAdmin/collegeAdmin.css";

function CollegeAdmin() {
  const fileInputRef = useRef(null);

  const [students, setStudents] = useState([]);

  const [certificates, setCertificates] = useState([]);

  const [dragging, setDragging] = useState(false);

  const [selectedStudent, setSelectedStudent] = useState("");

  const [certificateName, setCertificateName] = useState("");

  const [file, setFile] = useState(null);

  const [message, setMessage] = useState("");

  const [uploading, setUploading] = useState(false);

  const [collegeId, setCollegeId] = useState("");

  // Load dashboard data
  useEffect(() => {
    const storedCollegeId = localStorage.getItem("collegeId");

    if (!storedCollegeId) return;

    setCollegeId(storedCollegeId);

    fetchStudents(storedCollegeId);

    fetchCertificates();
  }, []);

  // Fetch college students
  const fetchStudents = async (currentCollegeId) => {
    try {
      const response = await api.get(`/college/students/${currentCollegeId}`);

      setStudents(response.data || []);
    } catch (error) {
      console.error("Fetch Students Error:", error);
    }
  };

  // Fetch uploaded certificates
  const fetchCertificates = async () => {
    try {
      const response = await api.get("/college/certificates");

      setCertificates(response.data || []);
    } catch (error) {
      console.error("Fetch Certificates Error:", error);
    }
  };

  // Handle drag enter
  const handleDragOver = (event) => {
    event.preventDefault();
    setDragging(true);
  };

  // Handle drag leave
  const handleDragLeave = () => {
    setDragging(false);
  };

  // Handle file drop
  const handleDrop = (event) => {
    event.preventDefault();

    setDragging(false);

    const uploadedFile = event.dataTransfer.files[0];

    validateFile(uploadedFile);
  };

  // Validate uploaded PDF
  const validateFile = (uploadedFile) => {
    if (uploadedFile && uploadedFile.type === "application/pdf") {
      setFile(uploadedFile);
    } else {
      alert("Only PDF files are allowed");
    }
  };

  // Upload certificate
  const handleUpload = async () => {
    if (!selectedStudent || !certificateName || !file) {
      alert("Select student, enter certificate name and upload a file");
      return;
    }

    const formData = new FormData();

    formData.append("studentId", selectedStudent);

    formData.append("certificateName", certificateName);

    formData.append("file", file);

    try {
      setUploading(true);

      const response = await api.post("/certificate/issue", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const hash = response.data.certificateHash;

      if (!hash) {
        throw new Error("Certificate hash missing");
      }

      try {
        const txHash = await addCertificate(hash);

        await api.post("/certificate/save", {
          studentId: selectedStudent,
          certificateName,
          certificateHash: hash,
          certificateUrl: response.data.certificateUrl,
          transactionHash: txHash,
          fileName: file.name,
        });

        setMessage("✅ Uploaded Successfully + Blockchain Verified");
      } catch (blockchainError) {
        console.error(blockchainError);

        setMessage("⚠ Blockchain Storage Failed");
      }

      await fetchCertificates();

      setFile(null);

      setCertificateName("");

      setSelectedStudent("");
    } catch (error) {
      console.error("Upload Error:", error);

      setMessage("❌ Upload Failed");
    } finally {
      setUploading(false);
    }
  };

  // Delete certificate
  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this certificate?");

    if (!confirmed) return;

    try {
      await api.delete(`/college/delete-certificate/${id}`);

      fetchCertificates();
    } catch (error) {
      console.error("Delete Error:", error);
    }
  };

  // Open certificate file
  const openCertificate = (certificateUrl) => {
    if (!certificateUrl) return;

    window.open(certificateUrl, "_blank");
  };

  return (
    <div className="college-container">
      {uploading && (
        <div className="loading-overlay">
          <div className="loader-box">
            <div className="loader" />

            <h3>Uploading Certificate...</h3>

            <p>Storing certificate securely on blockchain</p>
          </div>
        </div>
      )}

      <Navbar />

      <div className="college-header">
        <h2>
          <FaUniversity />
          College Admin Dashboard
        </h2>

        {collegeId && <p className="college-id">College ID: {collegeId}</p>}
      </div>

      <div className="college-card">
        <h3 className="Student-h">
          <FaUserGraduate />
          Select Student
        </h3>

        <select
          className="input"
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(e.target.value)}
        >
          <option value="">Choose Student</option>

          {students.map((student) => (
            <option key={student._id} value={student._id}>
              {student.name} ({student.email})
            </option>
          ))}
        </select>

        <h3 className="Student-h">
          <FaFileAlt />
          Certificate Name
        </h3>

        <input
          className="input"
          type="text"
          placeholder="Certificate Name"
          value={certificateName}
          onChange={(e) => setCertificateName(e.target.value)}
        />

        <h3 className="Student-h">
          <FaUpload />
          Upload Certificate
        </h3>

        <div
          className={`drop-zone ${dragging ? "dragging" : ""}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <FaCloudUploadAlt className="upload-icon" />

          <p className="drop-title">Drag & Drop Certificate</p>

          <p className="drop-sub">or click to upload</p>

          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            hidden
            onChange={(e) => validateFile(e.target.files?.[0])}
          />
        </div>

        {file && (
          <div className="file-name">
            <FaFileAlt />

            <div>
              <p>{file.name}</p>

              <small>{(file.size / 1024 / 1024).toFixed(2)} MB</small>
            </div>
          </div>
        )}

        <button
          className="upload-btn"
          onClick={handleUpload}
          disabled={uploading}
        >
          <FaLink />

          {uploading ? "Uploading..." : "Upload to Blockchain"}
        </button>

        {message && <p className="success">{message}</p>}
      </div>

      <h2 className="table-title">Uploaded Certificates</h2>

      <div className="table-wrapper">
        <table className="certificate-table">
          <thead>
            <tr>
              <th>Certificate</th>
              <th>Student</th>
              <th>Hash</th>
              <th>Date</th>
              <th>File</th>
              <th>Action</th>
              <th>Transaction</th>
            </tr>
          </thead>

          <tbody>
            {certificates.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  style={{
                    textAlign: "center",
                  }}
                >
                  <FaFileAlt className="empty-icon" />

                  <p>No certificates uploaded yet</p>
                </td>
              </tr>
            ) : (
              certificates.map((certificate) => (
                <tr key={certificate._id}>
                  <td>{certificate.certificateName}</td>

                  <td>{certificate.studentId?.name}</td>

                  <td className="hash-cell">
                    {certificate.certificateHash?.slice(0, 12)}...
                  </td>

                  <td>
                    {certificate.uploadedAt || certificate.createdAt
                      ? new Date(
                          certificate.uploadedAt || certificate.createdAt,
                        ).toLocaleDateString()
                      : "N/A"}
                  </td>

                  <td>
                    <button
                      className="view-btn"
                      onClick={() =>
                        openCertificate(certificate.certificateUrl)
                      }
                    >
                      <FaFileAlt />
                      View
                    </button>
                  </td>

                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(certificate._id)}
                    >
                      Delete
                    </button>
                  </td>

                  <td>
                    {certificate.transactionHash ? (
                      <>
                        <div>{certificate.transactionHash.slice(0, 10)}...</div>

                        <a
                          href={`https://sepolia.etherscan.io/tx/${certificate.transactionHash}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          View
                        </a>
                      </>
                    ) : (
                      "N/A"
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CollegeAdmin;
