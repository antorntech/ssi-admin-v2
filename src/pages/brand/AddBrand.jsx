import { Input, Typography } from "@material-tailwind/react";
import React, { useContext, useState } from "react";
import ImagePreviewWithRemove from "../products/ImagePreviewWithRemove";
import FetchContext from "../../context/FetchContext";

const AddBrand = ({ fetchBrands }) => {
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

    if (!body.has("author")) body.append("author", author);
    try {
      const response = await request("brands", {
        method: "POST",
        body,
      });
      if (response.ok) {
        if (fetchBrands) {
          fetchBrands();
        } else {
          window.location.reload();
        }
      }
    } catch (error) {
      console.error("Failed to add brand", error);
      alert("Failed to add brand. Please try again.");
    }
  };

  return (
    <>
      <div className="flex items-center gap-3 mb-3">
        <div>
          <h1 className="text-xl font-bold">Add Brand</h1>
          <p className="text-sm text-gray-500">
            You can add category details from here.
          </p>
        </div>
      </div>
      <form onSubmit={onSubmit} className="form">
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
        <div>
          <Typography
            variant="h6"
            color="gray"
            className="mb-1 font-normal mt-2"
          >
            Name
          </Typography>
          <Input
            type="text"
            size="md"
            name="name"
            className="!border !border-gray-300 bg-white text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#6CB93B] focus:!border-t-border-[#6CB93B] focus:ring-border-[#199bff]/10"
            labelProps={{
              className: "before:content-none after:content-none",
            }}
          />
        </div>

        <button
          type="submit"
          className="mt-5 bg-green-500 text-white px-4 py-2 rounded"
        >
          Add Brand
        </button>
      </form>
    </>
  );
};

export default AddBrand;
