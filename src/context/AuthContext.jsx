/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode"; // Make sure to import correctly
import { API_URL } from "../utils/API";

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Start as loading

  useEffect(() => {
    const access_token = localStorage.getItem("access_token");
    const refresh_token = localStorage.getItem("refresh_token");

    const fetchUser = async () => {
      if (access_token) {
        const user = jwtDecode(access_token);
        const exp = user?.exp * 1000;

        // Check if the access token has expired
        if (exp < Date.now()) {
          // Attempt to refresh the access token
          if (refresh_token) {
            // Ensure we have a refresh token
            try {
              const response = await fetch(`${API_URL}users/token`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ refresh_token }),
              });

              if (!response.ok) {
                throw new Error("Failed to refresh token");
              }

              const data = await response.json();

              if (data.access_token) {
                localStorage.setItem("access_token", data.access_token);
                setUser(jwtDecode(data.access_token)); // Update user state with the new token
              } else {
                console.error("No new access token returned");
                logout(); // Handle logout if token refresh fails
              }
            } catch (error) {
              console.error("Error refreshing token:", error);
              logout(); // Handle logout on error
            }
          } else {
            console.log("No refresh token found, logging out");
            logout(); // Handle logout if no refresh token is available
          }
        } else {
          // If the access token is valid, set the user state
          setUser(user);
        }
      } else {
        console.log("No access token found, logging out");
      }

      setLoading(false); // Set loading to false after processing
    };
    fetchUser();

    // Optional: cleanup function to avoid memory leaks
    return () => {
      setUser(null);
      setLoading(true);
    };
  }, []);

  function logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
    window.location.href = "/auth/login";
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, loading, logout }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export { AuthContext, AuthProvider, useAuth };
