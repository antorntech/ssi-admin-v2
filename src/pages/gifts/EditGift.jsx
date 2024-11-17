/* eslint-disable react/prop-types */
import { Typography } from "@material-tailwind/react";
import React, { useState, useEffect, useContext, useCallback } from "react";
import ImagePreviewWithRemove from "../products/ImagePreviewWithRemove";
import FetchContext from "../../context/FetchContext";
import { srcBuilder } from "../../utils/src.js";
import { useNavigate, useParams } from "react-router-dom";

const initialValues = {
  name: "",
  price: "",
  type: "",
  serverImages: null,
};

const EditGift = ({ selectedGift, fetchGifts }) => {
  const { id = null } = useParams();
  const [formState, setFormState] = useState(initialValues);
  const [files, setFiles] = useState([]);
  const [offerTypes, setOfferTypes] = useState([]);
  const { request } = useContext(FetchContext);
  const author = "author@gmail.com";
  const navigate = useNavigate();

  function onChange(e) {
    const { name, value } = e.target;
    if (!name) throw new Error("name or value is not defined");
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
  useEffect(fetchGiftById, [id, request, selectedGift]);

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
          navigate("/gifts");
        }
        setFormState(initialValues);
      })
      .catch(console.error);
  };

  // fetch offer types
  const fetchOfferTypes = useCallback(async () => {
    try {
      const response = await request("gifts/types");
      const json = await response.json();
      setOfferTypes(json);
    } catch (error) {
      console.error(error);
    }
  }, [request]);

  React.useEffect(() => {
    fetchOfferTypes();
  }, [fetchOfferTypes]);

  return (
    <div className="w-full max-w-2xl bg-white p-4 lg:p-5 rounded-lg custom-shadow">
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
              const files = Array.from(e.target.files);
              setFiles((prev) => [...prev, ...files]);
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

        {/* Name Input */}
        <div>
          <Typography
            variant="h6"
            color="gray"
            className="mb-1 font-normal mt-2"
          >
            Name
          </Typography>
          <input
            type="text"
            className="w-full bg-transparent font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 disabled:cursor-not-allowed transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2 border-t-transparent focus:border-t-transparent placeholder:opacity-0 focus:placeholder:opacity-100 px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-gray-900 !border !border-gray-300 bg-white text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#6CB93B] focus:!border-t-border-[#6CB93B] focus:ring-border-[#199bff]/10 py-3 block"
            name="name"
            value={formState.name}
            onChange={onChange}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Typography
              variant="h6"
              color="gray"
              className="mb-1 font-normal mt-2"
            >
              Edit Price
            </Typography>
            <input
              type="number"
              className="w-full bg-transparent font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 disabled:cursor-not-allowed transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2 border-t-transparent focus:border-t-transparent placeholder:opacity-0 focus:placeholder:opacity-100 px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-gray-900 !border !border-gray-300 bg-white text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#6CB93B] focus:!border-t-border-[#6CB93B] focus:ring-border-[#199bff]/10 py-3 block"
              value={formState.price}
              onChange={onChange}
              name="price"
            />
          </div>

          {/* Select Offer Type */}
          <div>
            <Typography
              variant="h6"
              color="gray"
              className="mb-1 font-normal mt-2"
            >
              Offer Type
            </Typography>
            <select
              className="capitalize w-full py-[14px] px-[5px] border border-gray-300 bg-white text-gray-900 rounded-md focus:outline-none  focus:ring-border-none focus:border-[#6CB93B] focus:border-t-border-[#6CB93B] focus:ring-border-[#199bff]/10"
              name="type"
              value={formState.type}
              onChange={onChange}
              required
            >
              <option value="" disabled></option>
              {offerTypes?.map((type, i) => (
                <option key={type.id || i} value={type?.id}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="mt-5 bg-green-500 text-white px-4 py-2 rounded"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditGift;
