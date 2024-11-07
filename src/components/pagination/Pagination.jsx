/* eslint-disable react/prop-types */
import { ArrowLeft2, ArrowRight2 } from "iconsax-react";
import { Link, useSearchParams } from "react-router-dom";

const Pagination = ({ currentPage, totalPages, endPoint }) => {
  const [searchParams] = useSearchParams();
  currentPage = parseInt(currentPage);

  const pagination = [];
  const range = 3;

  pagination.push(1);

  if (currentPage > range) {
    pagination.push("...");
  }

  const start = Math.max(2, currentPage - range);
  const end = Math.min(currentPage + range, totalPages - 1);

  for (let i = start; i <= end; i++) {
    pagination.push(i);
  }

  if (currentPage < totalPages - range) {
    pagination.push("...");
  }

  if (totalPages > 1) {
    pagination.push(totalPages);
  }

  return (
    <div className="flex justify-center mt-5">
      {/* Previous Page Link */}
      <Link
        to={
          currentPage > 1
            ? `/${endPoint}/${currentPage - 1}?${searchParams.toString()}`
            : "#"
        }
        className={`mx-1 px-1 py-1 rounded ${
          currentPage === 1
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-[#6CB93B] text-white"
        }`}
      >
        <ArrowLeft2 size="24" variant="Bold" color="#fff" />
      </Link>

      {/* Page Numbers */}
      {pagination.map((page) => (
        <Link
          key={page}
          to={`/${endPoint}/${page}?${searchParams.toString()}`}
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
        to={
          currentPage < totalPages
            ? `/${endPoint}/${currentPage + 1}?${searchParams.toString()}`
            : "#"
        }
        className={`mx-1 px-1 py-1 rounded ${
          currentPage === totalPages
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-[#6CB93B] text-white"
        }`}
      >
        <ArrowRight2 size="24" variant="Bold" color="#fff" />
      </Link>
    </div>
  );
};

export default Pagination;
