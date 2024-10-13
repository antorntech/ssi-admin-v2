/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useState } from "react";
import { API_URL } from "../utils/API";

const FetchContext = createContext(null);

const FetchProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState("");
  useEffect(() => {
    const access_token = localStorage.getItem("access_token");
    if (!access_token) return;
    setAccessToken(access_token);
  }, []);
  return (
    <FetchContext.Provider
      value={{
        request: function (endpoint = "", options = {}) {
          if (endpoint.startsWith("/")) endpoint = endpoint.slice(1);
          if (!options.Headers) options.Headers = {};
          options.Headers.Authorization = `Bearer ${accessToken}`;
          const fullPath = API_URL + endpoint;
          return fetch(fullPath, options);
        },
      }}
    >
      {children}
    </FetchContext.Provider>
  );
};

export const useFetch = () => {
  const context = useContext(FetchContext);
  if (context === undefined) {
    throw new Error("useFetch must be used within a FetchProvider");
  }
  return context;
};

export { FetchProvider, FetchContext };

export default FetchContext;
