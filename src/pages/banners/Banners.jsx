import React from "react";
import { Link } from "react-router-dom";

const Banners = () => {
  return (
    <>
      <div className="w-full flex flex-col md:flex-row items-start md:items-center md:justify-between">
        <div className="w-full flex flex-col md:flex-row items-start md:items-center md:justify-between">
          <div>
            <h1 className="text-xl font-bold">Banners</h1>
            <p className="text-sm text-gray-500">Total Banners:</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/banners/add-banner"
              className="inline-block ml-[50px] md:ml-0 w-[110px] text-sm font-medium bg-[#6CB93B] text-white md:w-[150px] text-center px-3 py-2 md:px-4 md:py-2 rounded-md"
            >
              Add Banner
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Banners;
