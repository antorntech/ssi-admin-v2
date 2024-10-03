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
            <label className="border-2 border-dashed rounded-lg border-gray-300 bg-gray-50 p-6 py-2 lg:py-[22px] text-center w-full flex flex-col items-center relative">
              <svg
                className="w-12 h-12 mb-6"
                viewBox="0 0 120 120"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_122_5767)">
                  <path
                    d="M67.9873 52.0125H52.0123C51.4553 52.0665 50.8931 52.0034 50.362 51.8273C49.8308 51.6512 49.3424 51.3659 48.928 50.9898C48.5136 50.6137 48.1825 50.1551 47.9559 49.6434C47.7294 49.1317 47.6123 48.5783 47.6123 48.0187C47.6123 47.4591 47.7294 46.9057 47.9559 46.394C48.1825 45.8824 48.5136 45.4237 48.928 45.0476C49.3424 44.6715 49.8308 44.3862 50.362 44.2101C50.8931 44.034 51.4553 43.9709 52.0123 44.025H68.0248C68.5817 43.9709 69.1439 44.034 69.675 44.2101C70.2062 44.3862 70.6946 44.6715 71.109 45.0476C71.5234 45.4237 71.8545 45.8824 72.0811 46.394C72.3077 46.9057 72.4247 47.4591 72.4247 48.0187C72.4247 48.5783 72.3077 49.1317 72.0811 49.6434C71.8545 50.1551 71.5234 50.6137 71.109 50.9898C70.6946 51.3659 70.2062 51.6512 69.675 51.8273C69.1439 52.0034 68.5817 52.0665 68.0248 52.0125H67.9873Z"
                    fill="#DDDDDD"
                  />
                  <path
                    d="M71.4752 65.025L62.6627 57.0375C61.9095 56.3956 60.9523 56.043 59.9627 56.043C58.9731 56.043 58.0158 56.3956 57.2627 57.0375L48.4502 65.025C47.7198 65.7546 47.2987 66.7377 47.2745 67.7698C47.2504 68.8019 47.6249 69.8036 48.3203 70.5666C49.0157 71.3296 49.9785 71.7952 51.0084 71.8666C52.0383 71.9381 53.0561 71.6097 53.8502 70.95L55.9502 69.0375V88.0125C56.0464 89.0049 56.5088 89.926 57.2471 90.5961C57.9854 91.2663 58.9468 91.6376 59.9439 91.6376C60.941 91.6376 61.9024 91.2663 62.6407 90.5961C63.379 89.926 63.8414 89.0049 63.9377 88.0125V69.0375L66.0377 70.95C66.4214 71.3333 66.8789 71.6349 67.3824 71.8364C67.886 72.038 68.4252 72.1354 68.9674 72.1226C69.5097 72.1099 70.0437 71.9874 70.5373 71.7625C71.0308 71.5376 71.4737 71.215 71.8391 70.8141C72.2044 70.4132 72.4847 69.9424 72.663 69.4301C72.8413 68.9179 72.9138 68.3748 72.8763 67.8337C72.8388 67.2926 72.692 66.7647 72.4447 66.282C72.1974 65.7992 71.8548 65.3716 71.4377 65.025H71.4752Z"
                    fill="#DDDDDD"
                  />
                  <path
                    d="M100.012 120C99.4551 120.054 98.8929 119.991 98.3618 119.815C97.8306 119.639 97.3422 119.353 96.9278 118.977C96.5135 118.601 96.1823 118.143 95.9557 117.631C95.7292 117.119 95.6121 116.566 95.6121 116.006C95.6121 115.447 95.7292 114.893 95.9557 114.382C96.1823 113.87 96.5135 113.411 96.9278 113.035C97.3422 112.659 97.8306 112.374 98.3618 112.198C98.8929 112.022 99.4551 111.958 100.012 112.013C103.195 112.013 106.247 110.748 108.497 108.498C110.748 106.247 112.012 103.195 112.012 100.013V19.9875C112.012 16.8049 110.748 13.7527 108.497 11.5022C106.247 9.25179 103.195 7.98751 100.012 7.98751H35.9996C35.4426 8.04155 34.8804 7.97848 34.3493 7.80236C33.8181 7.62624 33.3297 7.34096 32.9153 6.96486C32.5009 6.58875 32.1698 6.13013 31.9432 5.61845C31.7167 5.10678 31.5996 4.55336 31.5996 3.99376C31.5996 3.43416 31.7167 2.88075 31.9432 2.36907C32.1698 1.8574 32.5009 1.39878 32.9153 1.02267C33.3297 0.646561 33.8181 0.361284 34.3493 0.185165C34.8804 0.00904499 35.4426 -0.0540228 35.9996 1.25822e-05H100.012C105.31 0.00992462 110.388 2.11893 114.134 5.86516C117.881 9.6114 119.99 14.6895 120 19.9875V100.013C119.99 105.31 117.881 110.389 114.134 114.135C110.388 117.881 105.31 119.99 100.012 120Z"
                    fill="#DDDDDD"
                  />
                  <path
                    d="M84 120H19.9875C14.6895 119.99 9.61139 117.881 5.86515 114.135C2.11891 110.389 0.00991204 105.31 0 100.013L0 19.9875C0.00991204 14.6895 2.11891 9.6114 5.86515 5.86516C9.61139 2.11893 14.6895 0.00992462 19.9875 1.25822e-05C20.5445 -0.0540228 21.1066 0.00904499 21.6378 0.185165C22.1689 0.361284 22.6574 0.646561 23.0718 1.02267C23.4861 1.39878 23.8172 1.8574 24.0438 2.36907C24.2704 2.88075 24.3874 3.43416 24.3874 3.99376C24.3874 4.55336 24.2704 5.10678 24.0438 5.61845C23.8172 6.13013 23.4861 6.58875 23.0718 6.96486C22.6574 7.34096 22.1689 7.62624 21.6378 7.80236C21.1066 7.97848 20.5445 8.04155 19.9875 7.98751C16.8049 7.98751 13.7527 9.25179 11.5022 11.5022C9.25178 13.7527 7.9875 16.8049 7.9875 19.9875V100.013C7.9875 103.195 9.25178 106.247 11.5022 108.498C13.7527 110.748 16.8049 112.013 19.9875 112.013H84C84.557 111.958 85.1191 112.022 85.6503 112.198C86.1814 112.374 86.6699 112.659 87.0842 113.035C87.4986 113.411 87.8297 113.87 88.0563 114.382C88.2829 114.893 88.3999 115.447 88.3999 116.006C88.3999 116.566 88.2829 117.119 88.0563 117.631C87.8297 118.143 87.4986 118.601 87.0842 118.977C86.6699 119.353 86.1814 119.639 85.6503 119.815C85.1191 119.991 84.557 120.054 84 120Z"
                    fill="#DDDDDD"
                  />
                  <path
                    d="M28.0124 24H19.9874C18.9949 23.9037 18.0739 23.4414 17.4037 22.7031C16.7336 21.9648 16.3623 21.0034 16.3623 20.0063C16.3623 19.0092 16.7336 18.0478 17.4037 17.3095C18.0739 16.5711 18.9949 16.1088 19.9874 16.0125H28.0124C29.0048 16.1088 29.9258 16.5711 30.596 17.3095C31.2662 18.0478 31.6374 19.0092 31.6374 20.0063C31.6374 21.0034 31.2662 21.9648 30.596 22.7031C29.9258 23.4414 29.0048 23.9037 28.0124 24Z"
                    fill="#DDDDDD"
                  />
                  <path
                    d="M76.0127 24C75.4875 24.0049 74.9666 23.9058 74.48 23.7082C73.9934 23.5107 73.5507 23.2187 73.1777 22.8491C72.8046 22.4795 72.5084 22.0396 72.3063 21.5549C72.1042 21.0701 72.0002 20.5502 72.0002 20.025C71.9927 19.2298 72.2217 18.4504 72.6581 17.7856C73.0945 17.1209 73.7185 16.6007 74.451 16.2913C75.1835 15.9818 75.9914 15.897 76.7722 16.0476C77.553 16.1981 78.2715 16.5773 78.8364 17.1369C79.4013 17.6966 79.7872 18.4114 79.9451 19.1908C80.103 19.9701 80.0258 20.7788 79.7232 21.5142C79.4206 22.2496 78.9064 22.8785 78.2457 23.3211C77.5851 23.7636 76.8079 23.9999 76.0127 24Z"
                    fill="#DDDDDD"
                  />
                  <path
                    d="M88.0127 24C87.4875 24.0049 86.9666 23.9058 86.48 23.7082C85.9934 23.5107 85.5507 23.2187 85.1777 22.8491C84.8046 22.4795 84.5084 22.0396 84.3063 21.5549C84.1042 21.0701 84.0002 20.5502 84.0002 20.025C83.9927 19.2298 84.2217 18.4504 84.6581 17.7856C85.0945 17.1209 85.7185 16.6007 86.451 16.2913C87.1835 15.9818 87.9914 15.897 88.7722 16.0476C89.553 16.1981 90.2715 16.5773 90.8364 17.1369C91.4013 17.6966 91.7872 18.4114 91.9451 19.1908C92.103 19.9701 92.0258 20.7788 91.7232 21.5142C91.4206 22.2496 90.9064 22.8785 90.2458 23.3211C89.5851 23.7636 88.8079 23.9999 88.0127 24Z"
                    fill="#DDDDDD"
                  />
                  <path
                    d="M100.013 24C99.4875 24.0049 98.9666 23.9058 98.48 23.7082C97.9934 23.5107 97.5507 23.2187 97.1777 22.8491C96.8046 22.4795 96.5084 22.0396 96.3063 21.5549C96.1042 21.0701 96.0002 20.5502 96.0002 20.025C95.9927 19.2298 96.2217 18.4504 96.6581 17.7856C97.0945 17.1209 97.7185 16.6007 98.451 16.2913C99.1835 15.9818 99.9914 15.897 100.772 16.0476C101.553 16.1981 102.271 16.5773 102.836 17.1369C103.401 17.6966 103.787 18.4114 103.945 19.1908C104.103 19.9701 104.026 20.7788 103.723 21.5142C103.421 22.2496 102.906 22.8785 102.246 23.3211C101.585 23.7636 100.808 23.9999 100.013 24Z"
                    fill="#DDDDDD"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_122_5767">
                    <rect width={120} height={120} fill="white" />
                  </clipPath>
                </defs>
              </svg>
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
