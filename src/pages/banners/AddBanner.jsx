/* eslint-disable react/prop-types */
import { Typography } from "@material-tailwind/react";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import FetchContext from "../../context/FetchContext";
import ImagePreviewWithRemove from "../products/ImagePreviewWithRemove.jsx";
import { AuthContext } from "../../context/AuthContext";

const AddBanner = () => {
  const navigate = useNavigate();
  const { request } = useContext(FetchContext);
  const { user } = useContext(AuthContext);
  const author = user?.email || "admin";

  // Separate states for desktop and mobile banners
  const [desktopBanner, setDesktopBanner] = useState(null);
  const [mobileBanner, setMobileBanner] = useState(null);

  // Handle file changes for both banners
  const handleFileChange = (e, setBanner) => {
    setBanner(e.target.files[0]);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const body = new FormData(e.target);

    if (!body.has("color")) body.append("color", "#000000");
    if (!body.has("author")) body.append("author", author);

    try {
      await request("banners", {
        method: "POST",
        body,
      });
      toast.success("Banner added successfully", {
        autoClose: 1000,
      });
      navigate("/banners");
    } catch (error) {
      console.error("Failed to add banner", error);
    }
  };

  const Legend = ({ children }) => (
    <Typography variant="h6" color="gray" className="mb-1 mt-2 font-normal">
      {children}
    </Typography>
  );

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <button
          onClick={() => window.history.back()}
          className="flex items-center justify-center gap-1 text-black border-2 border-black px-2 py-2 rounded-md text-sm hover:bg-black hover:text-white transition-all duration-500"
        >
          <i className="fa-solid fa-hand-point-left"></i>
        </button>
        <div>
          <h1 className="text-xl font-bold">Add Banner</h1>
          <p className="text-sm text-gray-500">
            You can add banner photos from here.
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={onSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Mobile Banner Upload */}
          <div className="w-full lg:col-span-1">
            <Legend>Mobile Banner</Legend>
            <label className="border-2 border-dashed rounded-lg border-gray-400 bg-gray-100 hover:border-[#6CB93B] p-6 py-2 lg:py-[33px] text-center w-full flex flex-col items-center relative">
              <lord-icon
                src="https://cdn.lordicon.com/smwmetfi.json"
                trigger="loop"
                colors="primary:#545454"
                style={{ width: "50px", height: "50px" }}
              ></lord-icon>
              <div className="text-center">
                <div className="text-lg font-semibold mb-1">
                  Drag and drop files here
                </div>
                <div className="text-sm mb-6">File must be image/* format</div>
                <button
                  className="border border-gray-900 text-gray-900 hover:bg-gray-100 rounded-xl px-4 py-2 font-medium"
                  type="button"
                >
                  Browse file
                </button>
              </div>
              <input
                name="mobile_banner"
                type="file"
                accept="image/*"
                className="absolute top-0 left-0 w-full h-full opacity-0 z-[1]"
                onChange={(e) => handleFileChange(e, setMobileBanner)}
              />
            </label>
            <div className="flex overflow-x-auto gap-4 mt-2">
              <ImagePreviewWithRemove
                src={mobileBanner}
                onRemove={() => setMobileBanner(null)}
              />
            </div>
          </div>

          {/* Desktop Banner Upload */}
          <div className="w-full lg:col-span-2">
            <Legend>Desktop Banner</Legend>
            <label className="border-2 border-dashed rounded-lg border-gray-400 bg-gray-100 hover:border-[#6CB93B] p-6 py-2 lg:py-[33px] text-center w-full flex flex-col items-center relative">
              <lord-icon
                src="https://cdn.lordicon.com/smwmetfi.json"
                trigger="loop"
                colors="primary:#545454"
                style={{ width: "50px", height: "50px" }}
              ></lord-icon>
              <div className="text-center">
                <div className="text-lg font-semibold mb-1">
                  Drag and drop files here
                </div>
                <div className="text-sm mb-6">File must be image/* format</div>
                <button
                  className="border border-gray-900 text-gray-900 hover:bg-gray-100 rounded-xl px-4 py-2 font-medium"
                  type="button"
                >
                  Browse file
                </button>
              </div>
              <input
                name="desktop_banner"
                type="file"
                accept="image/*"
                className="absolute top-0 left-0 w-full h-full opacity-0 z-[1]"
                onChange={(e) => handleFileChange(e, setDesktopBanner)}
              />
            </label>
            <div className="flex overflow-x-auto gap-4 mt-2">
              <ImagePreviewWithRemove
                src={desktopBanner}
                onRemove={() => setDesktopBanner(null)}
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button className="mt-5 bg-[#6CB93B] text-white px-4 py-2 rounded">
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddBanner;
