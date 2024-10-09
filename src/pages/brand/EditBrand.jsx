import { Input, Typography } from "@material-tailwind/react";
import React, { useState, useEffect, useContext } from "react";
import ImagePreviewWithRemove from "../products/ImagePreviewWithRemove";
import FetchContext from "../../context/FetchContext";
import { srcBuilder } from "../../utils/src";

// Initial values for the form
const initialValues = {
  name: "",
  serverImage: []
};

const EditBrand = ({ selectedBrand, fetchBrands }) => {
  const [formState, setFormState] = useState(initialValues);
  const [file, setFile] = useState(null);
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
          serverImage: data.image || null // Handle image as array
        });
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchBrandById();
  }, [selectedBrand]);

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  // Handle form submission
  const onSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    request(`brands/${selectedBrand.id}`, {
      method: "PATCH",
      body: formData
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error: ${res.statusText}`);
        }
        return res.json();
      })
      .then(() => {
        setFile(null); // Clear file input after successful upload
        if (fetchBrands) {
          fetchBrands();
        }
      })
      .catch((error) => {
        console.error("Error submitting form:", error);
      });
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
        <div className="flex overflow-x-auto gap-4 py-2">
          {file ? (
            <ImagePreviewWithRemove src={file} onRemove={() => setFile(null)} />
          ) : formState.serverImage ? (
            <ImagePreviewWithRemove
              src={srcBuilder(formState.serverImage, "brands")}
              onRemove={() => {
                request(
                  `brands/${selectedBrand.id}/images/${formState.serverImage}`,
                  { method: "DELETE" }
                )
                  .then((res) => res.json())
                  .then(fetchBrandById)
                  .catch(console.error);
              }}
            />
          ) : null}
        </div>
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
