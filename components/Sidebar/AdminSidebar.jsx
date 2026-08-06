"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import {Button} from '../ui/Button';

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

export default function AdminSidebar({ user, logout }) {
  const { language } = useLanguage();
  const pathname = usePathname();
  const isAr = language === 'ar';

  // Liste de navigation ordonnée logiquement
  const menuItems = [
    {
      href: "/dashboard",
      label: isAr ? "لوحة التحكم" : "Dashboard",
      Icon: IconDashboard
    },
    {
      href: "/statistics",
      label: isAr ? "الإحصائيات" : "Statistics",
      Icon: IconStats
    },
    {
      href: "/courses-admin",
      label: isAr ? "إدارة الكورسات" : "Courses CRUD",
      Icon: IconBookOpen
    },
      {
      href: "/categories", // NOUVEAU
      label: isAr ? "التصنيفات" : "Categories",
      Icon: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-4 h-4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
      )
    },
    {
      href: "/enrollments",
      label: isAr ? "طلبات الاشتراكات" : "Enrollments Validation",
      Icon: IconCheckSquare
    },
    {
      href: "/students",
      label: isAr ? "إدارة الطلاب" : "Students",
      Icon: IconStudent
    },
    {
      href: "/instructors",
      label: isAr ? "إدارة الأساتذة" : "Instructors",
      Icon: IconUsers
    },
    {
      href: "/finances",
      label: isAr ? "المالية" : "Finances",
      Icon: IconFinances
    },
    {
      href: "/settings",
      label: isAr ? "الإعدادات" : "Settings",
      Icon: IconSettings
    }
  ];

  return (
    <aside className="w-full md:w-64 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 border-r border-slate-200 dark:border-slate-900 p-6 flex flex-col justify-between transition-colors duration-300">
      <div className="space-y-6">
        {/* En-tête de positionnement technique */}
        <div className="border-b border-slate-200 dark:border-slate-900 pb-5">
          <span className="inline-flex items-center gap-1.5 text-[9px] font-bold tracking-widest uppercase text-primary dark:text-primary-light bg-primary/5 dark:bg-primary/10 border border-primary/15 px-2 py-1 rounded-full w-fit mb-3">
            System Control
          </span>
          <h2 className="text-base font-black tracking-tight text-gray-950 dark:text-white">EduPlus Admin</h2>
          <p className="text-[10px] text-gray-450 dark:text-gray-400 mt-1 truncate">{user.fullName}</p>
        </div>

        {/* Liste des 8 modules d'administration */}
        <nav className="flex flex-col gap-1.5">
          {menuItems.map(({ href, label, Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`group flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-btn border transition-all duration-200 ${
                  isActive
                    ? "bg-white dark:bg-slate-900 text-primary dark:text-primary-light border-slate-200 dark:border-slate-850 shadow-sm" +
                      (isAr ? " border-r-2 border-r-primary" : " border-l-2 border-l-primary")
                    : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-900/30"
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-105 ${
                  isActive ? "text-primary dark:text-primary-light" : "text-gray-400"
                }`} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Déconnexion */}
      <div className="border-t border-slate-200 dark:border-slate-900 pt-5 mt-6">
        <Button
          onClick={logout}
          variant="outline"
          className="w-full text-xs hover:border-error/30 hover:text-error dark:hover:text-error flex items-center justify-center gap-2 group transition-all"
        >
          <IconLogout className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          <span>{isAr ? "تسجيل الخروج" : "Logout"}</span>
        </Button>
      </div>
    </aside>
  );
}