import { Outlet } from "react-router-dom"
import Header from "./Header"
import Footer from "./Footer"

function Layout() {
  return (
    <div style={{
      height:"100%",
      display:"flex",
      flexDirection:"column",
      
    }}>
        <Header/>
        <div className="outlet">
        <Outlet/>
        </div>
       
        <Footer/>
    </div>
  )
}

export default Layout