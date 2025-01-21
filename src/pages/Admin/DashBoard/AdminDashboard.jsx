import { useState } from "react";
import AdminHeader from "./AdminHeader";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

function AdminDashboard() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(true);

  const toggleSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  return (
    <div className="adminBody">
      <div
        className="grid-container"
        style={{
          gridTemplateColumns: openSidebarToggle ? "260px 1fr" : "80px 1fr",
        }}
      >
        <AdminHeader toggleSidebar={toggleSidebar} />
        <Sidebar openSidebarToggle={openSidebarToggle} />
        <div
          className={`main-content`}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
