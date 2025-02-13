import { NavLink } from "react-router-dom";
import "./admin.css";
function Sidebar({ openSidebarToggle }) {
  return (
    <aside
      className={openSidebarToggle ? "sidebar-normal" : "sidebar-collapsed"}
    >
      <div className="sidebar-title ">
        <div className="sidebar-brand">
          {openSidebarToggle ? (
            <img src="/logo.png" alt="" className="sidebar-logo" />
          ) : (
            <span style={{ color: "#ff724a" }}>SB</span>
          )}
        </div>
      </div>
      <ul className="sidebar-list">
       
        <li
          className={
            openSidebarToggle
              ? "sidebar-list-item"
              : "collapsed-sidebar-list-item"
          }
        >
          <NavLink to={"appointments"}>
            <BiCalendar className="icon " />
            {openSidebarToggle && <span>Appointments</span>}
          </NavLink>
        </li>
        <li
          className={
            openSidebarToggle
              ? "sidebar-list-item"
              : "collapsed-sidebar-list-item"
          }
        >
          <NavLink to={"updateProfile"}>
            <FaUserEdit className="icon " />
            {openSidebarToggle && <span>Edit Profile</span>}
          </NavLink>
        </li>

        <li
          className={
            openSidebarToggle
              ? "sidebar-list-item"
              : "collapsed-sidebar-list-item"
          }
        >
          <NavLink to={"schedule"}>
            <MdMoreTime className="icon " />
            {openSidebarToggle && <span>Schedule Timings</span>}
          </NavLink>
        </li>
        <li
          className={
            openSidebarToggle
              ? "sidebar-list-item"
              : "collapsed-sidebar-list-item"
          }
        >
          <NavLink to={"changePassword"}>
          <TbPassword className="icon " />
            {openSidebarToggle && <span>Change Password</span>}
          </NavLink>
        </li>
      </ul>
    </aside>
  );
}
import { BsCart3, BsGrid1X2Fill } from "react-icons/bs";
import { BiCalendar, BiPlus, BiUser } from "react-icons/bi";
import { GiDoctorFace } from "react-icons/gi";
import { FaUserDoctor } from "react-icons/fa6";
import { FaUserEdit } from "react-icons/fa";
import { MdMoreTime } from "react-icons/md";
import { TbPassword } from "react-icons/tb";

export default Sidebar;
