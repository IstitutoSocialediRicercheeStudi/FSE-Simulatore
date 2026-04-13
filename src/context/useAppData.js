import { createContext, useContext } from 'react';

export const AppDataContext = createContext(null);

export function useAppData() {
  const context = useContext(AppDataContext);

  if (!context) {
    throw new Error('useAppData deve essere usato dentro AppDataProvider.');
  }

  return context;
}
