import {
  Input,
  Textarea,
  Typography,
  Select,
  Option,
} from "@material-tailwind/react";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import moment from "moment";
import { useDropzone } from "react-dropzone";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const date = moment().format("Do MMM, YYYY");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [files, setFiles] = useState([]);
  const [initialFiles, setInitialFiles] = useState([]);

  // Fetch the existing product data when the component loads
  useEffect(() => {
    const existingData = JSON.parse(localStorage.getItem("productsData")) || [];

    const productToEdit = existingData.find(
      (product) => product.id === parseInt(id)
    );

    console.log(productToEdit);

    if (productToEdit) {
      setName(productToEdit.name);
      setDescription(productToEdit.description);
      setColor(productToEdit.color);
      setBrand(productToEdit.brand);
      setCategory(productToEdit.category);
      setPrice(productToEdit.price);
      setQuantity(productToEdit.quantity);
      setFiles(productToEdit.images || []);
      setInitialFiles(productToEdit.images || []); // Store initial images separately
    }
  }, [id]);

  const handleDrop = (acceptedFiles) => {
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  };

  const handleUpdate = async () => {
    const existingData = JSON.parse(localStorage.getItem("productsData")) || [];
    const updatedProducts = existingData.map((product) =>
      product.id === parseInt(id)
        ? {
            ...product,
            name,
            description,
            color,
            brand,
            category,
            price,
            quantity,
            date,
            images: files,
          }
        : product
    );

    localStorage.setItem("productsData", JSON.stringify(updatedProducts));

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
          color,
          brand,
          category,
          price,
          quantity,
          date,
          images: files,
        }),
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }

    toast.success("Update successful", {
      position: "top-right",
      hideProgressBar: false,
      autoClose: 1000,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

    navigate("/products");
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop: handleDrop });

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-5">
        <button
          onClick={() => window.history.back()}
          className="flex items-center justify-center gap-1 text-black border-2 border-black px-2 py-2 rounded-md text-sm hover:bg-black hover:text-white transition-all duration-500"
        >
          <i className="fa-solid fa-hand-point-left"></i>
        </button>
        <div>
          <h1 className="text-xl font-bold">Edit Product</h1>
          <p className="text-sm text-gray-500">
            Update product details from here.
          </p>
        </div>
      </div>

      {/* Form Fields (same as AddProduct but pre-filled) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left Column */}
        <div>
          <Typography variant="h6" color="gray" className="mb-1 font-normal">
            Product Name
          </Typography>
          <Input
            type="text"
            size="md"
            className="!border !border-gray-300 bg-white text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#6CB93B] focus:!border-t-border-[#6CB93B] focus:ring-border-[#199bff]/10"
            labelProps={{
              className: "before:content-none after:content-none",
            }}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Typography
            variant="h6"
            color="gray"
            className="mb-1 font-normal mt-4"
          >
            Brand
          </Typography>
          <Input
            type="text"
            size="md"
            className="!border !border-gray-300 bg-white text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#6CB93B] focus:!border-t-border-[#6CB93B] focus:ring-border-[#199bff]/10"
            labelProps={{
              className: "before:content-none after:content-none",
            }}
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          />

          <Typography
            variant="h6"
            color="gray"
            className="mb-1 font-normal mt-4"
          >
            Price
          </Typography>
          <Input
            type="number"
            size="md"
            className="!border !border-gray-300 bg-white text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#6CB93B] focus:!border-t-border-[#6CB93B] focus:ring-border-[#199bff]/10"
            labelProps={{
              className: "before:content-none after:content-none",
            }}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <Typography
            variant="h6"
            color="gray"
            className="mb-1 font-normal mt-4"
          >
            Quantity
          </Typography>
          <Input
            type="number"
            size="md"
            className="!border !border-gray-300 bg-white text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#6CB93B] focus:!border-t-border-[#6CB93B] focus:ring-border-[#199bff]/10"
            labelProps={{
              className: "before:content-none after:content-none",
            }}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>

        {/* Middle Column */}
        <div>
          <Typography variant="h6" color="gray" className="mb-1 font-normal">
            Category
          </Typography>
          <Select
            value={category}
            onChange={(value) => setCategory(value)}
            className="!border !border-gray-300 bg-white text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#6CB93B] focus:!border-t-border-[#6CB93B] focus:ring-border-[#199bff]/10"
            labelProps={{
              className: "before:content-none after:content-none",
            }}
          >
            <Option value="" disabled>
              Select category
            </Option>
            <Option value="Electronics">Electronics</Option>
            <Option value="Fashion">Fashion</Option>
            <Option value="Home & Garden">Home & Garden</Option>
            <Option value="Sports">Sports</Option>
            <Option value="Toys">Toys</Option>
            <Option value="Books">Books</Option>
          </Select>

          <Typography
            variant="h6"
            color="gray"
            className="mb-1 font-normal mt-4"
          >
            Color
          </Typography>
          <Select
            value={color}
            onChange={(value) => setColor(value)}
            className="!border !border-gray-300 bg-white text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#6CB93B] focus:!border-t-border-[#6CB93B] focus:ring-border-[#199bff]/10"
            labelProps={{
              className: "before:content-none after:content-none",
            }}
          >
            <Option value="" disabled>
              Select color
            </Option>
            <Option value="Red">Red</Option>
            <Option value="Blue">Blue</Option>
            <Option value="Green">Green</Option>
            <Option value="Black">Black</Option>
            <Option value="White">White</Option>
            <Option value="Yellow">Yellow</Option>
            <Option value="Orange">Orange</Option>
            <Option value="Purple">Purple</Option>
          </Select>

          <Typography
            variant="h6"
            color="gray"
            className="mb-1 font-normal mt-4"
          >
            Description
          </Typography>
          <Textarea
            value={description}
            className="!border !border-gray-300 bg-white text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#6CB93B] focus:!border-t-border-[#6CB93B] focus:ring-border-[#199bff]/10"
            labelProps={{
              className: "before:content-none after:content-none",
            }}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
          />
        </div>

        {/* Right Column */}
        <div>
          <Typography variant="h6" color="gray" className="mb-1 font-normal">
            Product Image
          </Typography>
          <div
            {...getRootProps({
              className:
                "dropzone border-2 border-dashed border-[#6CB93B] rounded-md p-4 text-center cursor-pointer",
            })}
          >
            <input {...getInputProps()} />
            <div>
              <lord-icon
                src="https://cdn.lordicon.com/smwmetfi.json"
                trigger="loop"
                colors="primary:#545454"
                style={{ width: "50px", height: "50px" }}
              ></lord-icon>
              <p className="text-2xl text-gray-600">
                Drop files here or click to upload.
              </p>
              {files.length > 0 && (
                <div className="mt-2">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center border-b py-2"
                    >
                      <span>{file.name || `Image ${index + 1}`}</span>
                      <button
                        className="text-red-500"
                        onClick={() => {
                          setFiles((prevFiles) =>
                            prevFiles.filter((_, i) => i !== index)
                          );
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Display Initial Images */}
          {initialFiles.length > 0 && (
            <div className="mt-4">
              <Typography
                variant="h6"
                color="gray"
                className="mb-2 font-normal"
              >
                Existing Images:
              </Typography>
              {initialFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center border-b py-2"
                >
                  <span>{file.name || `Image ${index + 1}`}</span>
                  <button
                    className="text-red-500"
                    onClick={() => {
                      setInitialFiles((prevFiles) =>
                        prevFiles.filter((_, i) => i !== index)
                      );
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Update Button */}
      <div className="mt-6">
        <button
          onClick={handleUpdate}
          className="bg-[#6CB93B] hover:bg-[#4d8229] text-white py-2 px-6 rounded-lg transition-all duration-300"
        >
          Update Product
        </button>
      </div>
    </div>
  );
};

export default EditProduct;
