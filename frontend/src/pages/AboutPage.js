import React from "react";
import "./AboutPage.css";
import aboutBanner from "../assets/banners/aboutBanner.jpg"; // make sure image is saved here

const AboutPage = () => {
  return (
    <div className="about-container">
      <div className="about-banner-section">
        <img src={aboutBanner} alt="About Us Banner" className="about-banner-img" />
      </div>
      <div className="about-content-section">
        <h1>About Trendy Cart</h1>
        <p>
          Trendy Cart is your one-stop destination for the latest and most stylish clothing for men,
          women, and kids. We believe shopping should be joyful, simple, and personalized.
        </p>

        <div className="about-mission">
          <h2>Our Mission</h2>
          <p>
            To provide premium fashion experiences to every customer with high-quality products,
            fast delivery, and classy designs — all wrapped in a user-friendly online platform.
          </p>
        </div>

        <div className="about-vision">
          <h2>Our Vision</h2>
          <p>
            Empower every individual to express their unique style confidently and affordably through
            our premium fashion collection.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
