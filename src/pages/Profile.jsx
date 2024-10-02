import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Loader from "../loader/Loader";

const Profile = () => {
  const initialData = JSON.parse(localStorage.getItem("profileData")) || {
    name: "Abdul Hamid",
    designation: "COO, PeopleNTech Institute of IT",
    email: "admin@gmail.com",
    phone: "01534 855 125",
    address: "Panthapath, Dhaka",
    avatar: "/img/avatar.png",
  };

  const [data, setData] = useState(initialData);
  const [editMode, setEditMode] = useState(false);
  const [newData, setNewData] = useState(initialData);

  useEffect(() => {
    localStorage.setItem("profileData", JSON.stringify(data));
  }, [data]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewData({ ...newData, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const newAvatar = reader.result;
      setNewData({ ...newData, avatar: newAvatar });
      setData({ ...data, avatar: newAvatar }); // Instantly update the preview
    };
    reader.readAsDataURL(file);
  };

  const saveProfile = () => {
    setData(newData);
    setEditMode(false);
  };

  return (
    <div>
      <div className="w-full flex flex-col md:flex-row items-start md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-bold">Profile</h1>
          <p className="text-sm text-gray-500">
            Profile details are {data ? "" : "not"} available here.
          </p>
        </div>
        <div>
          <button
            onClick={() => setEditMode(!editMode)}
            className="bg-[#199bff] text-white px-4 py-2 rounded-md mt-2 md:mt-0"
          >
            {editMode ? "Cancel" : "Update Profile"}
          </button>
          {editMode && (
            <button
              onClick={saveProfile}
              className="bg-green-500 text-white px-4 py-2 rounded-md ml-2"
            >
              Save
            </button>
          )}
        </div>
      </div>
      {data ? (
        <>
          <div className="mt-5 flex flex-col md:flex-row items-center justify-between gap-5">
            <div className="w-full md:w-1/3 shadow-md rounded-md p-4 flex flex-col items-center">
              <img
                src={data.avatar}
                alt="Profile Avatar"
                className="w-28 h-28 object-cover rounded-full"
              />
              {editMode ? (
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              ) : (
                <>
                  <h1 className="text-xl font-bold">{data.name}</h1>
                  <p className="text-sm text-gray-500">{data.designation}</p>
                </>
              )}
            </div>
            <div className="w-full md:w-2/3 shadow-md rounded-md p-4">
              <h1 className="text-xl font-bold mb-4">Contact Details</h1>
              {editMode ? (
                <>
                  <label className="block">
                    <span className="font-bold text-black">Name:</span>
                    <input
                      type="text"
                      name="name"
                      value={newData.name}
                      onChange={handleInputChange}
                      className="block w-full mt-1 p-2 border border-gray-300 rounded-md"
                    />
                  </label>
                  <label className="block mt-2">
                    <span className="font-bold text-black">Designation:</span>
                    <input
                      type="text"
                      name="designation"
                      value={newData.designation}
                      onChange={handleInputChange}
                      className="block w-full mt-1 p-2 border border-gray-300 rounded-md"
                    />
                  </label>
                  <label className="block mt-2">
                    <span className="font-bold text-black">Email:</span>
                    <input
                      type="email"
                      name="email"
                      value={newData.email}
                      onChange={handleInputChange}
                      className="block w-full mt-1 p-2 border border-gray-300 rounded-md"
                    />
                  </label>
                  <label className="block mt-2">
                    <span className="font-bold text-black">Phone:</span>
                    <input
                      type="text"
                      name="phone"
                      value={newData.phone}
                      onChange={handleInputChange}
                      className="block w-full mt-1 p-2 border border-gray-300 rounded-md"
                    />
                  </label>
                  <label className="block mt-2">
                    <span className="font-bold text-black">Address:</span>
                    <input
                      type="text"
                      name="address"
                      value={newData.address}
                      onChange={handleInputChange}
                      className="block w-full mt-1 p-2 border border-gray-300 rounded-md"
                    />
                  </label>
                </>
              ) : (
                <>
                  <p className="text-gray-500 text-md">
                    <span className="font-bold text-black">Email:</span>{" "}
                    {data.email}
                  </p>
                  <hr className="my-2" />
                  <p className="text-gray-500 text-md">
                    <span className="font-bold text-black">Phone:</span>{" "}
                    {data.phone}
                  </p>
                  <hr className="my-2" />
                  <p className="text-gray-500 text-md">
                    <span className="font-bold text-black">Address:</span>{" "}
                    {data.address}
                  </p>
                </>
              )}
            </div>
          </div>
        </>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default Profile;
