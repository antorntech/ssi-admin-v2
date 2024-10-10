import React from "react";
import { Link } from "react-router-dom";

const Pagination = ({ currentPage, totalPages, endPoint }) => {
  // Ensure currentPage is an integer
  currentPage = parseInt(currentPage);

  // Generate page numbers array
  const pages = [...Array(totalPages).keys()].map((page) => page + 1);

  return (
    <div className="flex justify-center mt-5">
      {/* Previous Page Link */}
      <Link
        to={currentPage > 1 ? `/${endPoint}/${currentPage - 1}` : "#"}
        className={`mx-1 px-3 py-1 rounded ${
          currentPage === 1
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-[#6CB93B] text-white"
        }`}
      >
        <i className="fa-solid fa-angle-left"></i>
      </Link>

      {/* Page Numbers */}
      {pages.map((page) => (
        <Link
          key={page}
          to={`/${endPoint}/${page}`}
          className={`mx-1 px-3 py-1 rounded ${
            currentPage === page
              ? "bg-[#6CB93B] text-white"
              : "bg-gray-300 text-gray-700"
          }`}
        >
          {page}
        </Link>
      ))}

      {/* Next Page Link */}
      <Link
        to={currentPage < totalPages ? `/${endPoint}/${currentPage + 1}` : "#"}
        className={`mx-1 px-3 py-1 rounded ${
          currentPage === totalPages
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-[#6CB93B] text-white"
        }`}
      >
        <i className="fa-solid fa-angle-right"></i>
      </Link>
    </div>
  );
};

export default Pagination;
