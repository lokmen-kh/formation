"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import en from './dictionaries/en.json';
import ar from './dictionaries/ar.json';

const dictionaries = { en, ar };

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  // L'arabe est configuré comme valeur initiale par défaut
  const [language, setLanguage] = useState('ar');

  useEffect(() => {
    // Vérification sécurisée côté client (hydration)
    const savedLang = localStorage.getItem('lang');
    if (savedLang && (savedLang === 'en' || savedLang === 'ar')) {
      setLanguage(savedLang);
    } else {
      const browserLang = navigator.language.split('-')[0];
      if (browserLang === 'ar' || browserLang === 'en') {
        setLanguage(browserLang);
      }
    }
  }, []);

  useEffect(() => {
    // Application des règles de direction et de langue sur le document DOM
    const dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
    localStorage.setItem('lang', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  // Récupérateur récursif de clés de traduction imbriquées (ex: 'auth.loginBtn')
  const t = (key) => {
    const keys = key.split('.');
    let value = dictionaries[language];

    for (const k of keys) {
      if (value && value[k] !== undefined) {
        value = value[k];
      } else {
        return key; // Fallback sur la clé brute en cas d'absence
      }
    }
    return value;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage doit être invoqué à l’intérieur d’un LanguageProvider');
  }
  return context;
}