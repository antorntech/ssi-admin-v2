/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { API_URL } from "../utils/API";

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const access_token = localStorage.getItem("access_token");
    const refresh_token = localStorage.getItem("refresh_token");
    if (access_token) {
      const user = jwtDecode(access_token);
      const exp = user?.exp;

      // Check if the token has expired
      if (exp < Date.now() / 1000) {
        // Attempt to refresh the access token
        async function refreshAccessToken() {
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
              console.log("Failed to refresh token");
            }
          } catch (error) {
            console.error("Error refreshing token:", error);
          }
        }

        refreshAccessToken();
      }

      setUser(user);
    } else {
      console.log("No access token found");
    }
    setLoading(false);
  }, []);

  if (loading) return;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading }}>
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
