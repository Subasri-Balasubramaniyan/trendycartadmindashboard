import React, { useEffect, useState } from "react";
import "./CustomerBrandingSettingsPage.css";

const STORAGE_KEY = "trendycart_customer_branding";

const CustomerBrandingSettingsPage = () => {
  const [settings, setSettings] = useState({
    logoDataUrl: "",
    logoFileName: "",
    primaryColor: "#FF5733",
    secondaryColor: "#00AACC",
    fontFamily: "Roboto",
    customHTML: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setSettings((prev) => ({
        ...prev,
        logoDataUrl: reader.result,
        logoFileName: file.name,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    alert("Branding settings saved!");
  };

  const handleClear = () => {
    localStorage.removeItem(STORAGE_KEY);
    setSettings({
      logoDataUrl: "",
      logoFileName: "",
      primaryColor: "#FF5733",
      secondaryColor: "#00AACC",
      fontFamily: "Roboto",
      customHTML: "",
    });
    alert("Branding settings cleared.");
  };

  return (
    <div className="branding-settings-card">
      <h2>Customer Portal Branding Settings</h2>

      <div className="form-group">
        <label>Logo Upload:</label>
        <input type="file" accept="image/*" onChange={handleLogoUpload} />
        {settings.logoFileName && (
          <p className="file-name">Selected File: {settings.logoFileName}</p>
        )}
      </div>

      <div className="form-group color-group">
        <label>Primary Color:</label>
        <div className="color-picker">
          <input
            type="color"
            name="primaryColor"
            value={settings.primaryColor}
            onChange={handleChange}
          />
          <span className="color-code">{settings.primaryColor}</span>
        </div>
      </div>

      <div className="form-group color-group">
        <label>Secondary Color:</label>
        <div className="color-picker">
          <input
            type="color"
            name="secondaryColor"
            value={settings.secondaryColor}
            onChange={handleChange}
          />
          <span className="color-code">{settings.secondaryColor}</span>
        </div>
      </div>

      <div className="form-group">
        <label>Font Family:</label>
        <select name="fontFamily" value={settings.fontFamily} onChange={handleChange}>
          <option>Roboto</option>
          <option>Open Sans</option>
          <option>Poppins</option>
          <option>Montserrat</option>
          <option>Lato</option>
        </select>
      </div>

      <div className="form-group">
        <label>Custom HTML Block (Dashboard):</label>
        <textarea
          name="customHTML"
          value={settings.customHTML}
          onChange={handleChange}
          rows="5"
          placeholder="You can write raw HTML here..."
        ></textarea>
      </div>

      <div className="form-actions">
        <button className="save-btn" onClick={handleSave}>
          Save Settings
        </button>
        <button className="clear-btn" onClick={handleClear}>
          Clear Settings
        </button>
      </div>
    </div>
  );
};

export default CustomerBrandingSettingsPage;
