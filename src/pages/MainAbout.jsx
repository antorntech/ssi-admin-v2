import React from "react";
import { Link } from "react-router-dom";
import Loader from "../loader/Loader";

const MainAbout = () => {
  const [data, setData] = React.useState(null);
  return (
    <div>
      <div className="w-full flex flex-col md:flex-row items-start md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-bold">Main About</h1>
          <p className="text-sm text-gray-500">
            details are {data ? "" : "not"} available here.
          </p>
        </div>
        <div>
          {!data ? (
            <Link to={"/dashboard/add-home-about"}>
              <button className="bg-[#199bff] text-white px-4 py-2 rounded-md mt-2 md:mt-0">
                Add Details
              </button>
            </Link>
          ) : null}
        </div>
      </div>
      {data ? <></> : <Loader />}
    </div>
  );
};

export default MainAbout;
