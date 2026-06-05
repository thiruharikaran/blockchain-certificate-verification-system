// Authentication endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: "/auth/login",
  LOGOUT: "/auth/logout",
  VERIFY_TOKEN: "/auth/verify",
};

// Master Admin endpoints
export const ADMIN_ENDPOINTS = {
  DASHBOARD: "/admin/dashboard",

  COLLEGES: "/admin/colleges",
  COLLEGE_ADMINS: "/admin/college-admins",

  STUDENTS: "/admin/students",
  RECRUITERS: "/admin/recruiters",

  CERTIFICATES: "/admin/certificates",
  VERIFICATIONS: "/admin/verifications",
};

// College Admin endpoints
export const COLLEGE_ADMIN_ENDPOINTS = {
  DASHBOARD: "/college-admin/dashboard",

  STUDENTS: "/college-admin/students",

  CERTIFICATES: "/college-admin/certificates",

  UPLOAD_CERTIFICATE:
    "/college-admin/certificates/upload",
};

// Student endpoints
export const STUDENT_ENDPOINTS = {
  DASHBOARD: "/student/dashboard",

  PROFILE: "/student/profile",

  CERTIFICATES: "/student/certificates",
};

// Recruiter endpoints
export const RECRUITER_ENDPOINTS = {
  DASHBOARD: "/recruiter/dashboard",

  VERIFY_CERTIFICATE:
    "/recruiter/verify-certificate",

  VERIFICATION_HISTORY:
    "/recruiter/verifications",
};

// Public certificate endpoints
export const CERTIFICATE_ENDPOINTS = {
  VERIFY: "/certificate/verify",

  DETAILS: "/certificate/details",
};