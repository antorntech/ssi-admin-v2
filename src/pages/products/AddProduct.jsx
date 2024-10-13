/* eslint-disable react/prop-types */
import { Typography } from "@material-tailwind/react";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import FetchContext from "../../context/FetchContext";
import ImagePreviewWithRemove from "./ImagePreviewWithRemove";
import { AuthContext } from "../../context/AuthContext";

const initialValues = {
  name: "",
  description: "",
  color: "",
  brand: "",
  category: "",
  price: "",
  quantity: "",
};

const AddProduct = () => {
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);
  const [formState, setFormState] = useState(initialValues);
  const [categories, setCategories] = useState([]);
  const [files, setFiles] = useState([]);
  const { request } = useContext(FetchContext);
  const { user } = useContext(AuthContext);
  const author = user?.email || "admin";

  function onChange(e) {
    const { name, value } = e.target;
    if (!name) return;
    setFormState((prev) => ({ ...prev, [name]: value }));
  }

  // fetch brands
  const fetchBrands = async () => {
    try {
      const response = await request("brands");
      const json = await response.json();
      const { data } = json;
      if (!data) return;
      setBrands(json.data);
    } catch (error) {
      console.error(error);
    }
  };

  // fetch categories
  const fetchCategories = async () => {
    try {
      const response = await request("categories");
      const json = await response.json();
      const { data } = json;
      if (!data) return;
      setCategories(json.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchBrands();
    fetchCategories();
  }, []);

  const fileChange = (e) => {
    const files = Array.from(e.target.files);
    setFiles((prevFiles) => [...prevFiles, ...files]);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const body = new FormData(e.target);
    if (!body.has("color")) body.append("color", "#000000");
    if (!body.has("author")) body.append("author", author);
    try {
      await request("products", {
        method: "POST",
        body,
      });
      toast.success("Product added successfully", {
        autoClose: 1000,
      });
      navigate("/products");
    } catch (error) {
      console.error("Failed to add product", error);
    }
    return;
  };

  const colors = [
    "red",
    "orange",
    "yellow",
    "green",
    "blue",
    "purple",
    "pink",
    "brown",
    "gray",
    "black",
    "white",
    "violet",
    "indigo",
    "cyan",
    "teal",
    "lime",
    "amber",
  ];

  const Legend = ({ children }) => (
    <Typography variant="h6" color="gray" className="mb-1 mt-2 font-normal">
      {children}
    </Typography>
  );

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
          <h1 className="text-xl font-bold">Add Product</h1>
          <p className="text-sm text-gray-500">
            You can add product details from here.
          </p>
        </div>
      </div>

      <form className="" onSubmit={onSubmit}>
        {/* Three Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Left Column */}
          <div className="w-full md:col-span-1">
            <Legend>Name</Legend>
            <input
              type="text"
              size="md"
              className="capitalize w-full py-[8px] pl-[12px] border border-gray-300 bg-white text-gray-900 rounded-md focus:outline-none  focus:ring-border-none focus:border-[#6CB93B] focus:border-t-border-[#6CB93B] focus:ring-border-[#199bff]/10"
              name="name"
              value={formState.name}
              onChange={onChange}
              required
            />

            <Legend>Brand</Legend>
            <select
              className="capitalize w-full py-[10px] px-[5px] border border-gray-300 bg-white text-gray-900 rounded-md focus:outline-none  focus:ring-border-none focus:border-[#6CB93B] focus:border-t-border-[#6CB93B] focus:ring-border-[#199bff]/10"
              name="brand"
              value={formState.brand}
              onChange={onChange}
              required
            >
              <option value="" disabled></option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand?.id}>
                  {brand.name}
                </option>
              ))}
            </select>

            <Legend>Price</Legend>
            <input
              type="number"
              size="md"
              className="capitalize w-full py-[8px] pl-[12px] border border-gray-300 bg-white text-gray-900 rounded-md focus:outline-none  focus:ring-border-none focus:border-[#6CB93B] focus:border-t-border-[#6CB93B] focus:ring-border-[#199bff]/10"
              name="price"
              value={formState.price}
              onChange={onChange}
              required
            />

            <Legend>Quantity</Legend>
            <input
              type="number"
              size="md"
              className="capitalize w-full py-[8px] pl-[12px] border border-gray-300 bg-white text-gray-900 rounded-md focus:outline-none  focus:ring-border-none focus:border-[#6CB93B] focus:border-t-border-[#6CB93B] focus:ring-border-[#199bff]/10"
              name="quantity"
              value={formState.quantity}
              onChange={onChange}
              required
            />

            <Legend>Category</Legend>
            <select
              className="capitalize w-full py-[10px] px-[5px] border border-gray-300 bg-white text-gray-900 rounded-md focus:outline-none  focus:ring-border-none focus:border-[#6CB93B] focus:border-t-border-[#6CB93B] focus:ring-border-[#199bff]/10"
              name="category"
              value={formState.category}
              onChange={onChange}
              required
            >
              <option value="" disabled></option>
              {categories.map((category) => (
                <option key={category._id} value={category?.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <Legend>Color</Legend>
            <select
              className="capitalize w-full py-[10px] px-[5px] border border-gray-300 bg-white text-gray-900 rounded-md focus:outline-none  focus:ring-border-none focus:border-[#6CB93B] focus:border-t-border-[#6CB93B] focus:ring-border-[#199bff]/10"
              name="color"
              onChange={onChange}
              value={formState.color}
              required
            >
              <option value="" disabled></option>
              {colors.map((color) => (
                <option key={color} value={color}>
                  {color}
                </option>
              ))}
            </select>
          </div>

          {/* Right Column */}
          <div className="w-full md:col-span-2">
            <Legend>Description</Legend>
            <textarea
              className="capitalize w-full py-[8px] pl-[12px] border border-gray-300 bg-white text-gray-900 rounded-md focus:outline-none  focus:ring-border-none focus:border-[#6CB93B] focus:border-t-border-[#6CB93B] focus:ring-border-[#199bff]/10"
              name="description"
              value={formState.description}
              onChange={onChange}
              rows={7}
              required
            />
            {/* file upload */}
            <label className="border-2 border-dashed rounded-lg border-gray-400 bg-gray-100 hover:border-[#6CB93B] p-6 py-2 lg:py-[33px] text-center w-full flex flex-col items-center relative">
              <lord-icon
                src="https://cdn.lordicon.com/smwmetfi.json"
                trigger="loop"
                colors="primary:#545454"
                style={{ width: "50px", height: "50px" }}
              ></lord-icon>
              <div className="flex flex-col items-center">
                <div className="text-lg font-semibold mb-1">
                  Drag and drop files here
                </div>
                <div className="text-sm mb-6">File must be image/* format</div>
                <button
                  className="border border-gray-900 text-gray-900 hover:bg-gray-100 relative flex items-center justify-center gap-1 text-sm lg:text-base rounded-xl px-4 lg:px-5 py-2 lg:py-2.5 font-medium"
                  type="button"
                >
                  <span className="whitespace-nowrap">Browse files</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="h-5 w-5"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
                    />
                  </svg>
                </button>
              </div>
              <input
                name="images"
                type="file"
                accept="image/*"
                multiple
                className="absolute top-0 left-0 w-full h-full opacity-0 z-[1] bg-black"
                onChange={fileChange}
                required
              />
            </label>
            <div className="flex overflow-x-auto gap-4 mt-2">
              {files.map((src, i) => {
                return (
                  <ImagePreviewWithRemove
                    key={i}
                    src={src}
                    onRemove={() => {
                      // call remove media api
                      setFiles((prev) => prev.filter((_, i) => i !== i));
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>
        <button className="mt-5 bg-[#6CB93B] text-white px-4 py-2 rounded">
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
