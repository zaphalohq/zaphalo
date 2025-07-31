import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  totalPages,
  currentPage,
  onPageChange,
}: PaginationProps) => {

  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const pages = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, "...", totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex justify-center items-center gap-2 my-4 flex-wrap">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 text-sm rounded cursor-pointer bg-gray-200 hover:bg-gray-300 disabled:opacity-50 flex items-center"
      >
        <FiChevronLeft /> Prev
      </button>

      {visiblePages.map((page, i) =>
        page === "..." ? (
          <span key={i} className="px-3 py-1 text-sm text-gray-400 select-none">...</span>
        ) : (
          <button
            key={i}
            onClick={() => onPageChange(Number(page))}
            className={`px-3 py-1 text-sm rounded cursor-pointer 
              ${currentPage === page
                ? "bg-violet-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 text-sm rounded cursor-pointer bg-gray-200 hover:bg-gray-300 disabled:opacity-50 flex items-center"
      >
        Next <FiChevronRight />
      </button>
    </div>
  );
};

export default Pagination;
