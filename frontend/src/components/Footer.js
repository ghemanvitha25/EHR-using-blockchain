import React from "react";
import "../styles/Footer.css"; // Import the CSS file

const Footer = () => {
  return (
    <div className="footer-text-center-text-white">
      <div className="container-mb-3">
        <h1>Medchain</h1>
        <h4>Follow us</h4>
        <i className="fab fa-facebook-square mx-4"></i>
        <i className="fab fa-twitter mx-4"></i>
        <i className="fab fa-instagram mx-4"></i>
        <i className="fab fa-linkedin-in mx-4"></i>
      </div>
    </div>
  );
};

export default Footer;
