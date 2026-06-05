import AdminSidebar from "./AdminSidebar";
import "../../styles/admin/dashboard.css";

function AdminLayout({ children }) {
  return (
    <div className="layout">
      {/* Admin navigation sidebar */}
      <AdminSidebar />

      {/* Main page content */}
      <main className="content">{children}</main>
    </div>
  );
}

export default AdminLayout;
