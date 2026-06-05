import { useEffect, useState } from "react";

import api from "../../api/axios";

import AdminSidebar from "../../components/layout/AdminSidebar";

import "../../styles/admin/dashboard.css";

import { FaUniversity, FaUserPlus, FaEdit, FaTrash } from "react-icons/fa";

function AdminColleges() {
  const [colleges, setColleges] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const collegesPerPage = 5;

  const [showModal, setShowModal] = useState(false);

  const [editingCollege, setEditingCollege] = useState(null);

  const [form, setForm] = useState({
    collegeName: "",
    collegeCode: "",
  });

  // Fetch all colleges
  const fetchColleges = async () => {
    try {
      const response = await api.get("/master/colleges");

      setColleges(response.data.colleges || []);
    } catch (error) {
      console.error("Fetch Colleges Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColleges();
  }, []);

  // Search filter
  const filteredColleges = colleges.filter(
    (college) =>
      (college.collegeName || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      (college.collegeCode || "").toLowerCase().includes(search.toLowerCase()),
  );

  // Pagination
  const indexOfLast = currentPage * collegesPerPage;

  const indexOfFirst = indexOfLast - collegesPerPage;

  const currentColleges = filteredColleges.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredColleges.length / collegesPerPage),
  );

  // Open create modal
  const openAddModal = () => {
    setEditingCollege(null);

    setForm({
      collegeName: "",
      collegeCode: "",
    });

    setShowModal(true);
  };

  // Open edit modal
  const openEditModal = (college) => {
    setEditingCollege(college);

    setForm({
      collegeName: college.collegeName || "",
      collegeCode: college.collegeCode || "",
    });

    setShowModal(true);
  };

  // Create or update college
  const saveCollege = async () => {
    try {
      if (editingCollege) {
        await api.put(`/master/colleges/${editingCollege._id}`, form);
      } else {
        await api.post("/master/colleges", form);
      }

      setShowModal(false);

      fetchColleges();
    } catch (error) {
      console.error("Save College Error:", error);
    }
  };

  // Delete college
  const deleteCollege = async (id) => {
    const confirmed = window.confirm("Delete this college?");

    if (!confirmed) return;

    try {
      await api.delete(`/master/colleges/${id}`);

      fetchColleges();
    } catch (error) {
      console.error("Delete College Error:", error);
    }
  };

  if (loading) {
    return <div className="page-loader">Loading colleges...</div>;
  }

  return (
    <div className="layout">
      <AdminSidebar />

      <main className="content">
        <div className="dashboard">
          <div className="table-header">
            <h2 className="title">
              <FaUniversity />
              Colleges Management
            </h2>

            <button type="button" className="add-btn" onClick={openAddModal}>
              <FaUserPlus />
              Add College
            </button>
          </div>

          <div className="table-tools">
            <input
              type="text"
              placeholder="Search college..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);

                setCurrentPage(1);
              }}
            />
          </div>

          <table className="table">
            <thead>
              <tr>
                <th>College Name</th>
                <th>College Code</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {currentColleges.length === 0 ? (
                <tr>
                  <td
                    colSpan="3"
                    style={{
                      textAlign: "center",
                    }}
                  >
                    No colleges found
                  </td>
                </tr>
              ) : (
                currentColleges.map((college) => (
                  <tr key={college._id}>
                    <td>
                      <div className="cell-flex">
                        <FaUniversity />

                        {college.collegeName}
                      </div>
                    </td>

                    <td>{college.collegeCode}</td>

                    <td className="actions">
                      <button
                        className="edit-btn"
                        onClick={() => openEditModal(college)}
                      >
                        <FaEdit />
                        Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => deleteCollege(college._id)}
                      >
                        <FaTrash />
                        Delete
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

      {showModal && (
        <div className="college-modal">
          <div className="college-modal-content">
            <h3>{editingCollege ? "Edit College" : "Add College"}</h3>

            <input
              placeholder="College Name"
              value={form.collegeName}
              onChange={(e) =>
                setForm({
                  ...form,
                  collegeName: e.target.value,
                })
              }
            />

            <input
              placeholder="College Code"
              value={form.collegeCode}
              onChange={(e) =>
                setForm({
                  ...form,
                  collegeCode: e.target.value,
                })
              }
            />

            <div className="modal-buttons">
              <button className="cancel" onClick={() => setShowModal(false)}>
                Cancel
              </button>

              <button onClick={saveCollege}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminColleges;
