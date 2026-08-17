"use client";

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import ThemeToggle from '@/components/ThemeToggle';
import {
  GraduationCap, LayoutDashboard, BookOpen, Users,
  LogOut, Menu, X, ArrowLeft, Globe, UserCheck
} from 'lucide-react';

function useDismiss(ref, isOpen, onClose) {
  useEffect(() => {
    if (!isOpen) return;
    const onClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [ref, isOpen, onClose]);
}

export default function InstructorLayout({ children }) {
  const { language } = useLanguage();
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const isAr = language === 'ar';

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  useDismiss(sidebarRef, sidebarOpen, () => setSidebarOpen(false));

  // BARRIÈRE DE SÉCURITÉ : Protéger tout l'espace formateur
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace('/login?redirect=/instructor');
        return;
      }
      const role = user.role?.toUpperCase();
      if (role !== 'INSTRUCTOR' && role !== 'ADMIN') {
        router.replace('/my-courses');
      }
    }
  }, [user, loading, router]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [sidebarOpen]);

  const isActive = (path) => {
    if (path === '/instructor') return pathname === path;
    return pathname.startsWith(path);
  };

  const menuItems = [
    {
      labelAr: 'لوحة التحكم',
      labelEn: 'Dashboard',
      path: '/instructor',
      Icon: LayoutDashboard
    },
    {
      labelAr: 'دروسي المعتمدة',
      labelEn: 'My Courses',
      path: '/instructor/courses',
      Icon: BookOpen // Icône corrigée pour les cours
    },
    {
      labelAr: 'عرض الموقع العام',
      labelEn: 'View Public Site',
      path: '/',
      Icon: Globe
    }
  ];

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fb] dark:bg-gray-950">
        <div className="relative flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary/25 border-t-primary rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-[#f8f9fb] dark:bg-[#090b11] text-gray-900 dark:text-gray-150 transition-colors duration-300 flex flex-col lg:flex-row ${isAr ? 'font-cairo' : 'font-sans'}`}>

      {/* HEADER MOBILE */}
      <header className="lg:hidden flex items-center justify-between p-4 bg-white/80 dark:bg-gray-900/80 border-b border-slate-200/50 dark:border-gray-800/80 sticky top-0 z-40 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-violet-500 text-white shadow-md shadow-primary/20">
            <GraduationCap className="size-5" />
          </span>
          <div>
            <span className="font-extrabold text-sm tracking-tight block text-gray-900 dark:text-white">EduPlus</span>
            <span className="text-[9px] text-primary uppercase font-bold tracking-widest">{isAr ? 'مدرب' : 'Instructor'}</span>
          </div>
        </div>
        <button
          onClick={() => setSidebarOpen((v) => !v)}
          aria-expanded={sidebarOpen}
          aria-label={isAr ? 'القائمة' : 'Menu'}
          className="p-2 rounded-xl bg-slate-50 dark:bg-gray-950 text-gray-700 dark:text-gray-300 border border-slate-200/60 dark:border-gray-800/80 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          {sidebarOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </header>

      {/* OVERLAY MOBILE */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-45 bg-gray-950/40 backdrop-blur-[3px] transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR NAVIGATION */}
      <aside
        ref={sidebarRef}
        role="dialog"
        aria-modal={sidebarOpen}
        className={`fixed top-0 bottom-0 z-50 w-72 bg-white dark:bg-gray-900/95 p-6 flex flex-col justify-between h-screen transition-transform duration-300 border-slate-200/50 dark:border-gray-800/60 lg:sticky lg:top-0 lg:translate-x-0 ${
          isAr
            ? `start-0 border-e ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`
            : `end-0 border-s lg:border-s-0 lg:border-e ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`
        }`}
      >
        <div className="space-y-8 flex-1 overflow-y-auto no-scrollbar">

          {/* Logo Brand */}
          <Link href="/instructor" className="hidden lg:flex items-center gap-3 select-none shrink-0">
            <span className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-violet-500 text-white shadow-md shadow-primary/20">
              <GraduationCap className="size-5.5" />
            </span>
            <div>
              <span className="font-extrabold text-base tracking-tight text-gray-950 dark:text-white block leading-none">
                EduPlus
              </span>
              <span className="text-[9px] font-black uppercase text-primary tracking-widest block mt-1.5">
                {isAr ? 'فضاء المدرب' : 'Instructor Workspace'}
              </span>
            </div>
          </Link>

          {/* Profil de l'enseignant */}
          <div className="relative flex items-center gap-3.5 p-3.5 bg-slate-50/70 dark:bg-gray-950/40 rounded-2xl border border-slate-200/50 dark:border-gray-800/80">
            <div className="relative size-10.5 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold shadow-sm shrink-0">
              <UserCheck className="w-5.5 h-5.5" />
              <span className="absolute -bottom-0.5 -end-0.5 size-3 bg-emerald-500 border-2 border-white dark:border-gray-900 rounded-full animate-pulse" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-black text-gray-900 dark:text-white truncate">{user.fullName}</p>
              <p className="text-[9px] font-extrabold text-primary capitalize mt-1">
                {isAr ? 'أستاذ معتمد' : 'Verified Instructor'}
              </p>
            </div>
          </div>

          {/* Menus de Navigation */}
          <div className="space-y-1.5">
            <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest block px-3 mb-2.5">
              {isAr ? 'التحكم والمتابعة' : 'Navigation Menu'}
            </span>
            {menuItems.map((item, idx) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={idx}
                  href={item.path}
                  aria-current={active ? 'page' : undefined}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-bold transition-all duration-200 group ${
                    active
                      ? 'bg-primary/10 text-primary shadow-sm border-l-4 border-primary'
                      : 'text-gray-500 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-gray-800/50 hover:text-primary'
                  }`}
                >
                  <item.Icon className={`size-[18px] shrink-0 transition-transform duration-200 group-hover:scale-110 ${active ? 'text-primary' : 'text-gray-400 dark:text-gray-500 group-hover:text-primary'}`} />
                  <span>{isAr ? item.labelAr : item.labelEn}</span>
                </Link>
              );
            })}
          </div>

        </div>

        {/* Pied de la Sidebar */}
        <div className="pt-4 border-t border-slate-150/60 dark:border-gray-800/60 space-y-4 shrink-0">
          <div className="flex items-center justify-between px-2">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>

          <button
            onClick={() => logout()}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50/60 dark:hover:bg-red-950/20 transition-colors duration-200 cursor-pointer"
          >
            <LogOut className="size-[18px] shrink-0" />
            <span>{isAr ? 'تسجيل الخروج' : 'Logout'}</span>
          </button>
        </div>

      </aside>

      {/* ZONE DE CONTENU PRINCIPAL */}
      <main className="flex-1 p-5 sm:p-8 lg:p-10 overflow-y-auto h-screen">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>

    </div>
  );
}