"use client";

import { useState, useRef, useEffect, useId } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';
import { Button } from './ui/Button';
import {
  GraduationCap,
  X,
  ChevronDown,
  Home,
  BookOpen,
  Info,
  Shield,
  BookMarked,
  LogOut,
  LogIn,
  Rocket,
  Grid3X3,
  Sparkles,
  ArrowRight,
  User,
  Menu,
  LifeBuoy,
  FileText,
  Search,
  Code2,
  Cpu,
  Palette,
  TrendingUp,
  Globe2,
  Camera,
  Dumbbell,
  Music2,
} from 'lucide-react';

const CATEGORY_ICONS = {
  development: Code2,
  'data-ai': Cpu,
  design: Palette,
  business: TrendingUp,
  languages: Globe2,
  photography: Camera,
  health: Dumbbell,
  music: Music2,
};

const ABOUT_ITEMS = [
  { en: 'About Us', ar: 'من نحن', path: '/about', icon: Info },
  { en: 'How It Works', ar: 'كيفية الاستخدام', path: '/how-it-works', icon: LifeBuoy },
  { en: 'Terms & Conditions', ar: 'الشروط والأحكام', path: '/terms', icon: FileText },
  { en: 'Privacy Policy', ar: 'سياسة الخصوصية', path: '/privacy', icon: Shield },
];

const BASE_NAV_ITEMS = [
  { en: 'Home', ar: 'الرئيسية', path: '/', icon: Home },
  { en: 'Courses', ar: 'دوراتنا', path: '/courses', icon: BookOpen },
  { en: 'About', ar: 'من نحن', path: '/about', icon: Info, dropdown: ABOUT_ITEMS },
];

function useDismiss(ref, isOpen, onClose) {
  useEffect(() => {
    if (!isOpen) return;

    let touchStartY = 0;
    let touchStartX = 0;
    let isSwiping = false;

    const onClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose();
      }
    };

    const onTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
      touchStartX = e.touches[0].clientX;
      isSwiping = false;
    };

    const onTouchMove = (e) => {
      const deltaY = Math.abs(e.touches[0].clientY - touchStartY);
      const deltaX = Math.abs(e.touches[0].clientX - touchStartX);
      if (deltaY > 15 || deltaX > 15) {
        isSwiping = true;
      }
    };

    const onTouchEnd = (e) => {
      if (!isSwiping && ref.current && !ref.current.contains(e.target)) {
        onClose();
      }
    };

    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('touchstart', onTouchStart, { passive: true });
    document.addEventListener('touchmove', onTouchMove, { passive: true });
    document.addEventListener('touchend', onTouchEnd, { passive: true });
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('touchstart', onTouchStart);
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [ref, isOpen, onClose]);
}

export default function Navbar() {
  const { language } = useLanguage();
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const isAr = language === 'ar';

  const [categories, setCategories] = useState([]);
  const [catOpen, setCatOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const catRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const mobileSearchInputRef = useRef(null);
  const aboutRef = useRef(null);
  const userMenuRef = useRef(null);
  const mobileMenuId = useId();

  // Portal target must only be used after mount (no `document` during SSR).
  // This also sidesteps the classic bug where a transformed/filtered ancestor
  // (e.g. a Framer Motion page-transition wrapper) turns into the containing
  // block for `position: fixed` descendants, making the fixed header/menu
  // scroll away with the page instead of staying pinned to the viewport.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useDismiss(catRef, catOpen, () => setCatOpen(false));
  useDismiss(aboutRef, aboutOpen, () => setAboutOpen(false));
  useDismiss(userMenuRef, userMenuOpen, () => setUserMenuOpen(false));
  useDismiss(mobileMenuRef, mobileMenuOpen, () => setMobileMenuOpen(false));
  useDismiss(mobileSearchRef, mobileSearchOpen, () => setMobileSearchOpen(false));

  useEffect(() => {
    fetch('/api/public/categories')
      .then((res) => res.json())
      .then((data) => {
        if (data.categories) {
          setCategories(data.categories);
        }
      })
      .catch((err) => console.error('Error fetching categories:', err));
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 15);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setAboutOpen(false);
    setUserMenuOpen(false);
    setCatOpen(false);
    setMobileSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (mobileSearchOpen) {
      const t = setTimeout(() => mobileSearchInputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [mobileSearchOpen]);

  const isActive = (path) => {
    if (path === '/') return pathname === path;
    return pathname.startsWith(path);
  };

  const role = user?.role?.toLowerCase();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchValue.trim()) return;
    router.push(`/courses?search=${encodeURIComponent(searchValue.trim())}`);
    setMobileSearchOpen(false);
  };

  // Simple, reliable toggle. No pointer/scroll heuristics: those caused
  // legitimate taps right after scrolling to be silently swallowed.
  const handleMenuClick = () => {
    setMobileMenuOpen((v) => !v);
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-lg shadow-md dark:bg-gray-950/90"
          : "bg-white dark:bg-gray-950"
      }`}
    >
      <nav
        aria-label={isAr ? 'التنقل الرئيسي' : 'Main navigation'}
        className="max-w-7xl mx-auto h-16 sm:h-[68px] px-3 sm:px-6 flex items-center justify-between gap-2"
      >
        {/* Logo */}
        <Link
          href="/"
          className="shrink-0 flex items-center gap-2 group rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 select-none"
        >
          <span className="flex size-8 sm:size-9 items-center justify-center rounded-xl bg-primary text-white shadow-sm transition-transform duration-200 group-hover:scale-105">
            <GraduationCap className="size-4 sm:size-5 text-white" />
          </span>
          <span className="font-display text-base sm:text-lg font-black text-gray-900 dark:text-white leading-none tracking-tight whitespace-nowrap">
            Edu<span className="text-primary">Plus</span>
          </span>
        </Link>

        {/* Desktop Navigation (links + dropdowns) */}
        <div className="hidden xl:flex items-center gap-0.5 flex-1 min-w-0 px-2">
          {BASE_NAV_ITEMS.map((item) => {
            if (item.dropdown) {
              return (
                <div ref={aboutRef} key={item.path} className="relative">
                  <button
                    onClick={() => setAboutOpen((v) => !v)}
                    aria-haspopup="menu"
                    aria-expanded={aboutOpen}
                    className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 cursor-pointer whitespace-nowrap ${
                      aboutOpen || isActive(item.path)
                        ? 'text-primary'
                        : 'text-gray-600 dark:text-gray-300 hover:text-primary'
                    }`}
                  >
                    <span>{isAr ? item.ar : item.en}</span>
                    <ChevronDown className={`size-3.5 transition-transform duration-200 ${aboutOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <div
                    role="menu"
                    className={`absolute top-full mt-2 w-56 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-md overflow-hidden origin-top transition-all duration-200 ${
                      aboutOpen
                        ? 'opacity-100 scale-100 pointer-events-auto translate-y-0'
                        : 'opacity-0 scale-95 pointer-events-none -translate-y-1'
                    } ${isAr ? 'end-0' : 'start-0'}`}
                  >
                    <div className="p-1.5 space-y-0.5">
                      {item.dropdown.map((sub) => {
                        const SubIcon = sub.icon;
                        return (
                          <Link
                            key={sub.path}
                            href={sub.path}
                            role="menuitem"
                            onClick={() => setAboutOpen(false)}
                            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors duration-150 ${
                              isActive(sub.path)
                                ? 'text-primary bg-primary/5'
                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/60 hover:text-primary'
                            }`}
                          >
                            <SubIcon className="size-4 shrink-0 opacity-80" />
                            <span>{isAr ? sub.ar : sub.en}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            }

            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                href={item.path}
                aria-current={active ? 'page' : undefined}
                className={`relative px-3 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 whitespace-nowrap ${
                  active ? 'text-primary' : 'text-gray-600 dark:text-gray-300 hover:text-primary'
                }`}
              >
                <span>{isAr ? item.ar : item.en}</span>
                {active && (
                  <span className="absolute left-3 right-3 -bottom-0.5 h-[2px] rounded-full bg-primary" />
                )}
              </Link>
            );
          })}

          {/* Categories Dropdown */}
          <div ref={catRef} className="relative">
            <button
              onClick={() => setCatOpen((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={catOpen}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 cursor-pointer whitespace-nowrap ${
                catOpen ? 'text-primary' : 'text-gray-600 dark:text-gray-300 hover:text-primary'
              }`}
            >
              <span>{isAr ? 'الفئات' : 'Categories'}</span>
              <ChevronDown className={`size-3.5 transition-transform duration-200 ${catOpen ? 'rotate-180' : ''}`} />
            </button>

            <div
              role="menu"
              className={`absolute top-full mt-2 w-72 max-w-[90vw] bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-md overflow-hidden origin-top transition-all duration-200 ${
                catOpen
                  ? 'opacity-100 scale-100 pointer-events-auto translate-y-0'
                  : 'opacity-0 scale-95 pointer-events-none -translate-y-1'
              } ${isAr ? 'end-0' : 'start-0'}`}
            >
              <div className="p-4">
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
                    {isAr ? 'تصفح حسب المجالات' : 'Browse categories'}
                  </span>
                  <Sparkles className="size-3.5 text-primary" />
                </div>
                {categories.length > 0 ? (
                  <div className="grid grid-cols-2 gap-1">
                    {categories.map((cat) => {
                      const CatIcon = CATEGORY_ICONS[cat.slug] || BookOpen;
                      return (
                        <Link
                          key={cat.id}
                          href={`/courses?category=${encodeURIComponent(cat.slug)}`}
                          role="menuitem"
                          onClick={() => setCatOpen(false)}
                          className="flex items-center gap-2 px-2.5 py-2.5 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-400 hover:bg-primary/5 hover:text-primary transition-colors duration-150 group"
                        >
                          <CatIcon className="size-4 shrink-0 text-gray-400 group-hover:text-primary transition-colors" />
                          <span className="flex-1 truncate">{isAr ? cat.nameAr : cat.nameEn}</span>
                          <ArrowRight className={`size-3.5 opacity-0 group-hover:opacity-100 transition-all duration-150 transform ${isAr ? 'rotate-180 group-hover:-translate-x-0.5' : 'group-hover:translate-x-0.5'}`} />
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 py-2 text-center">
                    {isAr ? 'لا توجد فئات حالياً' : 'No categories yet'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar (tablet/desktop, from md up) */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden md:flex w-full max-w-[150px] lg:max-w-xs items-center gap-2 px-3 lg:px-4 py-2 rounded-full bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800 focus-within:border-primary/40 focus-within:bg-white dark:focus-within:bg-gray-900 transition-colors duration-200"
        >
          <Search className="size-4 shrink-0 text-gray-400" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder={isAr ? 'ابحث...' : 'Search...'}
            className="w-full min-w-0 bg-transparent text-xs font-medium text-gray-700 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none"
          />
        </form>

        {/* Mobile Search Button (below md) */}
        <button
          type="button"
          className={`md:hidden p-2 rounded-xl transition-colors duration-200 shrink-0 ${
            mobileSearchOpen
              ? 'text-primary bg-primary/5'
              : 'hover:bg-gray-50 dark:hover:bg-gray-900 text-gray-600 dark:text-gray-300'
          }`}
          aria-label={isAr ? 'بحث' : 'Search'}
          aria-expanded={mobileSearchOpen}
          onClick={() => setMobileSearchOpen((v) => !v)}
        >
          <Search className="size-5" />
        </button>

        {/* Utility icons: hidden on the smallest screens, shown from sm */}
        <span className="hidden sm:inline-flex shrink-0">
          <LanguageSwitcher />
        </span>
        <span className="hidden sm:inline-flex shrink-0">
          <ThemeToggle />
        </span>

        {/* Right cluster: capsule (auth) + mobile menu button */}
        <div className="flex items-center gap-2 shrink-0">
          {user ? (
            <div ref={userMenuRef} className="relative shrink-0">
              <button
                onClick={() => setUserMenuOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={userMenuOpen}
                className="flex items-center p-0.5 rounded-full border-2 border-primary/20 hover:border-primary/50 transition-colors duration-200 cursor-pointer"
              >
                <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  <User className="size-3.5 sm:size-4" />
                </div>
              </button>

              <div
                role="menu"
                className={`absolute ${isAr ? 'start-0' : 'end-0'} mt-2 w-56 max-w-[90vw] bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-md overflow-hidden origin-top transition-all duration-200 ${
                  userMenuOpen
                    ? 'opacity-100 scale-100 pointer-events-auto translate-y-0'
                    : 'opacity-0 scale-95 pointer-events-none -translate-y-1'
                }`}
              >
                <div className="p-2 space-y-1">
                  <div className="px-3 py-3 mb-1 border-b border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-950/30 rounded-xl">
                    <p className="text-xs font-bold text-gray-900 dark:text-white truncate">
                      {user.fullName || user.email}
                    </p>
                    <p className="text-[10px] text-gray-400 font-black capitalize mt-0.5">{role || 'user'}</p>
                  </div>

                  <Link
                    href="/my-courses"
                    role="menuitem"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-primary/5 hover:text-primary transition-colors duration-150"
                  >
                    <BookMarked className="size-4 shrink-0" />
                    {isAr ? 'دوراتي' : 'My Courses'}
                  </Link>

                  <div className="border-t border-gray-100 dark:border-gray-800 pt-2 mt-1">
                    <button
                      onClick={() => {
                        logout();
                        setUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors duration-150 cursor-pointer"
                    >
                      <LogOut className="size-4 shrink-0" />
                      {isAr ? 'تسجيل الخروج' : 'Logout'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Solid-primary capsule — signature element, no gradient.
                  >= lg: full pill with Login text + Sign Up button.
                  sm–lg: compact icon-only pill (keeps the same visual language
                  without crowding smaller viewports).
                  < sm: hidden entirely, actions live in the mobile menu. */}
              <div className="hidden sm:flex items-center rounded-full bg-primary shadow-sm shadow-primary/30 overflow-hidden shrink-0">
                <Link
                  href="/login"
                  className="hidden lg:inline-flex items-center gap-1.5 pl-4 pr-3 py-2 text-xs font-bold text-white/90 hover:text-white transition-colors duration-200 whitespace-nowrap"
                >
                  <LogIn className="size-3.5 shrink-0" />
                  {isAr ? 'دخول' : 'Log In'}
                </Link>
                <Link
                  href="/login"
                  aria-label={isAr ? 'تسجيل الدخول' : 'Log in'}
                  className="lg:hidden inline-flex items-center justify-center size-9 text-white/90 hover:text-white transition-colors duration-200"
                >
                  <LogIn className="size-4" />
                </Link>

                <Link
                  href="/register"
                  className="flex items-center gap-1.5 bg-white text-primary text-xs font-bold px-3.5 lg:px-4 py-2 m-0.5 rounded-full hover:bg-white/90 transition-colors duration-200 whitespace-nowrap"
                >
                  <Rocket className="size-3.5 shrink-0" />
                  <span className="hidden lg:inline">{isAr ? 'ابدأ الآن' : 'Sign Up'}</span>
                  <span className="lg:hidden">{isAr ? 'ابدأ' : 'Join'}</span>
                </Link>
              </div>

              {/* < sm: single round primary CTA so the smallest screens still
                  get a one-tap path to sign up, without duplicating the whole pill. */}
              <Link
                href="/register"
                aria-label={isAr ? 'ابدأ الآن' : 'Sign up'}
                className="sm:hidden inline-flex items-center justify-center size-9 rounded-full bg-primary text-white shadow-sm shadow-primary/30 shrink-0"
              >
                <Rocket className="size-4" />
              </Link>
            </>
          )}

          {/* Mobile Menu Button - simple, reliable toggle */}
          <button
            type="button"
            onClick={handleMenuClick}
            aria-expanded={mobileMenuOpen}
            aria-controls={mobileMenuId}
            aria-label={isAr ? 'القائمة' : 'Menu'}
            className="xl:hidden shrink-0 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 text-gray-600 dark:text-gray-300 transition-colors duration-200 cursor-pointer touch-manipulation"
          >
            {mobileMenuOpen ? <X className="size-5 sm:size-6" /> : <Menu className="size-5 sm:size-6" />}
          </button>
        </div>
      </nav>

      {/* Inline Mobile Search Bar */}
      <div
        ref={mobileSearchRef}
        className={`md:hidden overflow-hidden transition-all duration-200 px-3 sm:px-6 ${
          mobileSearchOpen ? 'max-h-20 opacity-100 pb-3' : 'max-h-0 opacity-0'
        }`}
      >
        <form
          onSubmit={handleSearchSubmit}
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800 focus-within:border-primary/40"
        >
          <Search className="size-4 shrink-0 text-gray-400" />
          <input
            ref={mobileSearchInputRef}
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder={isAr ? 'ابحث عن دورة...' : 'Search courses...'}
            className="w-full min-w-0 bg-transparent text-sm font-medium text-gray-700 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setMobileSearchOpen(false)}
            aria-label={isAr ? 'إغلاق البحث' : 'Close search'}
            className="p-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X className="size-4" />
          </button>
        </form>
      </div>

      {mounted && createPortal(
        <>
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="xl:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Panel */}
      <div
        id={mobileMenuId}
        ref={mobileMenuRef}
        role="dialog"
        aria-modal="true"
        aria-label={isAr ? 'قائمة التنقل' : 'Navigation menu'}
        className={`xl:hidden fixed top-0 h-full w-[88%] sm:w-[85%] max-w-sm bg-white dark:bg-gray-950 shadow-2xl z-50 transform transition-transform duration-300 ease-out overflow-y-auto ${
          isAr
            ? `left-0 border-r border-gray-100 dark:border-gray-900 ${
                mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
              }`
            : `right-0 border-l border-gray-100 dark:border-gray-900 ${
                mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
              }`
        }`}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between px-4 sm:px-5 py-4 bg-white/95 dark:bg-gray-950/95 backdrop-blur-sm border-b border-gray-100 dark:border-gray-900">
          <span className="font-display text-base sm:text-lg font-extrabold text-gray-900 dark:text-white">
            Edu<span className="text-primary">Plus</span>
          </span>
          <button
            onClick={() => setMobileMenuOpen(false)}
            aria-label={isAr ? 'إغلاق' : 'Close'}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-600 dark:text-gray-300 transition-colors duration-200 cursor-pointer"
          >
            <X className="size-5 sm:size-6" />
          </button>
        </div>

        <div className="p-4 sm:p-5 space-y-5">
          {/* Navigation Links */}
          <div className="space-y-1">
            {BASE_NAV_ITEMS.map((item) => {
              const LinkIcon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  aria-current={active ? 'page' : undefined}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-bold transition-colors duration-150 ${
                    active
                      ? 'text-primary bg-primary/10'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900/60'
                  }`}
                >
                  <LinkIcon className="size-5 shrink-0" />
                  <span>{isAr ? item.ar : item.en}</span>
                </Link>
              );
            })}
          </div>

          {/* About Sub-items */}
          <div className="space-y-1 pl-4 border-l-2 border-gray-100 dark:border-gray-900">
            {ABOUT_ITEMS.filter((s) => s.path !== '/about').map((sub) => {
              const SubIcon = sub.icon;
              return (
                <Link
                  key={sub.path}
                  href={sub.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900/60 hover:text-primary transition-colors duration-150"
                >
                  <SubIcon className="size-4 shrink-0" />
                  <span>{isAr ? sub.ar : sub.en}</span>
                </Link>
              );
            })}
          </div>

          {/* Categories Grid */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 px-2">
              <Grid3X3 className="size-4 text-gray-400" />
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                {isAr ? 'الفئات التعليمية' : 'Categories'}
              </span>
            </div>
            {categories.length > 0 ? (
              <div className="grid grid-cols-2 gap-1.5">
                {categories.map((cat) => {
                  const CatIcon = CATEGORY_ICONS[cat.slug] || BookOpen;
                  return (
                    <Link
                      key={cat.id}
                      href={`/courses?category=${encodeURIComponent(cat.slug)}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/40 hover:bg-primary/5 hover:text-primary transition-colors duration-150"
                    >
                      <CatIcon className="size-4 shrink-0 text-gray-400" />
                      <span className="truncate">{isAr ? cat.nameAr : cat.nameEn}</span>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-gray-400 px-2">{isAr ? 'لا توجد فئات حالياً' : 'No categories yet'}</p>
            )}
          </div>

          {/* Tools — also live here now so they're reachable below the sm
              breakpoint, where they're hidden from the top bar. */}
          <div className="flex items-center gap-3 px-2 pt-1">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>

          {/* Auth Section */}
          {user ? (
            <div className="pt-4 space-y-1.5 border-t border-gray-100 dark:border-gray-900">
              <div className="flex items-center gap-3 px-3 py-3 bg-gray-50/60 dark:bg-gray-900/30 rounded-2xl border border-gray-100 dark:border-gray-900">
                <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <User className="size-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                    {user.fullName || user.email}
                  </p>
                  <p className="text-xs text-gray-400 capitalize">{role || 'user'}</p>
                </div>
              </div>

              <Link
                href="/my-courses"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900/60 transition-colors duration-150"
              >
                <BookMarked className="size-5 shrink-0" />
                {isAr ? 'دوراتي' : 'My Courses'}
              </Link>

              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors duration-150 cursor-pointer"
              >
                <LogOut className="size-5 shrink-0" />
                {isAr ? 'تسجيل الخروج' : 'Logout'}
              </button>
            </div>
          ) : (
            <div className="pt-4 border-t border-gray-100 dark:border-gray-900 space-y-2.5">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block w-full">
                <Button
                  variant="outline"
                  className="w-full gap-2 text-sm font-bold border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900/60 rounded-xl py-3"
                >
                  <LogIn className="size-4 shrink-0" />
                  {isAr ? 'تسجيل الدخول' : 'Login'}
                </Button>
              </Link>
              <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="block w-full">
                <Button className="w-full gap-2 text-sm font-bold bg-primary hover:bg-primary/90 shadow-sm rounded-xl py-3">
                  <Rocket className="size-4 shrink-0 text-white" />
                  {isAr ? 'هيا لنبدأ' : 'Sign Up'}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
        </>,
        document.body
      )}
    </header>
  );
}