"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Button } from './ui/Button';

/* -------------------------------------------------------------------------- */
/* Icônes Linéaires Vectorielles Uniformisées (Style Lucide)                  */
/* -------------------------------------------------------------------------- */

function IconClock(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function IconGraduationCap(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" />
    </svg>
  );
}

function IconArrow(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M5 12h14" />
      <path d="M12 5l7 7-7 7" />
    </svg>
  );
}

function IconStar(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.3l-5.9 3.2 1.2-6.5-4.8-4.6 6.6-.9L12 2.5z" />
    </svg>
  );
}

function IconHeart(props) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 20.5S3.5 15 3.5 8.8C3.5 5.6 6 3.5 8.6 3.5c1.7 0 3.2.9 4.1 2.3.9-1.4 2.4-2.3 4.1-2.3 2.6 0 5.1 2.1 5.1 5.3 0 6.2-8.5 11.7-8.5 11.7z" />
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

function IconSparkles(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2 2-6z" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Remplissage de notation précis (Fractional Star Rating)                    */
/* -------------------------------------------------------------------------- */
export function StarRating({ value = 4.8, className = '' }) {
  const stars = [0, 1, 2, 3, 4];
  return (
    <div className={`flex items-center gap-0.5 ${className}`} aria-label={`${value} / 5`}>
      {stars.map((i) => {
        const fill = Math.max(0, Math.min(1, value - i)) * 100;
        return (
          <span key={i} className="relative inline-block">
            <IconStar className="w-3 h-3 text-gray-200 dark:text-gray-700" />
            <span
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${fill}%` }}
            >
              <IconStar className="w-3 h-3 text-primary" />
            </span>
          </span>
        );
      })}
    </div>
  );
}

export default function CourseCard({ course, layout = 'grid' }) {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const [saved, setSaved] = useState(false);

  const title = isAr ? course.titleAr : course.titleEn;

  const firstOffer = course.offers?.[0];
  const priceActual = firstOffer ? firstOffer.price : 0;
  const priceOld = firstOffer && firstOffer.oldPrice
    ? firstOffer.oldPrice
    : Math.round(priceActual * 1.35);

  const discountPercentage = firstOffer && firstOffer.oldPrice
    ? Math.round((1 - priceActual / firstOffer.oldPrice) * 100)
    : 25;

  const priceFormatter = new Intl.NumberFormat("fr-FR");
  const compactFormatter = new Intl.NumberFormat(isAr ? 'ar' : 'en', { notation: 'compact' });

  const lessonsCount = course.chapters?.reduce((acc, chap) => acc + (chap.lessons?.length || 0), 0) || 0;
  const hoursEstimate = Math.max(1, Math.round(lessonsCount * 1.5));
  const ratingValue = 4.8;
  const studentsCount = course._count?.enrollments || 0;

  const isList = layout === 'list';

  return (
    <article
      className={`group flex h-full flex-col overflow-hidden rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/60 shadow-elegant hover:shadow-lg hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 ${
        isList ? 'flex-row' : ''
      }`}
    >
      {/* Zone média — solid primary-dark, sans dégradé */}
      <div className={`relative overflow-hidden bg-primary-dark ${
        isList ? 'w-48 h-48 shrink-0' : 'h-44'
      }`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl" />

        {course.imageUrl ? (
          <img
            src={course.imageUrl}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <IconBookOpen className="w-16 h-16 text-white/25" />
          </div>
        )}

        <div className="relative z-10 flex items-start justify-between p-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-2.5 py-1 text-[10px] font-black text-gray-700 dark:text-gray-200 shadow-sm select-none border border-gray-200/50 dark:border-gray-700/50">
            <IconClock className="w-3 h-3 text-primary" />
            {hoursEstimate}{isAr ? 'س' : 'h'}
          </span>

          <button
            type="button"
            onClick={() => setSaved((v) => !v)}
            aria-label={isAr ? 'إضافة إلى المفضلة' : 'Save to favorites'}
            aria-pressed={saved}
            className="inline-flex items-center justify-center size-7 rounded-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-sm text-gray-500 hover:text-error transition-colors duration-200 cursor-pointer border border-gray-200/50 dark:border-gray-700/50"
          >
            <IconHeart
              className={`w-3.5 h-3.5 transition-colors duration-200 ${
                saved ? 'fill-error stroke-error' : 'fill-none stroke-current'
              }`}
            />
          </button>
        </div>

        {discountPercentage > 0 && (
          <span className="absolute bottom-3 left-3 z-10 rounded-lg bg-primary px-2.5 py-1 text-[10px] font-black text-white shadow-sm select-none">
            -{discountPercentage}%
          </span>
        )}

        {/* Badge "Premium" en bas à droite */}
        <div className="absolute bottom-3 right-3 z-10">
          <span className="inline-flex items-center gap-1 rounded-lg bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-2 py-0.5 text-[8px] font-black text-primary shadow-sm border border-gray-200/50 dark:border-gray-700/50">
            <IconSparkles className="w-2.5 h-2.5" />
            Premium
          </span>
        </div>
      </div>

      {/* Contenu */}
      <div className={`flex-1 flex flex-col p-4 ${isList ? 'justify-between' : ''}`}>
        <div>
          <h3 className={`font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors line-clamp-2 ${
            isList ? 'text-base' : 'text-sm'
          }`}>
            {title}
          </h3>

          <div className={`flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 font-semibold ${
            isList ? 'mt-2' : 'mt-2.5'
          }`}>
            <span className="inline-flex items-center gap-1.5">
              <IconGraduationCap className="w-3.5 h-3.5 text-gray-400" />
              {lessonsCount} {isAr ? 'درس' : 'Lessons'}
            </span>
          </div>

          <div className={`flex items-center gap-1.5 border-t border-gray-200/50 dark:border-gray-800/50 ${
            isList ? 'mt-3 pt-3' : 'mt-3.5 pt-3.5'
          }`}>
            <StarRating value={ratingValue} />
            <span className="text-xs font-bold text-gray-900 dark:text-gray-100">
              {ratingValue.toFixed(1)}
            </span>
            <span className="text-[10px] text-gray-400">
              ({compactFormatter.format(studentsCount)})
            </span>
          </div>
        </div>

        {/* Tarifs & Bouton */}
        <div className={`flex items-end justify-between ${
          isList ? 'mt-4 pt-3 border-t border-gray-200/50 dark:border-gray-800/50' : 'mt-4'
        }`}>
          <div>
            <p className="text-[10px] text-gray-400 line-through">
              {priceFormatter.format(priceOld)} {isAr ? 'دج' : 'DZD'}
            </p>
            <p className="text-base font-black text-primary leading-none mt-0.5">
              {priceFormatter.format(priceActual)} {isAr ? 'دج' : 'DZD'}
            </p>
          </div>

          <Link href={`/courses/${course.slug}`}>
            <Button
              size="sm"
              className="gap-1.5 text-[10px] font-bold bg-primary hover:bg-primary/90 text-white shadow-sm shadow-primary/25 rounded-xl px-3.5 py-2 transition-all duration-300 hover:-translate-y-0.5 active:scale-95 cursor-pointer"
            >
              {isAr ? 'اشترك' : 'Enroll'}
              <IconArrow className={`w-3 h-3 transition-transform duration-300 transform ${
                isAr ? 'rotate-180 group-hover:-translate-x-0.5' : 'group-hover:translate-x-0.5'
              }`} />
            </Button>
          </Link>
        </div>
      </div>
    </article>
  );
}