"use client";

import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useState } from 'react';
import { 
  UserPlus, 
  CreditCard, 
  GraduationCap, 
  ArrowRight, 
  HelpCircle, 
  ChevronDown, 
  ShieldCheck, 
  Tv 
} from 'lucide-react';

/* -------------------------------------------------------------------------- */
/* Composant Accordion réutilisable pour la FAQ                               */
/* -------------------------------------------------------------------------- */
function FaqItem({ question, answer, isOpen, onToggle }) {
  return (
    <div className="border-b border-gray-100 dark:border-gray-900/60 py-4 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between text-start gap-4 font-bold text-sm sm:text-base text-gray-900 dark:text-white transition-colors hover:text-primary cursor-pointer"
      >
        <span>{question}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180 text-primary' : ''}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-48 mt-2.5' : 'max-h-0'}`}>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
          {answer}
        </p>
      </div>
    </div>
  );
}

export default function HowItWorksPage() {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const steps = [
    {
      step: '01',
      Icon: UserPlus,
      titleAr: 'اختر مساقك التعليمي',
      titleEn: '1. Select Your Track',
      descAr: 'تصفح كتالوج المساقات المتوفرة، اختر البرنامج الأنسب لتخصصك واطلع على المنهج الدراسي بكل تفاصيله.',
      descEn: 'Browse our detailed catalog of available tracks, choose the ideal program for your goals, and review its curriculum.'
    },
    {
      step: '02',
      Icon: CreditCard,
      titleAr: 'سدد الاشتراك بأمان',
      titleEn: '2. Secure Subscription',
      descAr: 'اختر طريقة الدفع المفضلة لديك؛ حوالة CCP بريدية (مع رفع الإيصال) أو الدفع الإلكتروني المباشر (SlickPay / الذهبية).',
      descEn: 'Select your preferred checkout method; local CCP postal transfer (by uploading your receipt) or direct e-payment via SlickPay (Edahabia/CIB).'
    },
    {
      step: '03',
      Icon: GraduationCap,
      titleAr: 'ابدأ التعلم فوراً',
      titleEn: '3. Start Learning',
      descAr: 'بمجرد تفعيل حسابك، ستحصل على وصول كامل وغير محدود لجميع الفيديوهات عالية الدقة والملخصات المكتوبة دون أي قيود.',
      descEn: 'Once approved, gain instant, unlimited access to all high-definition videos, quizzes, and written materials in any order.'
    }
  ];

  const faqs = [
    {
      qAr: 'كم يستغرق تفعيل الاشتراك بعد إرسال وصل CCP؟',
      qEn: 'How long does CCP verification take?',
      aAr: 'يتم مراجعة وتأكيد وصولات CCP من قبل الإدارة في غضون 12 إلى 24 ساعة كحد أقصى، وستتلقى إشعاراً بالتفعيل مباشرة في حسابك.',
      aEn: 'CCP payment receipts are verified manually by administrators within 12 to 24 hours. Your access is unlocked immediately upon approval.'
    },
    {
      qAr: 'هل يمكنني الدراسة باستخدام الهاتف المحمول؟',
      qEn: 'Can I study using my mobile phone?',
      aAr: 'نعم بالتأكيد! منصة EduPlus متوافقة بالكامل وتعمل بسلاسة على جميع أجهزة الهواتف الذكية، الأجهزة اللوحية، والحواسيب.',
      aEn: 'Absolutely! The EduPlus platform is fully responsive and optimized to deliver a seamless experience on smartphones, tablets, and desktops.'
    },
    {
      qAr: 'هل يجب علي مشاهدة الدروس بالترتيب؟',
      qEn: 'Do I have to watch lessons sequentially?',
      aAr: 'لا، لقد قمنا بإلغاء ميزة التقييد التدريجي. بمجرد اشتراكك في المساق، يمكنك تصفح ومشاهدة أي درس تريده بحرية تامة.',
      aEn: 'No, we have disabled the sequential progress lock. Subscribed students have unrestricted access to explore any lesson in any order.'
    }
  ];

  return (
    <div className={`min-h-screen bg-[#f8f9fb] dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300 pb-20 ${isAr ? 'font-cairo' : 'font-sans'}`}>
      
      {/* Hero section compacte */}
      <div className="relative overflow-hidden border-b border-gray-150/40 dark:border-gray-900/60 bg-gradient-to-b from-gray-50/50 to-transparent dark:from-gray-950 dark:to-transparent py-12 lg:py-16">
        <div className="absolute top-[-10%] right-[-10%] w-[350px] h-[380px] bg-primary/10 dark:bg-primary/5 rounded-full blur-[110px] pointer-events-none" />
        
        <div className="relative max-w-4xl mx-auto px-6 text-center space-y-4">
          <span className="text-[10px] font-black uppercase text-primary tracking-widest block">
            {isAr ? 'خطوات بسيطة للنجاح' : 'How It Works'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-gray-950 dark:text-white leading-tight">
            {isAr ? 'كيف تبدأ رحلتك التعليمية معنا؟' : 'Your Learning Journey in 3 Steps'}
          </h1>
          <p className="text-xs sm:text-sm text-gray-550 dark:text-gray-400 max-w-xl mx-auto leading-relaxed font-semibold">
            {isAr
              ? 'لقد صممنا تجربة استخدام سهلة ومرنة تراعي ظروف واحتياجات الطالب الجزائري لتنطلق في التعلم بضغطة زر.'
              : 'We structured an intuitive, frictionless onboarding workflow designed specifically to match Algerian student needs.'}
          </p>
        </div>
      </div>

      {/* Étapes illustrées */}
      <div className="max-w-5xl mx-auto px-6 mt-12 space-y-14">
        
        {/* Grille des étapes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((s, idx) => (
            <div key={idx} className="relative bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-slate-150/30 dark:border-gray-850/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-md flex flex-col justify-between overflow-hidden">
              <span className="absolute -top-2 -end-2 text-7xl font-black text-slate-100/60 dark:text-gray-950/20 select-none">
                {s.step}
              </span>
              <div className="relative z-10 space-y-4">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <s.Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-gray-950 dark:text-white">
                    {isAr ? s.titleAr : s.titleEn}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 leading-relaxed font-semibold">
                    {isAr ? s.descAr : s.descEn}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Section FAQ intégrée */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-slate-150/30 dark:border-gray-850/50 p-6 lg:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-gray-100 dark:border-gray-800">
            <HelpCircle className="w-5 h-5 text-primary" />
            <h2 className="text-sm sm:text-base font-black text-gray-950 dark:text-white uppercase tracking-wider">
              {isAr ? 'الأسئلة الشائعة حول المنصة' : 'Frequently Asked Questions'}
            </h2>
          </div>

          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {faqs.map((faq, idx) => (
              <FaqItem
                key={idx}
                question={isAr ? faq.qAr : faq.qEn}
                answer={isAr ? faq.aAr : faq.aEn}
                isOpen={openFaqIndex === idx}
                onToggle={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
              />
            ))}
          </div>
        </div>

        {/* Bannière CTA Finale */}
        <div className="relative rounded-3xl bg-white dark:bg-gray-900 border border-slate-150/30 dark:border-gray-850/50 p-8 lg:p-10 shadow-sm text-center space-y-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
          <div className="max-w-md mx-auto space-y-3 relative z-10">
            <h3 className="text-base sm:text-lg font-black text-gray-950 dark:text-white">
              {isAr ? 'هل أنت جاهز لبدء التعلم؟' : 'Ready to Start Learning?'}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-semibold">
              {isAr
                ? 'انضم اليوم لنخبة من الطلاب الجزائريين المتفوقين في مختلف التخصصات والجامعات.'
                : 'Join a thriving community of outstanding Algerian students across various universities today.'}
            </p>
          </div>
          <div className="pt-2 relative z-10">
            <Link href="/courses">
              <Button className="bg-primary hover:bg-primary/95 text-white font-bold py-3.5 px-8 rounded-2xl text-xs transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg shadow-md cursor-pointer inline-flex items-center gap-2">
                {isAr ? 'تصفح مساقاتنا التدريبية' : 'Explore Training Tracks'}
                <ArrowRight className={`w-4 h-4 text-white ${isAr ? 'rotate-180' : ''}`} />
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}