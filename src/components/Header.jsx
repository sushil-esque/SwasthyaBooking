import { NavLink } from "react-router-dom"
function Header() {
  return (
    <div className="headerMain">
        <div className="logo">
            <img src="/logo.png" alt="logo" />
        </div>
        <div className="navigation">
            <nav>
                <ul>
                    <li>
                        <NavLink to={"/home"}>
                        Home
                        </NavLink>
                        </li>
                    <li>
                        <NavLink to={"/findDoctors"}>
                        Find Doctor
                        </NavLink>
    
                       </li>
                    <li>
                        <NavLink to={"/healthPackages"}>
                        Health Packages
                        </NavLink>
                       </li>
                    <li>
                        <NavLink to={"/about"}>
                        About
                        </NavLink>
                        </li>  
                        <li>
                            <NavLink to={"/login"}>
                                <button className="login">Login </button>
                            </NavLink>
                        </li>
                        {/* <li>
                            <NavLink to={"/signin"}>
                                <button className="signin">Sign In</button>
                            </NavLink>
                        </li> */}
                </ul>
            </nav>
        </div>
    </div>
  )
}

export default Header