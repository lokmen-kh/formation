"use client";

import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { Target, Users, BookOpen, ShieldCheck, ArrowRight, Award } from 'lucide-react';

export default function AboutPage() {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const pillars = [
    {
      Icon: Target,
      titleAr: 'توجيه أكاديمي مخصص',
      titleEn: 'Guided Academic Path',
      descAr: 'نصمم مسارات تدريبية واضحة ومبنية علمياً لمرافقة الطالب الجزائري خطوة بخطوة نحو التميز الدراسي.',
      descEn: 'We design clear, scientifically structured learning tracks to guide students step-by-step toward academic excellence.'
    },
    {
      Icon: Users,
      titleAr: 'نخبة من الأساتذة والمدربين',
      titleEn: 'Elite Instructors',
      descAr: 'نتعاون مع أفضل الكفاءات الأكاديمية والمهنية المعتمدة لتقديم محتوى ثنائي اللغة عالي الجودة.',
      descEn: 'We collaborate with certified academic and professional experts to deliver premium bilingual educational content.'
    },
    {
      Icon: Award,
      titleAr: 'مرونة الدفع المحلي والدعم',
      titleEn: 'Flexible Local Payments',
      descAr: 'ندعم خيارات الدفع المحلية السهلة كحسابات CCP وبريدي موب لضمان وصول المعرفة للجميع دون عوائق.',
      descEn: 'We support accessible local payment gateways like CCP and BaridiMob, making high-end education available to all.'
    }
  ];

  return (
    <div className={`min-h-screen bg-[#f8f9fb] dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300 pb-20 ${isAr ? 'font-cairo' : 'font-sans'}`}>
      
      {/* Hero section miniature */}
      <div className="relative overflow-hidden border-b border-gray-150/40 dark:border-gray-900/60 bg-gradient-to-b from-gray-50/50 to-transparent dark:from-gray-950 dark:to-transparent py-12 lg:py-16">
        <div className="absolute top-[-10%] right-[-10%] w-[350px] h-[380px] bg-primary/10 dark:bg-primary/5 rounded-full blur-[110px] pointer-events-none" />
        
        <div className="relative max-w-5xl mx-auto px-6 text-center space-y-4">
          <span className="text-[10px] font-black uppercase text-primary tracking-widest block">
            {isAr ? 'قصتنا ورسالتنا' : 'Our Story & Mission'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-gray-950 dark:text-white">
            {isAr ? 'تعرّف على منصة EduPlus' : 'About EduPlus Platform'}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-xl mx-auto leading-relaxed">
            {isAr
              ? 'مبادرة تعليمية رائدة برعاية مؤسسة رساليون (الجزائر)، نسعى من خلالها لتوفير تعليم أكاديمي عالي الجودة بطرق دفع مرنة ومحتوى ثنائي اللغة.'
              : 'A pioneering educational initiative by Rissalioune Foundation (Algeria), designed to deliver high-quality bilingual academic courses with flexible payment options.'}
          </p>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-5xl mx-auto px-6 mt-12 space-y-12">
        
        {/* Grille de piliers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((p, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-slate-150/40 dark:border-gray-850/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4">
                <p.Icon className="w-5 h-5" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-gray-950 dark:text-white mb-2">
                {isAr ? p.titleAr : p.titleEn}
              </h3>
              <p className="text-xs text-gray-550 dark:text-gray-400 leading-relaxed font-semibold">
                {isAr ? p.descAr : p.descEn}
              </p>
            </div>
          ))}
        </div>

        {/* Section vision de la fondation */}
        <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-slate-150/40 dark:border-gray-850/50 shadow-sm flex flex-col md:flex-row gap-8 items-center">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h3 className="text-base font-black text-gray-950 dark:text-white">
              {isAr ? 'التزامنا نحو جيل البوصلة 2026' : 'Our Commitment to Boussole 2026'}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-semibold">
              {isAr
                ? 'نهدف في EduPlus إلى بناء بيئة دراسية متكاملة تضمن حصول كل متعلم جزائري على الدعم الكافي لتحقيق التميز الدراسي والمهني، عبر تقديم ملخصات مكتوبة دقيقة ومقاطع فيديو عالية الدقة تتبع التقدم خطوة بخطوة.'
                : 'At EduPlus, we aim to build a comprehensive learning ecosystem that guarantees Algerian students get necessary academic support to thrive, providing clean bilingual syllabus and detailed high-definition visual guides.'}
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center pt-4">
          <Link href="/courses">
            <Button className="bg-primary hover:bg-primary/95 text-white font-bold py-3.5 px-8 rounded-2xl text-xs transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg shadow-md cursor-pointer inline-flex items-center gap-2">
              {isAr ? 'تصفح مساقاتنا التدريبية' : 'Explore Training Tracks'}
              <ArrowRight className={`w-4 h-4 text-white ${isAr ? 'rotate-180' : ''}`} />
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
}