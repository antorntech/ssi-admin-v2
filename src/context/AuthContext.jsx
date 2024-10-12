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
              setUser(jwtDecode(data.access_token));
            } else {
              console.error("Failed to refresh token");
              setUser(null);
            }
          } catch (error) {
            console.error("Error refreshing token:", error);
            setUser(null);
          }
        } else {
          setUser(user);
        }
      } else {
        console.log("No access token found");
      }
      setLoading(false);
    };

    fetchUser();

    // Optional: cleanup function to avoid memory leaks
    return () => {
      setUser(null);
      setLoading(true);
    };
  }, []);

  if (loading) return null; // Return null while loading

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading }}>
      {children}
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
