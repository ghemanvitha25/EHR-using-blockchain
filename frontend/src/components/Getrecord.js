import React, { useState, useEffect } from "react";
import StewardRelationshipHistoryContract from "../constants/StewardRelationshipHistoryContract.json";
import PatientRecordsContract from "../constants/PatientRecordsContract.json";
import { useWeb3Contract } from "react-moralis";
import Layout from "./Layout";
import BackButton from "./BackButton";
import "../styles/Getrecord.css";
import { Link } from "react-router-dom";
import Score from "./Score.js";

function Getrecord() {
  const [saddress, setSaddress] = useState("");
  const [nodedata, setNodedata] = useState(null);
  const [engagedNodeAddresses, setEngagedNodeAddresses] = useState([]);
  const srhcadd ="0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
  const Prcadd = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

  const { runContractFunction: fetchPatientRecords, data: patientRecordsData } = useWeb3Contract({
    abi: PatientRecordsContract.abi,
    contractAddress: Prcadd,
    functionName: "getPatientRecords",
    params: {
      _patient: saddress,
    },
  });

  const { runContractFunction: fetchEngagedNodes, data: engagedNodesData } = useWeb3Contract({
    abi: StewardRelationshipHistoryContract.abi,
    contractAddress: srhcadd,
    functionName: "getEngagedStewardships",
    params: {
      node: window.ethereum.selectedAddress,
    },
  });

  const fetchPatientRecordsData = async () => {
    await fetchPatientRecords();
  };

  useEffect(() => {
    if (patientRecordsData) {
      console.log("Fetched patient records data:", patientRecordsData);
      const patientAddress = patientRecordsData[0];
      const patientRecords = patientRecordsData[1];
      const formattedData = patientRecords.map((record, index) => ({
        fileName: record.fileName,
        queryLinkHash: record.queryLinkHash,
      }));
      console.log("Formatted patient records data:", formattedData);
      setNodedata({ address: patientAddress, records: formattedData });
    }
  }, [patientRecordsData]);

  useEffect(() => {
    const fetchEngagedNodesData = async () => {
      try {
        await fetchEngagedNodes();
      } catch (error) {
        console.error("Error fetching engaged nodes:", error);
      }
    };
    fetchEngagedNodesData();
  }, []);

  useEffect(() => {
    if (engagedNodesData) {
      console.log("Fetched engaged nodes data:", engagedNodesData);
      // Extract only addresses from engaged nodes data
      const addresses = engagedNodesData[0];
      console.log("Engaged node addresses:", addresses);
      // Set the engaged node addresses
      setEngagedNodeAddresses(addresses);
    }
  }, [engagedNodesData]);


  return (
    <Layout>
      <body className="record">
      <div>
        <BackButton />
      </div>
      <div className="form-container3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchPatientRecordsData();
          }}
        >
          <label htmlFor="address">Select Address:</label>
          <select
            id="address"
            value={saddress}
            onChange={(e) => setSaddress(e.target.value)}
          >
            <option value="">Select Patient Address</option>
            {engagedNodeAddresses.map((address, index) => (
              <option key={index} value={address}>
                {address}
              </option>
            ))}
          </select>
          <button type="submit">Get Patient Record</button>
        </form>
        {nodedata && (
          <div className="data-container3">
            <p>Patient Address: {nodedata.address}</p>
            {nodedata.records.map((record, index) => (
              <div key={index}>
                <p>FileName: {record.fileName}</p>
                <p>
                  Link:{" "}
                  <a
                    href={record.queryLinkHash}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {record.queryLinkHash}
                  </a>
                </p>
              </div>
            ))}
          </div>
        )}
         <div className="signout-container">
            <Link to="/" className="signout-link">
              SignOut
            </Link>
           
          </div>
           <Score/>
      </div>
      </body>
    </Layout>
  );
}

export default Getrecord;
