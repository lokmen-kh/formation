"use client";

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import CourseCard from '@/components/CourseCard';
import Navbar from '@/components/Navbar';

/* -------------------------------------------------------------------------- */
/* Icônes Linéaires Vectorielles Uniformes (Style Lucide)                     */
/* -------------------------------------------------------------------------- */

function IconGraduationCap(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" />
    </svg>
  );
}
function IconRoute(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="5" cy="18" r="2" />
      <circle cx="19" cy="6" r="2" />
      <path d="M5 16v-2a4 4 0 0 1 4-4h6a4 4 0 0 0 4-4" />
    </svg>
  );
}
function IconSearch(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
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
function IconFilter(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polygon points="22 3 2 3 10 13 10 21 14 18 14 13 22 3" />
    </svg>
  );
}
function IconGrid(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}
function IconList(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <circle cx="3.5" cy="6" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="3.5" cy="12" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="3.5" cy="18" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}
function IconSparkles(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2 2-6z" />
    </svg>
  );
}
function IconTrendingUp(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}
function IconTarget(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none" />
    </svg>
  );
}
function IconCode(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="8 6 2 12 8 18" /><polyline points="16 6 22 12 16 18" />
    </svg>
  );
}
function IconCpu(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="6" y="6" width="12" height="12" rx="1.5" /><rect x="9" y="9" width="6" height="6" rx="0.8" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.5 4.5l2 2M17.5 17.5l2 2M4.5 19.5l2-2M17.5 6.5l2-2" />
    </svg>
  );
}
function IconPalette(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 3a9 9 0 100 18c1.2 0 1.6-.9.9-1.7-.5-.6-.1-1.5.8-1.5H15a5 5 0 005-5c0-5.5-3.6-9.8-8-9.8z" /><circle cx="7.5" cy="10.5" r="1" fill="currentColor" stroke="none" /><circle cx="11" cy="7.5" r="1" fill="currentColor" stroke="none" /><circle cx="15" cy="8.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
function IconBriefcase(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2.5" y="7" width="19" height="13" rx="2" /><path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" /><path d="M2.5 12.5h19" />
    </svg>
  );
}
function IconGlobe(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="8.5" /><path d="M3.5 12h17" /><path d="M12 3.5c2.4 2.3 3.6 5.2 3.6 8.5S14.4 18.2 12 20.5" /><path d="M12 3.5c-2.4 2.3-3.6 5.2-3.6 8.5s1.2 6.2 3.6 8.5" />
    </svg>
  );
}

const CATEGORY_ICONS = {
  '': IconTarget,
  development: IconCode,
  'data-ai': IconCpu,
  design: IconPalette,
  business: IconBriefcase,
  languages: IconGlobe,
};

function CoursesCatalogContent({ courses, setCourses, categories, setCategories, loading, setLoading }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const searchQueryParam = searchParams.get('search') || '';
  const categoryQueryParam = searchParams.get('category') || '';

  const [localSearch, setLocalSearch] = useState(searchQueryParam);
  const [activeCategory, setActiveCategory] = useState(categoryQueryParam);
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    Promise.all([
      fetch('/api/public/courses').then((res) => res.json()),
      fetch('/api/public/categories').then((res) => res.json())
    ])
      .then(([coursesData, categoriesData]) => {
        if (coursesData.courses) setCourses(coursesData.courses);
        if (categoriesData.categories) {
          const formatted = [
            { id: '', nameAr: 'الكل', nameEn: 'All', slug: '' },
            ...categoriesData.categories
          ];
          setCategories(formatted);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => setLocalSearch(searchQueryParam), [searchQueryParam]);
  useEffect(() => setActiveCategory(categoryQueryParam), [categoryQueryParam]);

  const handleCategorySelect = (slug) => {
    setActiveCategory(slug);
    const params = new URLSearchParams(window.location.search);
    if (slug) {
      params.set('category', slug);
    } else {
      params.delete('category');
    }
    router.replace(`/courses?${params.toString()}`, { scroll: false });
  };

  const filteredCourses = courses.filter((course) => {
    const query = localSearch.trim().toLowerCase();
    const titleAr = course.titleAr || '';
    const titleEn = course.titleEn || '';
    const descAr = course.descriptionAr || '';
    const descEn = course.descriptionEn || '';

    const matchesSearch =
      !query ||
      titleAr.toLowerCase().includes(query) ||
      titleEn.toLowerCase().includes(query) ||
      descAr.toLowerCase().includes(query) ||
      descEn.toLowerCase().includes(query);

    const matchesCategory = (() => {
      if (!activeCategory) return true;

      const activeLower = activeCategory.toLowerCase().trim();

      if (course.category) {
        if (course.category.slug?.toLowerCase().trim() === activeLower) return true;
        if (course.category.nameEn?.toLowerCase().trim() === activeLower) return true;
        if (course.category.nameAr?.trim() === activeCategory.trim()) return true;
        if (course.category.id === activeCategory) return true;
      }

      if (course.categoryId) {
        const matchedCatInList = categories.find(c => c.id === course.categoryId);
        if (matchedCatInList) {
          if (matchedCatInList.slug?.toLowerCase().trim() === activeLower) return true;
          if (matchedCatInList.nameEn?.toLowerCase().trim() === activeLower) return true;
          if (matchedCatInList.nameAr?.trim() === activeCategory.trim()) return true;
          if (matchedCatInList.id === activeCategory) return true;
        }
      }

      if (course.categorySlug?.toLowerCase().trim() === activeLower) return true;

      return false;
    })();

    return matchesSearch && matchesCategory;
  });

  const totalCourses = filteredCourses.length;
  const totalAvailable = courses.length;

  return (
    <div className="space-y-8">
      {/* Header with View Toggle */}
      <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b-2 border-gray-100 dark:border-gray-800/60">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isAr ? 'المساقات المتاحة' : 'Available Courses'}
            </h2>
            <span className="px-3 py-1 text-xs font-bold text-white bg-primary rounded-full shadow-sm shadow-primary/30">
              {totalCourses}
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {isAr ? `عرض ${totalCourses} من أصل ${totalAvailable} مساق` : `Showing ${totalCourses} of ${totalAvailable} courses`}
          </p>
        </div>

        {/* View Toggle Buttons */}
        <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800/50 rounded-xl border border-gray-200/60 dark:border-gray-700/60">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-all duration-300 cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-white dark:bg-gray-700 shadow-sm text-primary'
                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
            }`}
            title={isAr ? 'عرض شبكي' : 'Grid View'}
          >
            <IconGrid className="w-4.5 h-4.5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-all duration-300 cursor-pointer ${
              viewMode === 'list'
                ? 'bg-white dark:bg-gray-700 shadow-sm text-primary'
                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
            }`}
            title={isAr ? 'عرض قائمة' : 'List View'}
          >
            <IconList className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      {/* Filter Section */}
      <div className="relative rounded-2xl bg-white dark:bg-gray-900/50 border border-gray-200/60 dark:border-gray-800/60 shadow-elegant p-6 md:p-8">
        {/* Accent bar — solid, not a gradient */}
        <div className="absolute top-0 left-6 right-6 h-1 bg-primary rounded-full opacity-80" />

        <div className="flex flex-col lg:flex-row gap-5 items-stretch lg:items-center">
          {/* Search Bar */}
          <div className="w-full lg:flex-1 relative">
            <div className={`absolute ${isAr ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-gray-400`}>
              <IconSearch className="w-5 h-5" />
            </div>
            <input
              type="search"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder={isAr ? 'ابحث عن مساق، مهارة، أو موضوع...' : 'Search for a course, skill or topic...'}
              className="w-full text-sm bg-gray-50/80 dark:bg-gray-950/50 border-2 border-gray-200/60 dark:border-gray-700/60 focus:border-primary rounded-xl py-3.5 ps-11 pe-10 outline-none transition-all duration-300 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-4 focus:ring-primary/10"
            />
            {localSearch && (
              <button
                onClick={() => setLocalSearch('')}
                className={`absolute ${isAr ? 'left-3.5' : 'right-3.5'} top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-gray-500 hover:bg-primary hover:text-white transition-all duration-200`}
              >
                <IconX className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Filters */}
          <div className="w-full lg:w-auto flex items-center overflow-x-auto no-scrollbar py-1 gap-2">
            {categories.map((cat) => {
              const isSelected = activeCategory.toLowerCase() === cat.slug?.toLowerCase() || activeCategory.toLowerCase() === cat.nameEn?.toLowerCase();
              const CatIcon = CATEGORY_ICONS[cat.slug] || IconTarget;
              return (
                <button
                  key={cat.id || 'all'}
                  onClick={() => handleCategorySelect(cat.slug)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 whitespace-nowrap cursor-pointer flex items-center gap-2 flex-shrink-0 ${
                    isSelected
                      ? 'bg-primary text-white shadow-sm shadow-primary/30'
                      : 'bg-gray-50/80 dark:bg-gray-800/50 border-2 border-gray-200/60 dark:border-gray-700/60 text-gray-600 dark:text-gray-400 hover:border-primary/40 hover:text-primary hover:-translate-y-0.5'
                  }`}
                >
                  <CatIcon className={`w-4 h-4 transition-transform duration-300 ${isSelected ? 'scale-110' : ''}`} />
                  {isAr ? cat.nameAr : cat.nameEn}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Filters — search uses primary, category uses accent so the two stay visually distinct without leaving the palette */}
        {(localSearch || activeCategory) && (
          <div className="mt-5 pt-4 border-t border-gray-200/60 dark:border-gray-700/60 flex items-center gap-3 flex-wrap">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
              <IconFilter className="w-3.5 h-3.5" />
              {isAr ? 'الفلاتر النشطة:' : 'Active filters:'}
            </span>
            {localSearch && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/5 text-primary text-xs font-semibold border border-primary/20">
                {isAr ? 'بحث:' : 'Search:'} <span className="font-bold">"{localSearch}"</span>
                <button onClick={() => setLocalSearch('')} className="hover:bg-primary/10 rounded-full p-0.5 transition-colors">
                  <IconX className="w-3 h-3" />
                </button>
              </span>
            )}
            {activeCategory && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent/10 text-accent-dark dark:text-accent text-xs font-semibold border border-accent/30">
                {isAr ? 'تصنيف:' : 'Category:'} <span className="font-bold">{categories.find((c) => c.slug?.toLowerCase() === activeCategory.toLowerCase() || c.nameEn?.toLowerCase() === activeCategory.toLowerCase())?.[isAr ? 'nameAr' : 'nameEn'] || activeCategory}</span>
                <button onClick={() => handleCategorySelect('')} className="hover:bg-accent/20 rounded-full p-0.5 transition-colors">
                  <IconX className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              onClick={() => { setLocalSearch(''); handleCategorySelect(''); }}
              className="text-xs text-gray-400 hover:text-primary transition-colors font-semibold cursor-pointer ml-auto"
            >
              {isAr ? 'إعادة ضبط' : 'Reset all'}
            </button>
          </div>
        )}
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 bg-primary/20 rounded-full animate-ping" />
            </div>
          </div>
          <p className="mt-6 text-sm font-medium text-gray-500 dark:text-gray-400 tracking-wider">
            {isAr ? 'جاري تحميل المساقات...' : 'Loading courses...'}
          </p>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="text-center py-24 bg-gray-50/50 dark:bg-gray-900/20 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800">
          <div className="relative inline-block">
            <div className="w-24 h-24 rounded-2xl bg-gray-100 dark:bg-gray-800/60 flex items-center justify-center mx-auto">
              <IconRoute className="w-10 h-10 text-gray-300 dark:text-gray-600" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-sm shadow-primary/30">
              <IconSearch className="w-4 h-4 text-white" />
            </div>
          </div>
          <h3 className="mt-6 text-xl font-bold text-gray-900 dark:text-white">
            {isAr ? 'لم نجد أي مساقات مطابقة' : 'No matching courses found'}
          </h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto px-4">
            {isAr ? 'جرّب تعديل كلمات البحث أو اختيار تصنيف آخر' : 'Try adjusting your search or selecting a different category'}
          </p>
          <button
            onClick={() => { setLocalSearch(''); handleCategorySelect(''); }}
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-light text-white rounded-xl text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 shadow-sm shadow-primary/25 cursor-pointer"
          >
            {isAr ? 'عرض جميع المساقات' : 'View all courses'}
            <IconTrendingUp className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className={`transition-all duration-500 ${
          viewMode === 'grid'
            ? 'grid gap-3 sm:gap-4 md:gap-6 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3'
            : 'flex flex-col gap-4'
        }`}>
          {filteredCourses.map((course, i) => (
            <div
              key={course.id}
              className="opacity-0 animate-fade-in-up"
              style={{ animationDelay: `${(i % 6) * 75}ms`, animationFillMode: 'forwards' }}
            >
              <CourseCard course={course} layout={viewMode} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Main Page — Hero Section                                                   */
/* -------------------------------------------------------------------------- */

export default function CoursesPage() {
  const { language } = useLanguage();
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const isAr = language === 'ar';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300 pb-16">

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white dark:bg-gray-950 border-b border-gray-200/60 dark:border-gray-800/60">

        {/* Background decorative elements — single-tone primary blur, no gradient blend */}
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

        {/* Grid pattern, tinted to match the primary token */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(30,64,175,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(30,64,175,0.12) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="max-w-3xl space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-primary/5 border border-primary/20">
              <IconGraduationCap className="w-4.5 h-4.5 text-primary" />
              <span className="text-xs font-extrabold tracking-widest uppercase text-primary">
                {isAr ? 'استكشف مساقاتنا' : 'Explore Our Courses'}
              </span>
            </div>

            {/* Main Title — solid primary accent instead of a gradient clip */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
              <span className="text-primary">
                {isAr ? 'تعلم' : 'Learn'}
              </span>{' '}
              <span className="text-gray-900 dark:text-white">
                {isAr ? 'المهارات التي تحتاجها' : 'The Skills You Need'}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-xl font-medium">
              {isAr
                ? 'تصفح مجموعتنا الشاملة من المساقات المصممة بعناية لمساعدتك على التميز في مسيرتك الأكاديمية والمهنية'
                : 'Browse our comprehensive collection of carefully designed courses to help you excel in your academic and professional journey'}
            </p>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              {[
                { Icon: IconGraduationCap, value: courses.length, label: isAr ? 'مساقات' : 'Courses' },
                { Icon: IconTrendingUp, value: categories.filter(c => c.id).length, label: isAr ? 'تصنيفات' : 'Categories' },
                { Icon: IconSparkles, value: '100%', label: isAr ? 'تعلم مرن' : 'Flexible' },
              ].map(({ Icon, value, label }, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200/60 dark:border-gray-800/60 shadow-elegant hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-lg font-black text-gray-900 dark:text-white leading-none">
                      {loading ? (
                        <span className="block w-6 h-4 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
                      ) : (
                        value
                      )}
                    </div>
                    <div className="text-xs font-bold text-gray-500 dark:text-gray-400 mt-0.5">{label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 w-full">
        <Suspense
          fallback={
            <div className="flex flex-col items-center justify-center py-32">
              <div className="w-14 h-14 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                {isAr ? 'جاري تحميل المساقات...' : 'Loading courses...'}
              </p>
            </div>
          }
        >
          <CoursesCatalogContent
            courses={courses}
            setCourses={setCourses}
            categories={categories}
            setCategories={setCategories}
            loading={loading}
            setLoading={setLoading}
          />
        </Suspense>
      </div>
    </div>
  );
}