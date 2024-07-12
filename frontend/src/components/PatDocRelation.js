import React, { useState, useEffect } from "react";
import Base from "../constants/base.json";
import { useWeb3Contract } from "react-moralis";
import console from "console-browserify";
import "../styles/PatDocRelation.css";
import BackButton from "./BackButton";
import book from "../images/book.jpg";

function PatDocRelation() {
  const baseadd = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";
  const [doctorAddresses, setDoctorAddresses] = useState([]);
  const [daddress, setDaddress] = useState("");
  const [doctorSpecializations, setDoctorSpecializations] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");

  const timeSlots = ["09:00-10:00 AM", "10:00-11:00 AM", "11:00-12:00 PM", "12:00-01:00 PM", "02:00-03:00 PM", "03:00-04:00 PM", "04:00-05:00 PM"];

  const getDoctorId = (selectedSpecialization) => {
    if (!doctorSpecializations) {
      return "";
    }
    const index = doctorSpecializations.findIndex(spec => spec[1] === selectedSpecialization);
    if (index !== -1) {
      return doctorSpecializations[index][0];
    } else {
      return "";
    }
  };

  const { runContractFunction: grantAccessPatientToDoctor } = useWeb3Contract({
    abi: Base.abi,
    contractAddress: baseadd,
    functionName: "grantAccessPatientToDoctor",
    params: {
      doctorId: selectedDoctor,
      patientId: window.ethereum.selectedAddress,
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await grantAccessPatientToDoctor({
      onSuccess: (tx) => handleSetOnSuccess(tx),
      onError: (error) => alert("Already appointment is booked with this doctor"),
    });
  };

  async function handleSetOnSuccess(tx) {
    await tx.wait(1);
    console.log("success");
  }

  const { runContractFunction: getDoctorSpecializations } = useWeb3Contract({
    abi: Base.abi,
    contractAddress: baseadd,
    functionName: "getDoctorSpecializations",
  });

  useEffect(() => {
    const fetchDoctorSpecializations = async () => {
      try {
        const specializations = await getDoctorSpecializations();
        setDoctorSpecializations(specializations);
        console.log(specializations);
      } catch (error) {
        console.error("Error fetching doctor specializations:", error);
      }
    };
    fetchDoctorSpecializations();
  }, []);

  return (
    <body className="patdoc">
      <div className="container">
        <div className="form-container10">
          <h2>Book Your Appointment</h2>
          <BackButton />
          <form onSubmit={handleSubmit}>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <label htmlFor="mobileNumber">Mobile Number:</label>
            <input
              type="tel"
              id="mobileNumber"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
            />
            <label htmlFor="date">Date:</label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <label htmlFor="timeSlot">Time Slot:</label>
            <select
              id="timeSlot"
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
            >
              <option value="">Select a Time Slot</option>
              {timeSlots.map((slot, index) => (
                <option key={index} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
            <label htmlFor="doctorSelect">Select Doctor:</label>
            <select
              id="doctorSelect"
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
            >
              <option value="">Select a Doctor</option>
              <option value="0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266">
                No Specified Doctor
              </option>
              {doctorSpecializations &&
                doctorSpecializations[1] &&
                doctorSpecializations[1].map((specialization, index) => (
                  <option key={index} value={doctorSpecializations[0][index]}>
                    {specialization}
                  </option>
                ))}
            </select>
            <p>
              If no specified doctor is selected then booking appointment with general physician.
            </p>
            <button type="submit">Book Appointment</button>
          </form>
        </div>
        <div className="image-container">
          <img src={book} alt="Book Appointment" />
        </div>
      </div>
    </body>
  );
}

export default PatDocRelation;
