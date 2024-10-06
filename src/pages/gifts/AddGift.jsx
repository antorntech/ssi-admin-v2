import { Typography } from "@material-tailwind/react";
import React, { useContext, useState } from "react";
import FetchContext from "../../context/FetchContext";
import InputImages from "../../components/common/form/InputImages";
import ImagePreviewWithRemove from "../products/ImagePreviewWithRemove";

const AddGift = () => {
  const [price, setPrice] = useState(null);
  const [images, setImages] = useState([]); // State to store the selected image
  const { request } = useContext(FetchContext);
  return (
    <div className="space-y-2 max-w-md">
      <h1 className="text-xl font-bold">Add Gift</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const body = new FormData(e.target);
          request("gifts", { method: "POST", body })
            .then((r) => r.json())
            .then((data) => {
              if (!data) return;
              console.log(data);
            })
            .catch(console.error);
        }}
        className="space-y-3"
      >
        <div className="block space-y-2">
          <span className="font-semibold">Gift Images</span>
          <InputImages
            onChange={function (ev) {
              const images = ev.target.files;
              setImages((prev) => [...prev, ...images]);
            }}
          />
        </div>
        <div className="flex gap-4 overflow-x-auto">
          {images?.map((file, index) => (
            <ImagePreviewWithRemove
              key={index}
              src={file}
              onRemove={() =>
                setImages((prev) => prev.filter((_, i) => i !== index))
              }
            />
          ))}
        </div>
        <label htmlFor="" className="block space-y-2">
          <span className="font-semibold">Price</span>
          <input
            type="number"
            size="md"
            className="peer w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 disabled:cursor-not-allowed transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2 border-t-transparent focus:border-t-transparent placeholder:opacity-0 focus:placeholder:opacity-100 px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-gray-900 !border !border-gray-300 bg-white text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#6CB93B] focus:!border-t-border-[#6CB93B] focus:ring-border-[#199bff]/10 py-3 block"
            value={price}
            onChange={(e) => {
              setPrice(e.target.value);
            }}
            required
          />
        </label>
        <div>
          <button
            type="submit"
            className="mt-5 bg-green-500 hover:bg-green-600 focus:ring-4 focus:ring-green-200 text-white px-4 py-2 rounded-lg"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddGift;
