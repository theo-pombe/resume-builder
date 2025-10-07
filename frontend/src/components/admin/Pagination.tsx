type PaginationProps = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  startIndex: number;
  totalPaginatedItems: number;
  onPageChange: (page: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  startIndex,
  totalPaginatedItems,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  // Generate range of pages with ellipsis
  const getPageNumbers = () => {
    const delta = 2;
    // const pages: (number | string)[] = [];
    const range = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      range.unshift("...");
    }
    if (currentPage + delta < totalPages - 1) {
      range.push("...");
    }

    range.unshift(1);
    if (totalPages > 1) range.push(totalPages);

    return range;
  };

  const pages = getPageNumbers();

  return (
    <div className="absolute w-full bottom-4">
      <div className="flex justify-between items-center">
        <div className="flex justify-between items-center text-sm text-gray-600">
          <p>
            Showing {startIndex + 1}–{startIndex + totalPaginatedItems} of{" "}
            {totalItems} users
          </p>
        </div>

        <div className="flex items-center justify-end space-x-2">
          <span className="hidden"> {pages}</span>

          {/* Prev button */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded border text-sm cursor-pointer hover:bg-gray-100 disabled:opacity-50"
          >
            Prev
          </button>

          {/* Page numbers */}
          {pages.map((page, idx) =>
            typeof page === "number" ? (
              <button
                key={idx}
                onClick={() => onPageChange(page)}
                className={`px-3 py-1 rounded border text-sm cursor-pointer ${
                  page === currentPage
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ) : (
              <span key={idx} className="px-2">
                {page}
              </span>
            )
          )}

          {/* Next button */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded border text-sm hover:bg-gray-100 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
