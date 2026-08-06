"use client";

/**
 * FeaturesSection — refonte pour coller à la maquette (bandeau unique,
 * icônes bleues uniformes, séparateurs verticaux entre items) tout en
 * gardant les acquis d'accessibilité de la version précédente :
 * 1. ♿ Chaque carte reste focusable au clavier (`focus-visible:ring-2`),
 *    et `prefers-reduced-motion` désactive les animations d'entrée/survol
 *    via les variantes `motion-reduce:*`.
 * 2. 📐 Un seul conteneur blanc en "bandeau" (comme la maquette), avec
 *    séparateurs verticaux entre les 4 items sur desktop, empilé en
 *    grille 2x2 sur mobile/tablette.
 * 3. ✨ Toutes les icônes partagent la même couleur (primary), avec un
 *    anneau de "pulse" discret au survol/focus — pas de dégradé.
 * 4. 🧩 `useInView` inchangé, avec `aria-hidden` sur le décor.
 */

import { useRef, useState, useEffect } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { IconShieldLock, IconReceiptCard, IconGlobeLanguage, IconRoute } from '../icons';

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: '0px 0px -60px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, inView];
}

/** Registre icône, une seule couleur d'accent (primary) partout, comme la maquette. */
const FEATURE_ICONS = {
  shield: IconShieldLock,
  payment: IconReceiptCard,
  globe: IconGlobeLanguage,
  route: IconRoute,
};

function FeatureItem({ styleKey, title, desc, delay, isLast, isAr }) {
  const [ref, inView] = useInView();
  const Icon = FEATURE_ICONS[styleKey] || IconShieldLock;

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0 ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
      style={{ transitionDelay: inView ? `${delay}ms` : '0ms' }}
    >
      <div
        tabIndex={0}
        className={`group relative flex items-center gap-4 px-5 py-5 sm:px-6 rounded-2xl sm:rounded-none
          transition-colors duration-300 motion-reduce:transition-none
          hover:bg-primary/[0.03] focus-visible:bg-primary/[0.03]
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40
          ${!isLast ? 'sm:border-e sm:border-neutral-100 dark:sm:border-neutral-800' : ''}`}
      >
        <span className="relative inline-flex w-12 h-12 shrink-0">
          {/* Anneau de pulse discret derrière l'icône au survol/focus */}
          <span
            aria-hidden="true"
            className="absolute inset-0 rounded-full bg-primary/10 dark:bg-primary/20 scale-100 opacity-0 group-hover:scale-125 group-hover:opacity-70 group-focus-visible:scale-125 group-focus-visible:opacity-70 transition-all duration-500 motion-reduce:hidden"
          />
          <span
            className="relative inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white shadow-md shadow-primary/20
              transition-transform duration-300 motion-reduce:transition-none group-hover:scale-110 group-focus-visible:scale-110"
          >
            <Icon className="w-5.5 h-5.5" />
          </span>
        </span>

        <div className="space-y-0.5 min-w-0">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-snug">{title}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
        </div>
      </div>
    </div>
  );
}

export default function FeaturesSection({ features }) {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const [headRef, headInView] = useInView(0.4);

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div
        ref={headRef}
        className={`text-center max-w-xl mx-auto space-y-3 mb-12 transition-all duration-700 motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0 ${
          headInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-primary bg-primary/5 dark:bg-primary/10 border border-primary/15 px-3 py-1.5 rounded-full">
          {isAr ? 'مميزات المنصة' : 'Platform benefits'}
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
          {isAr ? 'لماذا تختار منصتنا؟' : 'Why learn with us?'}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {isAr
            ? 'كل ما تحتاجه لتعلم آمن، منظم، وبلا عوائق تقنية أو مادية.'
            : 'Everything you need for secure, structured learning without technical or payment friction.'}
        </p>
      </div>

      {/* Bandeau unique, comme la maquette : un seul conteneur blanc avec separateurs verticaux */}
      <div className="bg-white dark:bg-gray-900 border border-neutral-100 dark:border-neutral-800 rounded-3xl shadow-xl shadow-neutral-900/5 dark:shadow-black/30 overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 divide-neutral-100 dark:divide-neutral-800">
          {features.map((f, i) => (
            <FeatureItem
              key={i}
              styleKey={f.icon}
              title={f.title}
              desc={f.desc}
              delay={i * 100}
              isLast={i === features.length - 1}
              isAr={isAr}
            />
          ))}
        </div>
      </div>
    </section>
  );
}