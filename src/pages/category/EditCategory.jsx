import { Input, Typography } from "@material-tailwind/react";
import React, { useState, useEffect, useContext } from "react";
import ImagePreviewWithRemove from "../products/ImagePreviewWithRemove";
import FetchContext from "../../context/FetchContext";
import { srcBuilder } from "../../utils/src";
import { UPLOADS_URL } from "../../utils/API";

// Initial form values
const initialValues = {
  name: "",
  serverImage: null
};

const EditCategory = ({ selectedCategory, fetchCategories }) => {
  const [formState, setFormState] = useState(initialValues);
  const [file, setFile] = useState(null);
  const { request } = useContext(FetchContext);

  // Fetch category data by ID
  const fetchCategoryById = () => {
    if (!selectedCategory.id) return;

    request(`categories/${selectedCategory.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data) return;
        setFormState((prevState) => ({
          ...prevState,
          ...data,
          serverImage: data.image || null // Ensure it's an array
        }));
      })
      .catch(console.error);
  };

  // Fetch category data when selectedCategory changes
  useEffect(fetchCategoryById, [selectedCategory]);

  // Handle form submission
  const onSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    request(`categories/${selectedCategory.id}`, {
      method: "PATCH",
      body: formData
    })
      .then((res) => res.json())
      .then(() => {
        e.target.reset();
        setFile(null);
        fetchCategories ? fetchCategories() : window.location.reload();
      })
      .catch(console.error);
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  if (!selectedCategory.id) return null;

  return (
    <>
      <div className="flex items-center gap-3 mb-3">
        <div>
          <h1 className="text-xl font-bold">Edit Category</h1>
          <p className="text-sm text-gray-500">
            You can edit category details from here.
          </p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="form" encType="multipart/form-data">
        {/* File upload section */}
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
            onChange={(e) => setFile(e.target.files[0])}
          />
        </label>

        <div className="flex overflow-x-auto gap-4 py-2">
          {file ? (
            <ImagePreviewWithRemove
              src={file}
              onRemove={() => setFile(null)}
            />
          ) : formState.serverImage ? (
            <ImagePreviewWithRemove
              src={srcBuilder(formState.serverImage, "categories")}
              onRemove={() => {
                request(`categories/${selectedCategory.id}/images/${formState.serverImage}`, {
                  method: "DELETE"
                })
                  .then((res) => res.json())
                  .then(fetchCategoryById)
                  .catch(console.error);
              }}
            />
          ) : null}
        </div>

        {/* Edit name input */}
        <div className="mt-4">
          <Typography variant="h6" color="gray" className="mb-1 font-normal">
            Edit Name
          </Typography>
          <input
            type="text"
            size="md"
            className="capitalize w-full py-[8px] pl-[12px] border border-gray-300 bg-white text-gray-900 rounded-md focus:outline-none  focus:ring-border-none focus:border-[#6CB93B] focus:border-t-border-[#6CB93B] focus:ring-border-[#199bff]/10"
            name="name"
            value={formState.name}
            onChange={handleChange}
          />
        </div>

        {/* Submit button */}
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

export default EditCategory;
