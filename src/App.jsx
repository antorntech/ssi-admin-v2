import React, { useEffect, useState } from "react";
import AppLayout from "./layout/AppLayout";
import { API_URL } from "./utils/API";
import FetchContext from "./context/FetchContext";

const App = () => {
  const [token, setToken] = useState(null);
  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);
  useEffect(() => {
    setTimeout(() => {
      localStorage.clear();
      window.location.reload();
    }, 3000000);
  }, []);
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
      <AppLayout />
    </FetchContext.Provider>
  );
};

export default App;
