// BackButton.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons';
import "../styles/BackButton.css";

function BackButton() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <FontAwesomeIcon icon={faArrowAltCircleLeft} className="back-button-icon" onClick={handleGoBack} />
    
  );
}

export default BackButton;
