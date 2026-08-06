"use client";

/**
 * Reveal + StarRating — convertis depuis TS vers JSX.
 * Reveal : fade-in au scroll (IntersectionObserver), même logique que déjà utilisée ailleurs.
 * StarRating : affiche 5 étoiles avec remplissage proportionnel à `value` (ex: 4.6/5).
 */

import { useRef, useState, useEffect } from 'react';
import { IconStar } from './icons';

export function useInView(threshold = 0.15) {
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

export function Reveal({ children, delay = 0, className = '' }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out will-change-transform ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } ${className}`}
      style={{ transitionDelay: inView ? `${delay}ms` : '0ms' }}
    >
      {children}
    </div>
  );
}

/**
 * StarRating — value entre 0 et 5 (ex: 4.6).
 * Chaque étoile est remplie proportionnellement via un clip-path en largeur,
 * pour un rendu précis (4.6 affiche bien 92% de la 5e étoile remplie).
 */
export function StarRating({ value = 0, className = '' }) {
  const stars = [0, 1, 2, 3, 4];
  return (
    <div className={`flex items-center gap-0.5 ${className}`} aria-label={`${value} / 5`}>
      {stars.map((i) => {
        const fill = Math.max(0, Math.min(1, value - i)) * 100;
        return (
          <span key={i} className="relative inline-block">
            <IconStar className="w-3.5 h-3.5 text-neutral-200 dark:text-neutral-700" />
            <span
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${fill}%` }}
            >
              <IconStar className="w-3.5 h-3.5 text-amber-400" />
            </span>
          </span>
        );
      })}
    </div>
  );
}