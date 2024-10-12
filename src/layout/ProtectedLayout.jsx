import { AuthContext } from "../context/AuthContext";
import { useContext, useEffect } from "react";

const ProtectedLayout = ({ children }) => {
  const { user, isAuthenticated } = useContext(AuthContext);
  console.log(isAuthenticated);
  useEffect(() => {
    if (user?.email == false) {
      window.location.href = "/login";
    }
  }, [user?.email]);

  return children;
};

export default ProtectedLayout;
