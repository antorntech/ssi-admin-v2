/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { API_URL } from "../utils/API"; // Ensure the correct API_URL
import Loader from "../loader/Loader";

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Start loading initially

  useEffect(() => {
    const access_token = localStorage.getItem("access_token");
    const refresh_token = localStorage.getItem("refresh_token");

    const handleTokenRefresh = async (refresh_token) => {
      if (!refresh_token) {
        console.log("No refresh token found. Logging out...");
        return logout();
      }

      try {
        const response = await fetch(`${API_URL}users/token`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh_token }),
        });

        if (!response.ok) {
          throw new Error("Failed to refresh token");
        }

        const data = await response.json();
        if (data.access_token) {
          localStorage.setItem("access_token", data.access_token);
          const newUser = jwtDecode(data.access_token);
          setUser(newUser); // Update user state
        } else {
          console.error("No new access token received");
          logout(); // Logout if refresh fails
        }
      } catch (error) {
        console.error("Error refreshing token:", error);
        logout(); // Handle logout on error
      } finally {
        setLoading(false); // Stop loading after processing
      }
    };

    const fetchUser = async () => {
      try {
        const decodedUser = jwtDecode(access_token);
        const tokenExp = decodedUser?.exp * 1000;

        if (tokenExp < Date.now()) {
          console.log("Access token expired. Attempting to refresh...");
          await handleTokenRefresh(refresh_token); // Try refreshing token
        } else {
          setUser(decodedUser); // Token is valid, set the user
        }
      } catch (error) {
        console.log(
          "Logging out because access_token = undefined. On error I have triggered logout.\n",
          error
        );
        logout();
      } finally {
        setLoading(false); // Stop loading after processing
      }
    };

    fetchUser();
  }, []);

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    setUser(null);
    setLoading(false);
    if (window.location.pathname !== "/auth/login") {
      window.location.href = "/auth/login"; // Redirect to login
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, loading, logout }}
    >
      {!loading && children} {/* Render only after loading completes */}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
