import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  // Retrieve authentication data
  const token = localStorage.getItem("token");

  const userRole = localStorage.getItem("role");

  // Redirect unauthenticated users
  if (!token) {
    return <Navigate to="/401" replace />;
  }

  // Restrict access based on role
  if (role && userRole !== role) {
    return <Navigate to="/403" replace />;
  }

  return children;
}
