import React, { useEffect } from "react";
import AppLayout from "./layout/AppLayout";

const App = () => {
  // Add your application logic here
  useEffect(() => {
    setTimeout(() => {
      localStorage.clear();
      window.location.reload();
    }, 3000000);
  }, []);

  return (
    <>
      <AppLayout />
    </>
  );
};

export default App;
