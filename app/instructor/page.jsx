"use client";

import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { 
  BookOpen, Users, Layers, UploadCloud, GraduationCap, 
  Clock, ArrowRight, Sparkles, LayoutDashboard, Plus 
} from 'lucide-react';
import Link from 'next/link';

export default function InstructorDashboard() {
  const { language, t } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const isAr = language === 'ar';
  const nf = new Intl.NumberFormat('fr-FR');

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

  return (
    <div className={`min-h-screen bg-[#f8f9fb] dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300 pb-20 ${isAr ? 'font-cairo' : 'font-sans'}`}>
      
      {/* Container Principal */}
      <div className="max-w-7xl mx-auto px-6 pt-10 space-y-8">
        
        {/* En-tête de bienvenue */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-150/40 dark:border-gray-900">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-primary block mb-1">
              {isAr ? 'منصة الأستاذ والمدرب' : 'Instructor Workspace'}
            </span>
            <h1 className="text-2.5xl font-black text-gray-955 dark:text-white flex items-center gap-2">
              <LayoutDashboard className="w-6 h-6 text-primary" />
              {isAr ? `مرحباً بك، أ. ${user?.fullName || ''}` : `Welcome, Prof. ${user?.fullName || ''}`}
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              {isAr ? 'تابع إحصائيات طلابك وقم بإدارة محتوى فصولك ودروسك بسهولة' : 'Monitor student metrics and manage curriculum contents seamlessly'}
            </p>
          </div>
        </div>

        {/* Cartes de Statistiques Enseignant */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            { 
              label: isAr ? 'المساقات التعليمية النشطة' : 'Assigned Tracks', 
              val: `${courses.length} ${isAr ? 'مساقات' : 'Tracks'}`, 
              color: 'from-blue-500/10 to-indigo-500/10 text-primary',
              Icon: BookOpen 
            },
            { 
              label: isAr ? 'إجمالي الطلاب المشرف عليهم' : 'Students Enrolled', 
              val: `${nf.format(totalStudents)} ${isAr ? 'طالب' : 'Learners'}`, 
              color: 'from-emerald-500/10 to-teal-500/10 text-emerald-600',
              Icon: Users 
            },
            { 
              label: isAr ? 'إجمالي الدروس المصورة' : 'Total Lessons Created', 
              val: `${totalLessons} ${isAr ? 'دروس' : 'Lessons'}`, 
              color: 'from-purple-500/10 to-violet-500/10 text-purple-600',
              Icon: Layers 
            }
          ].map((stat, i) => (
            <div key={i} className="flex items-center gap-4 p-5 rounded-3xl bg-white dark:bg-gray-900 border border-slate-150/40 dark:border-gray-850/50 shadow-sm transition-transform duration-300 hover:-translate-y-0.5">
              <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shrink-0`}>
                <stat.Icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-gray-450 dark:text-gray-500 uppercase tracking-wider">{stat.label}</div>
                <div className="text-base sm:text-lg font-black text-gray-900 dark:text-white mt-1 leading-none">{stat.val}</div>
              </div>
            </div>
          ))}
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
            <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-3xl border border-dashed border-gray-150 dark:border-gray-800">
              <GraduationCap className="w-14 h-14 text-gray-300 dark:text-gray-600 mx-auto mb-4 animate-bounce" />
              <h3 className="text-base font-bold text-gray-950 dark:text-white">
                {isAr ? 'لا توجد مساقات مسندة إليك حالياً' : 'No tracks assigned yet'}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto mt-2 leading-relaxed">
                {isAr ? 'يرجى التواصل مع الإدارة لتعيين مساقات تعليمية إلى حسابك والبدء في رفع الدروس.' : 'Please contact the administrator to assign learning tracks to your account.'}
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => {
                const lessonsCount = course.chapters?.reduce((acc, chap) => acc + (chap.lessons?.length || 0), 0) || 0;
                
                return (
                  <div key={course.id} className="group flex flex-col justify-between rounded-3xl bg-white dark:bg-gray-900 border border-slate-150/40 dark:border-gray-850/50 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                    
                    {/* Infos du cours */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between gap-2">
                        <Badge variant="primary" className="text-[9px] font-black px-2.5 py-0.5">
                          {isAr ? course.category?.nameAr : course.category?.nameEn}
                        </Badge>
                        <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/10 text-[9px] font-bold">
                          {course.published ? (isAr ? 'منشور' : 'Active') : (isAr ? 'مسودة' : 'Draft')}
                        </Badge>
                      </div>

                      <h3 className="text-sm sm:text-base font-black text-gray-950 dark:text-white leading-snug group-hover:text-primary transition-colors line-clamp-2">
                        {isAr ? course.titleAr : course.titleEn}
                      </h3>

                      {/* Stats sous forme de puces filaires */}
                      <div className="flex flex-wrap gap-x-4 gap-y-2 text-[11px] font-bold text-gray-450 dark:text-gray-400 border-t border-gray-50 dark:border-gray-800/80 pt-3">
                        <div className="flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5" />
                          <span>{course.chapters?.length || 0} {isAr ? 'فصول' : 'chapters'}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>{lessonsCount} {isAr ? 'دروس' : 'lessons'}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5" />
                          <span>{course._count?.enrollments || 0} {isAr ? 'طلاب' : 'students'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions : Navigation vers la gestion ou suivi étudiant */}
                    <div className="grid grid-cols-2 gap-2 mt-6 pt-4 border-t border-gray-50 dark:border-gray-800/80">
                      
                      {/* Action 1 : Upload / Gestion du programme */}
                      <Link href={`/instructor/courses/${course.slug}/upload`}>
                        <Button variant="outline" className="w-full gap-1.5 text-[10px] font-bold border-gray-200 dark:border-gray-800 hover:bg-primary/5 hover:text-primary rounded-xl py-2 cursor-pointer">
                          <UploadCloud className="w-3.5 h-3.5 shrink-0" />
                          {isAr ? 'رفع الدروس' : 'Syllabus'}
                        </Button>
                      </Link>

                      {/* Action 2 : Suivi de progression des élèves */}
                      <Link href={`/instructor/courses/${course.slug}/students`}>
                        <Button className="w-full gap-1.5 bg-primary hover:bg-primary/95 text-white text-[10px] font-bold rounded-xl py-2 cursor-pointer shadow-sm shadow-primary/10">
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