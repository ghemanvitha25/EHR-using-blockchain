import React, { useState } from "react";
import { Link } from "react-router-dom";
import Base from "../constants/base.json";
import { useWeb3Contract } from "react-moralis";
import { useNavigate } from 'react-router-dom';
import Layout from "./Layout";
import "../styles/Doctor.css"; // Import the CSS file for styling

function DocSignIn() {
  const [address, setAddress] = useState("");
  const navigate = useNavigate();

  const baseadd = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";

  const { runContractFunction: doctorSignIn } = useWeb3Contract({
    abi: Base.abi,
    contractAddress: baseadd,
    functionName: "doctorSignIn",
    params: {
      _doctorId:address,
    },
  });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (address.trim() === "") {
      alert("Please enter a valid address.");
      return;
    }
    const connectedAddress = await getCurrentUserAddress();
  
    if (address.toLowerCase() !== connectedAddress.toLowerCase()) {
      alert("Entered doctor address does not match the connected MetaMask address.");
      return;
    }
  
    try {
      const tx = await doctorSignIn({
        onSuccess: (tx) => handleSetOnSuccess(tx),
        onError: (error) => alert(`Doctor do not exist`),
      });
    } catch (error) {
      console.error("Error signing in doctor:", error);
      alert("Error signing in doctor");
    }
  };
  
  async function handleSetOnSuccess(tx) {
    setTimeout(() => {
      alert("Signed In Successfully");
    }, 100);
    navigate("/doctor");
    console.log("success");
  }
  
  // Function to get the current connected MetaMask address
  const getCurrentUserAddress = async () => {
    if (!window.ethereum || !window.ethereum.selectedAddress) {
      throw new Error("MetaMask is not connected.");
    }
    return window.ethereum.selectedAddress;
  };

  return (
    <>
    <Layout>
    <body className="docsignin">
    <div className="signin-container">
      <h2>Doctor Sign In</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter Doctor Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <button type="submit">Sign In</button>
        <div className="register-link">
          Haven't registered yet? <Link to="/addDoctor" >Register</Link>
        </div>
      </form>
    </div>
    </body>
    </Layout>
    </>
  );
}

export default DocSignIn;
