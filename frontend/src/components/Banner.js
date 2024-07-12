import React, { useState, useEffect } from "react";
import "../styles/Banner.css";
import banner1 from "../images/banner/banner1.jpg";
import banner2 from "../images/banner/banner2.jpg";
import banner3 from "../images/banner/banner3.jpg";

const Slideshow = () => {
  const images = [banner1, banner2, banner3];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  // Define function to automatically move to next image
  const autoNextImage = () => {
    nextImage();
  };

  // Use useEffect to start automatic slideshow when component mounts
  useEffect(() => {
    const intervalId = setInterval(autoNextImage, 2000); // Change the time interval as needed (3000ms = 3 seconds)
    
    // Clear the interval when component unmounts or when currentImageIndex changes
    return () => clearInterval(intervalId);
  }, [currentImageIndex]); // Add currentImageIndex as a dependency to re-run useEffect when it changes

  return (
    <div className="slideshow-container">
      <button className="prev" onClick={prevImage}>
        &#10094; {/* Unicode for left-pointing arrow */}
      </button>
      <div className="image-overlay">
        <img src={images[currentImageIndex]} alt={`Slide ${currentImageIndex}`} />
        <div className="text-overlay">
          <h2>MedChain</h2>
          <p>We ensure the best health care as well as clinical service</p>
        </div>
      </div>
      <button className="next" onClick={nextImage}>
        &#10095; {/* Unicode for right-pointing arrow */}
      </button>
    </div>
  );
};

export default Slideshow;
