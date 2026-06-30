import { useSearchParams } from 'react-router-dom';

/**
 * usePagination - manage pagination with URL search params
 * @param defaultLimit - items per page (default: 10)
 *
 * Usage:
 * const { page, limit, setPage, goNext, goPrev } = usePagination(12);
 */
function usePagination(defaultLimit: number = 10) {
  const [searchParams, setSearchParams] = useSearchParams();

  const page  = parseInt(searchParams.get('page')  || '1');
  const limit = parseInt(searchParams.get('limit') || String(defaultLimit));

  const setPage = (newPage: number) => {
    const params = Object.fromEntries(searchParams);
    setSearchParams({ ...params, page: String(newPage) });
  };

  const goNext = (totalPages: number) => {
    if (page < totalPages) setPage(page + 1);
  };

  const goPrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const resetPage = () => {
    const params = Object.fromEntries(searchParams);
    setSearchParams({ ...params, page: '1' });
  };

  const getPageNumbers = (totalPages: number): number[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (page <= 4) return [1, 2, 3, 4, 5, -1, totalPages];
    if (page >= totalPages - 3) {
      return [1, -1, totalPages-4, totalPages-3, totalPages-2, totalPages-1, totalPages];
    }
    return [1, -1, page-1, page, page+1, -1, totalPages];
  };

  return {
    page,
    limit,
    setPage,
    goNext,
    goPrev,
    resetPage,
    getPageNumbers,
  };
}

export default usePagination;