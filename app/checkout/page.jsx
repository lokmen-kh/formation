'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

/* -------------------------------------------------------------------------- */
/* Icônes vectorielles professionnelles (Style Lucide)                        */
/* -------------------------------------------------------------------------- */

function IconBank(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 10l9-6 9 6" />
      <path d="M4 10v9M9 10v9M15 10v9M20 10v9" />
      <path d="M2 21h20" />
    </svg>
  );
}
function IconCardPay(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="5" width="20" height="14" rx="2.2" />
      <path d="M2 10h20" />
      <path d="M6 15h4" />
    </svg>
  );
}
function IconWhatsapp(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2a10 10 0 00-8.6 15L2 22l5.2-1.4A10 10 0 1012 2zm0 18.2a8.2 8.2 0 01-4.2-1.1l-.3-.2-3.1.8.8-3-.2-.3A8.2 8.2 0 1112 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.7.8-.8 1-.2.2-.3.2-.6.1-.2-.1-1-.4-2-1.2-.7-.6-1.2-1.4-1.4-1.6-.1-.2 0-.4.1-.5.1-.1.3-.3.4-.5.1-.1.2-.3.3-.4.1-.2 0-.4 0-.5 0-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.2-.9.9-.9 2.2 0 1.3.9 2.5 1 2.7.1.2 1.8 2.7 4.4 3.8.6.3 1.1.4 1.5.5.6.2 1.2.2 1.6.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2-.1-.1-.2-.2-.4-.3z" />
    </svg>
  );
}
function IconUpload(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 16V4" />
      <path d="M6 10l6-6 6 6" />
      <path d="M4 20h16" />
    </svg>
  );
}
function IconShieldCheck(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}
function IconSecure(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 2L3 7l9 5 9-5-9-5z" />
      <path d="M3 7v5l9 5 9-5V7" />
      <path d="M12 12v8" />
    </svg>
  );
}
function IconClock(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  );
}
function IconCheckCircle(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
      <path d="M22 4L12 14.01l-3-3" />
    </svg>
  );
}
function IconArrowRight(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M5 12h14" />
      <path d="M12 5l7 7-7 7" />
    </svg>
  );
}
function IconCalendar(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}
function IconUser(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
function IconBuilding(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
      <line x1="9" y1="6" x2="15" y2="6" />
      <line x1="9" y1="10" x2="15" y2="10" />
      <line x1="9" y1="14" x2="15" y2="14" />
      <line x1="9" y1="18" x2="12" y2="18" />
    </svg>
  );
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const { language, t } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const courseId = searchParams.get('courseId');
  const queryOfferId = searchParams.get('offerId');
  const planType = searchParams.get('planType') || 'monthly';

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('CCP');
  const [receiptFile, setReceiptFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const isAr = language === 'ar';
  const nf = new Intl.NumberFormat('fr-FR');

  useEffect(() => {
    if (!courseId) return;
    fetch('/api/public/courses')
      .then((res) => res.json())
      .then((data) => {
        if (data.courses) {
          const matched = data.courses.find((c) => c.id === courseId);
          setCourse(matched);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [courseId]);

  useEffect(() => {
    if (!authLoading && !user) {
      const redirectUrl = queryOfferId 
        ? `/checkout?courseId=${courseId}&offerId=${queryOfferId}`
        : `/checkout?courseId=${courseId}&planType=${planType}`;
      router.push(`/login?redirect=${encodeURIComponent(redirectUrl)}`);
    }
  }, [user, authLoading, router, courseId, planType, queryOfferId]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fb] dark:bg-gray-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400 tracking-wide uppercase">
            {t('common.loading')}
          </span>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fb] dark:bg-gray-950">
        <div className="text-center space-y-6 max-w-md px-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-red-50 dark:bg-red-950/20 flex items-center justify-center">
            <IconBuilding className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {isAr ? 'الدورة غير موجودة' : 'Course Not Found'}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {isAr
              ? 'قد تكون الدورة قد أزيلت أو الرابط غير صحيح.'
              : 'The course may have been removed or the link is incorrect.'}
          </p>
          <Link href="/">
            <Button className="bg-primary hover:bg-primary-dark hover:scale-105 transition-all duration-300 shadow-lg shadow-primary/20">
              {t('common.back')}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const selectedOffer = course.offers?.find(o => o.id === queryOfferId) || course.offers?.[0];
  
  const price = selectedOffer ? selectedOffer.price : (planType === 'yearly' ? course.priceYearly : course.priceMonthly);
  const oldPrice = selectedOffer ? selectedOffer.oldPrice : null;
  const hasDiscount = oldPrice && oldPrice > price;
  const discountPct = hasDiscount ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;

  const title = isAr ? course.titleAr : course.titleEn;

  const planText = selectedOffer 
    ? (isAr ? selectedOffer.nameAr : selectedOffer.nameEn)
    : (planType === 'yearly' ? (isAr ? 'سنوي' : 'Yearly') : (isAr ? 'شهري' : 'Monthly'));

  const whatsAppNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '213123456789';
  const textAr = `مرحباً، أود الاشتراك في دورة "${title}" بخطة (${planText}). بريدي الإلكتروني: ${user?.email}. يرجى تزويدي بتفاصيل الدفع أو تأكيد اشتراكي.`;
  const textEn = `Hello, I would like to subscribe to the course "${title}" with the ${planText} plan. My email: ${user?.email}. Please provide payment details or confirm my subscription.`;
  const whatsAppMessage = isAr ? textAr : textEn;
  const whatsAppLink = `https://wa.me/${whatsAppNumber}?text=${encodeURIComponent(whatsAppMessage)}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('courseId', courseId);
      formData.append('paymentMethod', paymentMethod);
      
      if (queryOfferId) {
        formData.append('offerId', queryOfferId);
      } else {
        formData.append('planType', planType);
      }

      if (paymentMethod === 'CCP') {
        if (!receiptFile) {
          setError(isAr ? 'يرجى تحميل ملف إيصال الدفع.' : 'Please upload your payment receipt.');
          setSubmitting(false);
          return;
        }
        formData.append('receipt', receiptFile);
      }

      const res = await fetch('/api/checkout/submit', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || (isAr ? 'فشلت عملية الاشتراك.' : 'Subscription failed.'));

      if (paymentMethod === 'SLICKPAY' && data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        router.push(`/checkout/pending?courseId=${courseId}`);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const methods = [
    { id: 'CCP', Icon: IconBank, label: isAr ? 'حوالة CCP' : 'CCP Transfer', color: 'primary' },
    { id: 'SLICKPAY', Icon: IconCardPay, label: isAr ? 'بطاقة ذهبية / CIB' : 'Edahabia / CIB', color: 'accent' },
    { id: 'WHATSAPP', Icon: IconWhatsapp, label: isAr ? 'واتساب مباشر' : 'Direct WhatsApp', color: 'green' },
  ];

  const methodStyles = {
    primary: 'border-primary dark:border-primary bg-primary/[0.01] text-primary dark:text-primary-light ring-primary/20',
    accent: 'border-accent bg-accent/[0.01] text-accent ring-accent/20',
    green: 'border-green-600 bg-green-50/50 text-green-700 dark:bg-green-950/20 dark:text-green-400 ring-green-500/20',
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] dark:bg-gray-950 text-slate-900 dark:text-gray-100 transition-colors duration-300">
      <Navbar />
     

      <main className="max-w-6xl mx-auto py-12 px-6">
        
        <div className="flex items-center justify-center gap-4 mb-8 px-6 py-3 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-xl border border-gray-250/20 dark:border-gray-800/50 shadow-sm">
          <IconShieldCheck className="w-5 h-5 text-primary" />
          <span className="text-xs font-semibold text-slate-600 dark:text-gray-400 tracking-wide">
            {isAr ? 'جميع عمليات الدفع مشفرة وآمنة 100%' : 'All payments are encrypted and 100% secure'}
          </span>
          <span className="w-px h-4 bg-gray-300 dark:bg-gray-700" />
          <IconClock className="w-5 h-5 text-primary" />
          <span className="text-xs font-semibold text-slate-600 dark:text-gray-400">
            {isAr ? 'معالجة فورية للطلب' : 'Instant processing'}
          </span>
        </div>

        {error && (
          <div className="mb-8 p-4 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-red-500 text-xs font-bold">!</span>
            </div>
            <span className="font-semibold">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-8 rounded-3xl border border-gray-250/20 dark:border-gray-800/50 shadow-xl shadow-slate-100/40 dark:shadow-gray-950/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                  <IconCardPay className="w-4 h-4 text-primary" />
                </div>
                <h2 className="text-xs font-black tracking-wider text-slate-900 dark:text-white uppercase">
                  {isAr ? 'اختر طريقة الدفع' : 'Select Payment Method'}
                </h2>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {methods.map(({ id, Icon, label, color }) => {
                  const active = paymentMethod === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setPaymentMethod(id)}
                      className={`group relative flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all duration-350 cursor-pointer ${
                        active
                          ? `${methodStyles[color]} scale-[1.02] shadow-xl`
                          : 'border-gray-200/50 dark:border-gray-800/50 text-gray-500 dark:text-gray-400 hover:border-primary/30 hover:bg-primary/5 hover:scale-[1.02]'
                      }`}
                    >
                      <div className={`p-3 rounded-xl transition-all duration-300 ${
                        active ? 'bg-current/10' : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-primary/10'
                      }`}>
                        <Icon className={`w-6 h-6 transition-all duration-300 ${
                          active ? 'text-current' : 'text-gray-650 dark:text-gray-400 group-hover:text-primary'
                        }`} />
                      </div>
                      <span className="text-xs font-bold tracking-wide text-center leading-tight">
                        {label}
                      </span>
                      {active && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center shadow-lg">
                          <IconCheckCircle className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-8 rounded-3xl border border-gray-250/20 dark:border-gray-800/50 shadow-xl shadow-slate-100/40 dark:shadow-gray-950/20">
              
              {paymentMethod === 'CCP' && (
                <div className="space-y-6">
                  <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/5 p-6 rounded-2xl border border-primary/20 dark:border-primary/10">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
                    <div className="relative space-y-4">
                      <div className="flex items-center gap-3">
                        <IconBank className="w-5 h-5 text-primary" />
                        <p className="text-sm font-black text-slate-900 dark:text-white">
                          {isAr ? 'معلومات حساب CCP' : 'CCP Account Details'}
                        </p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm border-t border-primary/10 pt-3">
                        <div>
                          <span className="text-gray-500 dark:text-gray-400 text-xs block mb-1">RIB</span>
                          <span className="font-mono font-bold text-slate-900 dark:text-white">007 99999 00000012345</span>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400 text-xs block mb-1">
                            {isAr ? 'الاسم واللقب' : 'Account Name'}
                          </span>
                          <span className="font-bold text-slate-900 dark:text-white">Benali Mohamed</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed border-t border-primary/10 pt-4 font-semibold">
                        {isAr
                          ? 'قم بتحويل المبلغ المطلوب ثم قم بتحميل صورة أو نسخة PDF من إيصال الدفع لتأكيد تسجيلك.'
                          : 'Transfer the required amount, then upload a photo or PDF copy of your payment receipt to confirm your registration.'}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-gray-300">
                      <IconUpload className="w-4 h-4 text-primary" />
                      {isAr ? 'تحميل إيصال الدفع' : 'Upload Payment Receipt'}
                      <span className="text-[10px] font-normal text-gray-450 dark:text-gray-500">(PNG, JPG, PDF)</span>
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        required
                        onChange={(e) => setReceiptFile(e.target.files[0])}
                        className="w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2.5 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary dark:file:bg-primary/20 hover:file:bg-primary/20 cursor-pointer transition-all duration-250 file:cursor-pointer"
                      />
                      {receiptFile && (
                        <div className="mt-2 text-xs text-green-600 dark:text-green-400 flex items-center gap-2 font-bold">
                          <IconCheckCircle className="w-4 h-4" />
                          {receiptFile.name}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'SLICKPAY' && (
                <div className="space-y-6">
                  <div className="relative overflow-hidden bg-gradient-to-br from-accent/5 to-accent/10 dark:from-accent/10 dark:to-accent/5 p-6 rounded-2xl border border-accent/20 dark:border-accent/10">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl" />
                    <div className="relative space-y-4">
                      <div className="flex items-center gap-3">
                        <IconShieldCheck className="w-5 h-5 text-accent" />
                        <p className="text-sm font-black text-slate-900 dark:text-white">
                          {isAr ? 'دفع إلكتروني مباشر عبر SlickPay' : 'Direct e-Payment via SlickPay'}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 p-4 bg-white/50 dark:bg-black/20 rounded-xl border border-accent/10">
                        <IconCardPay className="w-8 h-8 text-accent animate-pulse" />
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">Edahabia / CIB</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {isAr ? 'بوابة دفع SATIM الرسمية' : 'Official SATIM Payment Gateway'}
                          </p>
                        </div>
                      </div>
                      <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-400 font-semibold">
                        <li className="flex items-start gap-2">
                          <IconCheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                          {isAr ? 'تشفير SSL متقدم لجميع البيانات' : 'Advanced SSL encryption for all data'}
                        </li>
                        <li className="flex items-start gap-2">
                          <IconCheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                          {isAr ? 'دعم جميع بطاقات الذهبية و CIB' : 'Support for all Edahabia and CIB cards'}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'WHATSAPP' && (
                <div className="space-y-6 text-center py-4">
                  <div className="w-20 h-20 mx-auto rounded-2xl bg-green-50 dark:bg-green-950/20 flex items-center justify-center border border-green-250/20 dark:border-green-800/30">
                    <IconWhatsapp className="w-10 h-10 text-green-600 animate-bounce" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-black text-slate-900 dark:text-white">
                      {isAr ? 'تواصل مع الدعم الفني' : 'Contact Technical Support'}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto leading-relaxed font-semibold">
                      {isAr
                        ? 'سنتواصل معك عبر واتساب لتأكيد اشتراكك وتقديم الدعم اللازم.'
                        : 'We will contact you via WhatsApp to confirm your subscription and provide the necessary support.'}
                    </p>
                  </div>
                  <a
                    href={whatsAppLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold px-8 py-3.5 rounded-2xl text-xs transition-all duration-300 shadow-xl shadow-green-500/20 hover:-translate-y-0.5"
                  >
                    <IconWhatsapp className="w-5 h-5" />
                    {isAr ? 'إرسال رسالة واتساب' : 'Send WhatsApp Message'}
                    <IconArrowRight className="w-4 h-4" />
                  </a>
                </div>
              )}

              {paymentMethod !== 'WHATSAPP' && (
                <div className="pt-6 border-t border-gray-200/50 dark:border-gray-800/50 flex justify-end">
                  <Button
                    type="submit"
                    variant={paymentMethod === 'SLICKPAY' ? 'accent' : 'primary'}
                    className="w-full sm:w-auto px-12 py-3.5 text-xs font-bold rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/20 active:translate-y-0 flex items-center justify-center gap-3 cursor-pointer"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        {isAr ? 'جاري المعالجة...' : 'Processing...'}
                      </>
                    ) : (
                      <>
                        {isAr ? 'تأكيد الدفع' : 'Confirm Payment'}
                        <IconArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </div>
              )}
            </form>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              
              <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-8 rounded-3xl border border-gray-250/20 dark:border-gray-800/50 shadow-xl shadow-slate-100/40 dark:shadow-gray-950/20">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-xl bg-accent/10 flex items-center justify-center">
                    <IconCalendar className="w-4 h-4 text-accent" />
                  </div>
                  <h3 className="text-xs font-black tracking-wider text-slate-900 dark:text-white uppercase">
                    {isAr ? 'ملخص الطلب' : 'Order Summary'}
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-slate-50/60 dark:bg-gray-950/30 rounded-2xl border border-gray-200/30 dark:border-gray-800/30">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start gap-4">
                        <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase">
                          {isAr ? 'الدورة' : 'Course'}
                        </span>
                        <span className="text-xs font-bold text-slate-900 dark:text-white text-end max-w-[150px] leading-tight">
                          {title}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center gap-4">
                        <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase">
                          {isAr ? 'الخطة' : 'Plan'}
                        </span>
                        <span className="text-xs font-extrabold text-primary flex items-center gap-2">
                          {planText}
                          {discountPct > 0 && (
                            <span className="text-[10px] font-black text-green-600 bg-emerald-50 dark:bg-emerald-500/15 px-2 py-0.5 rounded-full">
                              -{discountPct}%
                            </span>
                          )}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center pt-3 border-t border-gray-200/30 dark:border-gray-800/30">
                        <span className="text-xs font-bold text-slate-700 dark:text-gray-350">
                          {isAr ? 'الإجمالي' : 'Total'}
                        </span>
                        <span className="text-xl font-black text-primary">
                          {nf.format(price)} DZD
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-[11px] text-gray-500 dark:text-gray-400 font-semibold">
                    <div className="flex justify-between py-1 border-b border-gray-100/50 dark:border-gray-800/50">
                      <span>{isAr ? 'طريقة الدفع' : 'Method'}</span>
                      <span className="font-bold text-slate-700 dark:text-gray-300">
                        {methods.find(m => m.id === paymentMethod)?.label}
                      </span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span>{isAr ? 'حالة الطلب' : 'Status'}</span>
                      <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                        {isAr ? 'بانتظار التأكيد' : 'Pending Confirmation'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm p-4 rounded-2xl border border-gray-200/30 dark:border-gray-800/30 text-center shadow-sm">
                <div className="flex items-center justify-center gap-2 text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">
                  <IconShieldCheck className="w-4 h-4 text-primary" />
                  <span>SSL Secure</span>
                  <span className="w-px h-3 bg-gray-350 dark:bg-gray-700" />
                  <IconClock className="w-4 h-4 text-primary" />
                  <span>24/7 Support</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fb] dark:bg-gray-950">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}