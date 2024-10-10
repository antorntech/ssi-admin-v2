import {
  Avatar,
  Button,
  Input,
  Popover,
  PopoverContent,
  PopoverHandler,
} from "@material-tailwind/react";
import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const handleLogOut = () => {
    localStorage.clear();
    window.location.href = "/login";
  };
  return (
    <div className="px-5 min-h-[70px] bg-white flex items-center fixed top-0 w-[calc(100%-250px)] z-40">
      <div className="w-full hidden md:flex items-center justify-between bg-whtie">
        <div className="w-full flex items-center justify-end gap-5">
          <div className="flex items-center ">
            <div>
              <Popover placement="bottom-start" className="px-12">
                <PopoverHandler>
                  <Button className="!p-0 bg-transparent shadow-none hover:shadow-none">
                    <div className="w-12 h-12 rounded-full bg-[#97df6b] text-white flex items-center justify-center">
                      <i className="fa-solid fa-user-tie text-3xl" />
                    </div>
                  </Button>
                </PopoverHandler>
                <PopoverContent className="mt-2 w-[150px]">
                  <div className="h-[1px] w-full bg-gray-200 my-2"></div>
                  <Link
                    to={"/profile"}
                    className="w-full flex items-center gap-2 hover:text-[#6CB93B] transition-all duration-300"
                  >
                    <i className="fa-regular fa-user"></i>
                    <p>Profile</p>
                  </Link>
                  <div className="h-[1px] w-full bg-gray-200 my-2"></div>
                  <div
                    className="w-full flex items-center gap-2 hover:text-[#6CB93B] cursor-pointer transition-all duration-300"
                    onClick={handleLogOut}
                  >
                    <i className="fa-solid fa-arrow-right-from-bracket"></i>
                    <p>Log Out</p>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full min-h-[70px] md:hidden fixed top-0 left-0 z-40 bg-white flex justify-end">
        <button className="me-4" onClick={handleLogOut}>
          <span className="px-4 py-3 bg-[#050828] text-white rounded-md">
            Logout
          </span>
        </button>
      </div>
    </div>
  );
};

export default Header;
