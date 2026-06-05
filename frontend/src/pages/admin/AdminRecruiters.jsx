import { useEffect, useState } from "react";

import api from "../../api/axios";

import AdminSidebar from "../../components/layout/AdminSidebar";

import { FaUserTie, FaUserPlus, FaUser, FaEdit, FaTrash } from "react-icons/fa";

import "../../styles/admin/dashboard.css";

export default function AdminRecruiters() {
  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const recruitersPerPage = 5;

  const [recruiters, setRecruiters] = useState([]);

  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);

  const [editingRecruiter, setEditingRecruiter] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    companyName: "",
    password: "",
  });

  // Fetch recruiters
  const fetchRecruiters = async () => {
    try {
      const response = await api.get("/master/recruiters");

      setRecruiters(response.data.recruiters || []);
    } catch (error) {
      console.error("Fetch Recruiters Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecruiters();
  }, []);

  // Search filtering
  const filteredRecruiters = recruiters.filter((recruiter) =>
    [recruiter.name, recruiter.email, recruiter.companyName]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  // Pagination
  const indexOfLast = currentPage * recruitersPerPage;

  const indexOfFirst = indexOfLast - recruitersPerPage;

  const currentRecruiters = filteredRecruiters.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredRecruiters.length / recruitersPerPage),
  );

  // Handle form changes
  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  // Create or update recruiter
  const handleSubmit = async () => {
    try {
      if (editingRecruiter) {
        await api.put(`/master/recruiters/${editingRecruiter._id}`, form);
      } else {
        await api.post("/master/recruiters", form);
      }

      setShowModal(false);

      setEditingRecruiter(null);

      setForm({
        name: "",
        email: "",
        companyName: "",
        password: "",
      });

      fetchRecruiters();
    } catch (error) {
      console.error("Recruiter Save Error:", error);

      alert(error.response?.data?.message || "Operation failed");
    }
  };

  // Delete recruiter
  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete recruiter?");

    if (!confirmed) return;

    try {
      await api.delete(`/master/recruiters/${id}`);

      fetchRecruiters();
    } catch (error) {
      console.error("Delete Recruiter Error:", error);
    }
  };

  // Open edit modal
  const handleEdit = (recruiter) => {
    setEditingRecruiter(recruiter);

    setForm({
      name: recruiter.name || "",
      email: recruiter.email || "",
      companyName: recruiter.companyName || "",
      password: "",
    });

    setShowModal(true);
  };

  // Open create modal
  const openAddModal = () => {
    setEditingRecruiter(null);

    setForm({
      name: "",
      email: "",
      companyName: "",
      password: "",
    });

    setShowModal(true);
  };

  if (loading) {
    return <div className="page-loader">Loading recruiters...</div>;
  }

  return (
    <div className="layout">
      <AdminSidebar />

      <main className="content">
        <div className="dashboard">
          <div className="table-header">
            <h2 className="title">
              <FaUserTie />
              Recruiters
            </h2>

            <button type="button" className="add-btn" onClick={openAddModal}>
              <FaUserPlus />
              Add Recruiter
            </button>
          </div>

          <div className="table-tools">
            <input
              type="text"
              placeholder="Search recruiter..."
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
                <th>Name</th>
                <th>Email</th>
                <th>Company</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {currentRecruiters.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    style={{
                      textAlign: "center",
                    }}
                  >
                    No recruiters found
                  </td>
                </tr>
              ) : (
                currentRecruiters.map((recruiter) => (
                  <tr key={recruiter._id}>
                    <td>
                      <div className="cell-flex">
                        <FaUser />

                        {recruiter.name}
                      </div>
                    </td>

                    <td>{recruiter.email}</td>

                    <td>{recruiter.companyName || "—"}</td>

                    <td className="actions">
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(recruiter)}
                      >
                        <FaEdit />
                        Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(recruiter._id)}
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
        <div className="recruiter-modal">
          <div className="recruiter-modal-content">
            <h3>{editingRecruiter ? "Edit Recruiter" : "Add Recruiter"}</h3>

            <input
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
            />

            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
            />

            <input
              name="companyName"
              placeholder="Company Name"
              value={form.companyName}
              onChange={handleChange}
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
            />

            <div className="modal-buttons">
              <button onClick={handleSubmit}>Save</button>

              <button className="cancel" onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
