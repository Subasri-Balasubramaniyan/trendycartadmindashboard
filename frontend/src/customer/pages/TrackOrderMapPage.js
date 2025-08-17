import React from "react";
import { useParams } from "react-router-dom";
import "./TrackOrderMapPage.css";

const TrackOrderMapPage = () => {
  const { orderId } = useParams();

  return (
    <div className="map-view">
      <h2>Tracking Order #{orderId}</h2>
      <div className="map-placeholder">
        <iframe
          title="Order Tracking Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3912.4572122237286!2d79.838006!3d10.7671871!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a554d6a88a6425b%3A0x1bc5f1e531f8d9dc!2sNagapattinam%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1682782782755!5m2!1sen!2sin"
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
};

export default TrackOrderMapPage;
