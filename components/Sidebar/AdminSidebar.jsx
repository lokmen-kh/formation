"use client";

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Button } from '../ui/Button';

/* -------------------------------------------------------------------------- */
/* Icônes Linéaires Vectorielles Unifiées (Style Lucide)                       */
/* -------------------------------------------------------------------------- */

function IconDashboard(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="3" width="7" height="9" rx="1" />
      <rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="14" y="12" width="7" height="9" rx="1" />
      <rect x="3" y="16" width="7" height="5" rx="1" />
    </svg>
  );
}

function IconStats(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

function IconBookOpen(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

function IconCheckSquare(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  );
}

function IconStudent(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
    </svg>
  );
}

function IconUsers(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function IconFinances(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

function IconSettings(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

function IconLogout(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function IconCategories(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function IconPanelToggle(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <line x1="9" y1="4" x2="9" y2="20" />
    </svg>
  );
}

function IconMenuBurger(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="4" y1="7" x2="20" y2="7" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="17" x2="20" y2="17" />
    </svg>
  );
}

function IconX(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

function IconHelp(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.1 9a3 3 0 1 1 4.9 2.3c-.7.6-1.5 1-1.5 2.2" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function IconChevronUpDown(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="7 9 12 4 17 9" />
      <polyline points="7 15 12 20 17 15" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Données de navigation                                                      */
/* -------------------------------------------------------------------------- */

function useMenuItems(isAr) {
  return [
    { href: "/dashboard", label: isAr ? "لوحة التحكم" : "Dashboard", Icon: IconDashboard },
    { href: "/statistics", label: isAr ? "الإحصائيات" : "Statistics", Icon: IconStats },
    { href: "/courses-admin", label: isAr ? "إدارة الكورسات" : "Courses CRUD", Icon: IconBookOpen },
    { href: "/categories", label: isAr ? "التصنيفات" : "Categories", Icon: IconCategories },
    { href: "/enrollments", label: isAr ? "طلبات الاشتراكات" : "Enrollments Validation", Icon: IconCheckSquare },
    { href: "/students", label: isAr ? "إدارة الطلاب" : "Students", Icon: IconStudent },
    { href: "/instructors", label: isAr ? "إدارة الأساتذة" : "Instructors", Icon: IconUsers },
    { href: "/finances", label: isAr ? "المالية" : "Finances", Icon: IconFinances },
    { href: "/settings", label: isAr ? "الإعدادات" : "Settings", Icon: IconSettings },
  ];
}

/* -------------------------------------------------------------------------- */
/* Contenu partagé (rendu dans le panneau desktop ET dans le tiroir mobile)   */
/* -------------------------------------------------------------------------- */

function SidebarContent({ user, logout, isAr, collapsed, menuItems, pathname, onNavigate }) {
  return (
    <>
      <div className="space-y-6">
        {/* En-tête */}
        <div className={`border-b border-slate-200 dark:border-slate-900 pb-5 flex items-center gap-2.5 ${collapsed ? 'justify-center' : ''}`}>
          <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary text-white font-black text-sm">
            E
          </span>
          {!collapsed && (
            <div className="min-w-0">
              <h2 className="text-sm font-black tracking-tight text-gray-950 dark:text-white truncate">EduPlus Admin</h2>
              <span className="inline-flex items-center gap-1 text-[9px] font-bold tracking-widest uppercase text-primary dark:text-primary-light mt-0.5">
                System Control
              </span>
            </div>
          )}
        </div>

        {/* Liste des modules d'administration */}
        <nav className="flex flex-col gap-1.5">
          {menuItems.map(({ href, label, Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={onNavigate}
                title={collapsed ? label : undefined}
                aria-current={isActive ? 'page' : undefined}
                className={`group flex items-center gap-3 px-3 py-2.5 text-xs font-semibold rounded-btn transition-all duration-200 ${
                  collapsed ? 'justify-center' : ''
                } ${
                  isActive
                    ? 'bg-primary text-white shadow-sm shadow-primary/25'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-primary/5 dark:hover:bg-primary/10 hover:text-primary dark:hover:text-primary-light'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-105" />
                {!collapsed && <span className="truncate">{label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Carte d'aide — remplace l'encart promo de l'exemple par quelque chose de réel */}
        {!collapsed && (
          <div className="rounded-2xl bg-primary/5 dark:bg-primary/10 border border-primary/15 p-4 space-y-2.5">
            <div className="flex items-center gap-2 text-primary dark:text-primary-light">
              <IconHelp className="w-4 h-4 shrink-0" />
              <span className="text-xs font-bold">{isAr ? 'تحتاج مساعدة؟' : 'Need help?'}</span>
            </div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
              {isAr
                ? 'راجع دليل الاستخدام أو تواصل مع الفريق التقني.'
                : 'Check the admin guide or reach out to the technical team.'}
            </p>
            <Link
              href="/settings"
              onClick={onNavigate}
              className="inline-flex items-center gap-1.5 text-[11px] font-bold text-primary dark:text-primary-light hover:underline"
            >
              {isAr ? 'الذهاب إلى الإعدادات' : 'Go to Settings'}
            </Link>
          </div>
        )}
      </div>

      {/* Profil + déconnexion */}
      <div className="border-t border-slate-200 dark:border-slate-900 pt-4 mt-6 space-y-3">
        <div className={`flex items-center gap-2.5 rounded-xl px-2 py-1.5 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 rounded-full bg-primary/10 dark:bg-primary-light/10 border border-primary/20 flex items-center justify-center text-xs font-black text-primary dark:text-primary-light shrink-0 select-none">
            {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'A'}
          </div>
          {!collapsed && (
            <>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{user?.fullName}</p>
                <span className="text-[10px] text-gray-450 dark:text-gray-400">
                  {isAr ? 'مدير النظام' : 'Administrator'}
                </span>
              </div>
              <IconChevronUpDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            </>
          )}
        </div>

        {collapsed ? (
          <button
            onClick={logout}
            title={isAr ? 'تسجيل الخروج' : 'Logout'}
            className="w-full flex items-center justify-center py-2 rounded-btn text-gray-500 hover:text-error hover:bg-error/5 transition-colors cursor-pointer"
          >
            <IconLogout className="w-4 h-4" />
          </button>
        ) : (
          <Button
            onClick={logout}
            variant="outline"
            className="w-full text-xs hover:border-error/30 hover:text-error dark:hover:text-error flex items-center justify-center gap-2 group transition-all"
          >
            <IconLogout className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            <span>{isAr ? "تسجيل الخروج" : "Logout"}</span>
          </Button>
        )}
      </div>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Sidebar principale                                                         */
/* -------------------------------------------------------------------------- */

export default function AdminSidebar({ user, logout }) {
  const { language } = useLanguage();
  const pathname = usePathname();
  const isAr = language === 'ar';
  const menuItems = useMenuItems(isAr);

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Ferme le tiroir mobile à chaque changement de page
  useEffect(() => setMobileOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [mobileOpen]);

  return (
    <>
      {/* Déclencheur mobile — bouton flottant, tiroir rendu via portal */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        aria-label={isAr ? 'فتح القائمة' : 'Open menu'}
        className="md:hidden fixed top-3.5 start-4 z-30 p-2 rounded-xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-slate-800 text-gray-600 dark:text-gray-300 shadow-sm"
      >
        <IconMenuBurger className="w-4.5 h-4.5" />
      </button>

      {/* Sidebar persistante — desktop uniquement, largeur collapsible */}
      <aside
        className={`hidden md:flex md:flex-col shrink-0 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 border-r border-slate-200 dark:border-slate-900 p-4 justify-between transition-[width] duration-300 relative ${
          collapsed ? 'md:w-20' : 'md:w-64'
        }`}
      >
        <button
          type="button"
          onClick={() => setCollapsed((v) => !v)}
          aria-label={isAr ? 'طي/توسيع القائمة' : 'Collapse/expand menu'}
          className={`absolute top-4 ${isAr ? 'start-4' : 'end-4'} p-1.5 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/5 transition-colors ${
            collapsed ? 'static self-center mb-4' : ''
          }`}
        >
          <IconPanelToggle className="w-4 h-4" />
        </button>

        <div className={`${collapsed ? 'pt-8' : 'pt-6'} flex flex-col justify-between flex-1 overflow-y-auto`}>
          <SidebarContent
            user={user}
            logout={logout}
            isAr={isAr}
            collapsed={collapsed}
            menuItems={menuItems}
            pathname={pathname}
          />
        </div>
      </aside>

      {/* Tiroir mobile — overlay + panneau, rendus via portal pour éviter tout
          conflit avec un éventuel ancêtre en backdrop-blur/transform (même
          bug que celui déjà corrigé sur la Navbar publique). */}
      {mounted && createPortal(
        <>
          {mobileOpen && (
            <div
              className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              onClick={() => setMobileOpen(false)}
            />
          )}
          <div
            role="dialog"
            aria-modal="true"
            className={`md:hidden fixed top-0 h-full w-[85%] max-w-xs bg-slate-50 dark:bg-slate-950 border-e border-slate-200 dark:border-slate-900 shadow-2xl z-50 p-5 flex flex-col justify-between overflow-y-auto transform transition-transform duration-300 ease-out ${
              isAr ? 'right-0' : 'left-0'
            } ${
              mobileOpen ? 'translate-x-0' : isAr ? 'translate-x-full' : '-translate-x-full'
            }`}
          >
            <div className="flex items-center justify-end mb-2">
              <button
                onClick={() => setMobileOpen(false)}
                aria-label={isAr ? 'إغلاق' : 'Close'}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 text-gray-500"
              >
                <IconX className="w-4.5 h-4.5" />
              </button>
            </div>
            <div className="flex flex-col justify-between flex-1">
              <SidebarContent
                user={user}
                logout={logout}
                isAr={isAr}
                collapsed={false}
                menuItems={menuItems}
                pathname={pathname}
                onNavigate={() => setMobileOpen(false)}
              />
            </div>
          </div>
        </>,
        document.body
      )}
    </>
  );
}