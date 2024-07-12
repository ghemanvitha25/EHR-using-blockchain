import React, { useState } from "react";
import Base from "../constants/base.json";
import { useWeb3Contract, useMoralis } from "react-moralis";
import { Link } from "react-router-dom";
import console from "console-browserify";
import Layout from "./Layout";
import "../styles/AddDoctor.css";

function AddDoctor(){
    const [address,setAddress]=useState("");
    const [name,setName]=useState("");
    const[contact,setContact]=useState("");
    const[spec,setSpec]=useState("");
    const[exp,setExp]=useState("");

    const baseadd= "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";

    const { runContractFunction: signupDoctor } = useWeb3Contract({
        abi: Base.abi,
        contractAddress: baseadd,
        functionName: "signupDoctor",
        params: {
          _id: address,
          _name: name,
          _contact: contact,
          _specialization:spec,
          _yrsofexp:exp
        },
      });
      const handleSubmit = async (e) => {
        e.preventDefault();
        await signupDoctor({
          onSuccess: (tx) => handleSetOnSuccess(tx),
          onError: (error) => alert(`Not able to signUp doctor`),
        });
      };
      async function handleSetOnSuccess(tx) {
        await tx.wait(1);
        console.log("success");
        alert("Docter Added");
 
      }
      return (
        <Layout>
          <body className="doctor">        
          <div className="form-container">
          <form onSubmit={handleSubmit}>
            <label htmlFor="address">Address:</label>
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <label htmlFor="contact">Contact:</label>
            <input
              type="text"
              id="contact"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />
            <label htmlFor="specia">Specialization:</label>
            <input
              type="text"
              id="specia"
              value={spec}
              onChange={(e) => setSpec(e.target.value)}
            />
             <label htmlFor="specia">Years Of Experience:</label>
            <input
              type="text"
              id="specia"
              value={exp}
              onChange={(e) => setExp(e.target.value)}
            />

            <button type="submit">Register As Doctor on Blockchain</button>
            <div className="already-registered" >
      Already Registered? <Link to="/docsignin" >SignIn</Link>
      </div>
          </form>
          {/* <ToastContainer /> */}
        </div>
        </body>
        </Layout>
      );

}
export default AddDoctor;