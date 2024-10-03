import {
  Input,
  Textarea,
  Typography,
  Select,
  Option,
} from "@material-tailwind/react";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import moment from "moment";
import { useDropzone } from "react-dropzone";
import FetchContext from "../../context/FetchContext";
import ImagePreviewWithRemove from "./ImagePreviewWithRemove";

const AddProduct = () => {
  const navigate = useNavigate();
  const date = moment().format("Do MMM, YYYY");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [files, setFiles] = useState([]);
  const { request } = useContext(FetchContext);
  const author = "google@gmail.com";

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
      navigate("/products");
    } catch (error) {
      console.error("Failed to add product", error);
    }
    return;

    const existingData = JSON.parse(localStorage.getItem("productsData")) || [];
    const products = [...existingData];
    const newEntry = {
      id: Date.now(),
      name,
      description,
      color,
      brand,
      category,
      price,
      quantity,
      date,
      author: "Admin",
      images: files,
    };

    console.log(newEntry);
    localStorage.setItem(
      "productsData",
      JSON.stringify([...products, newEntry])
    );

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEntry),
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }

    toast.success("Upload successful", {
      position: "top-right",
      hideProgressBar: false,
      autoClose: 1000,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

    navigate("/products");

    // Reset the form
    setName("");
    setDescription("");
    setColor("");
    setBrand("");
    setCategory("");
    setPrice("");
    setQuantity("");
    setFiles([]);
  };

  // const { getRootProps, getInputProps } = useDropzone({ onDrop: handleDrop });

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
            <Typography variant="h6" color="gray" className="mb-1 font-normal">
              Name
            </Typography>
            <Input
              type="text"
              size="md"
              className="!border !border-gray-300 bg-white text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#6CB93B] focus:!border-t-border-[#6CB93B] focus:ring-border-[#199bff]/10"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              value={name}
              name="name"
              onChange={(e) => setName(e.target.value)}
            />

            <Typography
              variant="h6"
              color="gray"
              className="mb-1 font-normal mt-2"
            >
              Brand
            </Typography>
            <Input
              type="text"
              size="md"
              className="!border !border-gray-300 bg-white text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#6CB93B] focus:!border-t-border-[#6CB93B] focus:ring-border-[#199bff]/10"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              value={brand}
              name="brand"
              onChange={(e) => setBrand(e.target.value)}
            />

            <Typography
              variant="h6"
              color="gray"
              className="mb-1 font-normal mt-2"
            >
              Price
            </Typography>
            <Input
              type="number"
              size="md"
              className="!border !border-gray-300 bg-white text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#6CB93B] focus:!border-t-border-[#6CB93B] focus:ring-border-[#199bff]/10"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              value={price}
              name="price"
              onChange={(e) => setPrice(e.target.value)}
            />

            <Typography
              variant="h6"
              color="gray"
              className="mb-1 font-normal mt-2"
            >
              Quantity
            </Typography>
            <Input
              type="number"
              size="md"
              className="!border !border-gray-300 bg-white text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#6CB93B] focus:!border-t-border-[#6CB93B] focus:ring-border-[#199bff]/10"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              value={quantity}
              name="quantity"
              onChange={(e) => setQuantity(e.target.value)}
            />
            <Typography
              variant="h6"
              color="gray"
              className="mb-1 font-normal mt-2"
            >
              Category
            </Typography>
            <Select
              value={category}
              onChange={(value) => setCategory(value)}
              className="!border !border-gray-300 bg-white text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#6CB93B] focus:!border-t-border-[#6CB93B] focus:ring-border-[#199bff]/10"
              labelProps={{
                className: "before:content-none after:content-none",
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

            <Typography
              variant="h6"
              color="gray"
              className="mb-1 font-normal mt-2"
            >
              Color
            </Typography>
            <Select
              value={color}
              name="color"
              onChange={(value) => setColor(value)}
              className="!border !border-gray-300 bg-white text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#6CB93B] focus:!border-t-border-[#6CB93B] focus:ring-border-[#199bff]/10"
              labelProps={{
                className: "before:content-none after:content-none",
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
            <Typography variant="h6" color="gray" className="mb-1 font-normal">
              Description
            </Typography>
            <Textarea
              value={description}
              name="description"
              className="!border !border-gray-300 bg-white text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#6CB93B] focus:!border-t-border-[#6CB93B] focus:ring-border-[#199bff]/10"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              onChange={(e) => setDescription(e.target.value)}
              rows={8}
            />
            {/* file upload */}
            <label className="border-2 border-dashed rounded-lg border-gray-300 bg-gray-50 hover:border-[#6CB93B] p-6 py-2 lg:py-[22px] text-center w-full flex flex-col items-center relative">
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
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>
        <button className="mt-5 bg-green-500 text-white px-4 py-2 rounded">
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
