import { useEffect, useState } from "react";

import api from "../../api/axios";

import "../../styles/student/profile.css";

function Profile() {
  const [user, setUser] = useState({});

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const role = localStorage.getItem("role");

  const canEdit = role === "MASTER_ADMIN";

  // Fetch profile
  const fetchProfile = async () => {
    try {
      const response = await api.get("/student/profile");

      setUser(response.data);
    } catch (error) {
      console.error("Profile Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Handle form changes
  const handleChange = (event) => {
    setUser({
      ...user,
      [event.target.name]: event.target.value,
    });
  };

  // Update profile
  const updateProfile = async () => {
    try {
      setSaving(true);

      await api.put("/student/profile", user);

      alert("Profile updated successfully");
    } catch (error) {
      console.error("Profile Update Error:", error);

      alert(error.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <h2>Loading profile...</h2>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <h2>👤 Student Profile</h2>

      <div className="profile-card">
        <label>Name</label>

        <input
          name="name"
          value={user.name || ""}
          onChange={handleChange}
          disabled={!canEdit}
        />

        <label>Email</label>

        <input value={user.email || ""} disabled />

        <label>College</label>

        <input value={user.collegeName || ""} disabled />

        <label>Address</label>

        <input
          name="address"
          value={user.address || ""}
          onChange={handleChange}
          disabled={!canEdit}
        />

        {canEdit && (
          <button onClick={updateProfile} disabled={saving}>
            {saving ? "Updating..." : "Update Profile"}
          </button>
        )}
      </div>
    </div>
  );
}

export default Profile;
