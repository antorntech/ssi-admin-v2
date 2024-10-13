import React from "react";
import Header from "../shared/Header";
import AppRoutes from "../routes/AppRoutes";
import Sidenav from "../shared/Sidenav";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AppLayout = () => {
  const user = localStorage.getItem("access_token");
  return (
    <>
      {user ? (
        <div className="flex items-start">
          <div className="md:w-[250px]">
            <Sidenav />
          </div>
          <div className="w-full md:w-[calc(100%-250px)]">
            <div className="min-h-[70px] w-full float-right">
              <Header />
            </div>
            <div className="content-shadow bg-[#F8F8FB] min-h-[calc(100vh-70px)] p-5 md:p-7 mt-[70px]">
              <AppRoutes />
            </div>
          </div>
        </div>
      ) : (
        <AppRoutes />
      )}
      <ToastContainer />
    </>
  );
};

export default AppLayout;
