import React from "react";

const Pagination = ({
  currentPage,
  totalPages,
  paginate,
  prevPage,
  nextPage,
}) => {
  return (
    <div className="flex justify-center mt-5">
      <button
        onClick={prevPage}
        disabled={currentPage === 1}
        className={`mx-1 px-3 py-1 rounded ${
          currentPage === 1
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-[#6CB93B] text-white"
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
              ? "bg-[#6CB93B] text-white"
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
            : "bg-[#6CB93B] text-white"
        }`}
      >
        <i className="fa-solid fa-angle-right"></i>
      </button>
    </div>
  );
};

export default Pagination;
