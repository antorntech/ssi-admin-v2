import { Input, Textarea, Typography, Select } from "@material-tailwind/react";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import JoditEditor from "jodit-react";
import moment from "moment";

const EditSoftware = () => {
  const { id } = useParams(); // Get the review ID from the URL
  const navigate = useNavigate();
  const config = {
    readonly: false,
    height: 300,
    placeholder: "Write your software block quote...",
  };
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    "https://placehold.co/530x480"
  );
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const editor = useRef(null);
  const [blockQuote, setBlockQuote] = useState("");
  const [devTools, setDevTools] = useState([]);
  const [currentDevTool, setCurrentDevTool] = useState("");
  const [keyFeatures, setKeyFeatures] = useState([]);
  const [currentKeyFeatures, setCurrentKeyFeatures] = useState("");
  const [benefits, setBenefits] = useState([]);
  const [currentBenefit, setCurrentBenefit] = useState("");
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState("");
  const [category, setCategory] = useState("Skill Development Training");
  const date = moment().format("Do MMMM, YYYY");
  const [fileKey, setFileKey] = useState(Date.now());
  const [uploadProgress, setUploadProgress] = useState(0);
  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB limit

  useEffect(() => {
    // Retrieve the specific review from local storage
    const storedSoftwares =
      JSON.parse(localStorage.getItem("softwaresData")) || [];
    const softwareToEdit = storedSoftwares.find(
      (software) => software.id === parseInt(id)
    );

    if (softwareToEdit) {
      setTitle(softwareToEdit.title);
      setDetails(softwareToEdit.details);
      setBlockQuote(softwareToEdit.blockQuote);
      setDevTools(softwareToEdit.devTools);
      setKeyFeatures(softwareToEdit.keyFeatures);
      setBenefits(softwareToEdit.benefits);
      setTags(softwareToEdit.tags);
      setCategory(softwareToEdit.category);
      setImagePreview(softwareToEdit.banner);
    } else {
      toast.error("Training not found", {
        position: "top-right",
        hideProgressBar: false,
        autoClose: 1000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      navigate("/softwares");
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
  const handleDetailsChange = (e) => {
    setDetails(e.target.value);
  };

  const handleBlockQuoteChange = (e) => {
    setBlockQuote(e.target.value);
  };

  const handleItemChange = (e, setCurrentItem) => {
    setCurrentItem(e.target.value);
  };

  const handleKeyDown = (e, value, setValue, currentItem, setCurrentItem) => {
    if (e.key === "Enter" && currentItem.trim() !== "") {
      e.preventDefault();
      if (!value.includes(currentItem.trim())) {
        // Check for duplicates
        setValue([...value, currentItem.trim()]);
      }
      setCurrentItem(""); // Clear the input field
    }
  };

  const removeItem = (indexToRemove, value, setValue) => {
    setValue(value.filter((_, index) => index !== indexToRemove));
  };

  const moveUp = (index, value) => {
    if (value === "devTools") {
      if (index > 0) {
        const newDevTools = [...devTools];
        [newDevTools[index - 1], newDevTools[index]] = [
          newDevTools[index],
          newDevTools[index - 1],
        ];
        setDevTools(newDevTools);
      }
    } else if (value === "keyFeatures") {
      if (index > 0) {
        const newKeyFeatures = [...keyFeatures];
        [newKeyFeatures[index - 1], newKeyFeatures[index]] = [
          newKeyFeatures[index],
          newKeyFeatures[index - 1],
        ];
        setKeyFeatures(newKeyFeatures);
      }
    } else {
      if (index > 0) {
        const newBenefits = [...benefits];
        [newBenefits[index - 1], newBenefits[index]] = [
          newBenefits[index],
          newBenefits[index - 1],
        ];
        setBenefits(newWorks);
      }
    }
  };

  const moveDown = (index, value) => {
    if (value === "devTools") {
      if (index < devTools.length - 1) {
        const newDevTools = [...devTools];
        [newDevTools[index + 1], newDevTools[index]] = [
          newDevTools[index],
          newDevTools[index + 1],
        ];
        setDevTools(newDevTools);
      }
    } else if (value === "keyFeatures") {
      if (index < keyFeatures.length - 1) {
        const newKeyFeatures = [...keyFeatures];
        [newKeyFeatures[index + 1], newKeyFeatures[index]] = [
          newKeyFeatures[index],
          newKeyFeatures[index + 1],
        ];
        setKeyFeatures(newKeyFeatures);
      }
    } else {
      if (index < benefits.length - 1) {
        const newBenefits = [...benefits];
        [newBenefits[index + 1], newBenefits[index]] = [
          newBenefits[index],
          newBenefits[index + 1],
        ];
        setBenefits(newBenefits);
      }
    }
  };

  const handleCategoryChange = (value) => {
    setCategory(value);
  };

  const handleUpdate = () => {
    const formData = new FormData();
    formData.append("banner", image);
    formData.append("title", title);
    formData.append("details", details);
    formData.append("devTools", JSON.stringify(devTools));
    formData.append("keyFeatures", JSON.stringify(keyFeatures));
    formData.append("benefits", JSON.stringify(benefits));
    formData.append("tags", JSON.stringify(tags));
    formData.append("category", category);
    formData.append("author", "Admin");
    formData.append("date", date);

    try {
      const storedSoftwares =
        JSON.parse(localStorage.getItem("softwaresData")) || [];
      const updatedSoftwares = storedSoftwares.map((software) =>
        software.id === parseInt(id)
          ? {
              ...software,
              title,
              details,
              blockQuote,
              devTools,
              keyFeatures,
              benefits,
              tags,
              category,
              date,
              banner: image ? URL.createObjectURL(image) : imagePreview,
            }
          : software
      );

      localStorage.setItem("softwaresData", JSON.stringify(updatedSoftwares));

      toast.success("Training updated successfully", {
        position: "top-right",
        hideProgressBar: false,
        autoClose: 1000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      navigate("/softwares");

      setImage(null);
      setImagePreview(null);
      setFileKey(Date.now());
      setUploadProgress(0);
    } catch (error) {
      console.error("Error updating review", error);
      setImage(null);
      setImagePreview(null);
      setFileKey(Date.now());
      setUploadProgress(0);
    }
  };

  const clearPreview = () => {
    setImage(null);
    setImagePreview("https://placehold.co/530x480");
    setFileKey(Date.now());
    setUploadProgress(0);
  };

  return (
    <div>
      <div>
        <h1 className="text-xl font-bold">Edit Software</h1>
        <p className="text-sm text-gray-500">
          You can edit the software details from here.
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
              placeholder="Enter software title"
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
              Details
            </Typography>
            <Textarea
              value={details}
              className="!border !border-gray-300 bg-white text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#199bff] focus:!border-t-border-[#199bff] focus:ring-border-[#199bff]/10"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              onChange={handleDetailsChange}
              rows={5}
              placeholder="Enter software details"
            />
          </div>
          {/* <div>
            <Typography
              variant="h6"
              color="gray"
              className="mb-1 font-normal mt-2"
            >
              Block Quote
            </Typography>
            <JoditEditor
              ref={editor}
              value={blockQuote}
              config={config}
              tabIndex={1} // tabIndex of textarea
              onBlur={(newContent) => setBlockQuote(newContent)} // preferred to use only this option to update the content for performance reasons
              onChange={(newContent) => {}}
            />
          </div> */}
          {/* DevTools input field */}
          <div>
            <Typography
              variant="h6"
              color="gray"
              className="mb-1 font-normal mt-2"
            >
              Development Tools
            </Typography>
            <Input
              type="text"
              size="lg"
              placeholder="Enter development tools and press Enter"
              className="!border !border-gray-300 bg-white text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#199bff] focus:!border-t-border-[#199bff] focus:ring-border-[#199bff]/10"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              value={currentDevTool}
              name="devTools"
              onChange={(e) => handleItemChange(e, setCurrentDevTool)}
              onKeyDown={(e) =>
                handleKeyDown(
                  e,
                  devTools,
                  setDevTools,
                  currentDevTool,
                  setCurrentDevTool
                )
              } // Handle Enter key
            />
            {/* Display devTools */}
            <div className="mt-2 flex flex-wrap gap-2">
              {devTools.map((devTool, index) => (
                <div
                  key={index}
                  className="w-full border-2 border-gray-300 bg-gray-200 text-black px-3 py-1 rounded-md flex items-center justify-between"
                >
                  <div>
                    <i className="fa-solid fa-check mr-2"></i>
                    {devTool}
                  </div>
                  <div className="flex items-center">
                    <button
                      onClick={() => moveUp(index, "devTools")}
                      className="text-gray-800 bg-gray-400 hover:bg-green-600 hover:text-white transition-all duration-500 rounded-full w-6 h-6 flex items-center justify-center mr-2"
                    >
                      <i class="fa-solid fa-up-long text-[12px]"></i>
                    </button>
                    <button
                      onClick={() => moveDown(index, "devTools")}
                      className="text-gray-800 bg-gray-400 hover:bg-green-600 hover:text-white transition-all duration-500 rounded-full w-6 h-6 flex items-center justify-center mr-2"
                    >
                      <i class="fa-solid fa-down-long text-[12px]"></i>
                    </button>
                    <button
                      onClick={() => removeItem(index, devTools, setDevTools)}
                      className="text-white bg-red-600 rounded-full w-6 h-6 flex items-center justify-center"
                    >
                      <i class="fa-solid fa-xmark text-[12px]"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* key features input field */}
          <div>
            <Typography
              variant="h6"
              color="gray"
              className="mb-1 font-normal mt-2"
            >
              Key Features
            </Typography>
            <Input
              type="text"
              size="lg"
              placeholder="Enter key features and press Enter"
              className="!border !border-gray-300 bg-white text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#199bff] focus:!border-t-border-[#199bff] focus:ring-border-[#199bff]/10"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              value={currentKeyFeatures}
              name="keyFeatures"
              onChange={(e) => handleItemChange(e, setCurrentKeyFeatures)}
              onKeyDown={(e) =>
                handleKeyDown(
                  e,
                  keyFeatures,
                  setKeyFeatures,
                  currentKeyFeatures,
                  setCurrentKeyFeatures
                )
              } // Handle Enter key
            />
            {/* Display key features */}
            <div className="mt-2 flex flex-wrap gap-2">
              {keyFeatures.map((keyFeature, index) => (
                <div
                  key={index}
                  className="w-full border-2 border-gray-300 bg-gray-200 text-black px-3 py-1 rounded-md flex items-center justify-between"
                >
                  <div>
                    <i className="fa-solid fa-check mr-2"></i>
                    {keyFeature}
                  </div>
                  <div className="flex items-center">
                    <button
                      onClick={() => moveUp(index, "keyFeatures")}
                      className="text-gray-800 bg-gray-400 hover:bg-green-600 hover:text-white transition-all duration-500 rounded-full w-6 h-6 flex items-center justify-center mr-2"
                    >
                      <i class="fa-solid fa-up-long text-[12px]"></i>
                    </button>
                    <button
                      onClick={() => moveDown(index, "keyFeatures")}
                      className="text-gray-800 bg-gray-400 hover:bg-green-600 hover:text-white transition-all duration-500 rounded-full w-6 h-6 flex items-center justify-center mr-2"
                    >
                      <i class="fa-solid fa-down-long text-[12px]"></i>
                    </button>
                    <button
                      onClick={() =>
                        removeItem(index, keyFeatures, setKeyFeatures)
                      }
                      className="text-white bg-red-600 rounded-full w-6 h-6 flex items-center justify-center"
                    >
                      <i class="fa-solid fa-xmark text-[12px]"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Benefits input field */}
          <div>
            <Typography
              variant="h6"
              color="gray"
              className="mb-1 font-normal mt-2"
            >
              Software Benefits
            </Typography>
            <Input
              type="text"
              size="lg"
              placeholder="Enter software benefits and press Enter"
              className="!border !border-gray-300 bg-white text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#199bff] focus:!border-t-border-[#199bff] focus:ring-border-[#199bff]/10"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              value={currentBenefit}
              name="benefits"
              onChange={(e) => handleItemChange(e, setCurrentBenefit)}
              onKeyDown={(e) =>
                handleKeyDown(
                  e,
                  benefits,
                  setBenefits,
                  currentBenefit,
                  setCurrentBenefit
                )
              } // Handle Enter key
            />
            {/* Display benefits */}
            <div className="mt-2 flex flex-wrap gap-2">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="w-full border-2 border-gray-300 bg-gray-200 text-black px-3 py-1 rounded-md flex items-center justify-between"
                >
                  <div>
                    <i className="fa-solid fa-check mr-2"></i>
                    {benefit}
                  </div>
                  <div className="flex items-center">
                    <button
                      onClick={() => moveUp(index, "benefits")}
                      className="text-gray-800 bg-gray-400 hover:bg-green-600 hover:text-white transition-all duration-500 rounded-full w-6 h-6 flex items-center justify-center mr-2"
                    >
                      <i class="fa-solid fa-up-long text-[12px]"></i>
                    </button>
                    <button
                      onClick={() => moveDown(index, "benefits")}
                      className="text-gray-800 bg-gray-400 hover:bg-green-600 hover:text-white transition-all duration-500 rounded-full w-6 h-6 flex items-center justify-center mr-2"
                    >
                      <i class="fa-solid fa-down-long text-[12px]"></i>
                    </button>
                    <button
                      onClick={() => removeItem(index, benefits, setBenefits)}
                      className="text-white bg-red-600 rounded-full w-6 h-6 flex items-center justify-center"
                    >
                      <i class="fa-solid fa-xmark text-[12px]"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Tags input field */}
          <div>
            <Typography
              variant="h6"
              color="gray"
              className="mb-1 font-normal mt-2"
            >
              Tags
            </Typography>
            <Input
              type="text"
              size="lg"
              placeholder="Enter tags and press Enter"
              className="!border !border-gray-300 bg-white text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#199bff] focus:!border-t-border-[#199bff] focus:ring-border-[#199bff]/10"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              value={currentTag}
              name="tags"
              onChange={(e) => handleItemChange(e, setCurrentTag)}
              onKeyDown={(e) =>
                handleKeyDown(e, tags, setTags, currentTag, setCurrentTag)
              } // Handle Enter key
            />
            {/* Display tags */}
            <div className="mt-2 flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <div
                  key={index}
                  className="bg-blue-500 text-white px-3 py-1 rounded-md flex items-center"
                >
                  {tag}
                  <button
                    onClick={() => removeItem(index, tags, setTags)}
                    className="ml-2 text-white bg-red-600 rounded-full w-4 h-4 flex items-center justify-center"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="w-full md:w-[55%]">
              <Typography
                variant="h6"
                color="gray"
                className="mb-1 font-normal mt-2"
              >
                Category
              </Typography>
              <Select
                className="!border !border-gray-300 bg-white text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#199bff] focus:!border-t-border-[#199bff] focus:ring-border-[#199bff]/10"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                value={category}
                onChange={handleCategoryChange}
                size="lg"
              >
                <Option value="Skill Development Training">
                  Skill Development Training
                </Option>
                <Option value="Internet of Things">Internet of Things</Option>
                <Option value="Artificial Intelligence">
                  Artificial Intelligence
                </Option>
                <Option value="Research & Development">
                  Research & Development
                </Option>
                <Option value="Blockchain Application">
                  Blockchain Application
                </Option>
                <Option value="Software Development">
                  Software Development
                </Option>
              </Select>
            </div>
            <div className="w-full md:w-[45%]">
              <Typography
                variant="h6"
                color="gray"
                className="mb-1 font-normal mt-2"
              >
                Banner
              </Typography>
              <input
                key={fileKey}
                type="file"
                onChange={handleImageChange}
                className=""
              />
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
          <div className="relative w-full md:w-1/2 h-[500px] mt-5 md:mt-0 md:ml-5 border-[1px] border-gray-400 rounded-md">
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

export default EditSoftware;
