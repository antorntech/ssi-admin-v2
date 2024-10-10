import React from "react";
import { Link } from "react-router-dom";

const Pagination = ({ currentPage, totalPages, endPoint }) => {
  const pages = [...Array(totalPages).keys()];
  currentPage = parseInt(currentPage);
  return (
    <div className="flex justify-center mt-5">
      <Link
        to={`/${endPoint}/${currentPage - 1}`}
        disabled={currentPage == 1}
        className={`mx-1 px-3 py-1 rounded ${
          currentPage == 1
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-[#6CB93B] text-white"
        }`}
      >
        <i className="fa-solid fa-angle-left"></i>
      </Link>

      {pages.map((e, index) => {
        const page = e + 1;
        return (
          <Link
            key={index}
            to={`/${endPoint}/${page}`}
            className={`mx-1 px-3 py-1 rounded ${
              currentPage == page
                ? "bg-[#6CB93B] text-white"
                : "bg-gray-300 text-gray-700"
            }`}
          >
            {page}
          </Link>
        );
      })}

      <Link
        to={`/${endPoint}/${currentPage + 1}`}
        disabled={currentPage === totalPages}
        className={`mx-1 px-3 py-1 rounded ${
          currentPage == totalPages
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
