import { useState } from 'react';

export function useLocalStorage(key, initialValue) {
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    const resolvedInitialValue = initialValue instanceof Function ? initialValue() : initialValue;

    if (typeof window === "undefined") {
      return resolvedInitialValue;
    }
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : resolvedInitialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return resolvedInitialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage.
  const setValue = (value) => {
    try {
      setStoredValue((previousValue) => {
        // Allow value to be a function so we have same API as useState
        const valueToStore = value instanceof Function ? value(previousValue) : value;
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
        return valueToStore;
      });
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}
