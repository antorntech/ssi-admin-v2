import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../loader/Loader";
import { DeleteConfirmModal } from "../components/DeleteConfirmModal";

const Faqs = () => {
  const [open, setOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const handleOpen = () => setOpen(!open);
  const [layout, setLayout] = useState(true);

  const handleDelete = () => {
    // Refresh the faq list after deletion
    const storedFaqs = JSON.parse(localStorage.getItem("faqsData")) || [];
    setFaqs(storedFaqs);
  };

  useEffect(() => {
    // Retrieve data from local storage
    const storedFaqs = localStorage.getItem("faqsData");
    if (storedFaqs) {
      setFaqs(JSON.parse(storedFaqs));
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
  const currentItems = faqs.slice(indexOfFirstItem, indexOfLastItem);
  console.log(currentItems);

  const totalPages = Math.ceil(faqs.length / itemsPerPage);

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
          <h1 className="text-xl font-bold">Faqs</h1>
          <p className="text-sm text-gray-500">
            faqs are {faqs.length > 0 ? "" : "not"} available here.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="bg-[#2e961a] text-white px-4 py-2 rounded-md mt-2 md:mt-0"
            onClick={handleLayout}
          >
            Change Layout
          </button>
          <Link to={"/faqs/add-faq"}>
            <button className="bg-[#199bff] text-white px-4 py-2 rounded-md mt-2 md:mt-0">
              Add Faq
            </button>
          </Link>
        </div>
      </div>
      {faqs.length > 0 ? (
        <>
          {layout ? (
            <div className="mt-5 overflow-x-auto">
              <table className="min-w-full bg-white border">
                <thead>
                  <tr>
                    <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                      Question
                    </th>
                    <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                      Answer
                    </th>
                    <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((faq) => (
                    <tr key={faq.id} className="hover:bg-gray-100">
                      <td className="px-6 py-4 border-b">
                        <h1 className="text-sm font-bold">{faq?.question}</h1>
                      </td>
                      <td className="px-6 py-4 border-b text-sm text-gray-500">
                        {faq?.answer.slice(0, 50)}...
                      </td>

                      <td className="px-6 py-4 border-b text-sm">
                        <div className="flex gap-2">
                          <Link to={`/faqs/edit-faq/${faq.id}`}>
                            <button className="text-orange-800 border-2 border-orange-800 px-2 py-1 rounded-md text-sm hover:bg-orange-800 hover:text-white transition-all duration-500">
                              <i class="fa-solid fa-pencil"></i>
                            </button>
                          </Link>
                          <button
                            onClick={() => openDeleteConfirmModal(faq.id)}
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
              {currentItems.map((faq) => (
                <div
                  key={faq.id}
                  className="w-full flex flex-col shadow-md rounded-md p-3"
                >
                  <h1 className="text-xl font-bold mt-3">{faq?.question}</h1>
                  <p className="text-sm text-gray-500">
                    {faq?.answer.slice(0, 80)}...
                  </p>
                  <div className="flex gap-3 mt-2">
                    <Link to={`/faqs/edit-faq/${faq.id}`}>
                      <button className="text-orange-800 border-2 border-orange-800 px-2 py-1 rounded-md text-sm hover:bg-orange-800 hover:text-white transition-all duration-500">
                        <i class="fa-solid fa-pencil"></i>
                      </button>
                    </Link>
                    <button
                      onClick={() => openDeleteConfirmModal(faq.id)}
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
            itemName={"faqsData"}
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

export default Faqs;
