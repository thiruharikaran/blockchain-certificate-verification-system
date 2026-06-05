import { useEffect, useMemo, useState } from "react";

import api from "../../api/axios";

import AdminSidebar from "../../components/layout/AdminSidebar";

import "../../styles/admin/dashboard.css";

import {
  FaUserGraduate,
  FaUserPlus,
  FaUser,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

function AdminStudents() {
  const [students, setStudents] = useState([]);

  const [colleges, setColleges] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const studentsPerPage = 5;

  const [showModal, setShowModal] = useState(false);

  const [editingStudent, setEditingStudent] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    collegeId: "",
  });

  // Fetch students
  const fetchStudents = async () => {
    try {
      const response = await api.get("/master/students");

      setStudents(response.data.students || []);
    } catch (error) {
      console.error("Fetch Students Error:", error);
    }
  };

  // Fetch colleges
  const fetchColleges = async () => {
    try {
      const response = await api.get("/master/colleges");

      setColleges(response.data.colleges || []);
    } catch (error) {
      console.error("Fetch Colleges Error:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([fetchStudents(), fetchColleges()]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // College lookup map
  const collegeMap = useMemo(() => {
    return colleges.reduce((map, college) => {
      map[college._id] = college.collegeName;

      return map;
    }, {});
  }, [colleges]);

  // Search filtering
  const filteredStudents = students.filter(
    (student) =>
      student.name?.toLowerCase().includes(search.toLowerCase()) ||
      student.email?.toLowerCase().includes(search.toLowerCase()),
  );

  // Pagination
  const indexOfLast = currentPage * studentsPerPage;

  const indexOfFirst = indexOfLast - studentsPerPage;

  const currentStudents = filteredStudents.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredStudents.length / studentsPerPage),
  );

  // Open create modal
  const openAddModal = () => {
    setEditingStudent(null);

    setForm({
      name: "",
      email: "",
      password: "",
      collegeId: "",
    });

    setShowModal(true);
  };

  // Open edit modal
  const openEditModal = (student) => {
    setEditingStudent(student);

    setForm({
      name: student.name || "",
      email: student.email || "",
      password: "",
      collegeId: student.collegeId || "",
    });

    setShowModal(true);
  };

  // Create or update student
  const saveStudent = async () => {
    try {
      if (editingStudent) {
        await api.put(`/master/students/${editingStudent._id}`, form);
      } else {
        await api.post("/master/students", form);
      }

      setShowModal(false);

      fetchStudents();
    } catch (error) {
      console.error("Save Student Error:", error);
    }
  };

  // Delete student
  const deleteStudent = async (id) => {
    const confirmed = window.confirm("Delete student?");

    if (!confirmed) return;

    try {
      await api.delete(`/master/students/${id}`);

      fetchStudents();
    } catch (error) {
      console.error("Delete Student Error:", error);
    }
  };

  if (loading) {
    return <div className="page-loader">Loading students...</div>;
  }

  return (
    <div className="layout">
      <AdminSidebar />

      <main className="content">
        <div className="dashboard">
          <div className="table-header">
            <h2 className="title">
              <FaUserGraduate />
              Students
            </h2>

            <button type="button" className="add-btn" onClick={openAddModal}>
              <FaUserPlus />
              Add Student
            </button>
          </div>

          <div className="table-tools">
            <input
              type="text"
              placeholder="Search student..."
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
                <th>Name</th>
                <th>Email</th>
                <th>College</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {currentStudents.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    style={{
                      textAlign: "center",
                    }}
                  >
                    No students found
                  </td>
                </tr>
              ) : (
                currentStudents.map((student) => (
                  <tr key={student._id}>
                    <td>
                      <div className="cell-flex">
                        <FaUser />

                        {student.name}
                      </div>
                    </td>

                    <td>{student.email}</td>

                    <td>{collegeMap[student.collegeId] || "N/A"}</td>

                    <td className="actions">
                      <button
                        className="edit-btn"
                        onClick={() => openEditModal(student)}
                      >
                        <FaEdit />
                        Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => deleteStudent(student._id)}
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
        <div className="student-modal">
          <div className="student-modal-content">
            <h3>{editingStudent ? "Edit Student" : "Add Student"}</h3>

            <input
              placeholder="Name"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
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

            {!editingStudent && (
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
            )}

            <select
              value={form.collegeId}
              onChange={(e) =>
                setForm({
                  ...form,
                  collegeId: e.target.value,
                })
              }
            >
              <option value="">Select College</option>

              {colleges.map((college) => (
                <option key={college._id} value={college._id}>
                  {college.collegeName}
                </option>
              ))}
            </select>

            <div className="modal-buttons">
              <button className="cancel" onClick={() => setShowModal(false)}>
                Cancel
              </button>

              <button onClick={saveStudent}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminStudents;
