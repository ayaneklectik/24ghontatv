'use client';
import { createContext, useContext, useState } from 'react';

const TitleContext = createContext({
  title: 'Dashboard',
  setTitle: (title: string) => {},
});

export function TitleProvider({ children }: { children: React.ReactNode }) {
  const [title, setTitle] = useState('Dashboard');
  return (
    <TitleContext.Provider value={{ title, setTitle }}>
      {children}
    </TitleContext.Provider>
  );
}

export const useTitle = () => useContext(TitleContext);