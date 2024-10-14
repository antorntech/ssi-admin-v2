import { Outlet } from "react-router-dom";
import Header from "../shared/Header";
import Sidenav from "../shared/Sidenav";

const RootLayout = () => {
  return (
    <div className="flex items-start">
      <div className="md:w-[250px]">
        <Sidenav />
      </div>
      <div className="w-full md:w-[calc(100%-250px)]">
        <div className="min-h-[70px] w-full float-right">
          <Header />
        </div>
        <div className="content-shadow bg-[#F8F8FB] min-h-[calc(100vh-70px)] p-5 md:p-7 mt-[70px]">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default RootLayout;
