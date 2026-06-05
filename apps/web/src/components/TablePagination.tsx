interface TablePaginationProps {
  page: number;
  totalPages: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

const PAGE_SIZES = [10, 20, 50];

export function TablePagination({
  page,
  totalPages,
  limit,
  onPageChange,
  onLimitChange,
}: TablePaginationProps) {
  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div className="pagination">
      <label className="pagination__size">
        Rows per page:
        <select
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
        >
          {PAGE_SIZES.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </label>

      <span className="pagination__info">
        Page {page} of {Math.max(totalPages, 1)}
      </span>

      <div className="pagination__nav">
        <button
          className="icon-button"
          onClick={() => onPageChange(page - 1)}
          disabled={!canPrev}
          aria-label="Previous page"
        >
          ‹
        </button>
        <button
          className="icon-button"
          onClick={() => onPageChange(page + 1)}
          disabled={!canNext}
          aria-label="Next page"
        >
          ›
        </button>
      </div>
    </div>
  );
}
