import React, { useState } from "react";
import { Link } from "react-router-dom";
import Base from "../constants/base.json";
import { useWeb3Contract } from "react-moralis";
import { useNavigate } from 'react-router-dom';
import Layout from "./Layout";
import "../styles/patient.css";

function PatientSignIn() {
  const [address, setAddress] = useState("");
  const navigate = useNavigate();

  const baseadd = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";

  const { runContractFunction: patientSignIn } = useWeb3Contract({
    abi: Base.abi,
    contractAddress: baseadd,
    functionName: "patientSignIn",
    params: {
      _patientId: address,
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
      alert("Entered patient address does not match the connected MetaMask address.");
      return;
    }
  
    try {
      const tx = await patientSignIn({
        onSuccess: (tx) => handleSetOnSuccess(tx),
        onError: (error) => alert(`Patient does not exist`),
      });
    } catch (error) {
      console.error("Error signing in patient:", error);
      alert("Error signing in patient");
    }
  };
  
  async function handleSetOnSuccess(tx) {
    setTimeout(() => {
      alert("Signed In Successfully");
    }, 100);
    navigate("/Patient");
  }
  
  // Function to get the current connected MetaMask address
  const getCurrentUserAddress = async () => {
    if (!window.ethereum || !window.ethereum.selectedAddress) {
      throw new Error("MetaMask is not connected.");
    }
    return window.ethereum.selectedAddress;
  };

  return (
    <Layout>
      <body className="patsignin">
        <div> 
          <form onSubmit={handleSubmit} className="patient-sign-in-container">
          <h2>Patient Sign In</h2>
           
            <input
              type="text"
              placeholder="Enter Patient Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <button type="submit">Sign In</button>
            <div className="register-link1">
              Haven't registered yet? <Link to="/addPatient">Register</Link>
            </div>
          </form>
        </div>
      </body>
    </Layout>
  );
}

export default PatientSignIn;
