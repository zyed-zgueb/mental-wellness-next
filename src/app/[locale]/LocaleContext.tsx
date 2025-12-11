// LocaleContext.tsx
'use client';

import { createContext, useContext, ReactNode } from "react";

export const LocaleContext = createContext('fr');
export const useLocale = () => useContext(LocaleContext);

// Add this provider component
export function LocaleProvider({ 
  locale, 
  children 
}: { 
  locale: string; 
  children: ReactNode;
}) {
  return (
    <LocaleContext.Provider value={locale}>
      {children}
    </LocaleContext.Provider>
  );
}