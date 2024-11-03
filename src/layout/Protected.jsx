/* eslint-disable react/prop-types */
import useAuth from "../hooks/useAuth";

const ProtectedLayout = ({ children }) => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? children : null; // Render content if authenticated
};

export default ProtectedLayout;
