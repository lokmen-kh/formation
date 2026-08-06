"use client";

import { useLanguage } from '@/lib/i18n/LanguageContext';
import { FileText, Shield, CreditCard, Clock } from 'lucide-react';

export default function TermsPage() {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const sections = [
    {
      Icon: FileText,
      titleAr: '1. شروط إنشاء الحساب',
      titleEn: '1. Account Registration',
      descAr: 'يلتزم المستخدم بتقديم معلومات دقيقة وصحيحة عند التسجيل بالمنصة، ويتحمل المسؤولية الكاملة عن سرية بيانات تسجيل الدخول الخاصة بحسابه.',
      descEn: 'Users are required to provide accurate, correct information upon registration, and remain fully responsible for maintaining login credential confidentiality.'
    },
    {
      Icon: CreditCard,
      titleAr: '2. شروط الدفع والوصولات المحلية (CCP / بريدي موب)',
      titleEn: '2. Local Payments & Receipts (CCP / BaridiMob)',
      descAr: 'يتعين على الطالب إرسال صورة واضحة لإيصال الدفع البريدي (CCP) عند طلب الاشتراك. يحق لإدارة المنصة رفض الطلب أو إلغاؤه في حال عدم وضوح الإيصال أو ثبوت عدم صحته.',
      descEn: 'Students must upload a legible copy of their CCP payment receipt. Platform administrators reserve the right to decline any subscription request if the receipt is invalid or unclear.'
    },
    {
      Icon: Clock,
      titleAr: '3. نظام الاشتراكات وتاريخ انتهاء الصلاحية',
      titleEn: '3. Subscription Expirations & Access Rules',
      descAr: 'الاشتراكات في العروض دورية ومحددة المدة بالشهور بناءً على خطة الشراء المعتمدة. عند انتهاء مدة الصلاحية، يتم تعليق الوصول تلقائياً ما لم يتم تجديد الاشتراك.',
      descEn: 'Subscriptions correspond to strict periodic billing plans calculated in months. Upon expiration, access to course contents is automatically suspended unless a renewal is submitted.'
    },
    {
      Icon: Shield,
      titleAr: '4. حماية المحتوى والملكية الفكرية',
      titleEn: '4. Copyrights & Security Policies',
      descAr: 'جميع الفيديوهات والملخصات المكتوبة والمحتويات المعروضة على EduPlus محمية بموجب قوانين الملكية الفكرية، ويُمنع منعاً باتاً مشاركة الحساب أو إعادة تسجيل أو توزيع أي محتوى خارج المنصة.',
      descEn: 'All HD videos, written outlines, and materials are copyrighted assets of EduPlus. Account sharing, recording, or unauthorized content distribution outside the platform is strictly prohibited.'
    }
  ];

  return (
    <div className={`min-h-screen bg-[#f8f9fb] dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300 pb-20 ${isAr ? 'font-cairo' : 'font-sans'}`}>
      
      {/* Header Compact */}
      <div className="relative overflow-hidden border-b border-gray-150/40 dark:border-gray-900/60 bg-gradient-to-b from-gray-50/50 to-transparent dark:from-gray-950 dark:to-transparent py-12 lg:py-16">
        <div className="absolute top-[-10%] right-[-10%] w-[350px] h-[380px] bg-primary/10 dark:bg-primary/5 rounded-full blur-[110px] pointer-events-none" />
        
        <div className="relative max-w-4xl mx-auto px-6 text-center space-y-3">
          <span className="text-[10px] font-black uppercase text-primary tracking-widest block">
            {isAr ? 'سياسة الاستخدام والقوانين' : 'Terms & Conditions'}
          </span>
          <h1 className="text-3xl font-black tracking-tight text-gray-950 dark:text-white">
            {isAr ? 'شروط وأحكام استخدام المنصة' : 'Platform Terms of Use'}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
            {isAr
              ? 'يرجى قراءة هذه الشروط بعناية قبل تفعيل حسابك أو الاشتراك في أي مساق لضمان حقوقك وسلامة استخدامك.'
              : 'Please read these guidelines thoroughly before completing your subscription to protect your rights and ensure fair platform usage.'}
          </p>
        </div>
      </div>

      {/* Liste des sections de règles */}
      <div className="max-w-4xl mx-auto px-6 mt-12 space-y-8">
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-slate-150/40 dark:border-gray-850/50 p-6 lg:p-8 shadow-sm divide-y divide-gray-100 dark:divide-gray-800">
          {sections.map((s, idx) => (
            <div key={idx} className={`py-6 first:pt-0 last:pb-0 flex gap-4 items-start ${isAr ? 'text-right' : 'text-left'}`}>
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                <s.Icon className="w-5 h-5" />
              </div>
              <div className="space-y-1.5 flex-1">
                <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                  {isAr ? s.titleAr : s.titleEn}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-semibold">
                  {isAr ? s.descAr : s.descEn}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}