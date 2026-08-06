"use client";

import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import CourseCard from '@/components/CourseCard';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
// Imports des sections modulaires réutilisables
import HeroSection from '@/components/Sections/HeroSection';
import StatsBarSection from '@/components/Sections/StatsBarSection';
import FeaturesSection from '@/components/Sections/FeaturesSection';
import FaqSection from '@/components/Sections/FaqSection';
import TestimonialSection from '@/components/Sections/TestimonialSection';
import { Button } from '@/components/ui/Button';

/* -------------------------------------------------------------------------- */
/* Icônes Linéaires Vectorielles Unifiées (Style Lucide)                       */
/* -------------------------------------------------------------------------- */

function IconShieldLock(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function IconReceiptCard(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="6" width="18" height="13" rx="1.5" />
      <path d="M3 10h18" />
      <path d="M7 14.5h4" />
      <path d="M7 17h2" />
    </svg>
  );
}

function IconGlobeLanguage(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17" />
      <path d="M12 3.5c2.4 2.3 3.6 5.2 3.6 8.5S14.4 18.2 12 20.5" />
      <path d="M12 3.5c-2.4 2.3-3.6 5.2-3.6 8.5s1.2 6.2 3.6 8.5" />
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

function IconGraduationCap(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" />
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

function IconArrowRight(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M5 12h14" />
      <path d="M12 5l7 7-7 7" />
    </svg>
  );
}

export default function HomePage() {
  const { language, t } = useLanguage();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const feedbackScrollRef = useRef(null);

  useEffect(() => {
    fetch('/api/public/courses')
      .then((res) => res.json())
      .then((data) => {
        if (data.courses) setCourses(data.courses);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const isAr = language === 'ar';

  const scrollFeedbacks = (direction) => {
    if (feedbackScrollRef.current) {
      const { scrollLeft, clientWidth } = feedbackScrollRef.current;
      const scrollOffset = clientWidth * 0.75;
      const factor = isAr ? -1 : 1;
      const offset = direction === 'left' ? -scrollOffset * factor : scrollOffset * factor;
      feedbackScrollRef.current.scrollTo({ left: scrollLeft + offset, behavior: 'smooth' });
    }
  };

  const features = isAr
    ? [
        { Icon: IconShieldLock, title: 'بث فيديو آمن ومشفر', desc: 'نعتمد على بنية بث محمية لحماية الفيديوهات من النسخ والتنزيل غير المصرح به، مع أداء ثابت على جميع الأجهزة.' },
        { Icon: IconReceiptCard, title: 'طرق دفع محلية مرنة', desc: 'اشترك عبر تحميل إيصال تحويل CCP، أو أرسل طلبك مباشرة عبر واتساب — بدون تعقيد.' },
        { Icon: IconGlobeLanguage, title: 'منهج ثنائي اللغة', desc: 'تصفح المنصة والدروس المكتوبة والملخصات بسلاسة تامة بالعربية والإنجليزية، بضغطة زر واحدة.' },
        { Icon: IconRoute, title: 'تتبع ذكي للمسار الدراسي', desc: 'تُفتح الدروس تباعاً فور إتمام متطلباتها السابقة، مع حفظ تلقائي لنسبة تقدمك في كل فيديو لتستأنف من حيث توقفت.' },
      ]
    : [
        { Icon: IconShieldLock, title: 'Secure Encrypted Streaming', desc: 'Built on protected streaming infrastructure to keep course videos safe from unauthorized downloads, with stable playback on every device.' },
        { Icon: IconReceiptCard, title: 'Flexible Local Payments', desc: 'Enroll with a manual CCP transfer receipt, or send your request directly via WhatsApp — no friction.' },
        { Icon: IconGlobeLanguage, title: 'Bilingual Curriculum', desc: 'Every lesson, written note, and exercise is available in both Arabic and English, switchable with a single click.' },
        { Icon: IconRoute, title: 'Sequential Learning Path', desc: 'Lessons unlock automatically as you complete their prerequisites, with your playback progress saved so you can resume exactly where you left off.' },
      ];

  const steps = isAr
    ? [
        { title: 'اختر مسارك', desc: 'تصفح الكتالوج واشترك في المساق الذي يناسب هدفك الدراسي أو المهني.' },
        { title: 'تعلّم بتسلسل منطقي', desc: 'تُفتح الدروس تباعاً وفق تقدمك، دون تشتت أو قفز عشوائي بين المواضيع.' },
        { title: 'تتبع تقدمك واستأنف بسهولة', desc: 'راقب نسبة إنجازك في كل فيديو واستأنف من حيث توقفت في أي وقت خلال مدة اشتراكك.' },
      ]
    : [
        { title: 'Choose your track', desc: 'Browse the catalog and enroll in the course that fits your academic or professional goal.' },
        { title: 'Learn in sequence', desc: 'Lessons unlock one after another as you progress, so nothing gets skipped or rushed.' },
        { title: 'Track your progress', desc: 'Follow your completion percentage on every video and resume exactly where you stopped, for your whole subscription period.' },
      ];

  const feedbacks = isAr
    ? [
        { name: 'سهام ب. (بومرداس)', role: 'طالبة هندسة', avatar: 'S', quote: 'نظام فتح الدروس التدريجي ساعدني على الالتزام بالبرنامج خطوة بخطوة دون تشتت.' },
        { name: 'أمين خ. (الجزائر العاصمة)', role: 'تخصص علوم الحاسوب', avatar: 'A', quote: 'الاشتراك عبر واتساب كان سريعاً وسهلاً جداً. المحتوى العلمي والملخصات المكتوبة ذات جودة ممتازة.' },
        { name: 'مريم م. (قسنطينة)', role: 'طالبة طب', avatar: 'M', quote: 'حماية الفيديوهات وسرعة البث ممتازة ولا تستهلك الكثير من البيانات.' },
        { name: 'رياض ت. (وهران)', role: 'تخصص لغات أجنبية', avatar: 'R', quote: 'التنقل بين اللغتين العربية والإنجليزية بضغطة زر واحدة رائع ويساعد كثيراً في فهم المصطلحات التقنية.' },
      ]
    : [
        { name: 'Siham B. (Boumerdes)', role: 'Engineering Student', avatar: 'S', quote: 'The progressive lesson locking kept me highly focused on one goal at a time.' },
        { name: 'Amine K. (Algiers)', role: 'Computer Science Student', avatar: 'A', quote: 'Enrolling via WhatsApp was fast and simple. The written summaries are outstanding.' },
        { name: 'Meriem M. (Constantine)', role: 'Medical Student', avatar: 'M', quote: 'Excellent video streaming quality with robust security, and light on data usage.' },
        { name: 'Ryad T. (Oran)', role: 'Foreign Languages Student', avatar: 'R', quote: 'Switching between Arabic and English with a single click makes learning technical terms easy.' },
      ];

  const trustPoints = isAr
    ? ['محتوى من مدربين متخصصين', 'دفع محلي 100%', 'وصول كامل طوال مدة اشتراكك']
    : ['Content by certified instructors', '100% local payment options', 'Full access for your whole subscription'];

  const faqs = isAr
    ? [
        { q: 'كيف أشترك في دورة؟', a: 'اختر الدورة والباقة (شهري أو سنوي)، أنشئ حسابًا، ثم ارفع وصل الدفع أو أرسله عبر واتساب. بعد موافقة الإدارة، يُفتح وصولك فورًا.' },
        { q: 'ما طرق الدفع المتوفرة؟', a: 'حاليًا: تحويل CCP مع رفع صورة الوصل, أو التواصل المباشر عبر واتساب لإتمام الدفع وتأكيد الطلب.' },
        { q: 'هل وصولي للدورة محدود بمدة؟', a: 'نعم، الوصول مرتبط بمدة اشتراكك (شهري أو سنوي) لكل دورة على حدة. يمكنك التجديد بسهولة قبل انتهاء المدة أو بعدها.' },
        { q: 'هل الدورات متوفرة بالعربية؟', a: 'نعم، كل دورة تتضمن فيديوهات وملخصات كتابية بالعربية والإنجليزية، وتقدر تبدّل اللغة من أي صفحة.' },
      ]
    : [
        { q: 'How do I enroll in a course?', a: 'Pick a course and a plan (monthly or yearly), create an account, then upload your payment receipt or send it via WhatsApp. Once approved, your access opens immediately.' },
        { q: 'Which payment methods are supported?', a: 'Currently: CCP bank transfer with receipt upload, or direct WhatsApp contact to complete payment and confirm your request.' },
        { q: 'Is my access time-limited?', a: 'Yes — access follows your subscription period (monthly or yearly) for each individual course. You can renew easily before or after it ends.' },
        { q: 'Are the courses available in Arabic?', a: 'Yes, every course includes videos and written summaries in both Arabic and English, switchable from any page.' },
      ];

  return (
    <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      
      {/* 1. Hero Section */}
      <HeroSection 
        courseCount={courses.length} 
        loading={loading} 
        trustPoints={trustPoints} 
      />

      {/* 2. Barre de Statistiques Dynamique */}
      <StatsBarSection courseCount={courses.length} />

      {/* 3. Section Atouts Bento */}
      <FeaturesSection features={features} />

      {/* 4. Carrousel de Témoignages & Formulaire d'Avis */}
      <TestimonialSection 
        feedbacks={feedbacks} 
        scrollFeedbacks={scrollFeedbacks} 
        feedbackScrollRef={feedbackScrollRef} 
      />

      {/* 5. Catalogue Complet de tous les Cours - Amélioré */}
      <main id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16 space-y-8 animate-fade-in-up delay-300 opacity-0">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-gray-200 dark:border-gray-800/60 pb-4">
          <div>
            <span className="inline-flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 border border-blue-200/50 dark:border-blue-800/50 px-3.5 py-1.5 rounded-full mb-2">
              <IconGraduationCap className="w-3.5 h-3.5 text-blue-500" />
              <span>{isAr ? 'جميع المساقات المتاحة للاشتراك' : 'All Available Training Tracks'}</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white leading-tight">
              {isAr ? 'اختر مساقك وابدأ التعلم الآن' : 'Choose Your Track & Start Learning'}
            </h2>
          </div>
          
          <Link href="/courses" className="shrink-0">
            <Button variant="outline" className="gap-2 text-xs font-bold border-2 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:border-blue-400 dark:hover:border-blue-600 rounded-xl px-4 py-2 transition-all duration-300 hover:scale-105">
              {isAr ? 'عرض الكل' : 'View All'}
              <IconArrowRight className={`w-3.5 h-3.5 transition-transform ${isAr ? 'rotate-180' : ''}`} />
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-blue-200 dark:border-blue-900/50 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-4 h-4 bg-blue-500/20 rounded-full animate-ping" />
              </div>
            </div>
            <p className="mt-4 text-sm font-medium text-gray-500 dark:text-gray-400">
              {isAr ? 'جاري تحميل المساقات...' : 'Loading courses...'}
            </p>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-900/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800 max-w-lg mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center mx-auto">
              <IconRoute className="w-8 h-8 text-blue-400" />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isAr ? 'لا توجد مساقات منشورة حالياً.' : 'No courses are published yet.'}
            </p>
            <p className="text-xs text-gray-400">
              {isAr ? 'ترقبوا قريباً إضافة مساقات جديدة' : 'Stay tuned for new courses coming soon'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6">
            {courses.slice(0, 6).map((course, i) => (
              <div
                key={course.id}
                className="opacity-0 animate-fade-in-up"
                style={{ animationDelay: `${(i % 6) * 75}ms`, animationFillMode: 'forwards' }}
              >
                <CourseCard course={course} />
              </div>
            ))}
          </div>
        )}

        {courses.length > 6 && (
          <div className="text-center pt-4">
            <Link href="/courses">
              <Button className="gap-2 text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 rounded-xl px-6 py-2.5 transition-all duration-300 hover:scale-105">
                {isAr ? 'استكشاف جميع المساقات' : 'Explore All Courses'}
                <IconArrowRight className={`w-4 h-4 transition-transform ${isAr ? 'rotate-180' : ''}`} />
              </Button>
            </Link>
          </div>
        )}
      </main>

      {/* 6. Accordéon FAQ */}
      <FaqSection faqs={faqs} />
    </div>
  );
}