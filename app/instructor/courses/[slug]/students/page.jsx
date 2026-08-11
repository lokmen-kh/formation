"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/progress';
import {
  Users, Search, BookOpen, Calendar, GraduationCap,
  ArrowLeft, Mail, Phone, Briefcase, Award
} from 'lucide-react';
import Link from 'next/link';

/* Mêmes tons que le reste du back-office (Admin / Instructor dashboard) —
   plus de dégradés bleu/émeraude/violet ad hoc. */
const STAT_TONES = {
  primary: { bg: 'bg-primary/10', text: 'text-primary' },
  success: { bg: 'bg-success/10', text: 'text-success' },
  secondary: { bg: 'bg-secondary/10', text: 'text-secondary' },
};

export default function InstructorStudentTrackingPage() {
  const { slug } = useParams();
  const { language, t } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [course, setCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const isAr = language === 'ar';
  const nf = new Intl.NumberFormat(isAr ? 'ar-DZ' : 'fr-FR');

  useEffect(() => {
    if (!slug) return;

    fetch(`/api/public/courses/${slug}`)
      .then(res => res.json())
      .then(data => {
        if (data.course) {
          setCourse(data.course);
        }
      })
      .catch(err => console.error('Error loading course details:', err));
  }, [slug]);

  useEffect(() => {
    if (!course) return;

    const role = user?.role?.toUpperCase();
    if (role !== 'ADMIN' && course.instructorId !== user?.id) {
      router.replace('/instructor');
      return;
    }

    fetch(`/api/instructor/students/${course.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.students) {
          setStudents(data.students);
        }
      })
      .catch(err => console.error('Error loading students progress:', err))
      .finally(() => setLoading(false));
  }, [course, user, router]);

  const filteredStudents = students.filter(student => {
    const term = searchTerm.trim().toLowerCase();
    const fullName = student.user?.fullName?.toLowerCase() || '';
    const email = student.user?.email?.toLowerCase() || '';
    const phone = student.user?.phone?.toLowerCase() || '';
    return !term || fullName.includes(term) || email.includes(term) || phone.includes(term);
  });

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

  const courseTitle = isAr ? course?.titleAr : course?.titleEn;

  const classProgressAvg = students.length > 0
    ? Math.round(students.reduce((acc, s) => acc + s.progress, 0) / students.length)
    : 0;

  const stats = [
    {
      label: isAr ? 'إجمالي الطلاب الملتحقين' : 'Total Active Students',
      val: `${nf.format(students.length)} ${isAr ? 'طالب' : 'Learners'}`,
      tone: 'primary',
      Icon: Users
    },
    {
      label: isAr ? 'متوسط نسبة تقدم الصف' : 'Average Class Progress',
      val: `${classProgressAvg}%`,
      tone: 'success',
      Icon: Award
    },
    {
      label: isAr ? 'إجمالي فصول المنهج' : 'Course Chapters',
      val: `${course?.chapters?.length || 0} ${isAr ? 'فصول' : 'Chapters'}`,
      tone: 'secondary',
      Icon: BookOpen
    }
  ];

  return (
    <div className={`min-h-screen bg-[#f8f9fb] dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300 pb-20 ${isAr ? 'font-cairo' : 'font-sans'}`}>

      <div className="max-w-7xl mx-auto px-6 pt-10 space-y-8">

        {/* En-tête */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-150/40 dark:border-gray-900">
          <div className="flex items-center gap-4">
            <Link href="/instructor">
              <button className="w-9 h-9 rounded-xl bg-white hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800/60 text-gray-600 dark:text-gray-300 flex items-center justify-center border border-gray-200/60 dark:border-gray-800 shadow-sm transition-all cursor-pointer">
                <ArrowLeft className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} />
              </button>
            </Link>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-primary block mb-0.5">
                {courseTitle}
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-gray-950 dark:text-white flex items-center gap-2">
                <Users className="size-5 text-primary shrink-0" />
                {isAr ? 'متابعة تقدم الطلاب' : 'Student Progress Tracking'}
              </h1>
            </div>
          </div>
        </div>

        {/* Stats — mêmes tons que les autres dashboards du back-office */}
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
                  <div className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider truncate">{stat.label}</div>
                  <div className="text-base sm:text-lg font-black text-gray-900 dark:text-white mt-1 leading-none">{stat.val}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Barre de recherche */}
        <div className="relative rounded-2xl border-2 border-gray-200 dark:border-gray-800 focus-within:border-primary bg-white dark:bg-gray-900 p-1 shadow-elegant max-w-md transition-colors duration-200">
          <div className="relative">
            <Search className="absolute start-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={isAr ? 'ابحث باسم الطالب، البريد، أو الهاتف...' : 'Search by name, email or phone...'}
              className="w-full text-xs sm:text-sm bg-transparent rounded-xl py-3 ps-11 pe-4 outline-none transition-all duration-200 text-gray-900 dark:text-white placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Tableau de suivi */}
        {filteredStudents.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 p-16 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <p className="text-sm font-bold text-gray-500 dark:text-gray-400">
              {isAr ? 'لم نجد أي طالب مطابق للبحث في هذا المساق' : 'No matching student records found for this course.'}
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200/60 dark:border-gray-800 shadow-elegant overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-start border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-950/50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-gray-800">
                    <th className="p-5 text-start">{isAr ? 'الطالب وبيانات الاتصال' : 'Student & Contact'}</th>
                    <th className="p-5 text-start">{isAr ? 'المستوى والحالة المهنية' : 'Education & Job'}</th>
                    <th className="p-5 text-start">{isAr ? 'معدل إنجاز الدروس' : 'Curriculum Progress'}</th>
                    <th className="p-5 text-end">{isAr ? 'تاريخ نهاية الاشتراك' : 'Subscription Expiry'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                  {filteredStudents.map((item) => (
                    <tr key={item.enrollmentId} className="hover:bg-gray-50/60 dark:hover:bg-gray-800/30 transition-colors">

                      {/* Élève Info */}
                      <td className="p-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                            {item.user?.fullName?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-gray-900 dark:text-white text-sm sm:text-base truncate">{item.user?.fullName}</div>
                            <div className="text-[10px] font-semibold text-gray-400 flex items-center flex-wrap gap-x-1.5 gap-y-0.5 mt-0.5">
                              <Mail className="w-3.5 h-3.5 shrink-0" /> <span className="truncate">{item.user?.email}</span>
                              {item.user?.phone && (
                                <>
                                  <span>•</span>
                                  <Phone className="w-3.5 h-3.5 shrink-0" /> {item.user.phone}
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Niveau d'études et Statut d'emploi (avec repli vers l'audience si absent) */}
                      <td className="p-5">
                        <div className="flex items-center gap-2 mb-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300">
                          <GraduationCap className="w-4 h-4 text-gray-400 shrink-0" />
                          <span>{item.user?.educationLevel || item.user?.audience || (isAr ? 'غير محدد' : 'Not specified')}</span>
                        </div>
                        <Badge variant="primary" className="text-[9px] px-2 py-0.5">
                          <Briefcase className="w-3 h-3 me-1.5 inline shrink-0" />
                          {item.user?.jobStatus === 'EMPLOYEE' ? (isAr ? 'موظف / عامل حُر' : 'Employee') : (isAr ? 'طالب' : 'Student')}
                        </Badge>
                      </td>

                      {/* Progression réelle calculée en base */}
                      <td className="p-5">
                        <div className="space-y-2 max-w-[180px]">
                          <div className="flex justify-between text-[10px] font-bold text-gray-500 dark:text-gray-400">
                            <span>{item.completedCount}/{item.totalLessonsCount} {isAr ? 'درس مكتمل' : 'completed'}</span>
                            <span>{item.progress}%</span>
                          </div>
                          <Progress value={item.progress} className="h-1.5" />
                        </div>
                      </td>

                      {/* Date de fin d'abonnement */}
                      <td className="p-5 text-end">
                        <div className="flex items-center justify-end gap-2 text-xs font-bold text-gray-700 dark:text-gray-300">
                          <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
                          <span>
                            {item.expiresAt ? (
                              new Date(item.expiresAt).toLocaleDateString(isAr ? 'ar-DZ' : 'en-US', {
                                year: 'numeric', month: 'short', day: 'numeric'
                              })
                            ) : (
                              <span className="italic font-normal text-gray-400">{isAr ? 'وصول دائم' : 'Lifetime Access'}</span>
                            )}
                          </span>
                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}