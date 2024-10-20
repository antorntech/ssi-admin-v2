import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppextBarChart from "../components/chart/AppextBarChart";
import FetchContext from "../context/FetchContext";
import { AuthContext } from "../context/AuthContext";
import {
  DollarCircle,
  Profile2User,
  ShoppingCart,
  UserTick,
} from "iconsax-react";

const Home = () => {
  const [dashboard, setDashboard] = useState({});
  const { request } = useContext(FetchContext);
  const { user } = useContext(AuthContext);

  const fetchDashboard = async () => {
    try {
      const response = await request("dashboard");
      const json = await response.json();
      if (!json) return;
      setDashboard(json);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <div className="flex flex-wrap gap-6">
      <div className="flex-grow w-6/12 min-w-[340px]">
        <div className="bg-white rounded-md custom-shadow">
          <div className="flex flex-col md:flex-row items-start justify-between bg-[#bde0a8] rounded-t-md">
            <div className="w-full md:w-1/2 p-5">
              <h2 className="text-lg md:text-xl text-[#6CB93B] font-semibold mb-1">
                Welcome Back!
              </h2>
              <p className="text-sm text-[#6CB93B]">SSI Admin Dashboard</p>
            </div>
            <div className="w-full md:w-1/2 p-2">
              <img
                src="/img/profile-img.png"
                alt="Profile"
                className="w-full h-auto object-contain"
              />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row items-start justify-between p-5">
            <div className="w-full lg:w-1/3 relative">
              <div className="absolute -top-14 left-5 w-16 h-16 p-1 rounded-full bg-white shadow-md">
                <img
                  src="/img/avatar.png"
                  alt="Avatar"
                  className="w-full h-full rounded-full"
                />
              </div>
              <div className="mt-8">
                <h2 className="text-sm md:text-base font-semibold break-words">
                  {user?.email}
                </h2>
              </div>
            </div>

            <div className="hidden w-full lg:w-2/3 mt-6 lg:mt-0 px-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h2 className="text-lg font-semibold">125</h2>
                  <p className="text-sm">Projects</p>
                </div>
                <div>
                  <h2 className="text-lg font-semibold">$655</h2>
                  <p className="text-sm">Revenue</p>
                </div>
              </div>
              <Link
                to="/profile"
                className="inline-block px-4 py-2 bg-[#6CB93B] text-white text-sm rounded-md mt-4"
              >
                View Profile <i className="fa-solid fa-arrow-right ml-2"></i>
              </Link>
            </div>
          </div>
        </div>

        {/* Box 2 (Monthly Earnings) */}
        <div className="bg-white rounded-md custom-shadow mt-6 hidden">
          <div className="p-5">
            <h2 className="text-lg font-semibold">Monthly Earnings</h2>
            <p className="text-sm my-3">This month</p>
            <p className="text-xl font-semibold">$35,655</p>
            <p className="text-sm mt-1">
              <span className="text-[#6CB93B]">
                12% <i className="fa-solid fa-arrow-up"></i>
              </span>{" "}
              From previous period
            </p>
            <Link
              to="/profile"
              className="inline-block px-4 py-2 bg-[#6CB93B] text-white text-sm rounded-md mt-4"
            >
              View Profile <i className="fa-solid fa-arrow-right ml-2"></i>
            </Link>
            <p className="text-sm mt-3">
              We craft digital, graphic, and dimensional thinking.
            </p>
          </div>
        </div>
      </div>
      <div className="flex-grow w-5/12">
        <div className="flex flex-wrap gap-5">
          {[
            {
              label: "Total Orders",
              value: dashboard?.orders,
              icon: <ShoppingCart size="30" className="text-white" />,
            },
            {
              label: "Total Revenue",
              value: `$ ${
                dashboard?.total_revenue ? dashboard?.total_revenue : 0
              }`,
              icon: <DollarCircle size="30" className="text-white" />,
            },
            {
              label: "Total Customers",
              value: dashboard?.customers,
              icon: <Profile2User size="30" className="text-white" />,
            },
            {
              label: "Repeated Customers",
              value: `${dashboard?.repeated_percentage}%`,
              icon: <UserTick size="30" className="text-white" />,
            },
          ].map((item, index) => (
            <div
              key={index}
              className="custom-shadow flex items-center justify-between gap-3 bg-white px-4 py-6 rounded-md flex-1 min-w-[248px]"
            >
              <div>
                <p className="text-sm mb-2">{item.label}</p>
                <h2 className="text-xl font-semibold">{item.value}</h2>
              </div>
              <div className="bg-[#6CB93B] w-12 h-12 flex items-center justify-center rounded-full">
                {item.icon}
              </div>
            </div>
          ))}
        </div>
        <div className="hidden bg-white rounded-md custom-shadow mt-6 lg:h-[79%]">
          <AppextBarChart />
        </div>
      </div>
    </div>
  );
};

export default Home;
