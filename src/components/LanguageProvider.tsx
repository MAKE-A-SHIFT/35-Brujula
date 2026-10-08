'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type LanguageContextType = {
  lang: 'es' | 'en' | 'fr';
  toggleLang: () => void;
  setLang: (lang: 'es' | 'en' | 'fr') => void;
};

const LanguageContext = createContext<LanguageContextType>({ lang: 'es', toggleLang: () => {}, setLang: () => {} });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<'es' | 'en' | 'fr'>('es');
  
  useEffect(() => {
    const saved = localStorage.getItem('brujula_lang');
    if (saved === 'en' || saved === 'es' || saved === 'fr') setLang(saved);
  }, []);

  const toggleLang = () => {
    setLang(l => {
      const newLang = l === 'es' ? 'en' : l === 'en' ? 'fr' : 'es';
      localStorage.setItem('brujula_lang', newLang);
      return newLang;
    });
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);

