import { useEffect, useState } from "react";

import api from "../../api/axios";

import "../../styles/student/profile.css";

function StudentProfile() {
  const [student, setStudent] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // Fetch student profile
  const fetchProfile = async () => {
    try {
      const response = await api.get("/student/profile");

      setStudent(response.data.student);
    } catch (error) {
      console.error("Profile Fetch Error:", error);

      setError("Unable to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="profile-page">
        <h2>Loading profile...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-page">
        <h2>{error}</h2>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <h2>👤 Student Profile</h2>

      <div className="profile-card">
        <p>
          <strong>Name:</strong> {student?.name || "N/A"}
        </p>

        <p>
          <strong>Email:</strong> {student?.email || "N/A"}
        </p>

        <p>
          <strong>College:</strong>{" "}
          {student?.collegeName || student?.college?.collegeName || "N/A"}
        </p>
      </div>
    </div>
  );
}

export default StudentProfile;
