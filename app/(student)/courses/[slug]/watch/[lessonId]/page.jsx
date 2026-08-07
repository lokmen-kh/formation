"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useVideoProgress } from '@/components/VideoPlayer/useVideoProgress';
import VideoPlayer from '@/components/VideoPlayer/VideoPlayer';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import ThemeToggle from '@/components/ThemeToggle';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

/* -------------------------------------------------------------------------- */
/* Icônes Vectorielles Fines (Style Lucide)                                   */
/* -------------------------------------------------------------------------- */

function IconChevronRight(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}
function IconLock(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
function IconPlayCircle(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" />
    </svg>
  );
}
function IconArrowLeft(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M19 12H5" />
      <path d="M12 19l-7-7 7-7" />
    </svg>
  );
}
function IconFileText(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}
function IconClock(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
function IconCheckCircle(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
function IconMenu(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}
function IconX(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
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

export default function WatchLessonPage() {
  const { slug: courseSlug, lessonId } = useParams();
  const { language, t } = useLanguage();
  const router = useRouter();

  const [course, setCourse] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [playbackUrl, setPlaybackUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [lockedError, setLockedError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [downloadingDoc, setDownloadingDoc] = useState(false); // État de chargement pour le document [2]

  const isAr = language === 'ar';

  // 1. OPTIMISATION : Charger le cours une seule fois au montage [2]
  useEffect(() => {
    if (!courseSlug) return;

    fetch(`/api/public/courses/${courseSlug}`)
      .then(res => res.json())
      .then(data => {
        if (data.course) {
          setCourse(data.course);
        }
      })
      .catch(err => console.error(err));
  }, [courseSlug]);

  // 2. OPTIMISATION : Synchroniser la leçon active en mémoire (Zéro délai de requête) [2]
  useEffect(() => {
    if (!course || !lessonId) return;
    const allLessons = course.chapters?.flatMap(c => c.lessons) || [];
    const matched = allLessons.find(l => l.id === lessonId);
    setActiveLesson(matched);
  }, [course, lessonId]);

  // 3. Charger le token vidéo de manière asynchrone sécurisée
  useEffect(() => {
    if (!lessonId) {
      setLoading(false);
      return;
    }
    setLockedError('');
    setPlaybackUrl('');
    setLoading(true);

    fetch(`/api/student/video-token/${lessonId}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Acces verrouille.');
        setPlaybackUrl(data.playbackUrl);
      })
      .catch(err => {
        setLockedError(err.message);
      })
      .finally(() => setLoading(false));
  }, [lessonId]);

  const handleCompletion = () => {
    alert(isAr ? 'عمل رائع ! لقد أكملت هذا الدرس بنجاح.' : 'Great job! You successfully completed this lesson.');
  };

  const { handlePlay, handlePause, handleEnded } = useVideoProgress({
    lessonId,
    onCompleted: handleCompletion
  });

  // Récupérer un lien signé temporaire pour le téléchargement sécurisé du document [2]
  const handleDownloadResource = async () => {
    if (!activeLesson?.id) return;
    setDownloadingDoc(true);
    try {
      const res = await fetch(`/api/student/document-token/${activeLesson.id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Accès verrouillé.');
      
      // Ouvrir le fichier de ressources privé pré-signé de B2 en toute sécurité dans un nouvel onglet
      window.open(data.downloadUrl, '_blank');
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setDownloadingDoc(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fb] dark:bg-gray-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">{t('common.loading')}</span>
        </div>
      </div>
    );
  }

  const title = isAr ? activeLesson?.titleAr : activeLesson?.titleEn;
  const courseTitle = isAr ? course?.titleAr : course?.titleEn;
  const allLessons = course?.chapters?.flatMap(c => c.lessons) || [];
  const currentIndex = allLessons.findIndex(l => l.id === lessonId);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  // Calcul du libellé bilingue de la catégorie réelle du cours [5]
  const categoryLabel = course?.category 
    ? (isAr ? course.category.nameAr : course.category.nameEn) 
    : (isAr ? 'التعليم' : 'Education');

  return (
    <div className="min-h-screen bg-[#f8f9fb] dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      
      {/* Boutons d'outils flottants discrets (Remplacent la Navbar) */}
      <div className="absolute top-4 end-4 z-40 flex items-center gap-2">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-md hover:bg-gray-100/80 text-gray-600 dark:text-gray-300 flex items-center justify-center border border-gray-150/40 dark:border-gray-800/60 shadow-sm lg:hidden cursor-pointer"
        >
          {sidebarOpen ? <IconX className="w-5 h-5" /> : <IconMenu className="w-5 h-5" />}
        </button>
        <LanguageSwitcher />
        <ThemeToggle />
      </div>

      {/* Main Content - YouTube Layout */}
      <div className="max-w-7xl mx-auto px-6 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Video Player Section */}
          <div className="flex-1 min-w-0 w-full space-y-6">
            
            {/* Fil d'Ariane épuré unifié à 5 niveaux */}
            <nav className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs font-bold text-gray-500 select-none pb-4 border-b border-gray-100 dark:border-gray-800/80">
              <Link href="/" className="hover:text-primary transition-colors">{isAr ? 'الرئيسية' : 'Home'}</Link>
              <IconChevronRight className={`w-3.5 h-3.5 text-gray-400 ${isAr ? 'rotate-180' : ''}`} />
              <Link href="/courses" className="hover:text-primary transition-colors">{isAr ? 'دوراتنا' : 'Courses'}</Link>
              <IconChevronRight className={`w-3.5 h-3.5 text-gray-400 ${isAr ? 'rotate-180' : ''}`} />
              <span className="text-gray-400">{categoryLabel}</span>
              <IconChevronRight className={`w-3.5 h-3.5 text-gray-400 ${isAr ? 'rotate-180' : ''}`} />
              <Link href={`/courses/${courseSlug}`} className="hover:text-primary transition-colors truncate max-w-[150px]">{courseTitle}</Link>
              <IconChevronRight className={`w-3.5 h-3.5 text-gray-400 ${isAr ? 'rotate-180' : ''}`} />
              <span className="text-gray-900 dark:text-white font-black truncate max-w-[180px]">{title}</span>
            </nav>

            {/* Lecteur ou Écran de Verrouillage */}
            {lockedError ? (
              <div className="aspect-video w-full bg-slate-950 rounded-3xl flex flex-col items-center justify-center p-8 text-center space-y-5 shadow-xl border border-gray-150/40 dark:border-gray-855/40 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-[100px] pointer-events-none" />
                <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center border border-red-500/20 text-red-500 shrink-0">
                  <IconLock className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-base sm:text-lg font-black text-white">
                    {isAr ? 'عذراً، محتوى هذا الدرس مقفل' : 'This Lesson is Currently Locked'}
                  </h3>
                  <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
                    {isAr
                      ? 'يتطلب مشاهدة هذا الفيديو أن تكون مشتركاً ومعتمداً من الإدارة في هذا الكورس. يرجى تأكيد اشتراكك للوصول.'
                      : 'Watching this video requires an active approved course subscription. Please complete your enrollment to proceed.'}
                  </p>
                </div>
                <div className="pt-2">
                  <Link href={`/courses/${courseSlug}`}>
                    <Button className="bg-primary hover:bg-primary/95 text-white font-bold py-3 px-8 rounded-xl text-xs transition-all duration-300 hover:-translate-y-0.5 shadow-lg shadow-primary/20 cursor-pointer flex items-center gap-2">
                      <IconPlayCircle className="w-4 h-4 text-white" />
                      {isAr ? 'عرض خطط الاشتراك' : 'View Subscription Plans'}
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border border-gray-150/40 dark:border-gray-850/40 shadow-sm">
                <VideoPlayer
                  playbackUrl={playbackUrl}
                  posterUrl={course?.imageUrl}
                  onPlay={handlePlay}
                  onPause={handlePause}
                  onEnded={handleEnded}
                />
              </div>
            )}

            {/* Infos du cours & Navigation entre leçons */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-gray-955 dark:text-white">
                    {title}
                  </h2>
                  <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                    <Badge variant="primary" className="text-[10px] px-2.5 py-0.5">
                      <IconClock className="w-3.5 h-3.5 mr-1.5 inline" />
                      {isAr ? 'درس' : 'Lesson'} {currentIndex + 1}/{allLessons.length}
                    </Badge>
                    <Badge variant="success" className="text-[10px] px-2.5 py-0.5">
                      <IconCheckCircle className="w-3.5 h-3.5 mr-1.5 inline" />
                      {isAr ? 'مكتمل' : 'Completed'}
                    </Badge>
                  </div>
                </div>

                {/* Boutons de navigation précédents et suivants */}
                <div className="flex gap-2 sm:shrink-0">
                  {prevLesson && (
                    <Link href={`/courses/${courseSlug}/watch/${prevLesson.id}`}>
                      <Button variant="outline" className="border-gray-200 dark:border-gray-800 hover:bg-primary/5 hover:text-primary rounded-xl px-4 py-2.5 text-xs font-bold transition-all cursor-pointer">
                        <IconArrowLeft className={`w-3.5 h-3.5 inline mr-1.5 ${isAr ? 'rotate-180' : ''}`} />
                        {isAr ? 'الدرس السابق' : 'Previous'}
                      </Button>
                    </Link>
                  )}
                  {nextLesson && (
                    <Link href={`/courses/${courseSlug}/watch/${nextLesson.id}`}>
                      <Button className="bg-primary hover:bg-primary/95 text-white rounded-xl px-4 py-2.5 text-xs font-bold transition-all shadow-md shadow-primary/10 hover:-translate-y-0.5 cursor-pointer">
                        {isAr ? 'الدرس التالي' : 'Next'}
                        <IconArrowLeft className={`w-3.5 h-3.5 inline ml-1.5 ${isAr ? '' : 'rotate-180'}`} />
                      </Button>
                    </Link>
                  )}
                </div>
              </div>

              {/* Notes Écrites & Téléchargement des Documents de Ressources SÉCURISÉ [2] */}
              {(activeLesson?.writtenContentAr || activeLesson?.writtenContentEn || activeLesson?.documentUrl) && (
                <div className="bg-white dark:bg-gray-900 p-6 lg:p-8 rounded-3xl border border-gray-150/40 dark:border-gray-850/40 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3 flex-wrap gap-2">
                    <h3 className="font-black text-gray-955 dark:text-white text-xs sm:text-sm flex items-center gap-2.5">
                      <IconFileText className="w-4.5 h-4.5 text-primary" />
                      {isAr ? 'الملخص المكتوب والملاحظات' : 'Written Notes & Materials'}
                    </h3>
                    
                    {activeLesson?.documentUrl && (
                      <button
                        onClick={handleDownloadResource}
                        disabled={downloadingDoc}
                        className="inline-flex items-center gap-1.5 text-xs font-bold bg-violet-500/10 text-violet-650 dark:text-violet-400 px-3.5 py-2 rounded-xl border border-violet-500/20 hover:bg-violet-500/20 cursor-pointer transition-all duration-300 hover:-translate-y-0.5"
                      >
                        <IconDownload className="h-4 w-4 shrink-0 animate-pulse" />
                        {downloadingDoc ? (isAr ? 'جاري التحضير...' : 'Loading...') : (isAr ? 'تحميل ملف الملحق (PDF)' : 'Download Resource (PDF)')}
                      </button>
                    )}
                  </div>
                  
                  {(activeLesson?.writtenContentAr || activeLesson?.writtenContentEn) && (
                    <p className="text-xs sm:text-sm text-gray-655 dark:text-gray-450 leading-relaxed whitespace-pre-line font-medium pt-1">
                      {isAr ? activeLesson.writtenContentAr : activeLesson.writtenContentEn}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Playlist (YouTube Style) - Sans bordure solide */}
          <div className={`w-full lg:w-80 xl:w-96 shrink-0 ${sidebarOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="sticky top-10 bg-white dark:bg-gray-900 rounded-3xl border border-gray-150/40 dark:border-gray-850/40 shadow-sm p-5 max-h-[calc(100vh-80px)] overflow-y-auto no-scrollbar">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100 dark:border-gray-800">
                <h3 className="text-xs font-black text-gray-955 dark:text-white uppercase tracking-wider">
                  {isAr ? 'فهرس الدروس المبرمجة' : 'Playlist Index'}
                </h3>
                <span className="text-[10px] font-bold text-gray-455">
                  {allLessons.length} {isAr ? 'درس' : 'lessons'}
                </span>
              </div>

              <div className="space-y-1.5">
                {allLessons.map((lesson, index) => {
                  const isActive = lesson.id === lessonId;
                  return (
                    <Link
                      key={lesson.id}
                      href={`/courses/${courseSlug}/watch/${lesson.id}`}
                      className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                        isActive
                          ? 'bg-primary/10 border border-primary/20 shadow-sm scale-[1.01]'
                          : 'hover:bg-gray-50/60 dark:hover:bg-gray-850/50'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
                        isActive
                          ? 'bg-primary text-white shadow-md'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-550'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-bold truncate ${
                          isActive ? 'text-primary' : 'text-gray-700 dark:text-gray-300'
                        }`}>
                          {isAr ? lesson.titleAr : lesson.titleEn}
                        </p>
                        <p className="text-[9px] text-gray-450 truncate mt-0.5">
                          {isAr ? 'مدة الدرس' : 'Lesson duration'}
                        </p>
                      </div>
                      {isActive && (
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}