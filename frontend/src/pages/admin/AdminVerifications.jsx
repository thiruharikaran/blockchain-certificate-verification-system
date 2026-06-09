import { useEffect, useState } from "react";

import api from "../../api/axios";

import AdminSidebar from "../../components/layout/AdminSidebar";

import { FaCheckCircle, FaFileAlt } from "react-icons/fa";

import "../../styles/admin/dashboard.css";

export default function AdminVerifications() {
  const [verifications, setVerifications] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const perPage = 5;

  // Fetch verification history
  const fetchVerifications = async () => {
    try {
      const response = await api.get("/master/verifications");

      setVerifications(response.data.verifications || []);
    } catch (error) {
      console.error("Fetch Verifications Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVerifications();
  }, []);

  // Search filtering
  const filtered = verifications.filter(
    (verification) =>
      (verification.certificateName || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      (verification.studentId?.name || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      (verification.studentId?.email || "")
        .toLowerCase()
        .includes(search.toLowerCase()),
  );

  // Pagination
  const indexOfLast = currentPage * perPage;

  const indexOfFirst = indexOfLast - perPage;

  const currentData = filtered.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));

  // Open certificate file
  const handleView = (certificateUrl) => {
    if (!certificateUrl) return;

    window.open(certificateUrl, "_blank");
  };

  if (loading) {
    return <div className="page-loader">Loading verifications...</div>;
  }

  return (
    <div className="layout">
      <AdminSidebar />

      <main className="content">
        <div className="dashboard">
          <div className="table-header">
            <h2 className="title">
              <FaCheckCircle />
              Verification History
            </h2>
          </div>

          <div className="table-tools">
            <input
              type="text"
              placeholder="Search verification..."
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);

                setCurrentPage(1);
              }}
            />
          </div>

          <table className="table">
            <thead>
              <tr>
                <th>Certificate</th>
                <th>Student</th>
                <th>Email</th>
                <th>Hash</th>
                <th>Status</th>
                <th>Date</th>
                <th>Verified By</th>
                <th>View</th>
              </tr>
            </thead>

            <tbody>
              {currentData.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    style={{
                      textAlign: "center",
                    }}
                  >
                    No verification records found
                  </td>
                </tr>
              ) : (
                currentData.map((verification) => (
                  <tr key={verification._id}>
                    <td>
                      <div className="cell-flex">
                        <FaFileAlt />

                        {verification.certificateName}
                      </div>
                    </td>

                    <td>{verification.studentId?.name || "N/A"}</td>

                    <td>{verification.studentId?.email || "N/A"}</td>

                    <td className="hash-cell">
                      {verification.certificateHash
                        ? `${verification.certificateHash.slice(
                            0,
                            12,
                          )}...${verification.certificateHash.slice(-6)}`
                        : "N/A"}
                    </td>

                    <td>
                      <span
                        className={
                          verification.result === "VALID"
                            ? "status-valid"
                            : "status-invalid"
                        }
                      >
                        {verification.result}
                      </span>
                    </td>

                    <td>
                      {verification.createdAt
                        ? new Date(verification.createdAt).toLocaleString()
                        : "N/A"}
                    </td>

                    <td>{verification.recruiterId?.name || "-"}</td>

                    <td>
                      <button
                        className="view-btn"
                        onClick={() =>
                          handleView(verification.certificateId?.certificateUrl)
                        }
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="pagination">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Prev
            </button>

            <span>
              Page {currentPage} of {totalPages}
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
