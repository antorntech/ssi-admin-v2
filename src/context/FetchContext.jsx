/* eslint-disable react/prop-types */
import { createContext } from "react";
import { API_URL } from "../utils/API";

const FetchContext = createContext(null);

const FetchProvider = ({ children }) => {
  const token = "";
  return (
    <FetchContext.Provider
      value={{
        request: function (endpoint = "", options = {}) {
          if (endpoint.startsWith("/")) endpoint = endpoint.slice(1);
          if (!options.Headers) options.Headers = {};
          if (token) options.Headers.Authorization = `Bearer ${token}`;
          const fullPath = API_URL + endpoint;
          return fetch(fullPath, options);
        },
      }}
    >
      {children}
    </FetchContext.Provider>
  );
};

export { FetchProvider, FetchContext };

export default FetchContext;
