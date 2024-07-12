import React from "react";
import InformationCard from "./InformationCard";
import { faFileMedical, faUserMd, faLock } from "@fortawesome/free-solid-svg-icons";
import "../styles/Info.css";

function Info() {
  return (
    <div className="info-section" id="services">
      <div className="info-title-content">
        <h3 className="info-title">
          <span>What We Do</span>
        </h3>
        <p className="info-description">
          We bring healthcare to your convenience, offering a comprehensive
          range of on-demand medical services tailored to your needs. Our
          platform allows you to connect with experienced online doctors who
          provide expert medical advice, issue online prescriptions, and offer
          quick refills whenever you require them.
        </p>
      </div>

      <div className="info-cards-content">
        <InformationCard
          title="Doctors"
          description="Booking an appointment with our doctors is simple and convenient.  
                      You can easily choose your preferred date and time to fit your schedule. 
            Our network includes experienced specialists dedicated to providing expert care.
    "
          icon={faUserMd}
        />

        <InformationCard
          title="Medical Records"
          description="Uploading patient records is quick and secure.
           Easily store all your medical information in one place. 
           Access your records anytime, from any device. 
           Share your records seamlessly with your healthcare providers. 
           Ensure your data is safe with our advanced encryption."
          icon={faFileMedical}
        />

        <InformationCard
          title="Security"
          description="Your records are protected with state-of-the-art security measures.
           We use advanced encryption to keep your data safe and confidential.
            Access is restricted to authorized users only, ensuring your privacy."
          icon={faLock}
        />
      </div>
    </div>
  );
}

export default Info;
