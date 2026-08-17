"use client";

import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { 
  BookOpen, Users, Layers, UploadCloud, Edit, 
  ArrowRight, ArrowLeft, Search, Globe, FolderOpen
} from 'lucide-react';
import Link from 'next/link';

export default function InstructorCoursesPage() {
  const { language, t } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const isAr = language === 'ar';
  const nf = new Intl.NumberFormat(isAr ? 'ar-DZ' : 'fr-FR');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/instructor/courses');
      return;
    }

    // Charger uniquement les cours liés à ce professeur
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

  // Filtrer les cours en temps réel par titre bilingue
  const filteredCourses = courses.filter((course) => {
    const term = searchTerm.trim().toLowerCase();
    const titleAr = course.titleAr || '';
    const titleEn = course.titleEn || '';
    return !term || titleAr.toLowerCase().includes(term) || titleEn.toLowerCase().includes(term);
  });

  if (authLoading || loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 animate-pulse">
        <div className="w-12 h-12 border-4 border-primary/25 border-t-primary rounded-full animate-spin mb-4" />
        <span className="text-xs font-bold text-gray-400 dark:text-gray-550 uppercase tracking-widest">{t('common.loading')}</span>
      </div>
    );
  }

  return (
    <div className={`space-y-8 ${isAr ? 'font-cairo' : 'font-sans'}`}>
      
      {/* Bouton de Retour à la لوحة التحكم */}
      <div className="flex">
        <Link 
          href="/instructor" 
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-primary dark:text-gray-500 dark:hover:text-primary transition-colors group select-none"
        >
          <ArrowLeft className={`w-4 h-4 transition-transform group-hover:-translate-x-1 ${isAr ? 'rotate-180 group-hover:translate-x-1' : ''}`} />
          {isAr ? 'العودة إلى لوحة التحكم' : 'Back to Dashboard'}
        </Link>
      </div>

      {/* En-tête de la page */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-200/50 dark:border-gray-800/60">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl border border-primary/15">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            {isAr ? 'إدارة المساقات التعليمية' : 'My Assigned Courses'}
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {isAr 
              ? 'استعرض تفاصيل مساقاتك، قم بتعديل الباقات والأسعار، أو أضف دروساً وتابع تقدم طلابك.' 
              : 'Review your tracks, manage subscription plans, upload lessons, and monitor student metrics.'}
          </p>
        </div>
      </div>

      {/* Barre de recherche de cours */}
      <div className="relative rounded-2xl border border-slate-200/50 dark:border-gray-800/60 bg-white dark:bg-gray-900 p-3 shadow-sm max-w-md">
        <div className="relative">
          <Search className={`absolute ${isAr ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400`} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={isAr ? 'ابحث باسم المساق...' : 'Search courses by title...'}
            className="w-full text-xs sm:text-sm bg-slate-50/50 dark:bg-gray-955/45 border border-slate-200 dark:border-gray-800 focus:border-primary/50 focus:ring-0 rounded-xl py-3 ps-10 pe-10 outline-none transition-all duration-200"
          />
        </div>
      </div>

      {/* Liste des cours assignés */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-gray-800 shadow-sm">
          <FolderOpen className="w-14 h-14 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            {isAr ? 'لم نجد أي مساقات مطابقة للبحث' : 'No assigned tracks found'}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto mt-2 leading-relaxed">
            {isAr 
              ? 'يرجى تغيير كلمات البحث أو التواصل مع الإدارة لتعيين مساقات جديدة لحسابك.' 
              : 'Try adjusting your search query, or contact the administrator to assign new courses.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => {
            const lessonsCount = course.chapters?.reduce((acc, chap) => acc + (chap.lessons?.length || 0), 0) || 0;

            return (
              <div
                key={course.id}
                className="group flex flex-col justify-between rounded-2xl bg-white dark:bg-gray-900 border border-slate-200/50 dark:border-gray-800/60 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-primary/30"
              >
                {/* Informations de la carte */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <Badge variant="primary" className="text-[9px] font-black px-2.5 py-0.5">
                      {isAr ? course.category?.nameAr : course.category?.nameEn}
                    </Badge>
                    
                    <div className="flex items-center gap-1.5 ml-auto">
                      {/* Lien de prévisualisation publique du cours */}
                      <Link href={`/courses/${course.slug}`} target="_blank">
                        <Badge variant="outline" className="text-[9px] font-bold px-2.5 py-0.5 border-primary/20 text-primary bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer">
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

                  {/* Statistiques sous forme de puces filaires */}
                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-[11px] font-bold text-gray-400 dark:text-gray-505 border-t border-slate-100 dark:border-gray-800 pt-3.5">
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

                {/* Actions (Syllabus, Edit, Tracking) */}
                <div className="space-y-2 mt-6 pt-4 border-t border-slate-100 dark:border-gray-800">
                  <div className="grid grid-cols-2 gap-2">
                    {/* Action 1 : Upload de chapitres / Syllabus */}
                    <Link href={`/instructor/courses/${course.slug}/upload`}>
                      <Button
                        variant="outline"
                        className="w-full gap-1.5 text-[10px] font-extrabold border-slate-200 dark:border-gray-800 hover:bg-primary/5 hover:text-primary rounded-xl py-2 cursor-pointer"
                      >
                        <UploadCloud className="w-3.5 h-3.5 shrink-0" />
                        {isAr ? 'رفع الدروس' : 'Syllabus'}
                      </Button>
                    </Link>

                    {/* Action 2 : Édition des métadonnées et plans d'offres */}
                    <Link href={`/instructor/courses/${course.slug}/edit`}>
                      <Button
                        variant="outline"
                        className="w-full gap-1.5 text-[10px] font-extrabold border-slate-200 dark:border-gray-800 hover:bg-primary/5 hover:text-primary rounded-xl py-2 cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5 shrink-0" />
                        {isAr ? 'تعديل المساق' : 'Edit Info'}
                      </Button>
                    </Link>
                  </div>

                  {/* Action 3 : Suivi de progression des élèves */}
                  <Link href={`/instructor/courses/${course.slug}/students`} className="block w-full">
                    <Button className="w-full gap-1.5 bg-primary hover:bg-primary/95 text-white text-[10px] font-extrabold rounded-xl py-2.5 cursor-pointer shadow-sm shadow-primary/20">
                      {isAr ? 'متابعة تقدم الطلاب المشتركين' : 'Track Student Progress'}
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
  );
}