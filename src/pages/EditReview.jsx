import { Input, Textarea, Typography } from "@material-tailwind/react";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const EditReview = () => {
  const { id } = useParams(); // Get the review ID from the URL
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    "https://placehold.co/150x50"
  );
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [comments, setComments] = useState("");
  const [fileKey, setFileKey] = useState(Date.now());
  const [uploadProgress, setUploadProgress] = useState(0);
  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB limit

  useEffect(() => {
    // Retrieve the specific review from local storage
    const storedReviews = JSON.parse(localStorage.getItem("reviewsData")) || [];
    const reviewToEdit = storedReviews.find(
      (review) => review.id === parseInt(id)
    );

    if (reviewToEdit) {
      setName(reviewToEdit.name);
      setDesignation(reviewToEdit.designation);
      setComments(reviewToEdit.comments);
      setImagePreview(reviewToEdit.banner);
    } else {
      toast.error("Review not found", {
        position: "top-right",
        hideProgressBar: false,
        autoClose: 1000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      navigate("/reviews");
    }
  }, [id, navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > MAX_FILE_SIZE) {
      alert("File size exceeds 50MB limit.");
      setFileKey(Date.now());
    } else {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleDesignationChange = (e) => {
    setDesignation(e.target.value);
  };

  const handleCommentsChange = (e) => {
    setComments(e.target.value);
  };

  const handleUpdate = () => {
    const formData = new FormData();
    formData.append("banner", image);
    formData.append("name", name);
    formData.append("designation", designation);
    formData.append("comments", comments);

    try {
      const storedReviews =
        JSON.parse(localStorage.getItem("reviewsData")) || [];
      const updatedReviews = storedReviews.map((review) =>
        review.id === parseInt(id)
          ? {
              ...review,
              name,
              designation,
              comments,
              banner: image ? URL.createObjectURL(image) : imagePreview,
            }
          : review
      );

      localStorage.setItem("reviewsData", JSON.stringify(updatedReviews));

      toast.success("Review updated successfully", {
        position: "top-right",
        hideProgressBar: false,
        autoClose: 1000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      navigate("/reviews");

      setImage(null);
      setImagePreview(null);
      setName("");
      setComments("");
      setFileKey(Date.now());
      setUploadProgress(0);
    } catch (error) {
      console.error("Error updating review", error);
      setImage(null);
      setImagePreview(null);
      setName("");
      setComments("");
      setFileKey(Date.now());
      setUploadProgress(0);
    }
  };

  const clearPreview = () => {
    setImage(null);
    setImagePreview("https://placehold.co/150x50");
    setFileKey(Date.now());
    setUploadProgress(0);
  };

  return (
    <div>
      <div>
        <h1 className="text-xl font-bold">Edit Review</h1>
        <p className="text-sm text-gray-500">
          You can edit the review details from here.
        </p>
      </div>
      <div className="mt-5 w-full md:flex">
        <div className="w-full md:w-1/2 flex flex-col">
          <div className="w-full mb-5 flex items-center gap-3">
            <div className="w-full">
              <Typography
                variant="h6"
                color="gray"
                className="mb-1 font-normal"
              >
                Name
              </Typography>
              <Input
                type="text"
                size="lg"
                placeholder="Enter client name"
                className="w-full !border !border-gray-300 bg-white text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#199bff] focus:!border-t-border-[#199bff] focus:ring-border-[#199bff]/10"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                value={name}
                title="name"
                onChange={handleNameChange}
              />
            </div>
            <div className="w-full">
              <Typography
                variant="h6"
                color="gray"
                className="mb-1 font-normal"
              >
                Designation
              </Typography>
              <Input
                type="text"
                size="lg"
                placeholder="Enter client designation"
                className="w-full !border !border-gray-300 bg-white text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#199bff] focus:!border-t-border-[#199bff] focus:ring-border-[#199bff]/10"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                value={designation}
                title="designation"
                onChange={handleDesignationChange}
              />
            </div>
          </div>
          <div>
            <Typography
              variant="h6"
              color="gray"
              className="mb-1 font-normal mt-2"
            >
              Comments
            </Typography>
            <Textarea
              value={comments}
              className="!border !border-gray-300 bg-white text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#199bff] focus:!border-t-border-[#199bff] focus:ring-border-[#199bff]/10"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              onChange={handleCommentsChange}
              rows={5}
              placeholder="Enter client comments"
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
              src={imagePreview ? imagePreview : "https://placehold.co/150x50"}
              alt="Selected"
              className="max-w-full h-full md:w-[150px] md:h-[50px] object-cover rounded-md"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default EditReview;
