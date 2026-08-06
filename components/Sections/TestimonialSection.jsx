"use client";

import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '../ui/Button';

function IconStar(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.3l-5.9 3.2 1.2-6.5-4.8-4.6 6.6-.9L12 2.5z" />
    </svg>
  );
}

function IconQuote(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M9.5 6.5C6 6.5 3.5 9.2 3.5 12.8c0 3 1.9 5.2 4.5 5.2 2.1 0 3.6-1.5 3.6-3.5 0-1.8-1.2-3.1-2.9-3.3.3-1.8 1.9-3.1 3.8-3.3l-3-1.4zM19 6.5c-3.5 0-6 2.7-6 6.3 0 3 1.9 5.2 4.5 5.2 2.1 0 3.6-1.5 3.6-3.5 0-1.8-1.2-3.1-2.9-3.3.3-1.8 1.9-3.1 3.8-3.3l-3-1.4z" />
    </svg>
  );
}

export default function TestimonialSection({ feedbacks, scrollFeedbacks, feedbackScrollRef }) {
  const { language } = useLanguage();
  const [ratingInput, setRatingInput] = useState(0);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const isAr = language === 'ar';

  const updateActiveIndex = useCallback(() => {
    const el = feedbackScrollRef?.current;
    if (!el || !el.children.length) return;
    const cards = Array.from(el.children);
    const containerCenter = el.scrollLeft + el.clientWidth / 2;
    let closest = 0;
    let closestDist = Infinity;
    cards.forEach((card, i) => {
      const cardCenter = card.offsetLeft + card.clientWidth / 2;
      const dist = Math.abs(cardCenter - containerCenter);
      if (dist < closestDist) {
        closestDist = dist;
        closest = i;
      }
    });
    setActiveIndex(closest);
  }, [feedbackScrollRef]);

  useEffect(() => {
    const el = feedbackScrollRef?.current;
    if (!el) return;
    updateActiveIndex();
    el.addEventListener('scroll', updateActiveIndex, { passive: true });
    return () => el.removeEventListener('scroll', updateActiveIndex);
  }, [feedbackScrollRef, updateActiveIndex]);

  const scrollToIndex = (i) => {
    const el = feedbackScrollRef?.current;
    if (!el || !el.children[i]) return;
    const card = el.children[i];
    el.scrollTo({ left: card.offsetLeft - (el.clientWidth - card.clientWidth) / 2, behavior: 'smooth' });
  };

  return (
    <section className="bg-neutral-50/50 dark:bg-gray-900/10 py-16 border-t border-b border-neutral-100 dark:border-neutral-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 text-center md:text-start">
          <div className="space-y-1.5 mx-auto md:mx-0">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-primary bg-primary/5 dark:bg-primary/10 border border-primary/15 px-3 py-1.5 rounded-full">
              {isAr ? 'آراء الطلاب' : 'Testimonials'}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white leading-tight">
              {isAr ? 'ماذا يقول طلابنا؟' : 'What our students say'}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-normal max-w-md">
              {isAr ? 'تجارب واقعية لطلابنا الملتحقين بالمنصة من مختلف الولايات والجامعات.' : 'Real stories from our students learning from different regions and universities.'}
            </p>
          </div>
          <div className="hidden md:flex gap-2 shrink-0">
            <button onClick={() => scrollFeedbacks('left')} className="p-2 rounded-full border border-neutral-200 dark:border-neutral-800 hover:bg-white dark:hover:bg-gray-900 hover:border-primary/30 text-gray-600 dark:text-gray-400 cursor-pointer shadow-sm active:scale-95 transition-all" aria-label="Scroll left">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="15 18 9 12 15 6" /></svg>
            </button>
            <button onClick={() => scrollFeedbacks('right')} className="p-2 rounded-full border border-neutral-200 dark:border-neutral-800 hover:bg-white dark:hover:bg-gray-900 hover:border-primary/30 text-gray-600 dark:text-gray-400 cursor-pointer shadow-sm active:scale-95 transition-all" aria-label="Scroll right">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="9 18 15 12 9 6" /></svg>
            </button>
          </div>
        </div>

        <div ref={feedbackScrollRef} className="flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-none pb-2" style={{ WebkitOverflowScrolling: 'touch' }}>
          {feedbacks.map((f, i) => (
            <div key={i} className="relative snap-center shrink-0 w-[280px] sm:w-[330px] bg-white dark:bg-gray-900 p-6 pt-8 rounded-card border border-neutral-100 dark:border-neutral-900 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow duration-300">
              {/* Guillemet decoratif, comme la maquette */}
              <IconQuote aria-hidden="true" className="absolute top-4 end-5 w-7 h-7 text-primary/10 dark:text-primary/15" />

              <div className="space-y-3">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, idx) => (
                    <IconStar key={idx} className="w-3 h-3 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed italic">{f.quote}</p>
              </div>
              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-850">
                <div className="w-8 h-8 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center font-black text-xs text-primary dark:text-primary-light shrink-0">
                  {f.avatar}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white leading-none">{f.name}</h4>
                  <span className="text-[10px] text-gray-450 dark:text-gray-500 mt-1 block">{f.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination a points, comme la maquette */}
        {feedbacks.length > 1 && (
          <div className="flex items-center justify-center gap-1.5">
            {feedbacks.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollToIndex(i)}
                aria-label={isAr ? `الانتقال إلى الرأي ${i + 1}` : `Go to testimonial ${i + 1}`}
                aria-current={activeIndex === i}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  activeIndex === i ? 'w-6 bg-primary' : 'w-1.5 bg-neutral-200 dark:bg-neutral-800 hover:bg-primary/40'
                }`}
              />
            ))}
          </div>
        )}

        {/* Boutons fleche mobile, sous la pagination puisque caches en haut sur petit ecran */}
        <div className="flex md:hidden justify-center gap-2 -mt-2">
          <button onClick={() => scrollFeedbacks('left')} className="p-2 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 cursor-pointer shadow-sm active:scale-95 transition-all" aria-label="Scroll left">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
          <button onClick={() => scrollFeedbacks('right')} className="p-2 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 cursor-pointer shadow-sm active:scale-95 transition-all" aria-label="Scroll right">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="9 18 15 12 9 6" /></svg>
          </button>
        </div>

        {/* Bloc interactif d'avis étudiant */}
        <div className="max-w-lg mx-auto mt-4 bg-white dark:bg-gray-900 rounded-card border border-neutral-100 dark:border-neutral-900 shadow-sm p-6 text-center space-y-4">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">
            {isAr ? 'شاركنا رأيك' : 'Leave your feedback'}
          </h3>
          <p className="text-[11px] text-gray-400 dark:text-gray-500">
            {isAr ? 'رأيك يساعدنا على تحسين المنصة باستمرار.' : 'Your feedback helps us keep improving the platform.'}
          </p>
          {feedbackSent ? (
            <p className="text-xs font-semibold text-success">
              {isAr ? 'شكراً لك، تم استلام تقييمك!' : 'Thank you, your feedback was received!'}
            </p>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-center gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} onClick={() => setRatingInput(n)} aria-label={`${n} star`} className="transition-transform duration-150 hover:scale-125 cursor-pointer">
                    <IconStar className={`w-6 h-6 ${n <= ratingInput ? 'text-amber-400' : 'text-neutral-200 dark:text-neutral-700'}`} />
                  </button>
                ))}
              </div>
              <textarea
                rows={3}
                placeholder={isAr ? 'اكتب رأيك هنا...' : 'Write your feedback here...'}
                className="w-full text-xs rounded-btn border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-gray-950 p-3 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all text-gray-700 dark:text-gray-300"
              />
              <Button variant="primary" className="w-full py-2.5 text-xs hover:-translate-y-0.5" onClick={() => setFeedbackSent(true)}>
                {isAr ? 'إرسال التقييم' : 'Submit feedback'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}