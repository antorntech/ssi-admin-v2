import { Input, Typography } from "@material-tailwind/react";
import React, { useState, useEffect, useContext } from "react";
import ImagePreviewWithRemove from "../products/ImagePreviewWithRemove";
import FetchContext from "../../context/FetchContext";
import { srcBuilder } from "../../utils/src";

// Initial values for the form
const initialValues = {
  name: "",
  serverImage: [],
};

const EditBrand = ({ selectedBrand, fetchBrands }) => {
  const [formState, setFormState] = useState(initialValues);
  const [file, setFile] = useState([]);
  const { request } = useContext(FetchContext);

  // Fetch the brand data by ID
  const fetchBrandById = () => {
    if (!selectedBrand.id) return;

    request(`brands/${selectedBrand.id}`)
      .then((r) => r.json())
      .then((data) => {
        if (!data) return;
        setFormState({
          ...formState,
          name: data.name || "",
          serverImage: Array.isArray(data.image) ? data.image : [data.image], // Handle image as array
        });
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchBrandById();
  }, [selectedBrand]);

  // Handle file selection
  const handleFileChange = (e) => {
    setFile((prev) => [...prev, ...e.target.files]);
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  // Handle form submission
  const onSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();

    // Append form data
    formData.append("name", formState.name);

    // Append new files if any
    if (file.length > 0) {
      file.forEach((fileItem) => formData.append("image", fileItem));
    }

    // Send the PATCH request
    request(`brands/${selectedBrand.id}`, {
      method: "PATCH",
      body: formData,
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error: ${res.statusText}`);
        }
        return res.json();
      })
      .then(() => {
        setFile([]); // Clear file input after successful upload
        if (fetchBrands) {
          fetchBrands();
        }
      })
      .catch((error) => {
        console.error("Error submitting form:", error);
      });
  };

  // Remove image on click (both new and server images)
  const handleRemoveImage = (index, isServerImage = false) => {
    if (isServerImage) {
      const image = formState.serverImage[index];
      if (image && selectedBrand.id) {
        request(`brands/${selectedBrand.id}/images/${image}`, {
          method: "DELETE",
        })
          .then((res) => res.json())
          .then(() => fetchBrandById()) // Refresh brand data after image deletion
          .catch(console.error);
      }
    } else {
      setFile((prev) => prev.filter((_, idx) => idx !== index));
    }
  };

  return (
    <>
      <div className="flex items-center gap-3 mb-3">
        <div>
          <h1 className="text-xl font-bold">Edit Brand</h1>
          <p className="text-sm text-gray-500">
            You can edit brand details from here.
          </p>
        </div>
      </div>
      <form onSubmit={onSubmit} className="form">
        {/* File Upload Section */}
        <label className="border-2 border-dashed rounded-lg border-gray-300 bg-gray-50 hover:border-[#6CB93B] p-6 py-2 lg:py-[33px] text-center w-full flex flex-col items-center relative">
          <lord-icon
            src="https://cdn.lordicon.com/smwmetfi.json"
            trigger="loop"
            colors="primary:#545454"
            style={{ width: "50px", height: "50px" }}
          />
          <div className="flex flex-col items-center">
            <div className="text-lg font-semibold mb-1">
              Drag and drop files here
            </div>
            <div className="text-sm mb-6">File must be image/* format</div>
            <button
              className="border border-gray-900 text-gray-900 hover:bg-gray-100 flex items-center justify-center gap-1 text-sm rounded-xl px-4 py-2 font-medium"
              type="button"
            >
              Browse files
            </button>
          </div>
          <input
            name="image"
            type="file"
            accept="image/*"
            multiple
            className="absolute top-0 left-0 w-full h-full opacity-0"
            onChange={handleFileChange}
          />
        </label>

        {/* Image Preview Section */}
        <div className="flex overflow-x-auto gap-4 py-2">
          {/* Server images */}
          {formState.serverImage?.map((src, i) => {
            const imageUrl =
              typeof src === "string" ? srcBuilder(`brands/${src}`) : null;
            return (
              <ImagePreviewWithRemove
                key={i}
                src={imageUrl}
                onRemove={() => handleRemoveImage(i, true)}
              />
            );
          })}

          {/* New files */}
          {file.map((fileItem, i) => (
            <ImagePreviewWithRemove
              key={i}
              src={URL.createObjectURL(fileItem)}
              onRemove={() => handleRemoveImage(i)}
            />
          ))}
        </div>

        {/* Name Input */}
        <div className="mt-4">
          <Typography variant="h6" color="gray" className="mb-1">
            Edit Name
          </Typography>
          <input
            type="text"
            name="name"
            value={formState.name}
            onChange={handleChange}
            className="capitalize w-full py-[8px] pl-[12px] border border-gray-300 bg-white text-gray-900 rounded-md focus:outline-none  focus:ring-border-none focus:border-[#6CB93B] focus:border-t-border-[#6CB93B] focus:ring-border-[#199bff]/10"
          />
        </div>

        {/* Submit Button */}
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
