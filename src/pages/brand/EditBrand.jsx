import { Input, Typography } from "@material-tailwind/react";
import React, { useState, useEffect, useContext } from "react";
import ImagePreviewWithRemove from "../products/ImagePreviewWithRemove";
import FetchContext from "../../context/FetchContext";
import { srcBuilder } from "../../utils/src";

const initialValues = {
  name: "",
  serverImage: null,
};

const EditBrand = ({ selectedBrand, fetchBrands }) => {
  const [formState, setFormState] = useState(initialValues);
  const [file, setFile] = useState([]);
  const { request } = useContext(FetchContext);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  }

  function fetchBrandById() {
    if (!selectedBrand.id) return;
    request(`brands/${selectedBrand.id}`)
      .then((r) => r.json())
      .then((data) => {
        if (!data) return;
        setFormState((prev) => ({
          ...prev,
          ...data,
          serverImage: Array.isArray(data.image) ? data.image : [data.image], // Ensure it's an array
          image: [],
        }));
      })
      .catch(console.error);
  }
  useEffect(fetchBrandById, [selectedBrand]);
  const onSubmit = (e) => {
    e.preventDefault();
    const body = new FormData(e.target);
    if (!request) return;
    request(`brands/${selectedBrand.id}`, { method: "PATCH", body })
      .then((r) => r.json())
      .then(() => {
        if (fetchBrands) {
          fetchBrands();
        } else {
          window.location.reload();
        }
      })
      .catch(console.error);
  };

  return (
    <>
      <div className="flex items-center gap-3 mb-3">
        <div>
          <h1 className="text-xl font-bold">Edit Brand</h1>
          <p className="text-sm text-gray-500">
            You can edit category details from here.
          </p>
        </div>
      </div>
      <form onSubmit={onSubmit} className="form">
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
            name="image"
            type="file"
            accept="image/*"
            multiple
            className="absolute top-0 left-0 w-full h-full opacity-0 z-[1] bg-black"
            onChange={(e) => {
              setFile((prev) => [...prev, ...e.target.files]);
            }}
          />
        </label>
        <div className="flex overflow-x-auto gap-4 py-2">
          {/* Handle single or multiple images */}
          {formState.serverImage?.map((src, i) => {
            let path = null;
            if (typeof src === "string") path = srcBuilder(`brands/${src}`);
            return (
              <ImagePreviewWithRemove
                key={i}
                src={path}
                onRemove={() => {
                  if (!selectedBrand.id || !src)
                    throw new Error("id or src is not defined");
                  // call remove media api
                  request(`brands/${selectedBrand.id}/images/${src}`, {
                    method: "DELETE",
                  })
                    .then((r) => r.json())
                    .then(() => {
                      fetchCategoryById();
                    })
                    .catch(console.error);
                }}
              />
            );
          })}
          {file?.map((src, i) => (
            <ImagePreviewWithRemove
              key={i}
              src={src}
              onRemove={() => {
                setFile((prev) => prev.filter((_, idx) => idx !== i));
              }}
            />
          ))}
        </div>
        <div>
          <Typography
            variant="h6"
            color="gray"
            className="mb-1 font-normal mt-2"
          >
            Edit Name
          </Typography>
          <Input
            type="text"
            size="md"
            className="!border !border-gray-300 bg-white text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#6CB93B] focus:!border-t-border-[#6CB93B] focus:ring-border-[#199bff]/10"
            labelProps={{
              className: "before:content-none after:content-none",
            }}
            value={formState.name}
            onChange={handleChange}
            name="name"
          />
        </div>

        <button
          type="submit"
          className="mt-5 bg-green-500 text-white px-4 py-2 rounded"
        >
          Save Changes
        </button>
      </form>
    </>
  );
};

export default EditBrand;
