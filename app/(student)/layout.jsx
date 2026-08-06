"use client";

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PublicLayout({ children }) {
  return (
    <div className="flex-1 flex flex-col min-h-screen justify-between transition-colors duration-300">
      {/* Navbar publique uniquement pour les visiteurs et espaces publics */}
      <Navbar />
      
      {/* Contenu de la page vitrine */}
      <div className="flex-1 flex flex-col">
        {children}
      </div>
      
      {/* Footer uniquement pour les pages publiques */}
      <Footer />
    </div>
  );
}