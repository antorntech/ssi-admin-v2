import {
  Input,
  Option,
  Select,
  Textarea,
  Typography,
} from "@material-tailwind/react";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import JoditEditor from "jodit-react";
import moment from "moment";

const AddBlog = () => {
  const navigate = useNavigate();
  const config = {
    readonly: false,
    height: 300,
    placeholder: "Write your blog block quote...",
  };
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    "https://placehold.co/530x480"
  );
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const editor = useRef(null);
  const [blockQuote, setBlockQuote] = useState("");
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState("");
  const [category, setCategory] = useState("Skill Development Training");
  const date = moment().format("Do MMMM, YYYY");
  const [fileKey, setFileKey] = useState(Date.now());
  const MAX_FILE_SIZE = 50 * 1024 * 1024;

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

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleDetailsChange = (e) => {
    setDetails(e.target.value);
  };

  const handleBlockQuoteChange = (e) => {
    setBlockQuote(e.target.value);
  };

  const handleTagsChange = (e) => {
    setCurrentTag(e.target.value);
  };

  const handleTagsKeyDown = (e) => {
    if (e.key === "Enter" && currentTag.trim() !== "") {
      e.preventDefault();
      if (!tags.includes(currentTag.trim())) {
        setTags([...tags, currentTag.trim()]);
      }
      setCurrentTag("");
    }
  };

  const removeTag = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  const handleCategoryChange = (value) => {
    setCategory(value);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("details", details);
    formData.append("blockQuote", blockQuote);
    formData.append("category", category);
    formData.append("tags", JSON.stringify(tags));
    formData.append("date", date);

    if (image) {
      formData.append("banner", image);
    }

    try {
      const response = await fetch("http://localhost:8000/api/v1/blogs/add", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Blog created successfully!");
        navigate("/blogs");
      } else {
        toast.error(data.message || "An error occurred.");
      }
    } catch (error) {
      toast.error("Failed to create blog. Please try again.");
      console.error("Error:", error);
    }
  };

  const clearPreview = () => {
    setImage(null);
    setImagePreview("https://placehold.co/530x480");
    setFileKey(Date.now());
  };

  return (
    <div>
      <div>
        <h1 className="text-xl font-bold">Add Blog</h1>
        <p className="text-sm text-gray-500">
          You can add blog details from here.
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
              placeholder="Enter blog title"
              className="!border !border-gray-300 bg-white text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#199bff] focus:ring-border-[#199bff]/10"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              value={title}
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
              className="!border !border-gray-300 bg-white text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#199bff] focus:ring-border-[#199bff]/10"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              onChange={handleDetailsChange}
              rows={5}
              placeholder="Enter blog details"
            />
          </div>
          <div>
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
              tabIndex={1}
              onBlur={(newContent) => setBlockQuote(newContent)}
            />
          </div>
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
              className="!border !border-gray-300 bg-white text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#199bff] focus:ring-border-[#199bff]/10"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              value={currentTag}
              onChange={handleTagsChange}
              onKeyDown={handleTagsKeyDown}
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <div
                  key={index}
                  className="bg-blue-500 text-white px-3 py-1 rounded-md flex items-center"
                >
                  {tag}
                  <button
                    onClick={() => removeTag(index)}
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
                className="!border !border-gray-300 bg-white text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#199bff] focus:ring-border-[#199bff]/10"
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
            </div>
          </div>
          <button
            onClick={handleUpload}
            className="mt-5 bg-[#199bff] text-white px-4 py-2 rounded"
          >
            Upload
          </button>
        </div>
        <div className="relative w-full md:w-1/2 h-[500px] mt-5 md:mt-0 md:ml-5 border-[1px] border-gray-400 rounded-md">
          <button
            className="bg-red-800 text-white w-8 h-8 rounded-full absolute top-2 right-2 flex items-center justify-center"
            onClick={clearPreview}
          >
            <i className="fa-solid fa-xmark text-white"></i>
          </button>
          <img
            src={imagePreview}
            alt="Selected"
            className="max-w-full h-full md:w-full object-cover rounded-md"
          />
        </div>
      </div>
    </div>
  );
};

export default AddBlog;
