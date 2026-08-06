"use client";

import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useState, useRef, useId } from 'react';

function IconChevronDown(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function IconHelpCircle(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.2 9a2.8 2.8 0 0 1 5.4.9c0 1.9-2.6 2-2.6 3.6" />
      <circle cx="12" cy="17" r="0.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function FaqSection({ faqs }) {
  const { language } = useLanguage();
  const [openFaq, setOpenFaq] = useState(0);
  const isAr = language === 'ar';
  const baseId = useId();

  return (
    <section id="faq" className="max-w-3xl mx-auto px-6 py-20 space-y-10">
      <div className="text-center space-y-3">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-primary bg-primary/5 dark:bg-primary/10 border border-primary/15 px-3 py-1.5 rounded-full">
          {isAr ? 'الأسئلة الشائعة' : 'FAQ'}
        </span>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
          {isAr ? 'أسئلة قد تخطر ببالك' : 'Questions you might have'}
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {isAr ? 'كل ما تحتاج معرفته قبل الاشتراك.' : 'Everything you need to know before enrolling.'}
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((item, i) => {
          const isOpen = openFaq === i;
          const panelId = `${baseId}-panel-${i}`;
          const buttonId = `${baseId}-button-${i}`;

          return (
            <div
              key={i}
              className={`border rounded-card bg-white dark:bg-gray-900 overflow-hidden transition-all duration-300 ${
                isOpen
                  ? 'border-primary/30 shadow-md shadow-primary/5'
                  : 'border-neutral-100 dark:border-neutral-900 hover:border-primary/20'
              }`}
            >
              <h3>
                <button
                  id={buttonId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenFaq(isOpen ? -1 : i)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-start cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-inset rounded-card"
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={`inline-flex items-center justify-center size-8 rounded-full shrink-0 transition-colors duration-300 ${
                        isOpen ? 'bg-primary text-white' : 'bg-primary/10 text-primary dark:bg-primary/20'
                      }`}
                    >
                      <IconHelpCircle className="w-4 h-4" />
                    </span>
                    <span
                      className={`text-sm font-bold transition-colors duration-300 ${
                        isOpen ? 'text-primary' : 'text-gray-900 dark:text-white'
                      }`}
                    >
                      {item.q}
                    </span>
                  </span>
                  <IconChevronDown
                    className={`w-4 h-4 shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-primary' : 'text-gray-400'
                    }`}
                  />
                </button>
              </h3>
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                className="grid transition-all duration-300 ease-out"
                style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
              >
                <div className="overflow-hidden">
                  <p className="ps-16 pe-5 pb-4 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                    {item.a}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}