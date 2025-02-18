import {
  BsFillBellFill,
  BsFillEnvelopeFill,
  BsJustify,
  BsPersonCircle,
  BsSearch,
} from "react-icons/bs";
import "./admin.css";
import { useNavigate } from "react-router-dom";
function AdminHeader({ toggleSidebar }) {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token
    navigate("/login"); // Redirect to login page
  };
  return (
    <header className="header">
      <div className="menu-icon">
        <BsJustify className="icon" onClick={toggleSidebar} />
      </div>
      {/* <div className="header-left">
        <BsSearch className="icon" />
      </div> */}
      <div className="header-right">
        <button
          onClick={handleLogout}
          className="text-[#ff724a] border-emerald-50 rounded-md hover:bg-emerald-50"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default AdminHeader;
