/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const UnProtected = ({ children }) => {
  const { isAuthenticated = false, loading } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      window.location.href = "/";
    }
  }, [isAuthenticated]);

  if (loading) return;

  return children;
};

export default UnProtected;
