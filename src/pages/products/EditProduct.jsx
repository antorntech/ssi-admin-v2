import {
  Input,
  Textarea,
  Typography,
  Select,
  Option
} from "@material-tailwind/react";
import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FetchContext from "../../context/FetchContext";
import ImagePreviewWithRemove from "./ImagePreviewWithRemove";
import { srcBuilder } from "../../utils/src.js";

const initialValues = {
  name: "",
  description: "",
  color: "",
  brand: "",
  category: "",
  price: "",
  quantity: "",
  serverImages: null
};

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formState, setFormState] = useState(initialValues);
  const [images, setImages] = useState([]);
  const { request } = useContext(FetchContext);
  const author = "google@gmail.com";
  function handleChange(e) {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  }
  function fetchProductById() {
    if (!id) return;
    request(`products/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (!data) return;
        setFormState((prev) => ({
          ...prev,
          ...data,
          serverImages: data.images,
          images: []
        }));
      })
      .catch(console.error);
  }
  useEffect(fetchProductById, [id]);
  const onSubmit = (e) => {
    e.preventDefault();
    const body = new FormData(e.target);
    if (!body.has("color")) body.append("color", "#000000");
    if (!body.has("author")) body.append("author", author);
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
        <h1 className="text-xl font-bold">Edit Product</h1>
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
                className: "before:content-none after:content-none"
              }}
              value={formState.name}
              name="name"
              onChange={handleChange}
            />
            <Legend>Brand</Legend>
            <Input
              type="text"
              size="md"
              className="!border !border-gray-300 bg-white text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#6CB93B] focus:!border-t-border-[#6CB93B] focus:ring-border-[#199bff]/10"
              labelProps={{
                className: "before:content-none after:content-none"
              }}
              value={formState.brand}
              name="brand"
              onChange={handleChange}
            />
            <Legend>Price</Legend>
            <Input
              type="number"
              size="md"
              className="!border !border-gray-300 bg-white text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#6CB93B] focus:!border-t-border-[#6CB93B] focus:ring-border-[#199bff]/10"
              labelProps={{
                className: "before:content-none after:content-none"
              }}
              value={formState.price}
              name="price"
              onChange={handleChange}
            />
            <Legend>Quantity</Legend>
            <Input
              type="number"
              size="md"
              className="!border !border-gray-300 bg-white text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#6CB93B] focus:!border-t-border-[#6CB93B] focus:ring-border-[#199bff]/10"
              labelProps={{
                className: "before:content-none after:content-none"
              }}
              value={formState.quantity}
              name="quantity"
              onChange={handleChange}
            />
            <Legend>Category</Legend>
            <Select
              value={formState.category}
              onChange={handleChange}
              className="!border !border-gray-300 bg-white text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#6CB93B] focus:!border-t-border-[#6CB93B] focus:ring-border-[#199bff]/10"
              labelProps={{
                className: "before:content-none after:content-none"
              }}
              name="category"
            >
              <Option value="" disabled>
                Select category
              </Option>
              <Option value="Electronics">Electronics</Option>
              <Option value="Fashion">Fashion</Option>
              <Option value="Home & Garden">Home & Garden</Option>
              <Option value="Sports">Sports</Option>
              <Option value="Toys">Toys</Option>
              <Option value="Books">Books</Option>
            </Select>
            <Legend>Color</Legend>
            <Select
              value={formState.color}
              name="color"
              onChange={handleChange}
              className="!border !border-gray-300 bg-white text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#6CB93B] focus:!border-t-border-[#6CB93B] focus:ring-border-[#199bff]/10"
              labelProps={{
                className: "before:content-none after:content-none"
              }}
            >
              <Option value="" disabled>
                Select color
              </Option>
              <Option value="Red">Red</Option>
              <Option value="Blue">Blue</Option>
              <Option value="Green">Green</Option>
              <Option value="Black">Black</Option>
              <Option value="White">White</Option>
              <Option value="Yellow">Yellow</Option>
              <Option value="Orange">Orange</Option>
              <Option value="Purple">Purple</Option>
            </Select>
          </div>

          {/* Right Column */}
          <div className="w-full md:col-span-2">
            <Legend>Description</Legend>
            <Textarea
              value={formState.description}
              name="description"
              className="!border !border-gray-300 bg-white text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#6CB93B] focus:!border-t-border-[#6CB93B] focus:ring-border-[#199bff]/10"
              labelProps={{
                className: "before:content-none after:content-none"
              }}
              onChange={handleChange}
              rows={8}
            />
            {/* file upload */}
            <label className="border-2 border-dashed rounded-lg border-gray-300 bg-gray-50 hover:border-[#6CB93B] p-6 py-2 lg:py-[33px] text-center w-full flex flex-col items-center relative">
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
                  setImages((prev) => [...prev, ...e.target.files]);
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
                        method: "DELETE"
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
              {images?.map((src, i) => {
                return (
                  <ImagePreviewWithRemove
                    key={i}
                    src={src}
                    onRemove={() => {
                      setImages((prev) => prev.filter((_, i) => i !== i));
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
