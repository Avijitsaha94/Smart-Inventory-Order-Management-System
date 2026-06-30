import { useState } from 'react';

/**
 * useLocalStorage - sync state with localStorage
 * @param key - localStorage key
 * @param initialValue - default value if key doesn't exist
 *
 * Usage:
 * const [theme, setTheme] = useLocalStorage('theme', 'light');
 */
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value: T | ((prev: T) => T)) => {
    try {
      const newValue =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(newValue);
      localStorage.setItem(key, JSON.stringify(newValue));
    } catch (error) {
      console.warn(`useLocalStorage error for key "${key}":`, error);
    }
  };

  const removeValue = () => {
    try {
      setStoredValue(initialValue);
      localStorage.removeItem(key);
    } catch (error) {
      console.warn(`useLocalStorage remove error for key "${key}":`, error);
    }
  };

  return [storedValue, setValue, removeValue] as const;
}

export default useLocalStorage;