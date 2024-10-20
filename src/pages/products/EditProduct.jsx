/* eslint-disable react/prop-types */
import { Input, Typography } from "@material-tailwind/react";
import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FetchContext from "../../context/FetchContext";
import ImagePreviewWithRemove from "./ImagePreviewWithRemove";
import filterImages from "../../utils/filter.js";
import { srcBuilder } from "../../utils/src.js";
import colors from "../../utils/colors";

const initialValues = {
  name: "",
  description: "",
  color: "",
  brand: "",
  category: "",
  price: 0,
  regular_price: 0,
  points: 0,
  points_max: 0,
  weight: 0,
  quantity: 0,
  serverImages: null,
  scale: "gm",
};

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formState, setFormState] = useState(initialValues);
  const [files, setFiles] = useState([]);
  const { request } = useContext(FetchContext);
  const author = "google@gmail.com";
  function onChange(e) {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  }
  function fetchProductById() {
    if (!id) return;
    request(`products/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (!data) return;
        setFormState(() => ({
          name: data.name,
          description: data.description,
          color: data.color,
          brand: data.brand,
          category: data.category,
          price: data.price,
          regular_price: data.regular_price,
          points: data.points,
          points_max: data.points_max,
          weight: data.weight,
          quantity: data.quantity,
          serverImages: filterImages(data.images),
          images: [],
        }));
      })
      .catch(console.error);
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
    fetchProductById();
    fetchBrands();
    fetchCategories();
  }, [id]);
  const onSubmit = (e) => {
    e.preventDefault();
    const body = new FormData(e.target);
    if (!body.has("color")) body.append("color", "#000000");
    if (!body.has("author")) body.append("author", author);
    if (body.has("weight"))
      body.append("weight", `${body.get("weight")}${formState.scale}`);
    if (!request) return;
    request(`products/${id}`, { method: "PATCH", body })
      .then((r) => r.json())
      .then(() => {
        navigate("/products");
      })
      .catch(console.error);
  };

  const Legend = ({ children }) => (
    <Typography variant="h6" color="gray" className="mb-1 font-normal">
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
          <h1 className="text-xl font-bold">Edit Product</h1>
          <p className="text-sm text-gray-500">
            You can edit product details from here.
          </p>
        </div>
      </div>

      <form className="" onSubmit={onSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="w-full md:col-span-1 space-y-2">
            <Legend>Name</Legend>
            <Input
              type="text"
              size="md"
              className="!border !border-gray-300 bg-white text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#6CB93B] focus:!border-t-border-[#6CB93B] focus:ring-border-[#199bff]/10"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              value={formState.name}
              name="name"
              onChange={onChange}
            />

            <Legend>Brand</Legend>
            <select
              name="brand"
              className="capitalize w-full py-[10px] px-[5px] border border-gray-300 bg-white text-gray-900 rounded-md focus:outline-none  focus:ring-border-none focus:border-[#6CB93B] focus:border-t-border-[#6CB93B] focus:ring-border-[#199bff]/10"
              onChange={onChange}
              value={formState.brand}
            >
              <option value="Select" disabled></option>
              {brands.map((brand, i) => (
                <option key={brand.id || i} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>

            <Legend>Price</Legend>
            <Input
              type="number"
              size="md"
              className="!border !border-gray-300 bg-white text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#6CB93B] focus:!border-t-border-[#6CB93B] focus:ring-border-[#199bff]/10"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              value={formState.price}
              name="price"
              onChange={onChange}
            />

            <Legend>Regular Price</Legend>
            <Input
              type="number"
              size="md"
              className="!border !border-gray-300 bg-white text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#6CB93B] focus:!border-t-border-[#6CB93B] focus:ring-border-[#199bff]/10"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              value={formState.regular_price}
              name="regular_price"
              onChange={onChange}
            />

            <Legend>Weight in gm</Legend>
            <input
              type="number"
              size="md"
              className="capitalize w-full py-[8px] pl-[12px] border border-gray-300 bg-white text-gray-900 rounded-md focus:outline-none  focus:ring-border-none focus:border-[#6CB93B] focus:border-t-border-[#6CB93B] focus:ring-border-[#199bff]/10"
              name="weight"
              value={formState.weight}
              onChange={onChange}
            />

            <Legend>Quantity</Legend>
            <Input
              type="number"
              size="md"
              className="!border !border-gray-300 bg-white text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#6CB93B] focus:!border-t-border-[#6CB93B] focus:ring-border-[#199bff]/10"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              value={formState.quantity}
              name="quantity"
              onChange={onChange}
            />
          </div>

          {/* Right Column */}
          <div className="w-full md:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
              <div>
                <Legend>Points</Legend>
                <input
                  type="number"
                  size="md"
                  className="capitalize mb-2 w-full py-[8px] pl-[12px] border border-gray-300 bg-white text-gray-900 rounded-md focus:outline-none  focus:ring-border-none focus:border-[#6CB93B] focus:border-t-border-[#6CB93B] focus:ring-border-[#199bff]/10"
                  name="points"
                  value={formState.points}
                  min={0}
                  onChange={onChange}
                />

                <Legend>Points Max</Legend>
                <input
                  type="number"
                  size="md"
                  className="capitalize mb-2 w-full py-[8px] pl-[12px] border border-gray-300 bg-white text-gray-900 rounded-md focus:outline-none  focus:ring-border-none focus:border-[#6CB93B] focus:border-t-border-[#6CB93B] focus:ring-border-[#199bff]/10"
                  name="points_max"
                  value={formState.points_max}
                  min={0}
                  onChange={onChange}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
                  <div>
                    <Legend>Category</Legend>
                    <select
                      className="capitalize w-full py-[10px] px-[5px] border border-gray-300 bg-white text-gray-900 rounded-md focus:outline-none  focus:ring-border-none focus:border-[#6CB93B] focus:border-t-border-[#6CB93B] focus:ring-border-[#199bff]/10"
                      name="category"
                      value={formState.category}
                      onChange={onChange}
                    >
                      <option value="" disabled></option>
                      {categories.map((category, i) => (
                        <option key={category.id || i} value={category?.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Legend>Color</Legend>
                    <select
                      className="capitalize mb-2 md:mb-0 w-full py-[10px] px-[5px] border border-gray-300 bg-white text-gray-900 rounded-md focus:outline-none  focus:ring-border-none focus:border-[#6CB93B] focus:border-t-border-[#6CB93B] focus:ring-border-[#199bff]/10"
                      name="color"
                      onChange={onChange}
                      value={formState.color}
                    >
                      <option value="" disabled></option>
                      {colors.map((color, i) => (
                        <option key={i} value={color}>
                          {color}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div>
                <Legend>Description</Legend>
                <textarea
                  className="capitalize w-full mb-3 md:mb-0 py-[8px] pl-[12px] border border-gray-300 bg-white text-gray-900 rounded-md focus:outline-none  focus:ring-border-none focus:border-[#6CB93B] focus:border-t-border-[#6CB93B] focus:ring-border-[#199bff]/10"
                  name="description"
                  value={formState.description}
                  onChange={onChange}
                  rows={8}
                />
              </div>
            </div>
            {/* file upload */}
            <label className="border-2 border-dashed rounded-lg border-gray-300 bg-gray-50 hover:border-[#6CB93B] p-6 text-center w-full flex flex-col items-center relative">
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
                onChange={(e) => {
                  setFiles((prev) => [...prev, ...e.target.files]);
                }}
              />
            </label>
            <div className="flex overflow-x-auto gap-4 py-2">
              {formState.serverImages?.map((src, i) => {
                let path = null;
                if (typeof src == "string") path = srcBuilder(src);
                return (
                  <ImagePreviewWithRemove
                    key={i}
                    src={path}
                    onRemove={() => {
                      if (!id || !src)
                        throw new Error("id or src is not defined");
                      // call remove media api
                      request(`products/${id}/images/${src}`, {
                        method: "DELETE",
                      })
                        .then((r) => r.json())
                        .then(() => {
                          fetchProductById();
                        })
                        .catch(console.error);
                    }}
                  />
                );
              })}
              {files?.map((src, i) => {
                return (
                  <ImagePreviewWithRemove
                    key={i}
                    src={src}
                    onRemove={() => {
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

export default EditProduct;
