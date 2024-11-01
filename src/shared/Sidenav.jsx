import { HambergerMenu } from "iconsax-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const menuItems = [
  {
    title: "Dashboard",
    link: "/",
    icon: "/img/icons/dashboard",
  },
  {
    title: "Products",
    link: "/products",
    icon: "/img/icons/product",
  },
  {
    title: "Categories",
    link: "/categories",
    icon: "/img/icons/category",
  },
  {
    title: "Brands",
    link: "/brands",
    icon: "/img/icons/brand",
  },
  {
    title: "Gifts",
    link: "/gifts",
    icon: "/img/icons/gift",
  },
  {
    title: "Orders",
    link: "/orders",
    icon: "/img/icons/order",
  },
  {
    title: "Manage Points",
    link: "/points",
    icon: "/img/icons/point",
  },
  {
    title: "Customers",
    link: "/customers",
    icon: "/img/icons/customer",
  },
  {
    title: "Previous Customers",
    link: "/previous-customers",
    icon: "/img/icons/precustomer",
  },
  {
    title: "Loyalty Customers",
    link: "/loyalty-customers",
    icon: "/img/icons/loyaltycustomer",
  },
  {
    title: "Withdrawal",
    link: "/withdrawal",
    icon: "/img/icons/wallet",
  },
  {
    title: "Send Messages",
    link: "/send-messages",
    icon: "/img/icons/message",
  },
  {
    title: "Gallery",
    link: "/gallery",
    icon: "/img/icons/gallery",
  },
  {
    title: "Pixel ID",
    link: "/pixel-id",
    icon: "/img/icons/meta",
  },
  {
    title: "Banners",
    link: "/banners",
    icon: "/img/icons/banner",
  },
];

const Sidenav = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  const handleMenuClick = (index) => {
    setActiveMenu(activeMenu === index ? null : index);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div>
      {/* Sidebar Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="px-4 py-2 bg-[#050828] text-white fixed top-4 left-4 z-50 md:hidden rounded-md"
      >
        <HambergerMenu className="size-6" />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full transform transition-transform z-50 bg-white w-[250px] ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="bg-white px-3 min-h-[70px] flex items-center justify-center">
          <Link to={"/"}>
            <img
              src="/img/logo.png"
              alt="Logo"
              className="w-[150px] h-[40px]"
            />
          </Link>
        </div>
        <div className=" flex flex-col h-full">
          <ul className="w-full flex flex-col">
            {menuItems.map((item, index) => (
              <li key={index} className="">
                {item.submenu ? (
                  <>
                    <div className="group">
                      <div
                        className={`flex items-center justify-between menu-title p-2 hover:text-[#050828]  ${
                          activeMenu === index
                            ? "bg-[#6CB93B] text-white hover:text-white"
                            : ""
                        }`}
                        onClick={() => handleMenuClick(index)}
                      >
                        <div className="flex items-center gap-2">
                          <img
                            src={
                              activeMenu === index
                                ? item.icon + "-light.png"
                                : item.icon + "-dark.png"
                            }
                            alt=""
                            className="size-6"
                          />
                          <p>{item.title}</p>
                        </div>
                        <i
                          className={`fa-solid fa-angle-right transition-transform ${
                            activeMenu === index ? "rotate-90" : ""
                          }`}
                        ></i>
                      </div>
                    </div>
                    {activeMenu === index && (
                      <ul className="pl-5 mt-1">
                        {item.submenu.map((subitem, subindex) => (
                          <li key={subindex}>
                            <Link
                              to={subitem.link}
                              className={`block p-2 ${
                                currentPath === subitem.link
                                  ? "bg-[#050828] text-white"
                                  : ""
                              }`}
                              onClick={toggleSidebar}
                            >
                              <i className="fa-solid fa-minus mx-2" />
                              {subitem.text}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <div className="group">
                    <Link
                      to={item.link}
                      className={`flex items-center gap-2 px-3 py-2.5 hover:text-[#050828] ${
                        currentPath === item.link
                          ? "bg-[#6CB93B] text-white hover:text-white"
                          : "hover:bg-green-50"
                      }`}
                      onClick={toggleSidebar}
                    >
                      <img
                        src={
                          currentPath === item.link
                            ? item.icon + "-light.png"
                            : item.icon + "-dark.png"
                        }
                        alt=""
                        className="size-6"
                      />
                      <span className="text-[17px]">{item.title}</span>
                    </Link>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
};

export default Sidenav;
