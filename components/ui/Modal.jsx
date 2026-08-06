"use client";

import React, { useEffect } from 'react';

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  className = '',
}) {
  // Verrouillage du défilement d'arrière-plan à l'ouverture
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay filtrant */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Boîte de dialogue */}
      <div className={`relative z-10 w-full max-w-lg bg-white rounded-card shadow-xl border border-gray-100 overflow-hidden transform scale-100 transition-all duration-300 max-h-[90vh] flex flex-col ${className}`}>
        {/* Entête */}
        <div className="flex items-center justify-between px-layout-md py-4 border-b border-gray-100">
          {title && (
            <h3 className="text-lg font-bold text-gray-900">
              {title}
            </h3>
          )}
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-50 transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>

        {/* Corps défilant */}
        <div className="p-layout-md overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}