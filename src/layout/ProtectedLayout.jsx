import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedLayout = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    navigate("/login");
  }

  return children;
};

export default ProtectedLayout;
