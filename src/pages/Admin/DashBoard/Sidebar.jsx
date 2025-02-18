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
          <NavLink to={"addDoctors"}>
            <BiPlus className="icon " />
            {openSidebarToggle && <span>Add Doctor</span>}
          </NavLink>
        </li>
        <li
          className={
            openSidebarToggle
              ? "sidebar-list-item"
              : "collapsed-sidebar-list-item"
          }
        >
          <NavLink to={"doctorList"}>
            <FaUserDoctor className="icon " />
            {openSidebarToggle && <span>Doctor List</span>}
          </NavLink>
        </li>
        <li
          className={
            openSidebarToggle
              ? "sidebar-list-item"
              : "collapsed-sidebar-list-item"
          }
        >
          <NavLink to={"patients"}>
            <BiUser className="icon " />
            {openSidebarToggle && <span>Patients</span>}
          </NavLink>
        </li>
        <li
          className={
            openSidebarToggle
              ? "sidebar-list-item"
              : "collapsed-sidebar-list-item"
          }
        >
          <NavLink to={"specializations"}>
            <FaHandHoldingMedical className="icon " />
            {openSidebarToggle && <span>Specializations</span>}
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
            <FaUser className="icon " />{" "}
            {openSidebarToggle && <span>Update Profile</span>}
          </NavLink>
        </li>
      </ul>
    </aside>
  );
}
import { BsCart3, BsGrid1X2Fill } from "react-icons/bs";
import { BiCalendar, BiPlus, BiUser } from "react-icons/bi";
import { GiDoctorFace } from "react-icons/gi";
import { FaHandHoldingMedical, FaUser, FaUserDoctor } from "react-icons/fa6";

export default Sidebar;
