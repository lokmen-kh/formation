"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import {Button} from './ui/Button';

export default function PlanSelector({ courseId, priceStandard, pricePremium }) {
  const { language } = useLanguage();
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState('STANDARD');

  const handleSubscribe = () => {
    router.push(`/checkout/${courseId}/${selectedPlan}`);
  };

  const isAr = language === 'ar';

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-gray-900 text-center">
        {isAr ? 'اختر خطة الاشتراك' : 'Choose Plan'}
      </h3>

      <div className="space-y-3">
        {/* Plan Standard (Mensuel) */}
        <div
          onClick={() => setSelectedPlan('STANDARD')}
          className={`p-4 rounded-card border-2 cursor-pointer transition-all ${
            selectedPlan === 'STANDARD'
              ? 'border-primary bg-primary/5'
              : 'border-gray-150 hover:border-gray-300'
          }`}
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-gray-800">
              {isAr ? 'الخطة العادية (شهري)' : 'Standard Plan (Monthly)'}
            </span>
            <input
              type="radio"
              checked={selectedPlan === 'STANDARD'}
              onChange={() => setSelectedPlan('STANDARD')}
              className="text-primary focus:ring-primary-light"
            />
          </div>
          <p className="text-xl font-black text-primary">
            {priceStandard} DZD
          </p>
          <p className="text-xs text-gray-500 mt-1 leading-normal">
            {isAr
              ? 'الوصول إلى الفيديوهات والمحتوى المكتوب للمساق بشكل شهري.'
              : 'Access to course videos and written content on a monthly basis.'}
          </p>
        </div>

        {/* Plan Premium (Annuel) */}
        <div
          onClick={() => setSelectedPlan('PREMIUM')}
          className={`p-4 rounded-card border-2 cursor-pointer transition-all relative ${
            selectedPlan === 'PREMIUM'
              ? 'border-accent bg-accent/5'
              : 'border-gray-150 hover:border-gray-300'
          }`}
        >
          <span className="absolute -top-2.5 right-4 bg-accent text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            {isAr ? 'موصى به' : 'Popular'}
          </span>
          
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-gray-850">
              {isAr ? 'الخطة الممتازة (سنوي)' : 'Premium Plan (Annual)'}
            </span>
            <input
              type="radio"
              checked={selectedPlan === 'PREMIUM'}
              onChange={() => setSelectedPlan('PREMIUM')}
              className="text-accent focus:ring-accent-light"
            />
          </div>
          <p className="text-xl font-black text-accent">
            {pricePremium} DZD
          </p>
          <p className="text-xs text-gray-500 mt-1 leading-normal">
            {isAr
              ? 'الوصول الكامل لمدة عام كامل مع دعم مباشر وميزات إضافية.'
              : 'Full annual access with direct support and additional premium features.'}
          </p>
        </div>
      </div>

      <div className="pt-2">
        <Button
          onClick={handleSubscribe}
          variant={selectedPlan === 'PREMIUM' ? 'accent' : 'primary'}
          className="w-full"
        >
          {isAr ? 'اشترك الآن' : 'Subscribe Now'}
        </Button>
      </div>
    </div>
  );
}