import { useSearchParams } from 'react-router-dom';

/**
 * useSort - manage sort state with URL search params
 * @param defaultSort - default sort field (default: '-createdAt')
 *
 * Usage:
 * const { sort, handleSort, getSortDirection } = useSort('-createdAt');
 */
function useSort(defaultSort: string = '-createdAt') {
  const [searchParams, setSearchParams] = useSearchParams();
  const sort = searchParams.get('sort') || defaultSort;

  const handleSort = (field: string) => {
    let newSort = `-${field}`;
    if (sort === `-${field}`) newSort = field;
    const params = Object.fromEntries(searchParams);
    setSearchParams({ ...params, sort: newSort, page: '1' });
  };

  // Returns 'asc' | 'desc' | null
  const getSortDirection = (field: string): 'asc' | 'desc' | null => {
    if (sort === `-${field}`) return 'desc';
    if (sort === field)        return 'asc';
    return null;
  };

  const isActive = (field: string) =>
    sort === field || sort === `-${field}`;

  return { sort, handleSort, getSortDirection, isActive };
}

export default useSort;