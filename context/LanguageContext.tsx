'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  en: { 
    font: 'font-inter', 
    labels: { dashboard: 'Dashboard', posts: 'Posts', newPost: 'New Post', settings: 'Settings' } 
  },
  bn: { 
    font: 'font-kalpurush', 
    labels: { dashboard: 'ড্যাশবোর্ড', posts: 'খবর', newPost: 'নতুন খবর', settings: 'সেটিংস' } 
  }
};

type Language = 'en' | 'bn';

interface LanguageContextValue {
  lang: Language;
  toggleLang: () => void;
  t: (key: string) => string;
  font: string;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'en',
  toggleLang: () => {},
  t: () => '',
  font: 'font-inter',
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<'en' | 'bn'>('en');

  useEffect(() => {
    const saved = localStorage.getItem('admin-lang');
    if (saved === 'en' || saved === 'bn') setLang(saved);
  }, []);

  const toggleLang = () => {
    const newLang = lang === 'en' ? 'bn' : 'en';
    setLang(newLang);
    localStorage.setItem('admin-lang', newLang);
  };

  const t = (key: string) => translations[lang].labels[key as keyof typeof translations.en.labels] || key;

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t, font: translations[lang].font }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => useContext(LanguageContext);