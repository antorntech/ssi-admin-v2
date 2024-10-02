import { Input, Typography } from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const EditSponsor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    "https://placehold.co/130x112"
  );
  const [title, setTitle] = useState("");
  const [fileKey, setFileKey] = useState(Date.now());
  const [uploadProgress, setUploadProgress] = useState(0);
  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB limit

  useEffect(() => {
    // Retrieve the specific review from local storage
    const storedSponsors =
      JSON.parse(localStorage.getItem("sponsorsData")) || [];
    const sponsorToEdit = storedSponsors.find(
      (sponsor) => sponsor.id === parseInt(id)
    );

    if (sponsorToEdit) {
      setTitle(sponsorToEdit.title);
      setImagePreview(sponsorToEdit.banner);
    } else {
      toast.error("Sponsor not found", {
        position: "top-right",
        hideProgressBar: false,
        autoClose: 1000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      navigate("/sponsors");
    }
  }, [id, navigate]);

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

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append("banner", image);
    formData.append("title", title);

    try {
      //   const response = await fetch("/api/upload", {
      //     method: "POST",
      //     body: formData,
      //     headers: {
      //       "X-Requested-With": "XMLHttpRequest",
      //     },
      //     onUploadProgress: (event) => {
      //       setUploadProgress(Math.round((event.loaded * 100) / event.total));
      //     },
      //   });

      //   if (!response.ok) {
      //     throw new Error("Upload failed");
      //   }

      //   const result = await response.json();
      //   console.log("Upload successful", result);

      // Retrieve existing data from local storage
      const storedSponsors =
        JSON.parse(localStorage.getItem("sponsorsData")) || [];
      const updatedSponsors = storedSponsors.map((sponsor) =>
        sponsor.id === parseInt(id)
          ? {
              ...sponsor,
              title,
              banner: image ? URL.createObjectURL(image) : imagePreview,
            }
          : sponsor
      );

      localStorage.setItem("sponsorsData", JSON.stringify(updatedSponsors));

      toast.success("Sponsor updated successfully", {
        position: "top-right",
        hideProgressBar: false,
        autoClose: 1000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      navigate("/sponsors");

      // Reset the form
      setImage(null);
      setImagePreview(null);
      setTitle("");
      setFileKey(Date.now());
      setUploadProgress(0);
    } catch (error) {
      console.error("Error uploading file", error);
      // Reset the form
      setImage(null);
      setImagePreview(null);
      setTitle("");
      setFileKey(Date.now());
      setUploadProgress(0);
    }
  };

  const clearPreview = () => {
    setImage(null);
    setImagePreview("https://placehold.co/130x112");
    setFileKey(Date.now());
    setUploadProgress(0);
  };

  return (
    <div>
      <div>
        <h1 className="text-xl font-bold">Edit Sponsor</h1>
        <p className="text-sm text-gray-500">
          You can edit sponsor details from here.
        </p>
      </div>
      <div className="mt-5 w-full md:flex">
        <div className="w-full md:w-1/2 flex flex-col">
          <div>
            <Typography variant="h6" color="gray" className="mb-1 font-normal">
              Title
            </Typography>
            <Input
              type="text"
              size="lg"
              placeholder="Enter sponsor title"
              className="!border !border-gray-300 bg-white text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#199bff] focus:!border-t-border-[#199bff] focus:ring-border-[#199bff]/10"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              value={title}
              title="title"
              onChange={handleTitleChange}
            />
          </div>
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="w-full">
              <Typography
                variant="h6"
                color="gray"
                className="mb-1 font-normal mt-2"
              >
                Logo
              </Typography>
              <input key={fileKey} type="file" onChange={handleImageChange} />
              {uploadProgress > 0 && (
                <div className="mt-3">
                  <progress value={uploadProgress} max="100">
                    {uploadProgress}%
                  </progress>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={handleUpdate}
            className="mt-5 bg-[#199bff] text-white px-4 py-2 rounded"
          >
            Update
          </button>
        </div>
        {imagePreview && (
          <div className="relative w-full md:w-1/2 h-[200px] mt-5 md:mt-0 md:ml-5 border-[1px] border-gray-400 rounded-md flex justify-center items-center">
            <button
              className="bg-red-800 text-white w-8 h-8 rounded-full absolute top-2 right-2 flex items-center justify-center"
              onClick={clearPreview}
            >
              <i className="fa-solid fa-xmark text-white"></i>
            </button>
            <img
              src={imagePreview ? imagePreview : "https://placehold.co/130x112"}
              alt="Selected"
              className="max-w-full h-full md:w-[130px] md:h-[112px] object-cover rounded-md"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default EditSponsor;
