import { AuthContext } from "../context/AuthContext";
import { useContext, useEffect } from "react";

const ProtectedLayout = ({ children }) => {
  const { user } = useContext(AuthContext);
  useEffect(() => {
    if (user?.email == false) {
      window.location.href = "/auth/login";
    }
  }, [user?.email]);

  return children;
};

export default ProtectedLayout;
