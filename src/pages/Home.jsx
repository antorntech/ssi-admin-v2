import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      <div className="grid grid-cols-5 gap-6">
        <div className="col-span-2">
          {/* box-1 */}
          <div className="bg-white rounded-md custom-shadow">
            <div className="flex items-start justify-between bg-blue-100 rounded-t-md">
              <div className="w-1/2 p-5">
                <h2 className="text-xl text-blue-500 font-semibold">
                  Welcome Back !
                </h2>
                <p className="text-sm text-blue-400">Admin Dashboard...</p>
              </div>
              <div className="w-1/2">
                <img
                  src="/img/profile-img.png"
                  alt=""
                  className="w-full object-contain"
                />
              </div>
            </div>
            <div className="flex items-start justify-between">
              <div className="w-1/3 p-5 relative">
                <div className="absolute -top-12 left-5 w-20 h-20 p-1 rounded-full bg-white">
                  <img src="/img/avatar.png" alt="" className="w-full h-full" />
                </div>
                <div className="mt-5">
                  <h2 className="text-lg font-semibold">John Doe</h2>
                  <p className="text-sm">Web Developer</p>
                </div>
              </div>
              <div className="w-1/3 p-5">
                <h2 className="font-semibold">125</h2>
                <p className="text-sm">Projects</p>
                <Link
                  to="/profile"
                  className="inline-block px-4 py-2 bg-blue-500 text-white text-sm rounded-md mt-5"
                >
                  View Profile <i className="fa-solid fa-arrow-right"></i>{" "}
                </Link>
              </div>
              <div className="w-1/3 p-5">
                <h2 className="font-semibold">$655</h2>
                <p className="text-sm">Revenue</p>
              </div>
            </div>
          </div>

          {/* box-2 */}
          <div className="bg-white rounded-md custom-shadow mt-6">
            <div className="p-5">
              <h2 className="text-lg font-semibold">Monthly Earning</h2>
              <div>
                <p className="text-sm my-3">This month</p>
                <p className="text-xl font-semibold">$35,655</p>
                <p className="text-sm mt-1">
                  <span className="text-sm text-blue-500">
                    12% <i className="fa-solid fa-arrow-up text-sm"></i>
                  </span>{" "}
                  From previous period
                </p>
                <Link
                  to="/profile"
                  className="inline-block px-4 py-2 bg-blue-500 text-white text-sm rounded-md mt-5"
                >
                  View Profile <i className="fa-solid fa-arrow-right"></i>{" "}
                </Link>
                <p className="text-sm mt-3">
                  We craft digital, graphic and dimensional thinking.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-3">
          {/* box-3 */}
          <div className="flex items-center gap-5">
            <div className="custom-shadow flex items-center justify-between gap-3 bg-white px-4 py-6 w-full rounded-md">
              <div>
                <p className="text-sm mb-2">Orders</p>
                <h2 className="text-xl font-semibold">1,235</h2>
              </div>
              <div>
                <div className="bg-blue-500 w-12 h-12 flex items-center justify-center p-2 rounded-full">
                  <i class="fa-solid fa-cart-shopping text-xl text-white"></i>
                </div>
              </div>
            </div>
            <div className="custom-shadow flex items-center justify-between gap-3 bg-white px-4 py-6 w-full rounded-md">
              <div>
                <p className="text-sm mb-2">Revenue</p>
                <h2 className="text-xl font-semibold">$35, 723</h2>
              </div>
              <div>
                <div className="bg-blue-500 w-12 h-12 flex items-center justify-center p-2 rounded-full">
                  <i class="fa-solid fa-sack-dollar text-xl text-white"></i>
                </div>
              </div>
            </div>
            <div className="custom-shadow flex items-center justify-between gap-3 bg-white px-4 py-6 w-full rounded-md">
              <div>
                <p className="text-sm mb-2">Average Price</p>
                <h2 className="text-xl font-semibold">$16.2</h2>
              </div>
              <div>
                <div className="bg-blue-500 w-12 h-12 flex items-center justify-center p-2 rounded-full">
                  <i class="fa-solid fa-filter-circle-dollar text-xl text-white"></i>
                </div>
              </div>
            </div>
          </div>
          {/* box-4 */}
          <div className="bg-white rounded-md custom-shadow mt-6">
            <div className="p-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Email Sent</h2>
              <div className="flex items-center">
                <div className="px-4 py-2 bg-blue-300 text-white text-sm">
                  Week
                </div>
                <div className="px-4 py-2 bg-blue-400 text-white text-sm">
                  Month
                </div>
                <div className="px-4 py-2 bg-blue-500 text-white text-sm">
                  Year
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
