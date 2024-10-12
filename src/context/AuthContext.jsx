/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { API_URL } from "../utils/API";

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const initialValues = {
    user: null,
    loading: true,
  };
  const [state, setState] = useState(initialValues);

  useEffect(() => {
    const access_token = localStorage.getItem("access_token");
    const refresh_token = localStorage.getItem("refresh_token");

    const fetchUser = async () => {
      if (access_token) {
        // const user = decode(access_token);
        const user = jwtDecode(access_token);
        const exp = user?.exp;

        // Check if the token has expired
        if (exp < Date.now() / 1000) {
          // Attempt to refresh the access token
          try {
            const response = await fetch(`${API_URL}users/token`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ refresh_token }),
            });
            const data = await response.json();

            if (data.access_token) {
              localStorage.setItem("access_token", data.access_token);
              setState((prev) => ({ ...prev, user: data.user }));
            } else {
              console.log("Failed to refresh token");
              setState((prev) => ({ ...prev, user: null }));
            }
          } catch (error) {
            console.error("Error refreshing token:", error);
            setState((prev) => ({ ...prev, user: null }));
          }
        } else {
          // If the token is valid, set the user
          setState((prev) => ({ ...prev, user }));
        }
      } else {
        console.log("No access token found");
      }

      // Set loading to false once processing is done
      setState((prev) => ({ ...prev, loading: false }));
    };

    fetchUser();
  }, []);

  if (state?.loading) return;

  return (
    <AuthContext.Provider value={{ ...state, isAuthenticated: !!state.user }}>
      {children}
    </AuthContext.Provider>
  );
};

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
}

export { AuthContext, AuthProvider, useAuth };
