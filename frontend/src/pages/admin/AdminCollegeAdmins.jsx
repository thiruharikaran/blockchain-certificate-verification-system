import { useEffect, useState } from "react";

import api from "../../api/axios";

import { FaUserShield, FaEdit, FaTrash, FaUserPlus } from "react-icons/fa";

import AdminSidebar from "../../components/layout/AdminSidebar";

import "../../styles/admin/AdminCollegeAdmins.css";

export default function AdminCollegeAdmins() {
  const [admins, setAdmins] = useState([]);

  const [showModal, setShowModal] = useState(false);

  const [editingAdmin, setEditingAdmin] = useState(null);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const adminsPerPage = 5;

  const [form, setForm] = useState({
    name: "",
    collegeName: "",
    email: "",
    password: "",
  });

  // Fetch all college administrators
  const fetchAdmins = async () => {
    try {
      const response = await api.get("/master/college-admins");

      setAdmins(response.data.admins || []);
    } catch (error) {
      console.error("Fetch Admins Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // Search filtering
  const filteredAdmins = admins.filter((admin) =>
    [admin.name, admin.collegeName, admin.email]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  // Pagination
  const indexOfLast = currentPage * adminsPerPage;

  const indexOfFirst = indexOfLast - adminsPerPage;

  const currentAdmins = filteredAdmins.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredAdmins.length / adminsPerPage),
  );

  // Delete administrator
  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this admin?");

    if (!confirmed) return;

    try {
      await api.delete(`/master/college-admins/${id}`);

      fetchAdmins();
    } catch (error) {
      console.error("Delete Admin Error:", error);
    }
  };

  // Open edit modal
  const handleEdit = (admin) => {
    setEditingAdmin(admin);

    setForm({
      name: admin.name || "",
      collegeName: admin.collegeName || "",
      email: admin.email || "",
      password: "",
    });

    setShowModal(true);
  };

  // Update administrator
  const handleUpdate = async () => {
    try {
      await api.put(`/master/college-admins/${editingAdmin._id}`, form);

      setShowModal(false);
      setEditingAdmin(null);

      fetchAdmins();
    } catch (error) {
      console.error("Update Admin Error:", error);
    }
  };

  // Create administrator
  const handleCreate = async () => {
    try {
      await api.post("/master/college-admins", form);

      setShowModal(false);

      setForm({
        name: "",
        collegeName: "",
        email: "",
        password: "",
      });

      fetchAdmins();
    } catch (error) {
      console.error("Create Admin Error:", error);
    }
  };

  if (loading) {
    return <div className="page-loader">Loading college admins...</div>;
  }

  return (
    <div className="layout">
      <AdminSidebar />

      <main className="content">
        <div className="dashboard">
          <div className="table-header">
            <h2 className="title">
              <FaUserShield />
              College Admins
            </h2>

            <button
              type="button"
              className="add-btn"
              onClick={() => {
                setEditingAdmin(null);

                setForm({
                  name: "",
                  collegeName: "",
                  email: "",
                  password: "",
                });

                setShowModal(true);
              }}
            >
              <FaUserPlus />
              Add College Admin
            </button>
          </div>

          <div className="table-tools">
            <input
              type="text"
              placeholder="Search college admin..."
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
                <th>Admin Name</th>
                <th>College</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {currentAdmins.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    style={{
                      textAlign: "center",
                      padding: "30px",
                    }}
                  >
                    No college admins
                  </td>
                </tr>
              ) : (
                currentAdmins.map((admin) => (
                  <tr key={admin._id}>
                    <td>
                      <div className="cell-flex">
                        <FaUserShield />

                        {admin.name || "N/A"}
                      </div>
                    </td>

                    <td>{admin.collegeName}</td>

                    <td>{admin.email}</td>

                    <td className="actions">
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(admin)}
                      >
                        <FaEdit />
                        Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(admin._id)}
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
        <div className="college-admin-modal">
          <div className="college-admin-modal-content">
            <h3>{editingAdmin ? "Edit College Admin" : "Add College Admin"}</h3>

            <input
              placeholder="Admin Name"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
            />

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
              placeholder="Email"
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
            />

            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) =>
                setForm({
                  ...form,
                  password: e.target.value,
                })
              }
            />

            <div className="modal-buttons">
              <button className="cancel" onClick={() => setShowModal(false)}>
                Cancel
              </button>

              <button onClick={editingAdmin ? handleUpdate : handleCreate}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
