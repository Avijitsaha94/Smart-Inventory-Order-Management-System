import { useState, useEffect } from 'react';

/**
 * useDebounce - delays updating a value until after a specified delay
 * @param value - the value to debounce
 * @param delay - delay in milliseconds (default: 500ms)
 *
 * Usage:
 * const debouncedSearch = useDebounce(searchInput, 500);
 * useEffect(() => { fetchData(debouncedSearch) }, [debouncedSearch]);
 */
function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup: cancel previous timer on value change
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;