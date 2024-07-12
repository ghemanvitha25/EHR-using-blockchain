import React from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css"; // Import your CSS file for styling
import { ConnectButton } from "web3uikit";
import medchain from "../images/medchain.png";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
        <img src={medchain} alt="Medchain Logo" className="navbar-logo-img" />
        <span className="navbar-title">Medchain</span>
        </Link>
        <ul className="navbar-menu">
          <li className="navbar-item">
            <Link to="/" className="navbar-link">
              Home
            </Link>
          </li>
          
          <li className="navbar-item">
            <Link to="/patientsignin" className="navbar-link">
              Patient
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/docsignin" className="navbar-link">
              Doctor
            </Link>
          </li>
          <li className="navbar-item">
            <ConnectButton />
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
