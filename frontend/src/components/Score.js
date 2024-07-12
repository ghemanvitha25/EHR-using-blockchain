import React, { useState, useEffect } from "react";
import Base from "../constants/base.json";
import { useWeb3Contract } from "react-moralis";
import console from "console-browserify";
import "../styles/Score.css";

function Score() {
  const [score, setScore] = useState();
  const baseadd = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";
  const { runContractFunction: fetchdata, data: Data } = useWeb3Contract({
    abi: Base.abi,
    contractAddress: baseadd,
    functionName: "getDoctorScore",
    params: {
      doctorAddress: window.ethereum.selectedAddress,
    },
  });

  useEffect(() => {
    const fetchScoreData = async () => {
      try {
        await fetchdata();
      } catch (error) {
        console.error("Error fetching score:", error);
      }
    };
    fetchScoreData();
  }, [fetchdata]);

  useEffect(() => {
    if (Data) {
      setScore(Data.toString());
      console.log(Data.toString());
    }
  }, [Data]);

  return (
    <div className="styled-box">
      <p>Your Authority Points: {score}</p>
    </div>
  );
}

export default Score;
