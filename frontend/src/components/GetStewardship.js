import React, { useState, useEffect } from "react";
import StewardRelationshipHistoryContract from "../constants/StewardRelationshipHistoryContract.json";
import { useWeb3Contract } from "react-moralis";
import Layout from "./Layout";
import { Link } from "react-router-dom";
import Score from "./Score.js";
import "../styles/GetStewardShip.css";
import BackButton from "./BackButton.js";


function GetStewardShip(){
    const srhcadd ="0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"
    const [nodedata, setNodedata] = useState(null);
    const [otherNodeAddress, setOtherNodeAddress] = useState("");
    const [newStatus, setNewStatus] = useState("");
    const { runContractFunction: updateStewardshipStatus } = useWeb3Contract({
        abi: StewardRelationshipHistoryContract.abi,
        contractAddress: srhcadd,
        functionName: "updateStewardshipStatus",
        params: {
          node: window.ethereum.selectedAddress,
          otherNode:otherNodeAddress,
          newStatus:newStatus
        },
      });
      const handleSubmit = async (e) => {
        e.preventDefault();
        await updateStewardshipStatus ({
          onSuccess: (tx) => handleSetOnSuccess(tx),
          onError: (error) => alert("Not able to update status"),
        });
      };
      async function handleSetOnSuccess(tx) {
        await tx.wait(1);
        console.log("success");
        alert("Status updated");
    
       
      }
    const { runContractFunction: fetch, data } = useWeb3Contract({
        abi: StewardRelationshipHistoryContract.abi,
        contractAddress: srhcadd,
        functionName: "getEngagedStewardships",
        params: {
            node: window.ethereum.selectedAddress,
        },
    });
    
    const fetchdata = async () => {
        await fetch();
    };

    useEffect(() => {
        if (data) {
            console.log(data);
            // Map through each node and format the data
            const formattedData = data[0].map((address, index) => ({
                address,
                status: data[1][index],
                timestamp: data[2][index].toNumber(),
            }));
            setNodedata(formattedData);
        }
    }, [data]);


  return (
    <Layout>
      <body className="steward">
        <div className="form-container2">
          <div className="get-engaged-nodes" >
            
            <button onClick={fetchdata}>Get Engaged Nodes</button>
            { nodedata && (
              <div className="data-container2">
                {nodedata.map((node, index) => (
                  <div key={index}>
                    <p>Address: {node.address}</p>
                    <p>Status: {node.status}</p>
                    <p>Timestamp: {new Date(node.timestamp * 1000).toString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Update Stewardship Status Form */}
          <div className="update-stewardship-status">
            <h3>Update Stewardship Status</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Node Address"
                value={otherNodeAddress}
                onChange={(e) => setOtherNodeAddress(e.target.value)}
              />
              <input
                type="text"
                placeholder="New Status"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              />
              <button type="submit">Update Status</button>
            </form>
          </div>
        </div>
        <div className="signout-container">
            <Link to="/" className="signout-link">
              SignOut
            </Link>
          </div>
           <Score/>
        <BackButton />
      </body>
    </Layout>
  );
}

export default GetStewardShip;
