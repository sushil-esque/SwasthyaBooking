function Footer() {
  return (
    <footer>
      <div className="footerBody">
        <div style={{ display: "flex", flexDirection: "column", width: "30%" }}>
          <img src="/public/logo.png" alt="" style={{ width: "200px" }} />
          <p style={{  color: "rgb(75 85 99 )" }}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum facilis
            explicabo ullam, corrupti consectetur quasi fugit praesentium saepe
            neque illum aliquam eaque in ab soluta! Asperiores officiis laborum
            maxime vel!
          </p>
        </div>
        <div>
          <ul>
            COMPANY
            <li>Home</li>
            <li>About us</li>
            <li>Delivery</li>
            <li>Privacy policy</li>
          </ul>
        </div>
        <div>
          <ul>
          GET IN TOUCH
          <li>+0-000-000-000</li>
          <li>swasthyabooking@gmail.com</li>
          </ul>
        </div>
      </div>
      <div className="bottomFooter" >
        <p>Copyright 2024@ Swasthya Booking - All Rights Reserved</p>
      </div>
    </footer>
  );
}

export default Footer;
