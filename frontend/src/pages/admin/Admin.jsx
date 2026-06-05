import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../api/axios";

import Navbar from "../../components/layout/Navbar";
import AdminSidebar from "../../components/layout/AdminSidebar";

import "../../styles/admin/dashboard.css";

import {
  FaUserGraduate,
  FaUniversity,
  FaFileAlt,
  FaUserTie,
  FaCheckCircle,
  FaCrown,
} from "react-icons/fa";

function Admin() {
  const navigate = useNavigate();

  const [activity, setActivity] = useState([]);

  const [stats, setStats] = useState({
    colleges: 0,
    students: 0,
    recruiters: 0,
    certificates: 0,
    verifications: 0,
    collegeAdmins: 0,
  });

  useEffect(() => {
    fetchAnalytics();
    fetchRecentActivity();
  }, []);

  // Fetch dashboard analytics
  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get("/master/analytics", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error("Analytics Error:", error);
    }
  };

  // Fetch recent verification activity
  const fetchRecentActivity = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get("/master/recent-activity", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setActivity(response.data.activity || []);
    } catch (error) {
      console.error("Activity Error:", error);
    }
  };

  return (
    <div>
      {/* Top navigation */}
      <Navbar />

      <div className="layout">
        {/* Admin sidebar */}
        <AdminSidebar />

        {/* Dashboard content */}
        <main className="content">
          <div className="dashboard">
            <div className="dashboard-header">
              <h1>
                <FaCrown /> Master Admin Dashboard
              </h1>
              <p>
                Manage students, colleges, recruiters and certificate
                verifications.
              </p>
            </div>

            {/* Statistics cards */}
            <div className="stats-grid">
              <div
                className="stat-card"
                onClick={() => navigate("/admin/students")}
              >
                <div className="stat-header">
                  <div className="stat-icon blue">
                    <FaUserGraduate />
                  </div>

                  <h3>Students</h3>
                </div>

                <p>{stats.students}</p>
              </div>

              <div
                className="stat-card"
                onClick={() => navigate("/admin/colleges")}
              >
                <div className="stat-header">
                  <div className="stat-icon green">
                    <FaUniversity />
                  </div>

                  <h3>Colleges</h3>
                </div>

                <p>{stats.colleges}</p>
              </div>

              <div
                className="stat-card"
                onClick={() => navigate("/admin/college-admins")}
              >
                <div className="stat-header">
                  <div className="stat-icon teal">
                    <FaUserTie />
                  </div>

                  <h3>College Admins</h3>
                </div>

                <p>{stats.collegeAdmins}</p>
              </div>

              <div
                className="stat-card"
                onClick={() => navigate("/admin/certificates")}
              >
                <div className="stat-header">
                  <div className="stat-icon purple">
                    <FaFileAlt />
                  </div>

                  <h3>Certificates</h3>
                </div>

                <p>{stats.certificates}</p>
              </div>

              <div
                className="stat-card"
                onClick={() => navigate("/admin/recruiters")}
              >
                <div className="stat-header">
                  <div className="stat-icon orange">
                    <FaUserTie />
                  </div>

                  <h3>Recruiters</h3>
                </div>

                <p>{stats.recruiters}</p>
              </div>

              <div
                className="stat-card"
                onClick={() => navigate("/admin/verifications")}
              >
                <div className="stat-header">
                  <div className="stat-icon teal">
                    <FaCheckCircle />
                  </div>

                  <h3>Verifications</h3>
                </div>

                <p>{stats.verifications}</p>
              </div>
            </div>

            {/* Recent activity table */}
            <div
              className="dashboard"
              style={{
                marginTop: "30px",
              }}
            >
              <div className="table-header">
                <h2>Recent Activity</h2>
              </div>

              <table className="table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Certificate</th>
                    <th>Recruiter</th>
                    <th>Company</th>
                    <th>Date</th>
                  </tr>
                </thead>

                <tbody>
                  {activity.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        style={{
                          textAlign: "center",
                        }}
                      >
                        No activity yet
                      </td>
                    </tr>
                  ) : (
                    activity.map((item) => (
                      <tr key={item._id}>
                        <td>{item.studentId?.name}</td>

                        <td>{item.certificateId?.certificateName}</td>

                        <td>{item.recruiterId?.name}</td>

                        <td>{item.recruiterId?.companyName}</td>

                        <td className="date-cell">
                          {new Date(item.createdAt).toLocaleString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Admin;
