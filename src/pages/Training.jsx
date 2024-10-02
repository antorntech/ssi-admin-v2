import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../loader/Loader";
import { DeleteConfirmModal } from "../components/DeleteConfirmModal";
import {
  Popover,
  PopoverContent,
  PopoverHandler,
} from "@material-tailwind/react";

const Training = () => {
  const [open, setOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [trainings, setTrainings] = useState([]);
  const handleOpen = () => setOpen(!open);
  const [layout, setLayout] = useState(true);

  const handleDelete = () => {
    // Refresh the training list after deletion
    const storedTrainings =
      JSON.parse(localStorage.getItem("trainingsData")) || [];
    setTrainings(storedTrainings);
  };

  useEffect(() => {
    // Retrieve data from local storage
    const storedTrainings = localStorage.getItem("trainingsData");
    if (storedTrainings) {
      setTrainings(JSON.parse(storedTrainings));
    }
  }, []);

  const openDeleteConfirmModal = (itemId) => {
    setSelectedItemId(itemId);
    handleOpen();
  };

  const handleLayout = () => setLayout(!layout);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Adjust as needed

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = trainings.slice(indexOfFirstItem, indexOfLastItem);
  console.log(currentItems);

  const totalPages = Math.ceil(trainings.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div>
      <div className="w-full flex flex-col md:flex-row items-start md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-bold">Trainings</h1>
          <p className="text-sm text-gray-500">
            trainings are {trainings.length > 0 ? "" : "not"} available here.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="bg-[#2e961a] text-white px-4 py-2 rounded-md mt-2 md:mt-0"
            onClick={handleLayout}
          >
            Change Layout
          </button>
          <Link to={"/trainings/add-training"}>
            <button className="bg-[#199bff] text-white px-4 py-2 rounded-md mt-2 md:mt-0">
              Add Training
            </button>
          </Link>
        </div>
      </div>
      {trainings.length > 0 ? (
        <>
          {layout ? (
            <div className="mt-5 overflow-x-auto">
              <table className="min-w-full bg-white border">
                <thead>
                  <tr>
                    <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                      Banner
                    </th>
                    <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                      Title
                    </th>
                    <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                      Details
                    </th>
                    <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                      Author
                    </th>
                    <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                      Date
                    </th>
                    <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((training) => (
                    <tr key={training.id} className="hover:bg-gray-100">
                      <td className="px-6 py-4 border-b">
                        <img
                          src={training.banner}
                          alt={training.title}
                          className="w-28 h-20 object-cover rounded"
                        />
                      </td>
                      <td className="px-6 py-4 border-b">
                        <h1 className="text-sm font-bold">{training.title}</h1>
                      </td>
                      <td className="px-6 py-4 border-b text-sm text-gray-500">
                        {training.details.slice(0, 80)}...
                      </td>
                      <td className="px-6 py-4 border-b text-sm text-gray-500">
                        {training.author}
                      </td>
                      <td className="px-6 py-4 border-b text-sm text-gray-500">
                        {training.date}
                      </td>
                      <td className="px-6 py-4 border-b text-sm">
                        <div className="flex gap-2">
                          <Popover placement="bottom-end">
                            <PopoverHandler>
                              <button className="text-cyan-700 border-2 border-cyan-700 px-2 py-1 rounded-md text-sm hover:bg-cyan-700 hover:text-white transition-all duration-500">
                                <i class="fa-solid fa-plus"></i>
                              </button>
                            </PopoverHandler>
                            <PopoverContent className="bg-gray-200 shadow-lg border-2 border-gray-300">
                              <Link to={`/trainings/add-module/${training.id}`}>
                                <button className="w-[130px] flex items-center justify-center gap-1 text-green-700 border-2 border-green-700 px-2 py-1 rounded-md text-sm hover:bg-green-700 hover:text-white transition-all duration-500">
                                  Add Module
                                  <i class="fa-solid fa-plus"></i>
                                </button>
                              </Link>
                              <hr className="py-1" />
                              <Link
                                to={`/trainings/view-module/${training.id}`}
                              >
                                <button className="w-[130px] flex items-center justify-center gap-1 text-orange-500 border-2 border-orange-500 px-2 py-1 rounded-md text-sm hover:bg-orange-500 hover:text-white transition-all duration-500">
                                  View Module
                                  <i class="fa-solid fa-eye"></i>
                                </button>
                              </Link>
                            </PopoverContent>
                          </Popover>
                          <Link to={`/trainings/edit-training/${training.id}`}>
                            <button className="text-orange-800 border-2 border-orange-800 px-2 py-1 rounded-md text-sm hover:bg-orange-800 hover:text-white transition-all duration-500">
                              <i class="fa-solid fa-pencil"></i>
                            </button>
                          </Link>
                          <button
                            onClick={() => openDeleteConfirmModal(training.id)}
                            className="text-red-800 border-2 border-red-800 px-2 py-1 rounded-md text-sm hover:bg-red-800 hover:text-white transition-all duration-500"
                          >
                            <i class="fa-regular fa-trash-can"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {currentItems.map((training) => (
                <div
                  key={training.id}
                  className="w-full flex flex-col shadow-md rounded-md p-3"
                >
                  <img
                    src={training.banner}
                    alt={training.title}
                    className="w-full h-full md:h-[250px]"
                  />
                  <h1 className="text-xl font-bold mt-3">{training.title}</h1>
                  <p className="text-sm text-gray-500">
                    {training.details.slice(0, 80)}...
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Popover>
                      <PopoverHandler>
                        <button className="text-cyan-700 border-2 border-cyan-700 px-2 py-1 rounded-md text-sm hover:bg-cyan-700 hover:text-white transition-all duration-500">
                          <i class="fa-solid fa-plus"></i>
                        </button>
                      </PopoverHandler>
                      <PopoverContent>
                        <Link to={`/trainings/add-module/${training.id}`}>
                          <button className="text-cyan-700 border-2 border-cyan-700 px-2 py-1 rounded-md text-sm hover:bg-cyan-700 hover:text-white transition-all duration-500">
                            <i class="fa-solid fa-plus"></i>
                          </button>
                        </Link>
                      </PopoverContent>
                    </Popover>

                    <Link to={`/trainings/edit-training/${training.id}`}>
                      <button className="text-orange-800 border-2 border-orange-800 px-2 py-1 rounded-md text-sm hover:bg-orange-800 hover:text-white transition-all duration-500">
                        <i class="fa-solid fa-pencil"></i>
                      </button>
                    </Link>
                    <button
                      onClick={() => openDeleteConfirmModal(training.id)}
                      className="text-red-800 border-2 border-red-800 px-2 py-1 rounded-md text-sm hover:bg-red-800 hover:text-white transition-all duration-500"
                    >
                      <i class="fa-regular fa-trash-can"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <DeleteConfirmModal
            open={open}
            handleOpen={handleOpen}
            itemId={selectedItemId}
            onDelete={handleDelete}
            itemName={"trainingsData"}
          />

          {/* Enhanced Pagination */}
          <div className="flex justify-center mt-5">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className={`mx-1 px-3 py-1 rounded ${
                currentPage === 1
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-500 text-white"
              }`}
            >
              <i className="fa-solid fa-angle-left"></i>
            </button>

            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => paginate(index + 1)}
                className={`mx-1 px-3 py-1 rounded ${
                  currentPage === index + 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 text-gray-700"
                }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className={`mx-1 px-3 py-1 rounded ${
                currentPage === totalPages
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-500 text-white"
              }`}
            >
              <i className="fa-solid fa-angle-right"></i>
            </button>
          </div>
        </>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default Training;
