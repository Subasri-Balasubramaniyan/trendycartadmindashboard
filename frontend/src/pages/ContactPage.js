import React, { useState } from "react";
import "./ContactPage.css";
import contactBanner from "../assets/banners/contactBanner.jpg";
import { FaFacebookF, FaInstagram, FaEnvelope } from "react-icons/fa";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="contact-page">
      <div className="contact-layout">
        <div className="contact-banner-container">
          <img src={contactBanner} alt="Contact" className="contact-banner" />
        </div>

        <div className="contact-content">
          <h1 className="animate-title">Contact Us</h1>

          {!submitted ? (
            <form className="contact-form" onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="animate-input"
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="animate-input"
              />
              <textarea
                name="message"
                rows="5"
                placeholder="Write your message..."
                value={formData.message}
                onChange={handleChange}
                required
                className="animate-input"
              ></textarea>
              <button type="submit" className="submit-button">Send Message</button>
            </form>
          ) : (
            <div className="thank-you animate-thankyou">
              <h2>Thank you!</h2>
              <p>We’ll get back to you shortly.</p>
            </div>
          )}
        </div>
      </div>

      <footer className="contact-footer"> 
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
          <FaFacebookF /> 
        </a>
        <a href="mailto:hello@trendycart.com">
          <FaEnvelope />
        </a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
          <FaInstagram />
        </a>
      </footer>
    </div>
  );
};

export default ContactPage;
