import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";

const RedirectWithAlert = ({ to = "/", message = "Access denied." }) => {
  const location = useLocation();

  useEffect(() => {
    alert(message);
  }, []);

  return <Navigate to={to} state={{ from: location }} replace />;
};

export default RedirectWithAlert;
