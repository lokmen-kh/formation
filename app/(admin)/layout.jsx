"use client";

import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AdminSidebar from '@/components/Sidebar/AdminSidebar';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import ThemeToggle from '@/components/ThemeToggle';

export default function AdminLayout({ children }) {
  const { user, loading, logout } = useAuth();
  const { language } = useLanguage();
  const router = useRouter();

  // Restriction stricte de l'accès client
  useEffect(() => {
    if (!loading && (!user || user.role !== 'ADMIN')) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fb] dark:bg-gray-950 text-gray-400 text-xs">
        Validation des privilèges système...
      </div>
    );
  }

  if (!user || user.role !== 'ADMIN') {
    return null;
  }

  const isAr = language === 'ar';

  return (
    <div className="min-h-screen bg-[#f8f9fb] dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col md:flex-row transition-colors duration-300">
      {/* Sidebar Latérale — rail compact/panneau responsive, gère elle-même
          son déclencheur mobile (bouton fixe en haut à gauche). */}
      <AdminSidebar user={user} logout={logout} />

      {/* Conteneur de travail à droite (Navbar supérieure d'admin + Contenu applicatif) */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">

        {/* Navbar Supérieure de l'Administration */}
        <header className="sticky top-0 z-20 w-full bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-900 py-3.5 px-layout-md md:px-layout-lg flex justify-between items-center transition-colors duration-300 shadow-sm">
          {/* Section gauche : Indicateur d'état système.
              ps-12 réserve l'espace du bouton hamburger mobile de la sidebar
              (fixed top-3.5 start-4, z-30) pour éviter tout chevauchement. */}
          <div className="shrink-0 ps-12 md:ps-0">
            <h1 className="text-xs font-bold text-gray-900 dark:text-white truncate">
              {isAr ? 'لوحة التحكم بالنظام' : 'System Administration Console'}
            </h1>
          </div>

          {/* Section droite : Outils bilingues, Thème et Profil Admin */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Commutateur de langue */}
            <LanguageSwitcher />

            <span className="hidden sm:inline text-slate-200 dark:text-slate-800 select-none">|</span>

            {/* Commutateur de thème (Mode sombre) */}
            <span className="hidden sm:inline">
              <ThemeToggle />
            </span>

            <span className="hidden sm:inline text-slate-200 dark:text-slate-800 select-none">|</span>

            {/* Profil Administrateur connecté */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-primary/10 dark:bg-primary-light/10 border border-primary/20 dark:border-primary-light/20 flex items-center justify-center text-xs font-black text-primary dark:text-primary-light shrink-0 select-none">
                {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'A'}
              </div>

              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-gray-900 dark:text-white leading-none">
                  {user.fullName}
                </p>
                <span className="text-[10px] text-primary dark:text-primary-light font-bold uppercase tracking-wider block mt-1">
                  {isAr ? 'مدير النظام' : 'Administrator'}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Espace de travail principal d'administration */}
        <main className="flex-1 p-layout-md md:p-layout-lg overflow-y-auto bg-[#f8f9fb] dark:bg-slate-900/10 opacity-0 animate-fade-in-up">
          {children}
        </main>
      </div>
    </div>
  );
}