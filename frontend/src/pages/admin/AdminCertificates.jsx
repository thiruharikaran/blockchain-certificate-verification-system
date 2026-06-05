import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../api/axios";
import Navbar from "../../components/layout/Navbar";
import AdminSidebar from "../../components/layout/AdminSidebar";
import { FaFileAlt, FaEye, FaEdit, FaTrash } from "react-icons/fa";

import "../../styles/admin/certificate.css";

export default function AdminCertificates() {
  const navigate = useNavigate();

  const [certificates, setCertificates] = useState([]);

  const [showModal, setShowModal] = useState(false);

  const [editingCert, setEditingCert] = useState(null);

  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    certificateName: "",
  });

  // Fetch all certificates
  const fetchCertificates = async () => {
    try {
      const response = await api.get("/master/certificates");

      setCertificates(response.data.certificates || []);
    } catch (error) {
      console.error("Certificate Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  // Delete certificate
  const handleDelete = async (certificateId) => {
    const confirmed = window.confirm("Delete this certificate?");

    if (!confirmed) return;

    try {
      await api.delete(`/master/certificates/${certificateId}`);

      fetchCertificates();
    } catch (error) {
      console.error("Delete Certificate Error:", error);
    }
  };

  // Open edit modal
  const handleEdit = (certificate) => {
    setEditingCert(certificate);

    setForm({
      certificateName: certificate.certificateName,
    });

    setShowModal(true);
  };

  // Update certificate
  const handleUpdate = async () => {
    try {
      await api.put(`/master/certificates/${editingCert._id}`, form);

      setShowModal(false);

      setEditingCert(null);

      fetchCertificates();
    } catch (error) {
      console.error("Update Certificate Error:", error);
    }
  };

  // Open certificate file
  const handleView = (fileName) => {
    const fileUrl = `${
      import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"
    }/uploads/${fileName}`;

    window.open(fileUrl, "_blank");
  };

  if (loading) {
    return <div className="page-loader">Loading certificates...</div>;
  }

  return (
    <div className="certificate-page">
      <div className="page-header">
        <button
          type="button"
          className="back-btn"
          onClick={() => navigate("/admin")}
        >
          ← Dashboard
        </button>

        <h2>
          <FaFileAlt /> Certificates
        </h2>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Student</th>
            <th>Email</th>
            <th>Hash</th>
            <th>Date</th>
            <th>Actions</th>
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
                No certificates uploaded
              </td>
            </tr>
          ) : (
            certificates.map((certificate) => (
              <tr key={certificate._id}>
                <td>
                  <div className="cell-flex">
                    <FaFileAlt />
                    <span>{certificate.certificateName}</span>
                  </div>
                </td>

                <td>{certificate.studentId?.name}</td>

                <td>{certificate.studentId?.email}</td>

                <td
                  className="hash-cell"
                  title="Click to copy"
                  onClick={() =>
                    navigator.clipboard.writeText(certificate.certificateHash)
                  }
                >
                  {certificate.certificateHash
                    ? `${certificate.certificateHash.slice(
                        0,
                        12,
                      )}...${certificate.certificateHash.slice(-6)}`
                    : "N/A"}
                </td>

                <td>
                  {certificate.uploadedAt
                    ? new Date(certificate.uploadedAt).toLocaleString()
                    : "N/A"}
                </td>

                <td className="actions">
                  <button
                    className="view-btn"
                    onClick={() => handleView(certificate.fileName)}
                  >
                    <FaEye /> View
                  </button>

                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(certificate)}
                  >
                    <FaEdit /> Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(certificate._id)}
                  >
                    <FaTrash /> Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit Certificate</h3>

            <input
              type="text"
              value={form.certificateName}
              onChange={(event) =>
                setForm({
                  certificateName: event.target.value,
                })
              }
            />

            <div className="modal-actions">
              <button onClick={handleUpdate}>Save</button>

              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
