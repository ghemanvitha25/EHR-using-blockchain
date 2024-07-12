import React, { useState, useEffect } from "react";
import LogsContract from "../constants/LogsContract.json"
import { useWeb3Contract } from "react-moralis";
import console from "console-browserify";
import Layout from "./Layout";
import "../styles/logs.css"
import BackButton from "./BackButton.js";
import { Link } from "react-router-dom";
import Score from "./Score.js";

const { keccak256 } = require('js-sha3');
function GetLogs(){
    const logadd="0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
    const [nodedata, setNodedata] = useState(null);
    const[txhash,settxhash]=useState("");
    const { runContractFunction: fetch, data } = useWeb3Contract({
        abi: LogsContract.abi,
        contractAddress: logadd,
        functionName: "getAllLogs",
        params: {
            _source: window.ethereum.selectedAddress,
        },
    });
    const { runContractFunction: fetchlast, data:lastdata } = useWeb3Contract({
        abi: LogsContract.abi,
        contractAddress: logadd,
        functionName: "getLastAddedLog",
        params: {
            _source: window.ethereum.selectedAddress,
        },
    });

    const fetchdata = async () => {
        await fetch();
    };
    const fetchdata2=async()=>{
        await fetchlast();
    }
    useEffect(()=>{
        if (lastdata && lastdata.length > 0) {
            console.log("Last data:", lastdata);
            // Assuming lastdata is an array of length 4
            const [address, encryptedData, addedToBlockchain, lastUpdate] = lastdata;
            const lastUpdateNumber = lastUpdate.toNumber();
            const lastUpdateHash = keccak256(lastUpdateNumber.toString());
            // Check if the required data elements are present
            if (address && encryptedData && typeof addedToBlockchain === "boolean" && lastUpdate) {
                const formattedData = {
                    address,
                    Encrypted: encryptedData,
                    addedToBlockchain,
                    last: lastUpdateNumber,
                    lastHash: lastUpdateHash,
         // Convert BigNumber to number
                };
                setNodedata([formattedData]); // Setting an array of last added log data
            } else {
                console.error("Invalid structure of last added log data:", lastdata);
            }
        }
    },[lastdata]);
    useEffect(() => {
        if (data && data.length > 0) {
            console.log(data);
            const formattedData = data.map((item) => {
                const lastUpdateNumber = item[3].toNumber();
                const lastUpdateHash = keccak256(lastUpdateNumber.toString());

                return {
                    address: item[0],
                    Encrypted: item[1],
                    // added: item[2],
                    last: lastUpdateNumber,
                    lastHash: lastUpdateHash,
                };
            });
            setNodedata(formattedData);
        }
    }, [data]);

    return(
        <Layout>
            <body className="logs">
            <div>
                <div className="transactions">
                    <button onClick={fetchdata}>Get All Transaction Details</button>
                    <button onClick={fetchdata2}>Get Last Transaction Details</button>
                    {nodedata && (
                        <form className="transaction-form">
                            {nodedata.map((node, index) => (
                                <div key={index} className="transaction-details">
                                    <label>Transaction Hash:</label>
                                    <input type="text" value={node.lastHash} readOnly />
                                    <label>Address:</label>
                                    <input type="text" value={node.address} readOnly />
                                    <label>Encrypted Log Data:</label>
                                    <textarea value={node.Encrypted} readOnly />
                                    <label>Last Updated:</label>
                                    <input type="text" value={new Date(node.last * 1000).toString()} readOnly />
                                </div>
                            ))}
                        </form>
                    )}
                </div>
                
                <div>
                    <BackButton />
                </div>
                <div className="signout-container">
            <Link to="/" className="signout-link">
              SignOut
            </Link>
          </div>
          <Score />
            </div>
            </body>
        </Layout>
    )

}
export default GetLogs;