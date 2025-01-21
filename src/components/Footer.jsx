function Footer() {
  return (
    <footer>
      <div className="footerBody">
        <div style={{ display: "flex", flexDirection: "column", width: "30%" }}>
          <img src="/public/logo.png" alt="" style={{ width: "200px" }} />
          <p style={{ color: "rgb(75 85 99 )" }}>
            Swasthya Booking connects patients with trusted doctors, making
            healthcare simple with easy appointment scheduling, detailed doctor
            profiles, and reliable access to quality care.
          </p>
        </div>
        <div>
          <ul>
            COMPANY
            <li>Home</li>
            <li>About us</li>
            <li>Find doctors</li>
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
      <div className="bottomFooter">
        <p>Copyright 2024@ Swasthya Booking - All Rights Reserved</p>
      </div>
    </footer>
  );
}

export default Footer;
