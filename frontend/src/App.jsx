import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense } from "react";
import Loader from "./components/common/Loader";
// PROTECTED
import ProtectedRoute from "./components/common/ProtectedRoute";

// ERROR
import Unauthorized from "./pages/errors/Unauthorized";
import Forbidden from "./pages/errors/Forbidden";
import NotFound from "./pages/errors/NotFound";
import ServerError from "./pages/errors/ServerError";

import Login from "./pages/auth/Login";
import Landing from "./pages/landing/Landing";

// MASTER ADMIN
import Admin from "./pages/admin/Admin";
import AdminColleges from "./pages/admin/AdminColleges";
import AdminCollegeAdmins from "./pages/admin/AdminCollegeAdmins";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminCertificates from "./pages/admin/AdminCertificates";
import AdminRecruiters from "./pages/admin/AdminRecruiters";
import AdminVerifications from "./pages/admin/AdminVerifications";

// OTHER ROLES
import CollegeAdmin from "./pages/collegeAdmin/CollegeAdmin";
import StudentDashboard from "./pages/student/StudentDashboard";
import Recruiter from "./pages/recruiter/Recruiter";

// APP ROUTER

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <Routes>
          {/* LANDING */}
          <Route path="/" element={<Landing />} />

          {/* LOGIN */}
          <Route path="/login" element={<Login />} />

          {/* MASTER ADMIN */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="MASTER_ADMIN">
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/colleges"
            element={
              <ProtectedRoute role="MASTER_ADMIN">
                <AdminColleges />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/college-admins"
            element={
              <ProtectedRoute role="MASTER_ADMIN">
                <AdminCollegeAdmins />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/students"
            element={
              <ProtectedRoute role="MASTER_ADMIN">
                <AdminStudents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/certificates"
            element={
              <ProtectedRoute role="MASTER_ADMIN">
                <AdminCertificates />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/recruiters"
            element={
              <ProtectedRoute role="MASTER_ADMIN">
                <AdminRecruiters />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/verifications"
            element={
              <ProtectedRoute role="MASTER_ADMIN">
                <AdminVerifications />
              </ProtectedRoute>
            }
          />

          {/* COLLEGE ADMIN */}
          <Route
            path="/college-admin"
            element={
              <ProtectedRoute role="COLLEGE_ADMIN">
                <CollegeAdmin />
              </ProtectedRoute>
            }
          />

          {/* STUDENT */}
          <Route
            path="/student"
            element={
              <ProtectedRoute role="STUDENT">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          {/* RECRUITER */}
          <Route
            path="/recruiter"
            element={
              <ProtectedRoute role="RECRUITER">
                <Recruiter />
              </ProtectedRoute>
            }
          />

          {/* ERROR PAGES */}
          <Route path="/401" element={<Unauthorized />} />
          <Route path="/403" element={<Forbidden />} />
          <Route path="/500" element={<ServerError />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
