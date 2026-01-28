import { FaArrowLeft } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  const renderPageNumbers = () => {
    const pages = [];

    // Always show first page
    pages.push(
      <button
        key={1}
        onClick={() => onPageChange(1)}
        className={`flex size-7 items-center justify-center rounded-lg font-bold transition-colors ${
          currentPage === 1
            ? "color-primary-bg text-white"
            : "border border-gray-100 hover:bg-gray-100"
        }`}
      >
        1
      </button>,
    );

    // Show ellipsis if needed after first page
    if (currentPage > 3) {
      pages.push(
        <span key="ellipsis-start" className="px-2 text-gray-500">
          ...
        </span>,
      );
    }

    // Show current page and neighbors
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`flex size-10 items-center justify-center rounded-lg font-bold transition-colors ${
            currentPage === i
              ? "color-primary-bg text-white"
              : "border border-gray-100 hover:bg-gray-100"
          }`}
        >
          {i}
        </button>,
      );
    }

    // Show ellipsis if needed before last page
    if (currentPage < totalPages - 2) {
      pages.push(
        <span key="ellipsis-end" className="px-2 text-gray-500">
          ...
        </span>,
      );
    }

    // Always show last page if more than 1 page
    if (totalPages > 1) {
      pages.push(
        <button
          key={totalPages}
          onClick={() => onPageChange(totalPages)}
          className={`flex size-10 items-center justify-center rounded-lg font-bold transition-colors ${
            currentPage === totalPages
              ? "color-primary-bg text-white"
              : "border border-gray-100 hover:bg-gray-100"
          }`}
        >
          {totalPages}
        </button>,
      );
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 py-4">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="flex size-7 items-center justify-center rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="material-symbols-outlined">
          <FaArrowLeft className="size-4" />
        </span>
      </button>

      {renderPageNumbers()}

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="flex size-7 items-center justify-center rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="material-symbols-outlined">
          <FaArrowRight className="size-4" />
        </span>
      </button>
    </div>
  );
};

export default Pagination;
