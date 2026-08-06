"use client";

import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function LanguageSwitcher() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium transition-colors duration-200 border rounded-btn bg-white hover:bg-gray-50 border-gray-200 shadow-sm cursor-pointer"
      aria-label="Changer de langue"
    >
      <span className="w-5 h-5 flex items-center justify-center text-xs">
        🌐
      </span>
      <span>
        {language === 'ar' ? 'English' : 'العربية'}
      </span>
    </button>
  );
}