import React, { useState, useEffect } from "react";
import Base from "../constants/base.json";
import { useWeb3Contract } from "react-moralis";
import Layout from "./Layout";
import "../styles/Rate.css";

function Rate() {
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [rating, setRating] = useState(0);
  const [specializations, setSpecializations] = useState([]);
  const baseadd = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";

  const { runContractFunction: rateDoctor } = useWeb3Contract({
    abi: Base.abi,
    contractAddress: baseadd,
    functionName: "rateDoctor",
    params: {
      doctorId: selectedDoctor,
      rating: rating,
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await rateDoctor({
      onSuccess: (tx) => handleSetOnSuccess(tx),
      onError: (error) => alert(`Not able to rate`),
    });
  };

  async function handleSetOnSuccess(tx) {
    await tx.wait(1);
    console.log("rated");
    alert("Thank you for your rating");
    setRating(0); // Reset rating
  }

  const { runContractFunction: fetchdata, data: Data } = useWeb3Contract({
    abi: Base.abi,
    contractAddress: baseadd,
    functionName: "getDoctorSpecializationsOfPatient",
    params: {
      patientId: window.ethereum.selectedAddress,
    },
  });

  useEffect(() => {
    const fetchEngagedNodesData = async () => {
      try {
        await fetchdata();
      } catch (error) {
        console.error("Error fetching engaged nodes:", error);
      }
    };
    fetchEngagedNodesData();
  }, []);

  useEffect(() => {
    if (Data) {
      const specializationsList = Data[0].map((address, index) => ({
        address,
        specialization: Data[1][index],
      }));
      setSpecializations(specializationsList);
      console.log("Fetched data:", specializationsList);
    }
  }, [Data]);

  const handleStarClick = (star) => {
    setRating(star);
  };

  return (
    <Layout>
      <body className="rate">
      <div className="container">
        <h1>Rate Your Doctor</h1>
        <div className="doctor-list">
          {specializations.map((item, index) => (
            <div
              key={index}
              className={`doctor-item ${item.address === selectedDoctor ? "selected" : ""}`}
              onClick={() => setSelectedDoctor(item.address)}
            >
              <h3>{item.specialization}</h3>
            </div>
          ))}
        </div>
        {selectedDoctor && (
          <form onSubmit={handleSubmit} className="rating-section">
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star ${star <= rating ? "selected" : ""}`}
                  onClick={() => handleStarClick(star)}
                >
                  ★
                </span>
              ))}
            </div>
            <button type="submit" className="btn btn-primary">
              Submit Rating
            </button>
          </form>
        )}
      </div>
      </body>
    </Layout>
  );
}

export default Rate;
