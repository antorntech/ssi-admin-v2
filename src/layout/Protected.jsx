/* eslint-disable react/prop-types */
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

const ProtectedLayout = ({ children }) => {
  const { user } = useAuth();
  useEffect(() => {
    if (user?.email == false) {
      if (window.location.pathname != "/auth/login") {
        window.location.href = "/auth/login";
      }
    }
  }, [user?.email]);
  // if (!user) return null;
  return children;
};

export default ProtectedLayout;
