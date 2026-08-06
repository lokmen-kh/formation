"use client";

import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import {Button} from '@/components/ui/Button';

export default function CheckoutPendingPage() {
  const { language } = useLanguage();

  const isAr = language === 'ar';

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-layout-md py-12">
      <div className="max-w-md w-full bg-white p-8 rounded-card border border-gray-100 shadow-md text-center space-y-6">
        <div className="w-16 h-16 bg-warning-light/15 text-warning rounded-full flex items-center justify-center mx-auto text-3xl">
          ⏳
        </div>
        
        <div className="space-y-2">
          <h1 className="text-xl font-black text-gray-900">
            {isAr ? 'الطلب قيد المراجعة' : 'Subscription Pending'}
          </h1>
          <p className="text-xs text-gray-500 leading-relaxed">
            {isAr
              ? 'نشكرك على التسجيل! طلب اشتراكك قيد المراجعة حاليًا من قبل فريق الإدارة. سيتم تفعيل حسابك فور التحقق من إيصال الدفع الخاص بك (عادةً خلال أقل من 24 ساعة).'
              : 'Thank you for registering! Your subscription request is currently being reviewed by our administration team. Your account will be activated once your receipt is verified (usually within 24 hours).'}
          </p>
        </div>

        <div className="pt-4 flex flex-col gap-2">
          <Link href="/my-courses">
            <Button variant="primary" className="w-full text-xs">
              {isAr ? 'الذهاب إلى دوراتي' : 'Go to My Courses'}
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="w-full text-xs">
              {isAr ? 'العودة للرئيسية' : 'Back to Home'}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}