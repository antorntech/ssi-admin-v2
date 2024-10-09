import { Input, Typography } from "@material-tailwind/react";
import React, { useContext, useState } from "react";
import ImagePreviewWithRemove from "../products/ImagePreviewWithRemove";
import FetchContext from "../../context/FetchContext";

const AddCategory = ({ fetchCategories }) => {
  const [file, setFile] = useState(null); // Single file handling, set to null initially
  const { request } = useContext(FetchContext);
  const author = "google@gmail.com"; // Consider making this dynamic or removing if not used

  // Handle file input change
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    try {
      await request("categories", {
        method: "POST",
        body: formData,
      });

      // Reset form and state after successful submission
      setFile(null);
      e.target.reset();

      // Fetch categories if the callback is passed, otherwise reload the page
      fetchCategories ? fetchCategories() : window.location.reload();
    } catch (error) {
      console.error("Failed to add category", error);
    }
  };

  return (
    <div>
      {/* Heading Section */}
      <div className="flex items-center gap-3 mb-3">
        <div>
          <h1 className="text-xl font-bold">Add Category</h1>
          <p className="text-sm text-gray-500">
            You can add category details from here.
          </p>
        </div>
      </div>

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="form">
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
            <div className="text-sm mb-6">File must be in image/* format</div>
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
            name="image"
            type="file"
            accept="image/*"
            className="absolute top-0 left-0 w-full h-full opacity-0 z-[1]"
            onChange={handleFileChange}
            required
          />
        </label>

        {/* Image Preview Section */}
        <div className="flex overflow-x-auto gap-4 mt-2">
          {file && (
            <ImagePreviewWithRemove src={file} onRemove={() => setFile(null)} />
          )}
        </div>

        {/* Category Name Input */}
        <div className="mt-4">
          <Typography variant="h6" color="gray" className="mb-1 font-normal">
            Name
          </Typography>
          <input
            type="text"
            size="md"
            className="capitalize w-full py-[8px] pl-[12px] border border-gray-300 bg-white text-gray-900 rounded-md focus:outline-none  focus:ring-border-none focus:border-[#6CB93B] focus:border-t-border-[#6CB93B] focus:ring-border-[#199bff]/10"
            name="name"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="mt-5 bg-green-500 text-white px-4 py-2 rounded"
        >
          Add Category
        </button>
      </form>
    </div>
  );
};

export default AddCategory;
