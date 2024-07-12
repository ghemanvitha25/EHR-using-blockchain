import React, { useState } from "react";
import Base from "../constants/base.json";
import { useWeb3Contract, useMoralis } from "react-moralis";
import console from "console-browserify";
import axios from "axios";
import Layout from "./Layout";
import "../styles/AddPatient.css";
import { Link } from "react-router-dom";
// import { toast, ToastContainer } from "react-toastify";

function AddPatient(){
    const [address,setAddress]=useState("");
    const [name,setName]=useState("");
    const[age,setAge]=useState(null);
    const[gender,setGender]=useState("");
    const[contact,setContact]=useState("");
    const[file,setFile]=useState(null);
    const[filename,setFilename]=useState("");
    const[filetype,setFiletype]=useState("");
    const[filehash,setFilehash]=useState("");
    const[uaddress,setUaddress]=useState("");
    const baseadd= "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";

    const { runContractFunction: addUserFiles } = useWeb3Contract({
      abi: Base.abi,
      contractAddress: baseadd,
      functionName: "addUserFiles",
      params: {
        a:uaddress,
        _file_name:filename,
        _file_type:filetype,
        _file_hash:filehash
      },
    });
    const { runContractFunction: signupPatient } = useWeb3Contract({
        abi: Base.abi,
        contractAddress: baseadd,
        functionName: "signupPatient",
        params: {
          _name: name,
          a: address,
          _age:age,
          _contact: contact,
          _gender:gender,
        },
      });
      const handleFileChange = (event) => {
        if (event.target.files.length > 0) {
          const data = event.target.files[0];
          const reader = new window.FileReader();
          reader.readAsArrayBuffer(data);
          reader.onloadend = () => {
            setFile(event.target.files[0]);
            setFilename(event.target.files[0].name);
          };
        } else {
          console.log("please select a file");
        }
    
        event.preventDefault();
      };
      const handleUpload = async (event) => {
        // Logic to upload the file
        event.preventDefault();
    
        if (file) {
          try {
            const formData = new FormData();
            formData.append("file", file);
    
            const resFile = await axios({
              method: "post",
              url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
              data: formData,
              headers: {
                pinata_api_key: "2d923f215e24e2658aa7",
                pinata_secret_api_key:
                  "0aa3767c5af853617de89579e4b7ccbfad6cbe87f7034062e636278612c34a20",
                "content-Type": "multipart/form-data",
              },
            });
    
            var hash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
            console.log(hash);
            setFilehash(hash);
           console.log("File Uploaded");
           alert("File Uploaded");
          } catch (error) {
            alert(error);
          }
        }
      };
      const handleGetLink = async (event) => {
        event.preventDefault();
        await addUserFiles({
          onSuccess: (tx) =>alert(`Added to chain`) ,
          onError: (error) => alert(`Not able to add file to blockchain`),
        });
    
        console.log("Added to chain");
      };
      const handleSubmit = async (e) => {
        e.preventDefault();
        await signupPatient({
          onSuccess: (tx) => handleSetOnSuccess(tx),
          onError: (error) => alert(`Not able to signup`),
        });
      };
      async function handleSetOnSuccess(tx) {
        await tx.wait(1);
        console.log("success");
        alert("Patient Added");
        // toast("Docter Added");
      }
      return (
        <>
        <Layout>
        <body class="patient">
        <div className="form-container-1">
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
             <label htmlFor="age">Age:</label>
            <input
              type="text"
              id="age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
             <label htmlFor="gender">Gender:</label>
            <input
              type="text"
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            />
            <label htmlFor="contact">Contact:</label>
            <input
              type="text"
              id="contact"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />
           

            <button type="submit">Register Patient on blockchain</button>
            <div className="already-registered"> 
      Already Registered? <Link to="/patsignin" >SignIn</Link>
      </div>
          </form>
          
          {/* <ToastContainer /> */}
        </div>
        <div className="fileupload">
          <h2>Upload file</h2>
          <input type="file" onChange={handleFileChange}/>
          <label htmlFor="address">Address of Patient:</label>
            <input
              type="text"
              id="address" 
              value={uaddress}
              onChange={(e) => setUaddress(e.target.value)}
            />

          <label htmlFor="filename">FileName:</label>
            <input
              type="text"
              id="filename"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
            />
            <label htmlFor="filetype">FileType:</label>
            <input
              type="text"
              id="filetype"
              value={filetype}
              onChange={(e) => setFiletype(e.target.value)}
            />
          <div className="buttons-container">
            <button className="upload-button" onClick={handleUpload}> Upload File</button>
            <button className="get-link-button" onClick={handleGetLink}> Add to chain</button>
          </div>
          
    

        </div>
        </body>
        </Layout>
        </>
        
      );

}
export default AddPatient;