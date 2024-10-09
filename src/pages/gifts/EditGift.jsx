import { Input, Typography } from "@material-tailwind/react";
import React, { useState, useEffect, useContext } from "react";
import ImagePreviewWithRemove from "../products/ImagePreviewWithRemove";
import FetchContext from "../../context/FetchContext";
import { srcBuilder } from "../../utils/src.js";

const initialValues = {
  price: "",
  serverImages: null,
};

const EditGift = ({ selectedGift, fetchGifts }) => {
  const [formState, setFormState] = useState(initialValues);
  const [files, setFiles] = useState([]);
  const { request } = useContext(FetchContext);
  const id = selectedGift?.id || null;
  const author = "author@gmail.com";

  function handleChange(e) {
    const { name, value } = e.target;
    if (!name || !value) throw new Error("name or value is not defined");
    setFormState({ ...formState, [name]: value });
  }

  function fetchGiftById() {
    if (!id) return;
    request(`gifts/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (!data) return;
        setFormState((prev) => ({
          ...prev,
          ...data,
          serverImages: data.images,
          images: [],
        }));
      })
      .catch(console.error);
  }
  useEffect(fetchGiftById, [selectedGift]);

  const onSubmit = (e) => {
    e.preventDefault();
    const body = new FormData(e.target);
    if (!body.has("author")) body.append("author", author);
    if (!request) return;
    request(`gifts/${id}`, { method: "PATCH", body })
      .then((r) => r.json())
      .then(() => {
        if (fetchGifts) {
          fetchGifts();
        }
        setFormState(initialValues);
      })
      .catch(console.error);
  };

  return (
    <>
      <div className="flex items-center gap-3 mb-3">
        <div>
          <h1 className="text-xl font-bold">Edit Gift</h1>
          <p className="text-sm text-gray-500">
            You can edit gift details from here.
          </p>
        </div>
      </div>
      <form onSubmit={onSubmit} className="form">
        <label className="border-2 border-dashed rounded-lg border-gray-300 bg-gray-50 hover:border-[#6CB93B] p-6 py-2 lg:py-[33px] text-center w-full flex flex-col items-center relative">
          <lord-icon
            src="https://cdn.lordicon.com/smwmetfi.json"
            trigger="loop"
            colors="primary:#545454"
            style={{ width: "50px", height: "50px" }}
          ></lord-icon>
          <div className="flex flex-col items-center">
            <div className="text-lg font-semibold mb-1">
              Drag and drop files here
            </div>
            <div className="text-sm mb-6">File must be image/* format</div>
            <button
              className="border border-gray-900 text-gray-900 hover:bg-gray-100 relative flex items-center justify-center gap-1 text-sm lg:text-base rounded-xl px-4 lg:px-5 py-2 lg:py-2.5 font-medium"
              type="button"
            >
              <span className="whitespace-nowrap">Browse files</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
                />
              </svg>
            </button>
          </div>
          <input
            name="images"
            type="file"
            accept="image/*"
            multiple
            className="absolute top-0 left-0 w-full h-full opacity-0 z-[1] bg-black"
            onChange={(e) => {
              setFiles((prev) => [...prev, ...e.target.files]);
            }}
          />
        </label>
        <div className="flex overflow-x-auto gap-4 py-2">
          {formState.serverImages?.map((src, i) => {
            let path = null;
            if (typeof src == "string") path = srcBuilder(`gifts/${src}`);
            return (
              <ImagePreviewWithRemove
                key={i}
                src={path}
                onRemove={() => {
                  if (!id || !src) throw new Error("id or src is not defined");
                  // call remove media api
                  request(`gifts/${id}/images/${src}`, {
                    method: "DELETE",
                  })
                    .then((r) => r.json())
                    .then(() => {
                      fetchGiftById();
                    })
                    .catch(console.error);
                }}
              />
            );
          })}
          {files?.map((src, i) => {
            return (
              <ImagePreviewWithRemove
                key={i}
                src={src}
                onRemove={() => {
                  setFiles((prev) => prev.filter((_, i) => i !== i));
                }}
              />
            );
          })}
        </div>

        <div>
          <Typography
            variant="h6"
            color="gray"
            className="mb-1 font-normal mt-2"
          >
            Edit Price
          </Typography>
          <Input
            type="number"
            size="md"
            className="!border !border-gray-300 bg-white text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#6CB93B] focus:!border-t-border-[#6CB93B] focus:ring-border-[#199bff]/10"
            labelProps={{
              className: "before:content-none after:content-none",
            }}
            value={formState.price}
            onChange={handleChange}
            name="price"
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

export default EditGift;
