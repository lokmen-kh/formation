"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

/* -------------------------------------------------------------------------- */
/* Icônes Vectorielles Minimalistes Uniformes (Style Lucide)                  */
/* -------------------------------------------------------------------------- */

function IconChevronRight(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}
function IconPlay(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" />
    </svg>
  );
}
function IconClock(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
function IconUser(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
function IconStar(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="currentColor" />
    </svg>
  );
}
function IconMessageCircle(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
function IconCheckCircle(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
function IconLock(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
function IconCheck(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
function IconShieldLock(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}
function IconUsers(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
function IconGraduationCap(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" />
    </svg>
  );
}
function IconReceiptCard(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M8 8h8" />
      <path d="M8 12h6" />
      <path d="M8 16h4" />
    </svg>
  );
}
function IconSearchOff(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
      <path d="M8 8l6 6M14 8l-6 6" />
    </svg>
  );
}
function IconDownload(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
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

export default function CourseDetailsPage() {
  const { slug } = useParams();
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const router = useRouter();

  const [course, setCourse] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [firstLessonId, setFirstLessonId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [activeTab, setActiveTab] = useState('syllabus');

  // Sélection d'offre d'abonnement dynamique [2]
  const [selectedOfferId, setSelectedOfferId] = useState(null);

  const isAr = language === 'ar';
  const nf = new Intl.NumberFormat('fr-FR');

  useEffect(() => {
    if (slug) {
      fetch(`/api/public/courses/${slug}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.course) {
            setCourse(data.course);
            const firstId = data.course.chapters?.[0]?.lessons?.[0]?.id;
            setFirstLessonId(firstId);
            
            // Sélectionner par défaut la première offre disponible
            if (data.course.offers && data.course.offers.length > 0) {
              setSelectedOfferId(data.course.offers[0].id);
            }
          }
        })
        .catch((err) => console.error(err));

      fetch(`/api/public/courses/${slug}/comments`)
        .then((res) => res.json())
        .then((data) => {
          if (data.comments) setComments(data.comments);
        })
        .catch((err) => console.error(err));
    }
  }, [slug]);

  useEffect(() => {
    if (user && course) {
      fetch('/api/student/my-courses')
        .then((res) => res.json())
        .then((data) => {
          if (data.enrollments) {
            const matched = data.enrollments.find(
              (e) => e.courseId === course.id && e.status === 'APPROVED'
            );
            if (matched) setIsEnrolled(true);
          }
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user, course]);

  // Gérer la soumission de la commande d'abonnement [2]
  const handleCheckoutRedirect = () => {
    if (!user) {
      router.push(`/login?redirect=/courses/${course.slug}`);
      return;
    }
    if (!selectedOfferId) return;
    router.push(`/checkout?courseId=${course.id}&offerId=${selectedOfferId}`);
  };

  // NOUVEAU : Récupérer un lien de téléchargement signé temporaire pour le document [2]
  const handleDownloadResource = async (lessonId) => {
    try {
      const res = await fetch(`/api/student/document-token/${lessonId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Accès verrouillé.');
      
      // Ouvrir le document privé pré-signé en toute sécurité dans un nouvel onglet
      window.open(data.downloadUrl, '_blank');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!user) {
      router.push('/login');
      return;
    }
    if (!newComment.trim()) return;
    setSubmittingComment(true);

    try {
      const res = await fetch(`/api/public/courses/${slug}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newComment }),
      });
      if (res.ok) {
        const data = await res.json();
        setComments((prev) => [data.comment, ...prev]);
        setNewComment('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fb] dark:bg-gray-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">{t('common.loading')}</span>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fb] dark:bg-gray-950 px-6">
        <div className="text-center space-y-6 max-w-md">
          <span className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white dark:bg-gray-900 text-gray-400 dark:text-gray-600 shadow-md">
            <IconSearchOff className="w-9 h-9" />
          </span>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white">
            {isAr ? 'الدورة غير موجودة' : 'Course Not Found'}
          </h2>
          <p className="text-sm text-gray-550 leading-relaxed">
            {isAr ? 'عذراً، لم نتمكن من العثور على هذه الدورة' : "Sorry, we couldn't find this course"}
          </p>
          <Link href="/">
            <Button className="bg-primary hover:bg-primary/95 text-white font-bold rounded-2xl py-3 px-8 transition-all duration-300 shadow-lg shadow-primary/20 hover:-translate-y-0.5">
              {t('common.back')}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const title = isAr ? course.titleAr : course.titleEn;
  const description = isAr ? course.descriptionAr : course.descriptionEn;
  
  const categoryLabel = course.category 
    ? (isAr ? course.category.nameAr : course.category.nameEn) 
    : (isAr ? 'التعليم' : 'Education');

  const chapters = course.chapters || [];
  const totalLessons = chapters.reduce((acc, ch) => acc + (ch.lessons?.length || 0), 0);
  const totalChapters = chapters.length;
  const hoursEstimate = Math.max(1, Math.round(totalLessons * 1.5));

  const displayRating = '4.8';
  const displayReviews = '128';

  const offers = course.offers || [];
  const selectedOffer = offers.find(o => o.id === selectedOfferId) || offers[0];

  return (
    <div className={`min-h-screen bg-[#f8f9fb] dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300 pb-16 ${isAr ? 'font-cairo' : 'font-sans'}`}>
      
      {/* Container Principal "Academy" */}
      <div className="max-w-7xl mx-auto px-6 pt-10">
        
        {/* Fil d'Ariane épuré */}
        <nav className="flex items-center gap-2 text-xs font-bold text-gray-500 mb-8 select-none">
          <Link href="/" className="hover:text-primary transition-colors">{isAr ? 'الرئيسية' : 'Home'}</Link>
          <IconChevronRight className={`w-3.5 h-3.5 text-gray-400 ${isAr ? 'rotate-180' : ''}`} />
          <Link href="/courses" className="hover:text-primary transition-colors">{isAr ? 'المساقات' : 'Tracks'}</Link>
          <IconChevronRight className={`w-3.5 h-3.5 text-gray-400 ${isAr ? 'rotate-180' : ''}`} />
          <span className="text-gray-900 dark:text-white font-black truncate max-w-[200px]">{categoryLabel}</span>
        </nav>

        {/* Structure Deux Colonnes Compacte */}
        <div className="grid lg:grid-cols-[1.65fr_1fr] gap-10 items-start">
          
          {/* ================= COLONNE DE GAUCHE : INFOS & CONTENU DE L'ONGLET ================= */}
          <div className="space-y-8">
            
            <div className="space-y-5">
              {/* Badge Catégorie */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/10">
                <IconGraduationCap className="w-4 h-4" />
                <span className="text-[10px] font-extrabold uppercase tracking-wider">{categoryLabel}</span>
              </div>

              {/* Titre Principal */}
              <h1 className="text-3xl sm:text-4xl lg:text-4.5xl font-black leading-tight text-gray-950 dark:text-white tracking-tight">
                {title}
              </h1>

              {/* Court extrait descriptif */}
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-350 leading-relaxed font-medium">
                {description ? description.substring(0, 180) + '...' : ''}
              </p>
            </div>

            {/* Grille de badges métadonnées 2x2 compacte */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
              {[
                { label: isAr ? 'فيديوهات مسجلة' : 'Online Videos', val: `${totalLessons} ${isAr ? 'درس' : 'Lessons'}`, icon: IconPlay },
                { label: isAr ? 'مدة الدراسة المقدرة' : 'Duration estimate', val: `${hoursEstimate} ${isAr ? 'ساعة' : 'Hours'}`, icon: IconClock },
                { label: isAr ? 'مشاركين نشطين' : 'Active Community', val: `${nf.format(course._count?.enrollments || 0)} ${isAr ? 'طالب' : 'Learners'}`, icon: IconUsers },
                { label: isAr ? 'التقييم العام' : 'Global Rating', val: `${displayRating} (${displayReviews} ${isAr ? 'مراجعة' : 'reviews'})`, icon: IconStar }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3.5 p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-gray-800 shadow-sm">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <item.icon className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-gray-455 dark:text-gray-500 uppercase tracking-wide">{item.label}</div>
                    <div className="text-xs font-extrabold text-gray-900 dark:text-white mt-0.5">{item.val}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Instructeur Profil */}
            <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-gray-800 shadow-sm max-w-sm">
              <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-primary to-indigo-500 flex items-center justify-center text-white font-bold shadow-md">
                {course.instructor?.fullName?.charAt(0).toUpperCase() || <IconUser className="w-5 h-5" />}
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-455 dark:text-gray-500 uppercase tracking-wider">{isAr ? 'المدرب المسؤول' : 'Instructor'}</p>
                <p className="text-sm font-black text-gray-955 dark:text-white mt-0.5">
                  {course.instructor?.fullName || (isAr ? 'مدرب معتمد' : 'Certified Instructor')}
                </p>
              </div>
            </div>

            {/* Navigation par Onglets Intégrée */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/60 dark:border-gray-800 p-2 flex gap-1 shadow-sm">
              {[
                { id: 'syllabus', label: isAr ? 'المنهج الدراسي' : 'Course Content' },
                { id: 'comments', label: isAr ? 'التعليقات والمناقشات' : 'Comments' },
                { id: 'about', label: isAr ? 'عن الدورة' : 'About' },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs transition-all duration-300 cursor-pointer ${
                      isActive
                        ? 'bg-primary text-white shadow-md'
                        : 'text-gray-550 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-800'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Contenus des onglets */}
            <div className="space-y-6">
              
              {activeTab === 'syllabus' && (
                <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200/60 dark:border-gray-800 p-6 lg:p-8 shadow-sm space-y-6">
                  <div>
                    <h2 className="text-lg font-black text-gray-955 dark:text-white">
                      {isAr ? 'برنامج الدورة التدريبية' : 'Course Program'}
                    </h2>
                    <p className="mt-1 text-xs text-gray-500">
                      {totalChapters} {isAr ? 'فصل' : 'chapters'} · {totalLessons} {isAr ? 'درس في المنهج' : 'lessons'}
                    </p>
                  </div>

                  {chapters.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-gray-150 rounded-2xl">
                      <p className="text-sm font-semibold text-gray-400">
                        {isAr ? 'لم يتم رفع محتوى الدورة بعد.' : 'No course chapters uploaded yet.'}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {chapters.map((chapter, i) => {
                        const isPreview = i === 0;
                        const lessonsCount = chapter.lessons?.length || 0;
                        return (
                          <div key={chapter.id} className="border border-gray-150 dark:border-gray-800 rounded-2xl p-5 hover:shadow-md transition-shadow duration-300">
                            <div className="flex items-center justify-between gap-4 flex-wrap">
                              <div className="flex items-center gap-3.5">
                                <span className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isEnrolled ? 'bg-primary text-white shadow-sm' : 'bg-gray-100 dark:bg-gray-850/60 text-gray-400'}`}>
                                  {isEnrolled ? <IconPlay className="w-4 h-4 fill-white" /> : <IconLock className="w-4 h-4" />}
                                </span>
                                <div>
                                  <h3 className="text-sm font-extrabold text-gray-900 dark:text-white">
                                    {isAr ? chapter.titleAr : chapter.titleEn}
                                  </h3>
                                  <p className="text-[11px] font-bold text-gray-455 mt-0.5">
                                    {lessonsCount} {isAr ? 'درس' : 'lessons'}
                                  </p>
                                </div>
                              </div>
                              <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg ${isEnrolled ? 'bg-primary/10 text-primary' : 'bg-gray-100 dark:bg-gray-800 text-gray-550'}`}>
                                {isEnrolled ? (isAr ? 'مفتوح' : 'Open') : (isAr ? 'مقفل' : 'Locked')}
                              </span>
                            </div>

                            {/* Système d'interaction dynamique bilingue lié strictement à l'abonnement élève [2] */}
                            {lessonsCount > 0 && (
                              <ul className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-855 space-y-2.5 text-xs text-gray-555 list-none">
                                {chapter.lessons.map((lesson, idx) => {
                                  if (isEnrolled) {
                                    return (
                                      <li key={lesson.id} className="flex flex-col gap-2">
                                        <div className="flex items-center justify-between w-full flex-wrap gap-2">
                                          <Link
                                            href={`/courses/${course.slug}/watch/${lesson.id}`}
                                            className="flex-1 flex items-center gap-2.5 py-2 px-3 rounded-xl transition-all duration-300 hover:bg-primary/5 hover:text-primary cursor-pointer group font-semibold"
                                          >
                                            <span className="opacity-70 group-hover:scale-110 transition-transform">📖</span>
                                            <span>{idx + 1}. {isAr ? lesson.titleAr : lesson.titleEn}</span>
                                            <span className="ms-auto text-[10px] font-black text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                              {isAr ? 'مشاهدة الآن ←' : 'Watch Now →'}
                                            </span>
                                          </Link>
                                          
                                          {/* DOCUMENT SECONDAIRE SÉCURISÉ : Téléchargement dynamique par token signé [2] */}
                                          {lesson.documentUrl && (
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleDownloadResource(lesson.id);
                                              }}
                                              className="inline-flex items-center gap-1.5 text-[9px] font-black bg-violet-500/10 text-violet-600 dark:text-violet-400 px-3 py-1.5 rounded-xl border border-violet-500/10 hover:bg-violet-500/20 cursor-pointer"
                                            >
                                              <IconDownload className="h-3 w-3 shrink-0 animate-pulse" />
                                              {isAr ? 'تحميل المرفق' : 'Download Resource'}
                                            </button>
                                          )}
                                        </div>
                                      </li>
                                    );
                                  } else {
                                    return (
                                      <li key={lesson.id}>
                                        <button
                                          onClick={() => {
                                            const element = document.getElementById('checkout-aside');
                                            if (element) {
                                              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                              element.classList.add('ring-4', 'ring-primary/20', 'scale-[1.01]');
                                              setTimeout(() => {
                                                element.classList.remove('ring-4', 'ring-primary/20', 'scale-[1.01]');
                                              }, 1500);
                                            }
                                          }}
                                          className="w-full flex items-center gap-2.5 py-2 px-3 rounded-xl transition-all duration-300 text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-850/40 text-start cursor-pointer group font-medium"
                                        >
                                          <span className="opacity-60">🔒</span>
                                          <span>{idx + 1}. {isAr ? lesson.titleAr : lesson.titleEn}</span>
                                          <span className="ms-auto text-[9px] font-black text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {isAr ? 'اشترك لفتح الدرس' : 'Subscribe to unlock'}
                                          </span>
                                        </button>
                                      </li>
                                    );
                                  }
                                })}
                              </ul>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'comments' && (
                <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200/60 dark:border-gray-800 p-6 lg:p-8 shadow-sm space-y-6">
                  <h2 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                    <IconMessageCircle className="w-5 h-5 text-violet-500" />
                    {isAr ? 'الأسئلة والتعليقات' : 'Questions & Discussion'}
                  </h2>

                  <form onSubmit={handleAddComment} className="space-y-4">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder={isAr ? 'اكتب سؤالك أو استفسارك هنا...' : 'Post a comment or ask a question...'}
                      required
                      rows={3}
                      className="w-full p-4 text-xs border border-gray-200 dark:border-gray-800 rounded-2xl bg-gray-50/50 dark:bg-gray-955 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/50 text-gray-800"
                    />
                    <div className="flex justify-end">
                      <Button type="submit" disabled={submittingComment} className="bg-primary hover:bg-primary/95 text-white font-bold px-6 py-3 rounded-2xl shadow-md">
                        {submittingComment ? t('common.loading') : (isAr ? 'نشر التعليق' : 'Publish Comment')}
                      </Button>
                    </div>
                  </form>

                  <div className="space-y-5 pt-4">
                    {comments.length === 0 ? (
                      <p className="text-xs text-gray-455 text-center py-6">{isAr ? 'لا توجد تعليقات بعد.' : 'No comments posted yet.'}</p>
                    ) : (
                      comments.map((comment) => (
                        <div key={comment.id} className="flex gap-4 p-4 rounded-2xl bg-[#f8f9fb] dark:bg-gray-950/20 border border-gray-150/40">
                          <div className="w-9 h-9 rounded-xl bg-violet-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                            {comment.user?.fullName?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-xs text-gray-900 dark:text-white">{comment.user?.fullName}</span>
                              <span className="text-[10px] text-gray-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
                            </div>
                            <p className="text-xs sm:text-sm text-gray-700 mt-1 font-semibold leading-relaxed">{comment.content}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'about' && (
                <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200/60 dark:border-gray-800 p-6 lg:p-8 shadow-sm space-y-4">
                  <h2 className="text-lg font-black text-gray-955 dark:text-white">
                    {isAr ? 'تفاصيل ومعلومات الدورة' : 'About This Program'}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-655 dark:text-gray-350 leading-relaxed whitespace-pre-line font-medium">
                    {description}
                  </p>
                </div>
              )}

            </div>

          </div>

          {/* ================= COLONNE DE DROITE : ABONNEMENT COMPACT ET DESIGN D'OFFRES AVANCÉ ================= */}
          <div className="lg:sticky lg:top-24 space-y-6">
            
            <aside id="checkout-aside" className="rounded-3xl border border-gray-200/60 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-6 transition-all duration-500">
              
              {/* Box d'Aperçu Vidéo Stylisé */}
              <div className="relative aspect-video rounded-2xl bg-gradient-to-br from-primary to-indigo-900 flex flex-col items-center justify-center text-white overflow-hidden group shadow-inner">
                <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
                <div className="absolute inset-0 opacity-15" style={{
                  backgroundImage: 'radial-gradient(circle, white 10%, transparent 11%)',
                  backgroundSize: '12px 12px'
                }} />
                
                <button className="relative z-10 w-14 h-14 rounded-full bg-white text-primary flex items-center justify-center shadow-2xl transition-all duration-300 group-hover:scale-110 active:scale-95 cursor-pointer">
                  <IconPlay className="w-5 h-5 fill-primary ml-1" />
                </button>
                <span className="text-[10px] font-black uppercase tracking-widest text-white/80 mt-3 relative z-10">
                  {isAr ? 'عرض مقدمة الدورة' : 'Watch Preview'}
                </span>
              </div>

              {/* SECTION DES ABONNÉS - RENDU DES OFFRES RÉELLES ET BOUTON D'ABONNEMENT [2] */}
              {isEnrolled ? (
                // S'il est inscrit et approuvé, on remplace par un accès direct vert premium [2]
                <div className="space-y-4">
                  <div className="flex items-center gap-2.5 text-emerald-600 bg-emerald-500/10 rounded-2xl p-4 border border-emerald-500/15">
                    <IconCheckCircle className="w-5 h-5 shrink-0" />
                    <div>
                      <p className="text-xs font-black leading-tight">
                        {isAr ? 'الاشتراك مفعّل ونشط' : 'Subscription is Active'}
                      </p>
                      <p className="text-[10px] text-gray-500 mt-1">
                        {isAr ? 'لديك حق الوصول الكامل للمنهج' : 'You have full verified curriculum access'}
                      </p>
                    </div>
                  </div>
                  {firstLessonId ? (
                    <Link href={`/courses/${course.slug}/watch/${firstLessonId}`} className="block">
                      <Button className="w-full font-black py-4 rounded-2xl bg-primary hover:bg-primary/95 text-white shadow-lg shadow-primary/25 transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                        📖 {isAr ? 'ابدأ التعلم الآن' : 'Start Learning Now'}
                      </Button>
                    </Link>
                  ) : (
                    <Button className="w-full font-bold py-4 rounded-2xl" variant="outline" disabled>
                      {isAr ? 'المحتوى غير متاح مؤقتا' : 'Lessons coming soon'}
                    </Button>
                  )}
                </div>
              ) : (
                // S'il n'est pas encore inscrit, on affiche la liste des offres réelles et le bouton s'abonner [2]
                <div className="space-y-5">
                  <div className="space-y-1">
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider">
                      {isAr ? 'اختر عرض الاشتراك المناسب' : 'Choose Your Subscription'}
                    </h4>
                    <p className="text-[10px] text-gray-500">
                      {isAr ? 'وفر أكثر مع اشتراكات الفترات الطويلة' : 'Save more with long-term billing plans'}
                    </p>
                  </div>

                  {offers.length === 0 ? (
                    <div className="text-center py-6 border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl">
                      <p className="text-xs font-bold text-gray-400">
                        {isAr ? 'لا تتوفر اشتراكات لهذا الكورس حالياً' : 'No dynamic offers currently configured'}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {offers.map((offer) => {
                        const isSelected = selectedOfferId === offer.id;
                        const hasDiscount = offer.oldPrice && offer.oldPrice > offer.price;
                        const discountPct = hasDiscount 
                          ? Math.round(((offer.oldPrice - offer.price) / offer.oldPrice) * 100) 
                          : 0;

                        return (
                          <div
                            key={offer.id}
                            onClick={() => setSelectedOfferId(offer.id)}
                            className={`group relative p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 flex items-center justify-between select-none ${
                              isSelected
                                ? 'border-primary bg-primary/[0.02] shadow-md shadow-primary/5 ring-4 ring-primary/5'
                                : 'border-gray-200/80 dark:border-gray-800 hover:border-primary/40 bg-white dark:bg-gray-900/40 hover:-translate-y-0.5'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              {/* Rond de sélection */}
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                                isSelected ? 'border-primary bg-primary' : 'border-gray-300 dark:border-gray-700'
                              }`}>
                                {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                              </div>
                              
                              <div>
                                <p className="text-xs font-black text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                                  {isAr ? offer.nameAr : offer.nameEn}
                                </p>
                                <p className="text-[10px] font-bold text-gray-455 dark:text-gray-500 mt-0.5">
                                  {offer.durationMonths} {isAr ? 'أشهر' : 'Months'}
                                </p>
                              </div>
                            </div>

                            {/* Tarifs de l'offre */}
                            <div className="text-right flex flex-col items-end shrink-0">
                              <span className="text-sm font-black text-gray-900 dark:text-white">
                                {nf.format(offer.price)} {isAr ? 'دج' : 'DZD'}
                              </span>
                              {hasDiscount && (
                                <span className="text-[10px] text-gray-400 line-through">
                                  {nf.format(offer.oldPrice)} {isAr ? 'دج' : 'DZD'}
                                </span>
                              )}
                              {hasDiscount && (
                                <span className="inline-block mt-1 text-[8px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                                  -{discountPct}%
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* BOUTON S'ABONNER DYNAMIQUE [2] */}
                  {selectedOffer && (
                    <div className="pt-2">
                      <Button
                        onClick={handleCheckoutRedirect}
                        className="w-full font-black py-4 rounded-2xl bg-primary hover:bg-primary/95 text-white shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/25 transition-all duration-300 hover:-translate-y-1 active:translate-y-0 active:shadow-md cursor-pointer text-xs"
                      >
                        🚀 {isAr ? 'اشترك في العرض الآن' : 'Subscribe to Selected Offer'}
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Spécifications Bullet Points */}
              <div className="pt-5 border-t border-gray-150 dark:border-gray-800/80 space-y-3.5 text-xs text-gray-550 dark:text-gray-400">
                <div className="flex items-center gap-3">
                  <IconPlay className="w-4 h-4 text-primary shrink-0" />
                  <span className="font-semibold">{isAr ? 'فيديوهات شرح عالية الدقة' : 'High-definition online videos'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <IconDownload className="w-4 h-4 text-primary shrink-0" />
                  <span className="font-semibold">{isAr ? 'ملخصات وموارد قابلة للتحميل' : 'Multiple downloadable resources'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <IconShieldLock className="w-4 h-4 text-primary shrink-0" />
                  <span className="font-semibold">{isAr ? 'بث آمن وحماية كاملة لحسابك' : 'Secure and verified streaming only'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <IconReceiptCard className="w-4 h-4 text-primary shrink-0" />
                  <span className="font-semibold">{isAr ? 'طرق دفع بريد الجزائر و CCP' : 'Local payment support (CCP, BaridiMob)'}</span>
                </div>
              </div>

            </aside>

            {/* Objectifs atteints (Cartouche secondaire de droite) */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200/60 dark:border-gray-800 p-6 shadow-sm space-y-4">
              <h3 className="font-black text-gray-950 dark:text-white text-sm flex items-center gap-2">
                <span className="w-1.5 h-4 bg-primary rounded-full" />
                {isAr ? 'ما ستحققه في نهاية الدورة' : "What you'll achieve"}
              </h3>
              <ul className="space-y-3 text-xs text-gray-655 dark:text-gray-400">
                {[
                  { en: 'Follow a guided path with no guesswork', ar: 'منهج أكاديمي واضح ومرتب خطوة بخطوة' },
                  { en: 'Apply each concept in hands-on exercises', ar: 'تطبيقات عملية لكل مفهوم يتم شرحه' },
                  { en: 'Revise faster with bilingual summaries', ar: 'مراجعة فعالة عبر ملخصات مكتوبة باللغتين' },
                ].map((o, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="mt-0.5 w-4 h-4 shrink-0 rounded-full bg-emerald-500/15 text-emerald-600 flex items-center justify-center">
                      <IconCheck className="w-2.5 h-2.5" />
                    </span>
                    <span className="font-semibold leading-normal">{isAr ? o.ar : o.en}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}