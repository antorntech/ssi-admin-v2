import { Textarea } from "@material-tailwind/react";
import React, { useState } from "react";

const AddHomeAbout = () => {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    "https://placehold.co/530x480"
  );
  const [details, setDetails] = useState("");
  const [fileKey, setFileKey] = useState(Date.now());
  const [uploadProgress, setUploadProgress] = useState(0);
  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB limit

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > MAX_FILE_SIZE) {
      alert("File size exceeds 50MB limit.");
      setFileKey(Date.now());
    } else {
      setImage(file);
      setImagePreview(URL.createObjectURL(file)); // Set the image preview
    }
  };

  const handleDetailsChange = (e) => {
    setDetails(e.target.value);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("banner", image);
    formData.append("details", details);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        headers: {
          "X-Requested-With": "XMLHttpRequest",
        },
        onUploadProgress: (event) => {
          setUploadProgress(Math.round((event.loaded * 100) / event.total));
        },
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const result = await response.json();
      console.log("Upload successful", result);

      // Reset the form
      setImage(null);
      setImagePreview(null);
      setDetails("");
      setFileKey(Date.now());
      setUploadProgress(0);
    } catch (error) {
      console.error("Error uploading file", error);
      // Reset the form
      setImage(null);
      setImagePreview(null);
      setDetails("");
      setFileKey(Date.now());
      setUploadProgress(0);
    }
  };

  const clearPreview = () => {
    setImage(null);
    setImagePreview("https://placehold.co/530x480");
    setDetails("");
    setFileKey(Date.now());
    setUploadProgress(0);
  };

  return (
    <div>
      <div>
        <h1 className="text-xl font-bold">Add Home About</h1>
        <p className="text-sm text-gray-500">
          You can add home about details from here.
        </p>
      </div>
      <div className="mt-5 w-full md:flex">
        <div className="w-full md:w-1/2 flex flex-col">
          <Textarea
            label="Home About Details"
            value={details}
            onChange={handleDetailsChange}
            rows={10}
          />
          <input
            key={fileKey}
            type="file"
            onChange={handleImageChange}
            className="mt-3"
          />
          {uploadProgress > 0 && (
            <div className="mt-3">
              <progress value={uploadProgress} max="100">
                {uploadProgress}%
              </progress>
            </div>
          )}
          <button
            onClick={handleUpload}
            className="mt-5 bg-[#199bff] text-white px-4 py-2 rounded"
          >
            Upload
          </button>
        </div>
        {imagePreview && (
          <div className="relative w-full md:w-1/2 h-[330px] mt-5 md:mt-0 md:ml-5 border-[1px] border-gray-400 rounded-md">
            <button
              className="bg-red-800 text-white w-8 h-8 rounded-full absolute top-2 right-2 flex items-center justify-center"
              onClick={clearPreview}
            >
              <i className="fa-solid fa-xmark text-white"></i>
            </button>
            <img
              src={imagePreview ? imagePreview : "https://placehold.co/530x480"}
              alt="Selected"
              className="max-w-full h-full md:w-full object-cover rounded-md"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AddHomeAbout;
