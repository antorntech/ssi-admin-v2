import { Avatar, Chip, Typography } from "@material-tailwind/react";
import React from "react";
import { Link } from "react-router-dom";
import { DeleteConfirmModal } from "../components/DeleteConfirmModal";
import Loader from "../loader/Loader";

const HomeAbout = () => {
  const [open, setOpen] = React.useState(false);
  const [data, setData] = React.useState(true);

  const handleOpen = () => setOpen(!open);
  return (
    <div>
      <div className="w-full flex flex-col md:flex-row items-start md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-bold">Home About</h1>
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
      {data ? (
        <>
          <div className="flex flex-col md:flex-row items-center gap-4 py-5">
            <div className="w-full md:w-1/2">
              <img
                src="/img/home-about.jpg"
                alt=""
                className="rounded-md w-full"
              />
            </div>
            <div className="w-full md:w-1/2">
              <p className=" text-gray-500 text-sm md:text-lg text-justify w-full md:w-3/4">
                Intelligent Systems & Solutions Limited is a rapidly expanding
                offshore and onshore software development, skill development,
                and outsourcing company based in Bangladesh. We specialize in
                delivering global systems and solutions while ensuring top-notch
                customer service. Our core competencies include technology
                solutions, desktop applications, web applications, mobile
                applications, business solutions, engineering solutions, system
                upgrades, system implementation, system development, training,
                and other essential services.
              </p>
              <div className="flex gap-2 mt-3">
                <Link to={"/dashboard/edit-home-about/1"}>
                  <button className="bg-orange-800 text-white px-4 py-1 rounded-md">
                    Edit
                  </button>
                </Link>
                <button
                  onClick={handleOpen}
                  className="bg-red-800 text-white px-4 py-1 rounded-md"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
          <DeleteConfirmModal open={open} handleOpen={handleOpen} />
        </>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default HomeAbout;
