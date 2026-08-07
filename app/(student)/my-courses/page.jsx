"use client";

import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

function IconBook(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

function IconAlertTriangle(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
      <path d="M12 9v4" />
      <circle cx="12" cy="16.5" r="0.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconClock(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 7 12 12 15.5 14" />
    </svg>
  );
}

function IconArrowStart(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
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

function IconTrendingUp(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
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

function IconClock2(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function IconUser(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function ProgressBar({ value }) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-[10px] font-bold text-gray-500 dark:text-gray-400">
        <span>{clamped}%</span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-1.5 w-full rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden"
      >
        <div
          className="h-full rounded-full bg-primary transition-all duration-700 ease-out"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}

function formatNumber(num) {
  return new Intl.NumberFormat('fr-FR').format(num);
}

export default function MyCoursesPage() {
  const { language } = useLanguage();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  const isAr = language === 'ar';

  useEffect(() => {
    fetch('/api/student/my-courses')
      .then(res => res.json())
      .then(data => {
        if (data.enrollments) setEnrollments(data.enrollments);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
        <span className="text-gray-500 text-xs">{isAr ? 'جارٍ التحميل...' : 'Chargement...'}</span>
      </div>
    );
  }

  const approvedCount = enrollments.filter((e) => e.status === 'APPROVED').length;
  const totalCourses = enrollments.length;
  const completionRate = totalCourses > 0 ? Math.round((approvedCount / totalCourses) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8 opacity-0 animate-fade-in-up">

        {/* Header with Stats */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              {isAr ? 'مساحة التعلم الخاصة بي' : 'Mon Espace d\'Apprentissage'}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {isAr
                ? `${formatNumber(approvedCount)} دورة نشطة من أصل ${formatNumber(totalCourses)}`
                : `${formatNumber(approvedCount)} cours actifs sur ${formatNumber(totalCourses)}`}
            </p>
          </div>

          <Link href="/courses">
            <Button className="gap-2 text-xs font-bold bg-primary hover:bg-primary/90 text-white shadow-sm shadow-primary/25 rounded-xl px-5 py-2.5 transition-all duration-300 hover:-translate-y-0.5">
              <IconBook className="w-4 h-4" />
              {isAr ? 'تصفح دورات أخرى' : 'Parcourir les cours'}
            </Button>
          </Link>
        </div>

        {/* Stats Cards — chaque métrique garde une identité propre via les tokens sémantiques du thème */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: IconGraduationCap, value: formatNumber(totalCourses), label: isAr ? 'إجمالي الدورات' : 'Total Cours', tone: 'bg-primary' },
            { icon: IconTrendingUp, value: formatNumber(approvedCount), label: isAr ? 'الدورات النشطة' : 'Cours Actifs', tone: 'bg-success' },
            { icon: IconClock2, value: `${completionRate}%`, label: isAr ? 'معدل الإكمال' : 'Taux d\'achèvement', tone: 'bg-accent' },
            { icon: IconUser, value: '1', label: isAr ? 'المتعلم' : 'Apprenant', tone: 'bg-secondary' },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/60 dark:border-gray-800/60 shadow-sm p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`inline-flex w-10 h-10 rounded-xl ${stat.tone} text-white items-center justify-center mb-3 shadow-sm`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div className="text-2xl font-black text-gray-900 dark:text-white">{stat.value}</div>
              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {enrollments.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800 p-12 text-center space-y-4">
            <span className="inline-flex items-center justify-center size-16 rounded-full bg-primary/10 text-primary mx-auto">
              <IconBook className="w-8 h-8" />
            </span>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {isAr ? 'لم تقم بالاشتراك في أي دورة بعد' : 'Aucun cours inscrit'}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
              {isAr
                ? 'ابدأ رحلة التعلم الخاصة بك اليوم واكتشف آلاف الدورات التدريبية'
                : 'Commencez votre parcours d\'apprentissage dès aujourd\'hui et découvrez des milliers de cours'}
            </p>
            <Link href="/courses">
              <Button className="gap-2 text-sm bg-primary hover:bg-primary/90 text-white shadow-sm shadow-primary/25 rounded-xl px-6 py-2.5">
                <IconBook className="w-4 h-4" />
                {isAr ? 'استكشاف الدورات' : 'Explorer les cours'}
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrollments.map(({ id, course, status, expiresAt, planType, progress }, i) => {
              const title = isAr ? course.titleAr : course.titleEn;
              const desc = isAr ? course.descriptionAr : course.descriptionEn;
              const expirationStr = expiresAt ? new Date(expiresAt).toLocaleDateString(isAr ? 'ar-dz' : 'fr-FR') : null;

              const now = new Date();
              const expiresDate = expiresAt ? new Date(expiresAt) : null;
              const isExpiringSoon = expiresDate && (expiresDate - now > 0) && (expiresDate - now <= 3 * 24 * 60 * 60 * 1000);
              const progressValue = typeof progress === 'number' ? progress : 0;

              const statusMap = {
                APPROVED: { label: isAr ? 'مفعل' : 'Actif', tone: 'bg-success' },
                PENDING: { label: isAr ? 'قيد المراجعة' : 'En attente', tone: 'bg-warning' },
                REJECTED: { label: isAr ? 'مرفوض' : 'Refusé', tone: 'bg-error' },
              };

              const statusInfo = statusMap[status] || statusMap.PENDING;

              return (
                <div
                  key={id}
                  style={{ animationDelay: `${i * 60}ms` }}
                  className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/60 dark:border-gray-800/60 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col overflow-hidden"
                >
                  <div className="relative">
                    {course.imageUrl ? (
                      <img src={course.imageUrl} alt={title} className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-44 bg-primary/5 dark:bg-primary/10 flex items-center justify-center">
                        <IconBook className="w-12 h-12 text-primary/30" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      <span className={`px-2.5 py-1 rounded-lg text-[9px] font-extrabold uppercase tracking-wider text-white shadow-sm ${statusInfo.tone}`}>
                        {statusInfo.label}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 rounded-lg bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-[9px] font-extrabold text-gray-700 dark:text-gray-300 shadow-sm border border-gray-200/50 dark:border-gray-800/50">
                        {planType}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-snug line-clamp-2 min-h-[2.5rem]">
                      {title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed mt-1.5 flex-1">
                      {desc}
                    </p>

                    {status === 'APPROVED' && (
                      <div className="mt-4">
                        <ProgressBar value={progressValue} />
                      </div>
                    )}

                    {status === 'APPROVED' && expiresDate && (
                      <div className="mt-4 flex items-center justify-between text-[10px] text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-800 pt-3">
                        <span className="flex items-center gap-1.5 font-medium">
                          <IconClock className="w-3.5 h-3.5 text-gray-400" />
                          {isAr ? 'ينتهي في' : 'Expire le'}
                        </span>
                        <span className="font-bold text-gray-700 dark:text-gray-300">{expirationStr}</span>
                      </div>
                    )}

                    {status === 'APPROVED' && isExpiringSoon && (
                      <div className="mt-3 bg-warning/10 dark:bg-warning/15 border border-warning/25 rounded-xl p-2.5 flex items-center gap-2">
                        <IconAlertTriangle className="w-3.5 h-3.5 text-warning shrink-0" />
                        <span className="text-[9px] font-bold text-warning-dark dark:text-warning leading-tight">
                          {isAr
                            ? 'ينتهي اشتراكك قريباً! جدد الآن.'
                            : 'Votre abonnement expire bientôt ! Renouvelez maintenant.'}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/20">
                    {status === 'APPROVED' ? (
                      <Link href={`/courses/${course.slug}`}>
                        <Button variant="primary" className="w-full text-xs gap-2 font-bold rounded-xl py-2.5 bg-primary hover:bg-primary/90 shadow-sm shadow-primary/25 transition-all duration-300">
                          {progressValue > 0
                            ? (isAr ? 'متابعة التعلم' : 'Continuer')
                            : (isAr ? 'ابدأ التعلم' : 'Commencer')}
                          <IconArrowStart className={`w-3.5 h-3.5 transition-transform group-hover:${isAr ? '-translate-x-0.5' : 'translate-x-0.5'}`} />
                        </Button>
                      </Link>
                    ) : (
                      <Button variant="outline" className="w-full text-xs font-bold rounded-xl py-2.5 border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400" disabled>
                        {isAr ? 'بانتظار المراجعة' : 'En attente de validation'}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}