/* eslint-disable react/prop-types */
import { Typography } from "@material-tailwind/react";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import FetchContext from "../../context/FetchContext";
import ImagePreviewWithRemove from "../products/ImagePreviewWithRemove.jsx";
import { AuthContext } from "../../context/AuthContext";
import { srcBuilder } from "../../utils/src";

const initialValues = {
  serverImage: "",
  image: "",
  size: "",
};

const AddBanner = () => {
  const navigate = useNavigate();
  const { request } = useContext(FetchContext);
  const { user } = useContext(AuthContext);
  const author = user?.email || "admin";
  const [sizes, setSizes] = useState([]);
  const [formState, setFormState] = useState(initialValues);
  const { id } = useParams();

  useEffect(() => {
    if (!id) return;
    async function fetchBannerById() {
      try {
        const response = await request(`banners/${id}`);
        const banner = await response.json();
        if (!banner) return;
        setFormState((prev) => {
          return {
            ...prev,
            serverImage: banner.image,
            size: banner.size,
          };
        });
      } catch (error) {
        console.error(error);
      }
    }
    fetchBannerById();
  }, [id]);

  function onChange(e) {
    const { name, value } = e.target;
    if (!name) return;
    setFormState((prev) => ({ ...prev, [name]: value }));
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    const body = new FormData(e.target);
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

  useEffect(() => {
    const fetchSizes = async () => {
      try {
        const response = await request("banners/sizes");
        const sizes = await response.json();
        setSizes(sizes);
      } catch (error) {
        console.error(error);
      }
    };
    fetchSizes();
  }, []);

  let preview = "";

  if (formState.image) {
    preview = formState.image;
  } else if (formState.serverImage) {
    preview = srcBuilder(formState.serverImage, "banners");
  }

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-5">
        <button
          onClick={() => window.history.back()}
          className="flex items-center justify-center gap-1 text-black border-2 border-black px-2 py-2 rounded-md text-sm hover:bg-black hover:text-white transition-all duration-500"
        >
          <i className="fa-solid fa-hand-point-left"></i>
        </button>
        <div>
          <h1 className="text-xl font-bold">{id ? "Edit" : "Add"} Banner</h1>
          <p className="text-sm text-gray-500">
            You can add banner photos from here.
          </p>
        </div>
      </div>

      <form onSubmit={onSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="w-full lg:col-span-1">
            <Legend>Banner Size</Legend>
            <select
              className="capitalize w-full py-[10px] px-[5px] border border-gray-300 bg-white text-gray-900 rounded-md focus:outline-none  focus:ring-border-none focus:border-[#6CB93B] focus:border-t-border-[#6CB93B] focus:ring-border-[#199bff]/10"
              name="size"
              value={formState.size}
              onChange={onChange}
              required
            >
              <option value="" disabled></option>
              {sizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>

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
                name="image"
                type="file"
                accept="image/*"
                className="absolute top-0 left-0 w-full h-full opacity-0 z-[1]"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setFormState((prev) => ({ ...prev, image: file }));
                }}
              />
            </label>
            <div className="flex overflow-x-auto gap-4 mt-2">
              <ImagePreviewWithRemove
                src={preview}
                onRemove={() =>
                  setFormState((prev) => ({ ...prev, image: null }))
                }
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
