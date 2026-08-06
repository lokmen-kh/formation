"use client";

import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useState, useEffect } from 'react';

function useInView(threshold = 0.5) {
  const [ref, setRef] = useState(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.disconnect();
      }
    }, { threshold });
    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref, threshold]);

  return [setRef, inView];
}

function CountUp({ target, suffix = '', duration = 1200 }) {
  const [ref, inView] = useInView();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setValue(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {value}{suffix}
    </span>
  );
}

export default function StatsBarSection({ courseCount }) {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const stats = [
    { value: courseCount, suffix: '+', label: isAr ? 'دورة منشورة' : 'Published courses' },
    { value: 140, suffix: '+', label: isAr ? 'طالب مسجل' : 'Registered students' },
    { value: 5, suffix: '/5', label: isAr ? 'متوسط التقييم' : 'Average rating' },
    { value: 92, suffix: '%', label: isAr ? 'معدّل الإكمال' : 'Completion rate' },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-primary via-primary to-blue-700 py-10">
      {/* Décor discret : points, à la manière de la capture */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
          backgroundSize: '18px 18px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
        {stats.map(({ value, suffix, label }, i) => (
          <div
            key={i}
            className={`flex flex-col items-center gap-1 ${
              i !== 0 ? 'sm:border-s sm:border-white/15' : ''
            }`}
          >
            <p className="text-2xl sm:text-3xl font-black text-white leading-none">
              <CountUp target={value} suffix={suffix} />
            </p>
            <p className="text-[11px] font-medium text-white/70 mt-1">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}