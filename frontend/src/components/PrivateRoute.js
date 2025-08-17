import React from "react";
import RedirectWithAlert from "./RedirectWithAlert";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  return token ? children : (
    <RedirectWithAlert
      to="/"
      message="You must be logged in to access this page."
    />
  );
};

export default PrivateRoute;
