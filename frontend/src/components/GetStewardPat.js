import React, { useState, useEffect } from "react";
import StewardRelationshipHistoryContract from "../constants/StewardRelationshipHistoryContract.json";
import PatientRecordsContract from "../constants/PatientRecordsContract.json";
import { useWeb3Contract } from "react-moralis";
import console from "console-browserify";
import Layout from "./Layout";
import "../styles/getstewardpat.css";
import BackButton from "./BackButton.js";

function GetStewardPat() {
    const srhcadd = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
    const Prcadd = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
    const [nodedata, setNodedata] = useState(null);
    const [newdata, setNewdata] = useState(null);
    const { runContractFunction: fetch, data } = useWeb3Contract({
        abi: StewardRelationshipHistoryContract.abi,
        contractAddress: srhcadd,
        functionName: "getEngagedStewardships",
        params: {
            node: window.ethereum.selectedAddress,
        },
    });
    const { runContractFunction: fetchPatientRecords, data: patientRecordsData } = useWeb3Contract({
        abi: PatientRecordsContract.abi,
        contractAddress: Prcadd,
        functionName: "getPatientRecords",
        params: {
            _patient: window.ethereum.selectedAddress,
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
            setNewdata({ address: patientAddress, records: formattedData });
        }
    }, [patientRecordsData]);
    
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
        <>
            <Layout>
                <body className="stewardpat">
                    <div className="form-container7">
                        <button onClick={fetchdata}>Get Engaged Nodes</button>
                        {nodedata && (
                            <div className="data-container7">
                                {nodedata.map((node, index) => (
                                    <div key={index}>
                                        <p>Address: {node.address}</p>
                                        <p>Status: {node.status}</p>
                                        <p>Timestamp: {new Date(node.timestamp * 1000).toString()}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                        <BackButton /> {/* {nodedata && <Getrecord nodedata={nodedata} />} */}
                    </div>
                    <div className="form-container9">
                        <button onClick={fetchPatientRecordsData}>Get My Records</button>
                        {newdata && (
                            <div className="data-container9">
                                <p>Patient Address: {newdata.address}</p>
                                {newdata.records.map((record, index) => (
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
                        {/* {nodedata && <Getrecord nodedata={nodedata} />} */}
                    </div>
                </body>
            </Layout>
        </>
    );
}

export default GetStewardPat;
