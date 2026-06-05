import { useNavigate, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUserGraduate,
  FaUniversity,
  FaFileAlt,
  FaUserTie,
  FaCheckCircle,
  FaUserShield,
  FaCrown,
} from "react-icons/fa";

import "../../styles/layout/sidebar.css";

function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  // Master Admin navigation menu
  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: <FaTachometerAlt />,
    },
    {
      name: "Students",
      path: "/admin/students",
      icon: <FaUserGraduate />,
    },
    {
      name: "Colleges",
      path: "/admin/colleges",
      icon: <FaUniversity />,
    },
    {
      name: "College Admins",
      path: "/admin/college-admins",
      icon: <FaUserShield />,
    },
    {
      name: "Certificates",
      path: "/admin/certificates",
      icon: <FaFileAlt />,
    },
    {
      name: "Recruiters",
      path: "/admin/recruiters",
      icon: <FaUserTie />,
    },
    {
      name: "Verifications",
      path: "/admin/verifications",
      icon: <FaCheckCircle />,
    },
  ];

  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">
        <FaCrown className="sidebar-crown" />
        Admin
      </h2>

      {menuItems.map((item) => (
        <button
          key={item.path}
          type="button"
          onClick={() => navigate(item.path)}
          className={
            location.pathname === item.path
              ? "sidebar-btn active"
              : "sidebar-btn"
          }
        >
          <span className="icon">{item.icon}</span>

          {item.name}
        </button>
      ))}
    </aside>
  );
}

export default AdminSidebar;
