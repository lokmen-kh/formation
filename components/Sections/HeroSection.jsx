"use client";

/**
 * HeroSection - fusion des deux directions :
 * - Composition inspiree de la maquette (blob plein derriere la photo,
 *   badges flottants avec statistiques, pile d avatars + compteur,
 *   strip de features sous le hero).
 * - Aucun degrade : le blob derriere l image est une couleur pleine
 *   (primary), la profondeur vient des ombres (shadow-xl/2xl) et bordures.
 * - Icones SVG maison coherentes avec le reste du fichier.
 */

import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Button } from '../ui/Button';

function IconRoute(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="5" cy="18" r="2" />
      <circle cx="19" cy="6" r="2" />
      <path d="M5 16v-2a4 4 0 0 1 4-4h6a4 4 0 0 0 4-4" />
    </svg>
  );
}

function IconArrowStart(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  );
}

function IconPlay(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M10.5 9l5 3-5 3V9z" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconCheck(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 12l5 5L20 7" />
    </svg>
  );
}

function IconBook(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

function IconTrophy(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M8 4h8v5a4 4 0 0 1-8 0V4z" />
      <path d="M8 5H5a2 2 0 0 0 2 3.5M16 5h3a2 2 0 0 1-2 3.5" />
      <path d="M12 13v3M9 20h6M10 20v-2.5h4V20" />
    </svg>
  );
}

function IconUsers(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="9" cy="8" r="3" />
      <path d="M2.5 19c0-3 3-5.5 6.5-5.5s6.5 2.5 6.5 5.5" />
      <circle cx="17.5" cy="8.5" r="2.3" />
      <path d="M16 13.3c2.6.5 4.5 2.5 4.5 5.2" />
    </svg>
  );
}

function IconChevronDown(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

const AVATAR_COLORS = ['bg-primary/25', 'bg-amber-400/40', 'bg-emerald-400/40', 'bg-rose-400/40'];

export default function HeroSection({ courseCount, loading, trustPoints }) {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  return (
    <section className="relative overflow-hidden border-b border-neutral-100 dark:border-neutral-900 bg-white dark:bg-gray-950 transition-colors duration-300">
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)',
          backgroundSize: '40px 48px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 py-20 sm:py-28 grid grid-cols-1 lg:grid-cols-12 gap-14 items-center">
        <div className="lg:col-span-7 space-y-7">
          <div className="opacity-0 animate-fade-in-up">
            <span className="relative inline-flex items-center gap-2 text-[10px] font-black tracking-widest uppercase text-primary dark:text-primary-light bg-primary/5 dark:bg-primary/10 border border-primary/15 dark:border-primary-light/10 px-3.5 py-2 rounded-full shadow-sm">
              <span className="relative flex items-center justify-center">
                <span className="absolute inline-flex w-3.5 h-3.5 rounded-full bg-primary/40 animate-pulse-ring" />
                <IconRoute className="relative w-3.5 h-3.5" />
              </span>
              {isAr ? 'منصة تعلم اكاديمي ومهني متكاملة' : 'The Best Online Learning Platform'}
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold leading-[1.12] tracking-tight text-gray-900 dark:text-white opacity-0 animate-fade-in-up delay-75">
            {isAr ? (
              <span>
                ارتقِ بمهاراتك مع{' '}
                <span className="relative inline-block text-primary">
                  دورات منظمة
                  <span className="absolute inset-x-0 -bottom-1 h-3 bg-primary/15 dark:bg-primary/25 -z-10 origin-start scale-x-0 animate-underline-grow rounded-sm" />
                </span>{' '}
                نحو مستقبلك
              </span>
            ) : (
              <span>
                Learn New Skills, Advance{' '}
                <span className="relative inline-block text-primary">
                  Your Future
                  <span className="absolute inset-x-0 -bottom-1 h-3 bg-primary/15 dark:bg-primary/25 -z-10 origin-start scale-x-0 animate-underline-grow rounded-sm" />
                </span>
              </span>
            )}
          </h1>

          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-xl leading-relaxed opacity-0 animate-fade-in-up delay-150">
            {isAr
              ? 'مساقات مصممة بعناية بالعربية والانجليزية، ببث فيديو امن ودفع محلي مرن، تفتح دروسها تباعا لتضمن تقدما حقيقيا لا عشوائيا.'
              : 'Carefully structured courses in Arabic and English, secure video streaming, and flexible local payment options, with lessons that unlock in order for real, guided progress.'}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2 opacity-0 animate-fade-in-up delay-300">
            <a href="#catalog" className="group">
              <Button
                variant="primary"
                className="px-6 py-2.5 text-xs inline-flex items-center gap-2 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 active:shadow-md transition-all duration-300"
              >
                {isAr ? 'تصفح الكتالوج' : 'Explore Courses'}
                <IconArrowStart className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </a>
            <a href="#how-it-works"
              className="group inline-flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300 border border-neutral-200 dark:border-neutral-800 px-6 py-2.5 rounded-btn shadow-sm hover:shadow-md hover:border-primary/40 hover:text-primary dark:hover:text-primary-light hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 bg-white dark:bg-gray-900"
            >
              <IconPlay className="w-3.5 h-3.5 transition-transform duration-300 group-hover:scale-110" />
              {isAr ? 'شاهد العرض' : 'Watch Demo'}
            </a>
          </div>

          <div className="flex items-center gap-3 pt-4 opacity-0 animate-fade-in-up delay-300">
            <div className="flex items-center">
              {AVATAR_COLORS.map((color, i) => (
                <span
                  key={i}
                  className={`inline-flex size-9 rounded-full ${color} border-2 border-white dark:border-gray-950 shadow-sm ${i === 0 ? '' : '-ms-3'}`}
                />
              ))}
              <span className="inline-flex items-center justify-center size-9 rounded-full bg-primary text-white text-[10px] font-black border-2 border-white dark:border-gray-950 shadow-sm -ms-3">
                8k+
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight">
              {isAr ? (
                <span>
                  انضم الى <span className="font-bold text-gray-800 dark:text-gray-200">8,000+ طالب</span>
                  <br />
                  يتعلمون معنا حول العالم
                </span>
              ) : (
                <span>
                  Join <span className="font-bold text-gray-800 dark:text-gray-200">8,000+ students</span>
                  <br />
                  worldwide learning with us
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="lg:col-span-5 relative opacity-0 animate-fade-in-up delay-150">
          <div className="absolute -inset-6 rounded-[3rem] bg-primary/90 dark:bg-primary/70 -z-10 rotate-2 shadow-2xl shadow-primary/25" />
          <div
            aria-hidden="true"
            className="absolute -bottom-8 -start-8 w-24 h-24 -z-10 opacity-40 hidden lg:block text-primary"
            style={{
              backgroundImage: 'radial-gradient(circle, currentColor 1.5px, transparent 1.5px)',
              backgroundSize: '10px 10px',
            }}
          />

          <div className="relative rounded-[2.5rem] overflow-hidden border-4 border-white dark:border-gray-950 shadow-2xl shadow-neutral-900/15 dark:shadow-black/40 aspect-[4/5] bg-neutral-100 dark:bg-neutral-900 animate-scale-in">
            <img
              src="/hero-student.jpg"
              alt={isAr ? 'طالب يتابع دورة عبر الانترنت' : 'Student following an online course'}
              className="w-full h-full object-cover"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          </div>

          <div className="absolute -top-5 -start-6 bg-white dark:bg-gray-900 rounded-btn shadow-xl shadow-neutral-900/10 dark:shadow-black/40 border border-neutral-100 dark:border-neutral-800 px-3.5 py-2.5 flex items-center gap-2.5 animate-float-soft hover:shadow-2xl hover:-translate-y-1 transition-shadow duration-300">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-400/15 text-amber-500 shrink-0">
              <IconTrophy className="w-4 h-4" />
            </span>
            <div>
              <p className="text-sm font-black text-gray-900 dark:text-white leading-none">25+</p>
              <p className="text-[9px] text-gray-400 dark:text-gray-500 mt-1">
                {isAr ? 'سنة خبرة' : 'Years of Experience'}
              </p>
            </div>
          </div>

          <div className="absolute top-16 -end-6 bg-white dark:bg-gray-900 rounded-btn shadow-xl shadow-neutral-900/10 dark:shadow-black/40 border border-neutral-100 dark:border-neutral-800 px-3.5 py-2.5 items-center gap-2.5 animate-float-soft hover:shadow-2xl hover:-translate-y-1 transition-shadow duration-300 hidden sm:flex">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light shrink-0">
              <IconBook className="w-4 h-4" />
            </span>
            <div>
              <p className="text-sm font-black text-gray-900 dark:text-white leading-none">
                {loading ? '-' : courseCount}+
              </p>
              <p className="text-[9px] text-gray-400 dark:text-gray-500 mt-1">
                {isAr ? 'دورة منشورة' : 'Premium Courses'}
              </p>
            </div>
          </div>

          <div className="absolute -bottom-5 -end-5 bg-white dark:bg-gray-900 rounded-btn shadow-xl shadow-neutral-900/10 dark:shadow-black/40 border border-neutral-100 dark:border-neutral-800 px-3.5 py-2.5 flex items-center gap-2.5 animate-float-soft hover:shadow-2xl hover:-translate-y-1 transition-shadow duration-300">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-400/15 text-emerald-500 shrink-0">
              <IconUsers className="w-4 h-4" />
            </span>
            <div>
              <p className="text-sm font-black text-gray-900 dark:text-white leading-none">35K+</p>
              <p className="text-[9px] text-gray-400 dark:text-gray-500 mt-1">
                {isAr ? 'طالب مسجل' : 'Students Enrolled'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {trustPoints && trustPoints.length > 0 && (
        <div className="relative max-w-7xl mx-auto px-6 pb-16">
          <div className="bg-white dark:bg-gray-900 border border-neutral-100 dark:border-neutral-800 rounded-card shadow-xl shadow-neutral-900/5 dark:shadow-black/30 px-6 py-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {trustPoints.map((point, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light shrink-0">
                  <IconCheck className="w-4 h-4" />
                </span>
                <span className="text-[11px] font-bold text-gray-600 dark:text-gray-300 leading-tight">{point}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="relative hidden sm:flex justify-center pb-8 opacity-0 animate-fade-in-up delay-500">
        
          <a href="#catalog"
          aria-label={isAr ? 'مرر للاسفل' : 'Scroll down'}
          className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-gray-900 shadow-sm text-gray-400 hover:text-primary hover:shadow-md hover:border-primary/30 transition-all duration-300 animate-bounce-soft"
        >
          <IconChevronDown className="w-4 h-4" />
        </a>
      </div>

      <style jsx>{`
        @keyframes underline-grow {
          to { transform: scaleX(1); }
        }
        .animate-underline-grow {
          animation: underline-grow 0.6s ease-out 0.9s forwards;
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scale-in {
          animation: scale-in 0.6s ease-out forwards;
        }
        @keyframes bounce-soft {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(4px); }
        }
        .animate-bounce-soft {
          animation: bounce-soft 2s ease-in-out infinite;
        }
        @keyframes float-soft {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .animate-float-soft {
          animation: float-soft 4s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}