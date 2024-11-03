/* eslint-disable react/prop-types */
import useAuth from "../hooks/useAuth";

const UnProtected = ({ children }) => {
  const { isAuthenticated } = useAuth();

  // Not protected that mean opposite of isAuthenticated
  return !isAuthenticated ? children : null;
};

export default UnProtected;
