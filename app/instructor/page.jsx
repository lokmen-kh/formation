"use client";

import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  BookOpen, Users, Layers, UploadCloud, GraduationCap,
  ArrowRight, LayoutDashboard
} from 'lucide-react';
import Link from 'next/link';

/* Mêmes tons que le dashboard Admin (STAT_TONES) pour une identité visuelle
   cohérente entre les deux espaces — plus de dégradés bleu/émeraude/violet
   ad hoc, on réutilise primary / success / secondary. */
const STAT_TONES = {
  primary: { bg: 'bg-primary/10', text: 'text-primary' },
  success: { bg: 'bg-success/10', text: 'text-success' },
  secondary: { bg: 'bg-secondary/10', text: 'text-secondary' },
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
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fb] dark:bg-gray-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t('common.loading')}</span>
        </div>
      </div>
    );
  }

  // Calcul des statistiques globales pour l'enseignant
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
    <div className={`min-h-screen bg-[#f8f9fb] dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300 pb-20 ${isAr ? 'font-cairo' : 'font-sans'}`}>

      <div className="max-w-7xl mx-auto space-y-8">

        {/* En-tête de bienvenue */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-150/40 dark:border-gray-900">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-primary block mb-1">
              {isAr ? 'منصة الأستاذ والمدرب' : 'Instructor Workspace'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-950 dark:text-white flex items-center gap-2">
              <LayoutDashboard className="w-6 h-6 text-primary shrink-0" />
              {isAr ? `مرحباً بك، أ. ${user?.fullName || ''}` : `Welcome, Prof. ${user?.fullName || ''}`}
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {isAr
                ? 'تابع إحصائيات طلابك وقم بإدارة محتوى فصولك ودروسك بسهولة'
                : 'Monitor student metrics and manage curriculum contents seamlessly'}
            </p>
          </div>
        </div>

        {/* Cartes de Statistiques Enseignant — même langage visuel que l'espace Admin */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {stats.map((stat, i) => {
            const colors = STAT_TONES[stat.tone];
            return (
              <div
                key={i}
                className="flex items-center gap-4 p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-gray-800/60 shadow-elegant transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary/30"
              >
                <div className={`w-11 h-11 rounded-xl ${colors.bg} flex items-center justify-center shrink-0`}>
                  <stat.Icon className={`w-5 h-5 ${colors.text}`} />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider truncate">
                    {stat.label}
                  </div>
                  <div className="text-base sm:text-lg font-black text-gray-900 dark:text-white mt-1 leading-none">
                    {stat.val}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Liste des cours assignés */}
        <div className="space-y-6 pt-4">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-5 bg-primary rounded-full" />
            <h2 className="text-lg font-black text-gray-950 dark:text-white">
              {isAr ? 'المساقات المسندة إليك' : 'Your Assigned Tracks'}
            </h2>
          </div>

          {courses.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
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
                    className="group flex flex-col justify-between rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-gray-800/60 p-6 shadow-elegant transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary/30"
                  >
                    {/* Infos du cours */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between gap-2">
                        <Badge variant="primary" className="text-[9px] font-black px-2.5 py-0.5">
                          {isAr ? course.category?.nameAr : course.category?.nameEn}
                        </Badge>
                        <Badge
                          variant={course.published ? 'success' : 'secondary'}
                          className="text-[9px] font-bold px-2.5 py-0.5"
                        >
                          {course.published ? (isAr ? 'منشور' : 'Active') : (isAr ? 'مسودة' : 'Draft')}
                        </Badge>
                      </div>

                      <h3 className="text-sm sm:text-base font-black text-gray-950 dark:text-white leading-snug group-hover:text-primary transition-colors line-clamp-2">
                        {isAr ? course.titleAr : course.titleEn}
                      </h3>

                      {/* Stats sous forme de puces filaires */}
                      <div className="flex flex-wrap gap-x-4 gap-y-2 text-[11px] font-bold text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-800 pt-3">
                        <div className="flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 shrink-0" />
                          <span>{nf.format(course.chapters?.length || 0)} {isAr ? 'فصول' : 'chapters'}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 shrink-0" />
                          <span>{nf.format(lessonsCount)} {isAr ? 'دروس' : 'lessons'}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 shrink-0" />
                          <span>{nf.format(course._count?.enrollments || 0)} {isAr ? 'طلاب' : 'students'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions : Navigation vers la gestion ou suivi étudiant */}
                    <div className="grid grid-cols-2 gap-2 mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                      <Link href={`/instructor/courses/${course.slug}/upload`}>
                        <Button
                          variant="outline"
                          className="w-full gap-1.5 text-[10px] font-bold border-gray-200 dark:border-gray-800 hover:bg-primary/5 hover:text-primary rounded-xl py-2 cursor-pointer"
                        >
                          <UploadCloud className="w-3.5 h-3.5 shrink-0" />
                          {isAr ? 'رفع الدروس' : 'Syllabus'}
                        </Button>
                      </Link>

                      <Link href={`/instructor/courses/${course.slug}/students`}>
                        <Button className="w-full gap-1.5 bg-primary hover:bg-primary/90 text-white text-[10px] font-bold rounded-xl py-2 cursor-pointer shadow-sm shadow-primary/20">
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
    </div>
  );
}