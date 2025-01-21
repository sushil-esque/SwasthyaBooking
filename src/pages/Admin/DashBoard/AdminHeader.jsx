import {
  BsFillBellFill,
  BsFillEnvelopeFill,
  BsJustify,
  BsPersonCircle,
  BsSearch,
} from "react-icons/bs";
import "./admin.css";
function AdminHeader({toggleSidebar}) {
  return (
    <header className="header" >
      <div className="menu-icon">
        <BsJustify className="icon" onClick={toggleSidebar} />
      </div>
      {/* <div className="header-left">
        <BsSearch className="icon" />
      </div> */}
      <div className="header-right">
        <BsFillBellFill className="icon" />
        <BsFillEnvelopeFill className="icon" />
        <BsPersonCircle className="icon" />
      </div>
    </header>
  );
}

export default AdminHeader;
