import { Input, Typography } from "@material-tailwind/react";
import React, { useContext, useState } from "react";
import moment from "moment";
import FetchContext from "../../context/FetchContext";

const AddGift = ({ handleAddGift }) => {
  const date = moment().format("Do MMM, YYYY");
  const [price, setPrice] = useState("");
  const [files, setFiles] = useState([]);
  const [image, setImage] = useState(null); // State to store the selected image
  const { request } = useContext(FetchContext);
  const handleDrop = (acceptedFiles) => {
    setFiles(acceptedFiles); // Store the dropped files
    setImage(acceptedFiles[0]); // Store the first file as the image
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const body = new FormData(e.target);
    request("gifts", { method: "POST", body })
      .then((r) => r.json())
      .then((data) => {
        if (!data) return;
        console.log(data);
      })
      .catch(console.error);
  };

  return (
    <div>
      <h1 className="text-xl font-bold">Add Gift</h1>
      <form onSubmit={handleSubmit} className="form">
        <div>
          <Typography variant="h6" color="gray" className="mb-1 font-normal">
            Gift Image
          </Typography>
          <div className="grid grid-cols-5 gap-4">
            {files.map((file, index) => (
              <div key={index} className="relative mt-4">
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="w-full h-16 object-cover rounded-md"
                />
                <button
                  className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded p-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFiles(files.filter((_, i) => i !== index));
                  }}
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>
        <div>
          <Typography
            variant="h6"
            color="gray"
            className="mb-1 font-normal mt-2"
          >
            Price
          </Typography>
          <input
            type="number"
            size="md"
            className="peer w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 disabled:cursor-not-allowed transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2 border-t-transparent focus:border-t-transparent placeholder:opacity-0 focus:placeholder:opacity-100 text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-gray-900 !border !border-gray-300 bg-white text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#6CB93B] focus:!border-t-border-[#6CB93B] focus:ring-border-[#199bff]/10"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="mt-5 bg-green-500 text-white px-4 py-2 rounded"
        >
          Add Gift
        </button>
      </form>
    </div>
  );
};

export default AddGift;
