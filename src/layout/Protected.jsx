import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ProtectedLayout = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth/login"); // Redirect to login if unauthenticated
    }
  }, [user, loading, navigate]);

  if (loading) return <div>Loading...</div>; // Avoid rendering during loading

  return children; // Render content if authenticated
};

export default ProtectedLayout;
