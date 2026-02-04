// import React from "react";\n

interface PaginationControlProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  disablePageSizeSelect?: boolean;
}

const PaginationControl = ({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50],
  disablePageSizeSelect = false,
}: PaginationControlProps) => {
  const renderPageNumbers = () => {
    const pages = [];

    // Always show first page
    pages.push(
      <button
        key={1}
        onClick={() => onPageChange(1)}
        className={`flex size-8 items-center justify-center rounded-lg font-bold transition-colors text-sm ${
          currentPage === 1
            ? "color-primary-bg text-white"
            : "border border-gray-100 hover:bg-gray-100 text-slate-600"
        }`}
      >
        1
      </button>,
    );

    // Show ellipsis if needed after first page
    if (currentPage > 3) {
      pages.push(
        <span key="ellipsis-start" className="px-1 text-gray-500 self-end mb-2">
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
          className={`flex size-8 items-center justify-center rounded-lg font-bold transition-colors text-sm ${
            currentPage === i
              ? "color-primary-bg text-white"
              : "border border-gray-100 hover:bg-gray-100 text-slate-600"
          }`}
        >
          {i}
        </button>,
      );
    }

    // Show ellipsis if needed before last page
    if (currentPage < totalPages - 2) {
      pages.push(
        <span key="ellipsis-end" className="px-1 text-gray-500 self-end mb-2">
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
          className={`flex size-8 items-center justify-center rounded-lg font-bold transition-colors text-sm ${
            currentPage === totalPages
              ? "color-primary-bg text-white"
              : "border border-gray-100 hover:bg-gray-100 text-slate-600"
          }`}
        >
          {totalPages}
        </button>,
      );
    }

    return pages;
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 w-full">
      {!disablePageSizeSelect && pageSize && onPageSizeChange ? (
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span>Hiển thị</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="bg-white border border-slate-300 text-slate-900 text-xs rounded focus:ring-blue-500 focus:border-blue-500 block p-1.5"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span>kết quả</span>
        </div>
      ) : (
        <div /> // Spacer if no left content
      )}

      <div className="flex items-center gap-2">
        <span className="text-sm text-slate-500 mr-2 hidden sm:inline-block">
          Trang {currentPage} / {totalPages || 1}
        </span>
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage <= 1}
          className="flex size-8 items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-slate-600 transition-colors"
        >
          <span className="material-symbols-outlined text-sm">
            chevron_left
          </span>
        </button>

        <div className="flex items-center gap-1">{renderPageNumbers()}</div>

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage >= totalPages}
          className="flex size-8 items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-slate-600 transition-colors"
        >
          <span className="material-symbols-outlined text-sm">
            chevron_right
          </span>
        </button>
      </div>
    </div>
  );
};

export default PaginationControl;
