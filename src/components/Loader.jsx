import "./Loader.css"
function Loader() {
    return (
      <div style={{height:"100vh",
          display:"flex",
          justifyContent:"center",
          alignItems:"center",
          textAlign:"center",
          
  
      }}>
  <div className="lds-dual-ring"></div>    
  </div>
    )
  }
  
  export default Loader