import { Input, Textarea, Typography } from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const EditRoadMap = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    // Retrieve the specific review from local storage
    const storedRoadMaps =
      JSON.parse(localStorage.getItem("roadmapsData")) || [];
    const roadMapToEdit = storedRoadMaps.find(
      (roadMap) => roadMap.id === parseInt(id)
    );

    if (roadMapToEdit) {
      setTitle(roadMapToEdit.title);
      setDescription(roadMapToEdit.description);
    } else {
      toast.error("Road Map not found", {
        position: "top-right",
        hideProgressBar: false,
        autoClose: 1000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      navigate("/road-maps");
    }
  }, [id, navigate]);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };
  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);

    console.log(title, description);

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
      const storedRoadMaps =
        JSON.parse(localStorage.getItem("roadmapsData")) || [];
      const updatedRoadMaps = storedRoadMaps.map((roadMap) =>
        roadMap.id === parseInt(id)
          ? {
              ...roadMap,
              title,
              description,
            }
          : roadMap
      );

      localStorage.setItem("roadmapsData", JSON.stringify(updatedRoadMaps));

      toast.success("Road Map updated successfully", {
        position: "top-right",
        hideProgressBar: false,
        autoClose: 1000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      navigate("/road-maps");

      // Reset the form
      setTitle("");
      setDescription("");
    } catch (error) {
      console.error("Error uploading file", error);
      // Reset the form
      setTitle("");
      setDescription("");
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => window.history.back()}
          className="flex items-center justify-center gap-1 text-black border-2 border-black px-2 py-2 rounded-md text-sm hover:bg-black hover:text-white transition-all duration-500"
        >
          <i class="fa-solid fa-hand-point-left"></i>
        </button>
        <div>
          <h1 className="text-xl font-bold">Edit Road Map</h1>
          <p className="text-sm text-gray-500">
            You can edit road map details from here.
          </p>
        </div>
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
              placeholder="Enter roadMap title"
              className="!border !border-gray-300 bg-white text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#199bff] focus:!border-t-border-[#199bff] focus:ring-border-[#199bff]/10"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              value={title}
              name="title"
              onChange={handleTitleChange}
            />
          </div>

          <div>
            <Typography
              variant="h6"
              color="gray"
              className="mb-1 font-normal mt-2"
            >
              Description
            </Typography>
            <Textarea
              value={description}
              className="!border !border-gray-300 bg-white text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#199bff] focus:!border-t-border-[#199bff] focus:ring-border-[#199bff]/10"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              onChange={handleDescriptionChange}
              rows={5}
              placeholder="Enter roadMap description"
            />
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

export default EditRoadMap;
