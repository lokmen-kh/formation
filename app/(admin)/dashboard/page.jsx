"use client";

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import AdminCharts from '@/components/Charts/AdminCharts';
import Link from 'next/link';

/* -------------------------------------------------------------------------- */
/* Icônes Vectorielles (Style Lucide)                                         */
/* -------------------------------------------------------------------------- */

function IconTrendingUp(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

function IconUsers(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function IconBookOpen(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

function IconDollarSign(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
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

function IconCalendar(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function IconActivity(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}

function IconChevronRight(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

export default function AdminDashboard() {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Données simulées
  const statsData = [
    { name: 'Jan', revenue: 45000, students: 12 },
    { name: 'Feb', revenue: 75000, students: 19 },
    { name: 'Mar', revenue: 120000, students: 30 },
    { name: 'Apr', revenue: 98000, students: 25 },
    { name: 'May', revenue: 150000, students: 38 },
    { name: 'Jun', revenue: 210000, students: 50 },
  ];

  // KPI Data with icons and colors
  const kpiData = [
    {
      icon: IconDollarSign,
      iconBg: 'bg-blue-50 dark:bg-blue-950/30',
      iconColor: 'text-blue-600 dark:text-blue-400',
      label: isAr ? 'إجمالي المبيعات' : 'Total Revenue',
      value: '698,000 DZD',
      change: '+12.5%',
      changePositive: true,
      color: 'from-blue-600 to-blue-500',
    },
    {
      icon: IconUsers,
      iconBg: 'bg-purple-50 dark:bg-purple-950/30',
      iconColor: 'text-purple-600 dark:text-purple-400',
      label: isAr ? 'إجمالي الطلاب' : 'Active Students',
      value: '174',
      change: '+18.2%',
      changePositive: true,
      color: 'from-purple-600 to-purple-500',
    },
    {
      icon: IconBookOpen,
      iconBg: 'bg-emerald-50 dark:bg-emerald-950/30',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      label: isAr ? 'الكورسات المنشورة' : 'Published Courses',
      value: '8',
      change: '+2',
      changePositive: true,
      color: 'from-emerald-600 to-emerald-500',
    },
    {
      icon: IconActivity,
      iconBg: 'bg-orange-50 dark:bg-orange-950/30',
      iconColor: 'text-orange-600 dark:text-orange-400',
      label: isAr ? 'معدل الإنجاز' : 'Completion Rate',
      value: '76%',
      change: '+5.3%',
      changePositive: true,
      color: 'from-orange-600 to-orange-500',
    },
  ];

  // Recent activity data
  const recentActivities = isAr
    ? [
        { user: 'أحمد خ', action: 'اشترك في دورة', course: 'Python المتقدم', time: 'منذ 5 دقائق' },
        { user: 'سارة م', action: 'أكملت دورة', course: 'التصميم الجرافيكي', time: 'منذ 1 ساعة' },
        { user: 'محمد ر', action: 'دفع اشتراك', course: 'تطوير الويب', time: 'منذ 3 ساعات' },
        { user: 'فاطمة ب', action: 'سجلت جديد', course: 'التسويق الرقمي', time: 'منذ 5 ساعات' },
      ]
    : [
        { user: 'Ahmed K', action: 'Enrolled in', course: 'Advanced Python', time: '5 min ago' },
        { user: 'Sara M', action: 'Completed', course: 'Graphic Design', time: '1 hour ago' },
        { user: 'Mohamed R', action: 'Paid subscription', course: 'Web Development', time: '3 hours ago' },
        { user: 'Fatima B', action: 'New registration', course: 'Digital Marketing', time: '5 hours ago' },
      ];

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-200 dark:border-gray-800/60">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            {isAr ? 'لوحة التحكم التحليلية' : 'Admin Analytics'}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {isAr ? 'نظرة عامة على أداء المنصة' : 'Overview of platform performance'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 text-xs font-bold border border-blue-200/50 dark:border-blue-800/50">
            <IconCalendar className="w-3.5 h-3.5" />
            {isAr ? 'آخر 6 أشهر' : 'Last 6 months'}
          </span>
        </div>
      </div>

      {/* KPI Cards - Grid responsive avec 2 sur mobile */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <div
              key={index}
              className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/60 dark:border-gray-800/60 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-5"
            >
              <div className="flex items-start justify-between">
                <div className={`w-10 h-10 rounded-xl ${kpi.iconBg} flex items-center justify-center shadow-sm`}>
                  <Icon className={`w-5 h-5 ${kpi.iconColor}`} />
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  kpi.changePositive 
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400' 
                    : 'bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400'
                }`}>
                  {kpi.change}
                </span>
              </div>
              <div className="mt-3">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{kpi.label}</p>
                <p className="text-xl font-black text-gray-900 dark:text-white mt-1">{kpi.value}</p>
              </div>
              <div className="mt-3 h-1 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div className={`h-full rounded-full bg-gradient-to-r ${kpi.color} transition-all duration-1000`} style={{ width: `${Math.random() * 40 + 60}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/60 dark:border-gray-800/60 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-sm font-bold text-gray-900 dark:text-white">
              {isAr ? 'تحليل الإيرادات والطلاب' : 'Revenue & Students Analysis'}
            </h2>
            <p className="text-[10px] text-gray-400 mt-0.5">
              {isAr ? 'تطور الإيرادات وعدد الطلاب خلال الأشهر الماضية' : 'Revenue and student growth over the past months'}
            </p>
          </div>
        </div>
        <AdminCharts data={statsData} />
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/60 dark:border-gray-800/60 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-sm font-bold text-gray-900 dark:text-white">
              {isAr ? 'آخر النشاطات' : 'Recent Activity'}
            </h2>
            <p className="text-[10px] text-gray-400 mt-0.5">
              {isAr ? 'أحدث التفاعلات على المنصة' : 'Latest platform interactions'}
            </p>
          </div>
          <Link href="/enrollments" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors flex items-center gap-1">
            {isAr ? 'عرض الكل' : 'View All'}
            <IconChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-3">
          {recentActivities.map((activity, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-950/50 hover:bg-gray-100 dark:hover:bg-gray-950 transition-colors duration-200"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs shadow-sm flex-shrink-0">
                  {activity.user.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-gray-900 dark:text-white truncate">
                    {activity.user}
                  </p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
                    {activity.action} <span className="font-semibold text-gray-700 dark:text-gray-300">{activity.course}</span>
                  </p>
                </div>
              </div>
              <span className="text-[10px] text-gray-400 flex-shrink-0">
                {activity.time}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: isAr ? 'إضافة كورس' : 'Add Course', icon: IconBookOpen, color: 'from-blue-600 to-blue-500' },
          { label: isAr ? 'إدارة الطلاب' : 'Manage Students', icon: IconUsers, color: 'from-purple-600 to-purple-500' },
          { label: isAr ? 'تقرير مالي' : 'Financial Report', icon: IconDollarSign, color: 'from-emerald-600 to-emerald-500' },
          { label: isAr ? 'الإعدادات' : 'Settings', icon: IconActivity, color: 'from-orange-600 to-orange-500' },
        ].map((action, index) => {
          const Icon = action.icon;
          return (
            <Link
              key={index}
              href="#"
              className="group flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-gray-800/60 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-lg shadow-${action.color.split(' ')[1]}/20 group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-[10px] font-bold text-gray-600 dark:text-gray-400 text-center group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                {action.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}