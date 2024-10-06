import { Input, Typography } from "@material-tailwind/react";
import React, { useContext, useState } from "react";
import ImagePreviewWithRemove from "../products/ImagePreviewWithRemove";
import FetchContext from "../../context/FetchContext";
import { useNavigate } from "react-router-dom"; // Ensure you're importing useNavigate

const AddGift = ({ handleAddGift }) => {
  const [price, setPrice] = useState("");
  const [files, setFiles] = useState([]);
  const { request } = useContext(FetchContext);
  const navigate = useNavigate(); // Initialize navigate from react-router-dom

  const fileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const body = new FormData();
    body.append("price", price); // Add price to FormData

    // Add each file to FormData
    files.forEach((file) => {
      body.append("images", file);
    });

    try {
      await request("gifts", {
        method: "POST",
        body,
      });
      navigate("/gifts");
    } catch (error) {
      console.error("Failed to add gift", error);
      alert("Failed to add gift. Please try again.");
    }
  };

  const handleRemoveFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  return (
    <div>
      <h1 className="text-xl font-bold">Add Gift</h1>
      <form onSubmit={onSubmit} className="form">
        {/* File Upload Section */}
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
          />
        </label>
        <div className="flex overflow-x-auto gap-4 mt-2">
          {files.map((file, i) => (
            <ImagePreviewWithRemove
              key={i}
              src={URL.createObjectURL(file)} // Use createObjectURL for preview
              onRemove={() => handleRemoveFile(i)}
            />
          ))}
        </div>

        {/* Price Input */}
        <div>
          <Typography
            variant="h6"
            color="gray"
            className="mb-1 font-normal mt-2"
          >
            Price
          </Typography>
          <input
            type="number"
            size="md"
            className="peer w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 disabled:cursor-not-allowed transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2 border-t-transparent focus:border-t-transparent placeholder:opacity-0 focus:placeholder:opacity-100 text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-gray-900 !border !border-gray-300 bg-white text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#6CB93B] focus:!border-t-border-[#6CB93B] focus:ring-border-[#199bff]/10"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="mt-5 bg-green-500 text-white px-4 py-2 rounded"
        >
          Add Gift
        </button>
      </form>
    </div>
  );
};

export default AddGift;
