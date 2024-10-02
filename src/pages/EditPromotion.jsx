import { Input, Textarea, Typography } from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const EditPromotion = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [titleOne, setTitleOne] = useState("");
  const [titleTwo, setTitleTwo] = useState("");
  const [titleThree, setTitleThree] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [videoLink, setVideoLink] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Retrieve the specific review from local storage
    const storedPromotions =
      JSON.parse(localStorage.getItem("promotionsData")) || [];

    const promotionToEdit = storedPromotions.find(
      (promotion) => promotion.id === parseInt(id)
    );

    if (promotionToEdit) {
      setTitleOne(promotionToEdit.titleOne);
      setTitleTwo(promotionToEdit.titleTwo);
      setTitleThree(promotionToEdit.titleThree);
      setSubtitle(promotionToEdit.subtitle);
      setVideoLink(promotionToEdit.videoLink);
    } else {
      toast.error("Promotion not found", {
        position: "top-right",
        hideProgressBar: false,
        autoClose: 1000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      navigate("/promotion");
    }
  }, [id, navigate]);

  const handleTitleOneChange = (e) => {
    setTitleOne(e.target.value);
  };

  const handleTitleTwoChange = (e) => {
    setTitleTwo(e.target.value);
  };

  const handleTitleThreeChange = (e) => {
    setTitleThree(e.target.value);
  };

  const handleSubtitleChange = (e) => {
    setSubtitle(e.target.value);
  };

  const handleVideoLinkChange = (e) => {
    const url = e.target.value;
    setVideoLink(url);

    if (!url.startsWith("http")) {
      setError("Invalid URL.");
    } else {
      setError(""); // Clear error on valid input
    }
  };

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append("titleOne", titleOne);
    formData.append("titleTwo", titleTwo);
    formData.append("titleThree", titleThree);
    formData.append("subtitle", subtitle);
    formData.append("videoLink", videoLink);

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
      const storedPromotions =
        JSON.parse(localStorage.getItem("promotionsData")) || [];
      const updatedPromotions = storedPromotions.map((promotion) =>
        promotion.id === parseInt(id)
          ? {
              ...promotion,
              titleOne,
              titleTwo,
              titleThree,
              subtitle,
              videoLink,
            }
          : promotion
      );

      localStorage.setItem("promotionsData", JSON.stringify(updatedPromotions));

      toast.success("Promotion updated successfully", {
        position: "top-right",
        hideProgressBar: false,
        autoClose: 1000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      navigate("/promotion");

      // Reset the form
      setTitleOne("");
      setTitleTwo("");
      setTitleThree("");
      setSubtitle("");
      setVideoLink("");
    } catch (error) {
      console.error("Error uploading file", error);
      // Reset the form
      setTitleOne("");
      setTitleTwo("");
      setTitleThree("");
      setSubtitle("");
      setVideoLink("");
    }
  };

  return (
    <div>
      <div>
        <h1 className="text-xl font-bold">Edit Promotion</h1>
        <p className="text-sm text-gray-500">
          You can edit promotion details from here.
        </p>
      </div>
      <div className="mt-5 w-full md:flex">
        <div className="w-full md:w-1/2 flex flex-col">
          <div>
            <Typography variant="h6" color="gray" className="mb-1 font-normal">
              Title One
            </Typography>
            <Input
              type="text"
              size="lg"
              className="!border !border-gray-300 bg-white text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#199bff] focus:!border-t-border-[#199bff] focus:ring-border-[#199bff]/10"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              value={titleOne}
              name="titleOne"
              onChange={handleTitleOneChange}
              placeholder="Enter title one"
            />
          </div>

          <div>
            <Typography
              variant="h6"
              color="gray"
              className="mb-1 font-normal mt-2"
            >
              Title Two
            </Typography>
            <Input
              type="text"
              value={titleTwo}
              className="!border !border-gray-300 bg-white text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#199bff] focus:!border-t-border-[#199bff] focus:ring-border-[#199bff]/10"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              onChange={handleTitleTwoChange}
              placeholder="Enter title two"
            />
          </div>

          <div>
            <Typography
              variant="h6"
              color="gray"
              className="mb-1 font-normal mt-2"
            >
              Title Three
            </Typography>
            <Input
              type="text"
              value={titleThree}
              className="!border !border-gray-300 bg-white text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#199bff] focus:!border-t-border-[#199bff] focus:ring-border-[#199bff]/10"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              onChange={handleTitleThreeChange}
              placeholder="Enter title three"
            />
          </div>

          <div>
            <Typography
              variant="h6"
              color="gray"
              className="mb-1 font-normal mt-2"
            >
              Subtitle
            </Typography>
            <Input
              type="text"
              value={subtitle}
              className="!border !border-gray-300 bg-white text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#199bff] focus:!border-t-border-[#199bff] focus:ring-border-[#199bff]/10"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              onChange={handleSubtitleChange}
              placeholder="Enter subtitle"
            />
          </div>

          <div>
            <Typography
              variant="h6"
              color="gray"
              className="mb-1 font-normal mt-2"
            >
              Video Link
            </Typography>
            <Input
              type="text"
              value={videoLink}
              className="!border !border-gray-300 bg-white text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#199bff] focus:!border-t-border-[#199bff] focus:ring-border-[#199bff]/10"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              onChange={handleVideoLinkChange}
              placeholder="Enter video link"
            />
            {error && <p className="text-red-500">{error}</p>}
          </div>

          <button
            onClick={handleUpdate}
            className="mt-5 bg-[#199bff] text-white px-4 py-2 rounded"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPromotion;
