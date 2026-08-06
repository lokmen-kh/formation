"use client";

import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Shield, Database, Lock, EyeClosedIcon } from 'lucide-react';

export default function PrivacyPage() {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const sections = [
    {
      Icon: Database,
      titleAr: '1. البيانات التي نجمعها',
      titleEn: '1. Data Collection',
      descAr: 'نقوم بجمع البيانات الشخصية الأساسية كالاسم الكامل، البريد الإلكتروني، ورقم الهاتف، بالإضافة إلى صور إيصالات الدفع لغرض تفعيل وتأكيد اشتراكاتك بالمنصة.',
      descEn: 'We collect minimal necessary personal parameters like fullName, email address, phone number, alongside payment receipt files solely to authorize and confirm platform access.'
    },
    {
      Icon: Lock,
      titleAr: '2. أمن وحماية البيانات الشخصية',
      titleEn: '2. Data Security & Storage',
      descAr: 'نحن نطبق إجراءات أمنية وحماية تشفير متقدمة لحماية بياناتك من أي وصول غير مصرح به أو تلف أو تسريب، ولا نبيع أو نشارك معلوماتك مع أي جهات خارجية.',
      descEn: 'We implement advanced encryption routines and security layers to protect your personal information against unauthorized disclosure. Your data is never sold or shared.'
    },
    {
      Icon: EyeClosedIcon,
      titleAr: '3. ملفات تعريف الارتباط وبوابات الدفع',
      titleEn: '3. Cookies & SlickPay Gateways',
      descAr: 'تستخدم المنصة ملفات تعريف الارتباط لتحسين تجربة تصفحك ودوام تسجيل دخولك. نعتمد بوابات دفع آمنة (مثل SlickPay) والتي تتبع بروتوكولات حماية تشفير عالمية.',
      descEn: 'We use cookies to maintain login persistence and elevate UX. Our e-payment gateway integrations (SlickPay/SATIM) rely on strict official security protocols.'
    }
  ];

  return (
    <div className={`min-h-screen bg-[#f8f9fb] dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300 pb-20 ${isAr ? 'font-cairo' : 'font-sans'}`}>
      
      {/* Header Compact */}
      <div className="relative overflow-hidden border-b border-gray-150/40 dark:border-gray-900/60 bg-gradient-to-b from-gray-50/50 to-transparent dark:from-gray-950 dark:to-transparent py-12 lg:py-16">
        <div className="absolute top-[-10%] right-[-10%] w-[350px] h-[380px] bg-primary/10 dark:bg-primary/5 rounded-full blur-[110px] pointer-events-none" />
        
        <div className="relative max-w-4xl mx-auto px-6 text-center space-y-3">
          <span className="text-[10px] font-black uppercase text-primary tracking-widest block">
            {isAr ? 'خصوصية بياناتك أولويتنا' : 'Privacy Policy'}
          </span>
          <h1 className="text-3xl font-black tracking-tight text-gray-950 dark:text-white">
            {isAr ? 'سياسة الخصوصية وسرية المعلومات' : 'Privacy & Security Policy'}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
            {isAr
              ? 'نحن ملتزمون التزاماً تاماً بحماية خصوصية بياناتك الشخصية وضمان سرية معلوماتك أثناء تصفحك لمنصتنا.'
              : 'We are strictly committed to safeguarding your personal parameters and ensuring confidentiality as you browse our training materials.'}
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