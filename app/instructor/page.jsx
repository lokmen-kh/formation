"use client";

import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  BookOpen, Users, Layers, UploadCloud, GraduationCap,
  ArrowRight, LayoutDashboard, Globe
} from 'lucide-react';
import Link from 'next/link';

const STAT_TONES = {
  primary: { bg: 'bg-primary/10 text-primary border-primary/20', iconColor: 'text-primary' },
  success: { bg: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20', iconColor: 'text-emerald-500' },
  secondary: { bg: 'bg-violet-500/10 text-violet-600 border-violet-500/20', iconColor: 'text-violet-500' },
};

export default function InstructorDashboard() {
  const { language, t } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const isAr = language === 'ar';
  const nf = new Intl.NumberFormat(isAr ? 'ar-DZ' : 'fr-FR');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/instructor');
      return;
    }

    // Récupérer les cours assignés au professeur
    fetch('/api/instructor/courses')
      .then((res) => res.json())
      .then((data) => {
        if (data.courses) {
          setCourses(data.courses);
        }
      })
      .catch((err) => console.error('Error loading instructor courses:', err))
      .finally(() => setLoading(false));
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fb] dark:bg-[#090b11]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/25 border-t-primary rounded-full animate-spin" />
          <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{t('common.loading')}</span>
        </div>
      </div>
    );
  }

  const totalStudents = courses.reduce((acc, c) => acc + (c._count?.enrollments || 0), 0);
  const totalLessons = courses.reduce((acc, c) => {
    const lessonsCount = c.chapters?.reduce((subAcc, chap) => subAcc + (chap.lessons?.length || 0), 0) || 0;
    return acc + lessonsCount;
  }, 0);

  const stats = [
    {
      label: isAr ? 'المساقات التعليمية النشطة' : 'Assigned Tracks',
      val: `${nf.format(courses.length)} ${isAr ? 'مساقات' : 'Tracks'}`,
      tone: 'primary',
      Icon: BookOpen
    },
    {
      label: isAr ? 'إجمالي الطلاب المشرف عليهم' : 'Students Enrolled',
      val: `${nf.format(totalStudents)} ${isAr ? 'طالب' : 'Learners'}`,
      tone: 'success',
      Icon: Users
    },
    {
      label: isAr ? 'إجمالي الدروس المصورة' : 'Total Lessons Created',
      val: `${nf.format(totalLessons)} ${isAr ? 'دروس' : 'Lessons'}`,
      tone: 'secondary',
      Icon: Layers
    }
  ];

  return (
    <div className={`space-y-10 ${isAr ? 'font-cairo' : 'font-sans'}`}>

      {/* En-tête de bienvenue stylisé */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-white to-primary/[0.03] dark:from-gray-900 dark:via-gray-900 dark:to-primary/[0.05] border border-slate-200/50 dark:border-gray-800/80 p-6 sm:p-8 shadow-sm">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary border border-primary/15 rounded-full px-3 py-1 mb-3.5">
              <span className="size-1.5 rounded-full bg-primary animate-ping" />
              <span className="text-[10px] font-black uppercase tracking-wider">
                {isAr ? 'منصة الأستاذ والمدرب المعتمدة' : 'Verified Instructor Workspace'}
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
              <LayoutDashboard className="w-7 h-7 text-primary shrink-0" />
              {isAr ? `مرحباً بك، أ. ${user?.fullName || ''}` : `Welcome, Prof. ${user?.fullName || ''}`}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-2xl leading-relaxed">
              {isAr
                ? 'تابع إحصائيات ونشاط طلابك وقم بإدارة وتحديث محتوى فصولك ودروسك التعليمية بيسر وسهولة.'
                : 'Monitor real-time student metrics, design curriculum layouts, and deploy dynamic courses.'}
            </p>
          </div>
        </div>
      </div>

      {/* Cartes de Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {stats.map((stat, i) => {
          const colors = STAT_TONES[stat.tone];
          return (
            <div
              key={i}
              className="flex items-center gap-4.5 p-6 rounded-2xl bg-white dark:bg-gray-900 border border-slate-200/50 dark:border-gray-800/60 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-primary/30"
            >
              <div className={`w-12 h-12 rounded-xl ${colors.bg} border flex items-center justify-center shrink-0`}>
                <stat.Icon className={`w-6 h-6 ${colors.iconColor}`} />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider truncate">
                  {stat.label}
                </div>
                <div className="text-lg sm:text-xl font-black text-gray-900 dark:text-white mt-1.5 leading-none">
                  {stat.val}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Liste des cours assignés */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-gray-800/60 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="w-1.5 h-6 bg-primary rounded-full" />
            <h2 className="text-lg font-black text-gray-900 dark:text-white">
              {isAr ? 'المساقات المسندة إليك' : 'Your Assigned Tracks'}
            </h2>
          </div>
          <Badge variant="outline" className="text-[10px] font-bold px-2.5 py-0.5 border-slate-200 dark:border-gray-800 text-gray-400">
            {courses.length} {isAr ? 'مساقات' : 'total'}
          </Badge>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-gray-800 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 border border-primary/20">
              <GraduationCap className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-base font-bold text-gray-950 dark:text-white">
              {isAr ? 'لا توجد مساقات مسندة إليك حالياً' : 'No tracks assigned yet'}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto mt-2 leading-relaxed">
              {isAr
                ? 'يرجى التواصل مع الإدارة لتعيين مساقات تعليمية إلى حسابك والبدء في رفع الدروس.'
                : 'Please contact the administrator to assign learning tracks to your account.'}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => {
              const lessonsCount = course.chapters?.reduce((acc, chap) => acc + (chap.lessons?.length || 0), 0) || 0;

              return (
                <div
                  key={course.id}
                  className="group flex flex-col justify-between rounded-2xl bg-white dark:bg-gray-900 border border-slate-200/50 dark:border-gray-800/60 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-primary/30"
                >
                  {/* Infos du cours */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <Badge variant="primary" className="text-[9px] font-black px-2.5 py-0.5">
                        {isAr ? course.category?.nameAr : course.category?.nameEn}
                      </Badge>
                      <div className="flex items-center gap-1.5 ml-auto">
                        <Link href={`/courses/${course.slug}`} target="_blank">
                          <Badge variant="outline" className="text-[9px] font-bold px-2 py-1 border-primary/20 text-primary bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer">
                            <Globe className="w-3 h-3 mr-1 inline shrink-0" />
                            {isAr ? 'الصفحة العامة' : 'View Public'}
                          </Badge>
                        </Link>
                        <Badge
                          variant={course.published ? 'success' : 'secondary'}
                          className="text-[9px] font-bold px-2.5 py-0.5"
                        >
                          {course.published ? (isAr ? 'منشور' : 'Active') : (isAr ? 'مسودة' : 'Draft')}
                        </Badge>
                      </div>
                    </div>

                    {/* Titre interactif */}
                    <Link href={`/instructor/courses/${course.slug}/upload`}>
                      <h3 className="text-sm sm:text-base font-black text-gray-900 dark:text-white leading-snug hover:text-primary transition-colors line-clamp-2 cursor-pointer">
                        {isAr ? course.titleAr : course.titleEn}
                      </h3>
                    </Link>

                    {/* Stats sous forme de puces filaires */}
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-[11px] font-bold text-gray-400 dark:text-gray-500 border-t border-slate-100 dark:border-gray-800 pt-3.5">
                      <div className="flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span>{nf.format(course.chapters?.length || 0)} {isAr ? 'فصول' : 'chapters'}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span>{nf.format(lessonsCount)} {isAr ? 'دروس' : 'lessons'}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span>{nf.format(course._count?.enrollments || 0)} {isAr ? 'طلاب' : 'students'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions de navigation */}
                  <div className="grid grid-cols-2 gap-2 mt-6 pt-4 border-t border-slate-100 dark:border-gray-800">
                    <Link href={`/instructor/courses/${course.slug}/upload`}>
                      <Button
                        variant="outline"
                        className="w-full gap-1.5 text-[10px] font-extrabold border-slate-200 dark:border-gray-800 hover:bg-primary/5 hover:text-primary rounded-xl py-2 cursor-pointer"
                      >
                        <UploadCloud className="w-3.5 h-3.5 shrink-0" />
                        {isAr ? 'رفع الدروس' : 'Syllabus'}
                      </Button>
                    </Link>

                    <Link href={`/instructor/courses/${course.slug}/students`}>
                      <Button className="w-full gap-1.5 bg-primary hover:bg-primary/95 text-white text-[10px] font-extrabold rounded-xl py-2 cursor-pointer shadow-sm shadow-primary/20">
                        {isAr ? 'متابعة الطلاب' : 'Tracking'}
                        <ArrowRight className={`w-3.5 h-3.5 shrink-0 ${isAr ? 'rotate-180' : ''}`} />
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}