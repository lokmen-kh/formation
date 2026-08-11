"use client";

import { useState, useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import {
  Layers, Play, FileText, Trash2, BookOpen, MessageSquare, Loader2, UploadCloud,
  Plus, XCircle, Grid, List, Download, FileUp, Edit
} from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Accordion, AccordionItem, AccordionTrigger, AccordionContent,
} from '@/components/ui/accordion';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from '@/components/ui/select';

/* -------------------------------------------------------------------------- */
/* Champs façon "panneau de filtres" : libellé posé sur la bordure du champ,  */
/* cohérent avec le reste du back-office (Admin / Instructor).                */
/* -------------------------------------------------------------------------- */
function FieldBox({ label, required, children, className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <span className="absolute -top-2.5 start-3 px-1.5 bg-white dark:bg-gray-950 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide z-10">
        {label} {required && <span className="text-error">*</span>}
      </span>
      <div className="border-2 border-gray-200 dark:border-gray-800 focus-within:border-primary rounded-2xl transition-colors duration-200">
        {children}
      </div>
    </div>
  );
}

/* Zone de dépôt de fichier : pointillés tant que rien n'est choisi, puis
   badge avec nom du fichier + bouton d'annulation une fois sélectionné. */
function FileDropField({ label, icon: Icon, accept, file, onChange, onClear, hint, tone = 'primary' }) {
  const toneClasses = tone === 'primary'
    ? 'border-primary/30 bg-primary/5 text-primary hover:bg-primary/10'
    : 'border-accent/40 bg-accent/5 text-accent hover:bg-accent/10';

  return (
    <div>
      <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">
        {label}
      </label>
      {file ? (
        <div className="flex items-center gap-3 h-12 px-4 rounded-2xl border-2 border-primary/30 bg-primary/5">
          <Icon className="w-4 h-4 text-primary shrink-0" />
          <span className="flex-1 min-w-0 truncate text-xs font-semibold text-primary">{file.name}</span>
          <button
            type="button"
            onClick={onClear}
            aria-label="Clear"
            className="p-1 rounded-full hover:bg-primary/10 text-primary/70 hover:text-primary shrink-0 cursor-pointer"
          >
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <label className={`flex h-12 w-full cursor-pointer items-center gap-2 rounded-2xl border-2 border-dashed px-4 text-xs font-semibold transition-colors ${toneClasses}`}>
          <Icon className="h-4 w-4 shrink-0" />
          <span className="truncate">{hint}</span>
          <input type="file" accept={accept} onChange={onChange} className="hidden" />
        </label>
      )}
    </div>
  );
}

export default function InstructorCourseDetailsPage() {
  const { slug } = useParams();
  const { language } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [course, setCourse] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');

  // États des fenêtres modales
  const [isChapterModalOpen, setIsChapterModalOpen] = useState(false);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Édition de leçon dynamique
  const [editingLesson, setEditingLesson] = useState(null);

  // États d'upload progressif vers Backblaze B2
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewVideoUrl, setPreviewVideoUrl] = useState(null);

  // États de l'accordéon des chapitres
  const [openChapters, setOpenChapters] = useState([]);

  // États d'ajout de chapitre
  const [chapTitleAr, setChapTitleAr] = useState('');
  const [chapTitleEn, setChapTitleEn] = useState('');
  const [chapOrder, setChapOrder] = useState('');

  // États d'ajout de leçon
  const [selectedChapterId, setSelectedChapterId] = useState('');
  const [lessonTitleAr, setLessonTitleAr] = useState('');
  const [lessonTitleEn, setLessonTitleEn] = useState('');
  const [writtenContentAr, setWrittenContentAr] = useState('');
  const [writtenContentEn, setWrittenContentEn] = useState('');
  const [lessonOrder, setLessonOrder] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [documentFile, setDocumentFile] = useState(null);

  const isAr = language === 'ar';

  const fetchCourseDetails = async () => {
    try {
      const res = await fetch(`/api/public/courses/${slug}`);
      const data = await res.json();
      if (data.course) setCourse(data.course);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/public/courses/${slug}/comments`);
      const data = await res.json();
      if (data.comments) setComments(data.comments);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (slug) {
      Promise.all([fetchCourseDetails(), fetchComments()]).finally(() => setLoading(false));
    }
  }, [slug]);

  // BARRIÈRE DE SÉCURITÉ : Un professeur ne peut gérer que son propre cours
  useEffect(() => {
    if (!authLoading && user && course) {
      const role = user.role?.toUpperCase();
      if (role !== 'ADMIN' && course.instructorId !== user.id) {
        router.replace('/instructor');
      }
    }
  }, [user, authLoading, course, router]);

  useEffect(() => {
    if (course?.chapters?.length && openChapters.length === 0) {
      setOpenChapters([String(course.chapters[0].id)]);
    }
  }, [course]);

  const handlePreviewVideo = async (lessonId) => {
    try {
      const res = await fetch(`/api/student/video-token/${lessonId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Impossible de prévisualiser la vidéo.');
      setPreviewVideoUrl(data.playbackUrl);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAddChapter = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/courses/${course.id}/syllabus`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titleAr: chapTitleAr, titleEn: chapTitleEn, order: chapOrder })
      });

      if (res.ok) {
        setIsChapterModalOpen(false);
        setChapTitleAr(''); setChapTitleEn(''); setChapOrder('');
        fetchCourseDetails();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  // Pré-remplir le formulaire en mode édition
  const handleEditLesson = (lesson) => {
    setEditingLesson(lesson);
    setSelectedChapterId(String(lesson.chapterId));
    setLessonTitleAr(lesson.titleAr || '');
    setLessonTitleEn(lesson.titleEn || '');
    setWrittenContentAr(lesson.writtenContentAr || '');
    setWrittenContentEn(lesson.writtenContentEn || '');
    setLessonOrder(lesson.order ? lesson.order.toString() : '');
    setVideoFile(null);
    setDocumentFile(null);
    setUploadProgress(0);
    setIsLessonModalOpen(true);
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!confirm(isAr ? 'حذف هذا الدرس نهائياً ؟' : 'Delete this lesson permanently?')) return;
    try {
      const res = await fetch(`/api/instructor/lessons?id=${lessonId}`, { method: 'DELETE' });
      if (res.ok) {
        fetchCourseDetails();
      } else {
        const data = await res.json();
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddLesson = (e) => {
    e.preventDefault();
    setActionLoading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('chapterId', selectedChapterId);
    formData.append('titleAr', lessonTitleAr);
    formData.append('titleEn', lessonTitleEn);
    formData.append('writtenContentAr', writtenContentAr);
    formData.append('writtenContentEn', writtenContentEn);
    formData.append('order', lessonOrder);

    if (videoFile) formData.append('video', videoFile);
    if (documentFile) formData.append('document', documentFile);

    const url = editingLesson ? '/api/instructor/lessons' : '/api/instructor/upload-video';
    const method = editingLesson ? 'PUT' : 'POST';

    if (editingLesson) {
      formData.append('id', editingLesson.id);
    }

    const xhr = new XMLHttpRequest();
    xhr.open(method, url, true);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(percentComplete);
      }
    };

    xhr.onload = () => {
      setActionLoading(false);
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          if (data.success) {
            setIsLessonModalOpen(false);
            resetLessonForm();
            fetchCourseDetails();
          } else {
            alert(data.error || 'Échec du téléversement.');
          }
        } catch {
          alert('Erreur lors du traitement de la réponse.');
        }
      } else {
        alert('Échec du téléversement avec le statut : ' + xhr.status);
      }
    };

    xhr.onerror = () => {
      setActionLoading(false);
      alert('Une erreur réseau est survenue lors du téléversement.');
    };

    xhr.send(formData);
  };

  const resetLessonForm = () => {
    setEditingLesson(null);
    setLessonTitleAr(''); setLessonTitleEn(''); setWrittenContentAr('');
    setWrittenContentEn(''); setLessonOrder(''); setVideoFile(null);
    setDocumentFile(null);
    setUploadProgress(0);
  };

  const handleDeleteComment = async (commentId) => {
    if (!confirm(isAr ? 'حذف هذا التعليق ؟' : 'Delete this comment?')) return;
    try {
      const res = await fetch(`/api/admin/comments/${commentId}`, { method: 'DELETE' });
      if (res.ok) {
        fetchComments();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fb] dark:bg-gray-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            {isAr ? 'جاري التحميل...' : 'Loading Content...'}
          </p>
        </div>
      </div>
    );
  }

  const courseTitle = isAr ? course.titleAr : course.titleEn;
  const totalLessons = course?.chapters?.reduce((acc, c) => acc + (c.lessons?.length || 0), 0) || 0;

  return (
    <div className={`min-h-screen bg-[#f8f9fb] dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300 pb-16 ${isAr ? 'font-cairo' : 'font-sans'}`}>
      <div className="max-w-7xl mx-auto space-y-6 pt-8">

        {/* En-tête de cours — solid primary-dark, cohérent avec le reste du back-office */}
        <div className="relative overflow-hidden rounded-3xl bg-primary-dark p-6 md:p-8 border border-white/10 shadow-2xl shadow-slate-900/10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-sm shadow-md">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-[9px] font-black uppercase text-white/80 block mb-0.5 tracking-wider">
                    {isAr ? 'برنامج دراسة المساق' : 'Manage Syllabus'}
                  </span>
                  <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight drop-shadow-sm">
                    {courseTitle}
                  </h1>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 hover:text-white rounded-xl text-xs py-2.5 px-4 font-bold"
                  onClick={() => setIsChapterModalOpen(true)}
                >
                  <Plus className="w-4 h-4 me-2" />
                  {isAr ? 'إضافة فصل' : 'Add Chapter'}
                </Button>
                <Button
                  className="bg-white text-primary hover:bg-primary/5 shadow-md rounded-xl font-bold text-xs py-2.5 px-4"
                  onClick={() => { resetLessonForm(); setIsLessonModalOpen(true); }}
                >
                  <Plus className="w-4 h-4 me-2" />
                  {isAr ? 'إضافة درس' : 'Add Lesson'}
                </Button>
              </div>
            </div>

            {/* Statistiques rapides */}
            <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-white/10 text-white/80 text-xs font-semibold">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4" />
                <span>{course.chapters?.length || 0} {isAr ? 'فصول' : 'Chapters'}</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>{totalLessons} {isAr ? 'دروس مبرمجة' : 'Lessons'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Double Colonne */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* Syllabus */}
          <div className="lg:col-span-2">
            <Card className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200/60 dark:border-gray-800 shadow-elegant">
              <CardHeader className="pb-3 flex flex-row items-center justify-between border-b border-gray-100 dark:border-gray-800">
                <CardTitle className="text-sm font-black flex items-center gap-2 text-gray-900 dark:text-white">
                  <BookOpen className="size-[18px] text-primary" />
                  {isAr ? 'منهج ودروس المساق المعتمدة' : 'Syllabus & Lessons'}
                </CardTitle>
                <div className="flex gap-1 p-1 bg-gray-50 dark:bg-gray-950/40 rounded-xl border border-gray-100 dark:border-gray-800">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg transition-all duration-200 cursor-pointer ${viewMode === 'grid' ? 'bg-primary text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <Grid className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-lg transition-all duration-200 cursor-pointer ${viewMode === 'list' ? 'bg-primary text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {course.chapters?.length === 0 ? (
                  <div className="py-16 text-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl">
                    <Layers className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                      {isAr ? 'لم تقم بإضافة فصول بعد لبرنامج هذا المساق.' : 'No chapters created yet.'}
                    </p>
                  </div>
                ) : (
                  <Accordion
                    type="multiple"
                    value={openChapters}
                    onValueChange={setOpenChapters}
                    className="space-y-3.5"
                  >
                    {course.chapters?.map((chapter) => (
                      <AccordionItem
                        key={chapter.id}
                        value={String(chapter.id)}
                        className="rounded-2xl border border-gray-200/60 dark:border-gray-800 bg-white dark:bg-gray-950/40 overflow-hidden data-[state=open]:border-primary/40 transition-all duration-300"
                      >
                        <AccordionTrigger className="gap-3 px-5 py-4 text-xs sm:text-sm hover:no-underline hover:bg-gray-50/60 dark:hover:bg-gray-900/40 transition-colors">
                          <div className="flex min-w-0 flex-1 items-center gap-3">
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-black text-primary">
                              {chapter.order}
                            </span>
                            <span className="truncate font-black text-gray-900 dark:text-white">
                              {isAr ? chapter.titleAr : chapter.titleEn}
                            </span>
                          </div>
                          <span className="me-2 shrink-0 text-[10px] font-extrabold text-gray-400 dark:text-gray-500 uppercase">
                            {chapter.lessons?.length || 0} {isAr ? 'دروس' : 'lessons'}
                          </span>
                        </AccordionTrigger>

                        <AccordionContent className="px-5 pb-4">
                          {chapter.lessons?.length === 0 ? (
                            <p className="ps-1 text-xs italic text-gray-500 dark:text-gray-400">
                              {isAr ? 'لا توجد دروس في هذا الفصل بعد.' : 'No lessons in this chapter yet.'}
                            </p>
                          ) : (
                            <ul className="space-y-3.5 pt-4 border-t border-gray-100 dark:border-gray-800">
                              {chapter.lessons?.map((les) => (
                                <li
                                  key={les.id}
                                  className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl border border-gray-200/60 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 transition-all duration-200 hover:border-primary/30 hover:shadow-md"
                                >
                                  {/* Miniature Vidéo */}
                                  <button
                                    type="button"
                                    onClick={() => handlePreviewVideo(les.id)}
                                    disabled={!les.videoUrl}
                                    className={`group relative h-16 w-28 shrink-0 overflow-hidden rounded-xl bg-primary-dark ${les.videoUrl ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
                                  >
                                    {les.videoUrl ? (
                                      <>
                                        <video
                                          src={les.videoUrl}
                                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                          preload="metadata"
                                          muted
                                        />
                                        <span className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors group-hover:bg-black/50">
                                          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-primary shadow-lg">
                                            <Play className="h-3 w-3 fill-current" />
                                          </span>
                                        </span>
                                      </>
                                    ) : (
                                      <span className="flex h-full items-center justify-center text-[10px] font-black uppercase tracking-wider text-white/80">
                                        {isAr ? 'بدون فيديو' : 'No video'}
                                      </span>
                                    )}
                                  </button>

                                  {/* Info sur la Leçon */}
                                  <div className="min-w-0 flex-1">
                                    <p className="truncate text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
                                      {isAr ? les.titleAr : les.titleEn}
                                    </p>
                                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                                      <Badge variant="primary" className="gap-1 text-[9px] font-bold">
                                        <FileText className="h-3 w-3 shrink-0" />
                                        {les.writtenContentAr ? (isAr ? 'محتوى مكتوب' : 'Has notes') : (isAr ? 'بدون محتوى' : 'No notes')}
                                      </Badge>
                                      {les.videoUrl && (
                                        <Badge variant="success" className="gap-1 text-[9px] font-bold">
                                          <Play className="h-3 w-3 shrink-0" />
                                          {isAr ? 'فيديو' : 'Video'}
                                        </Badge>
                                      )}
                                      {les.documentUrl && (
                                        <a
                                          href={les.documentUrl}
                                          download
                                          onClick={(e) => e.stopPropagation()}
                                          className="inline-flex items-center gap-1 text-[9px] font-bold bg-accent/10 text-accent-dark px-2.5 py-0.5 rounded-full border border-accent/20 hover:bg-accent/20 transition-colors"
                                        >
                                          <Download className="h-3 w-3 shrink-0" />
                                          {isAr ? 'تحميل المورد (PDF)' : 'Download Resource'}
                                        </a>
                                      )}
                                    </div>
                                  </div>

                                  {/* Actions : Édition et Suppression de la leçon */}
                                  <div className="flex gap-1 sm:ms-auto shrink-0 self-end sm:self-auto">
                                    <button
                                      type="button"
                                      onClick={(e) => { e.stopPropagation(); handleEditLesson(les); }}
                                      aria-label={isAr ? 'تعديل الدرس' : 'Edit lesson'}
                                      className="p-1.5 rounded-lg hover:bg-primary/10 text-gray-400 hover:text-primary transition-colors cursor-pointer"
                                    >
                                      <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={(e) => { e.stopPropagation(); handleDeleteLesson(les.id); }}
                                      aria-label={isAr ? 'حذف الدرس' : 'Delete lesson'}
                                      className="p-1.5 rounded-lg hover:bg-error/10 text-gray-400 hover:text-error transition-colors cursor-pointer"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Section Commentaires */}
          <div className="lg:col-span-1">
            <Card className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200/60 dark:border-gray-800 shadow-elegant">
              <CardHeader className="pb-3 border-b border-gray-100 dark:border-gray-800">
                <CardTitle className="flex items-center gap-2 text-sm font-black text-gray-900 dark:text-white">
                  <MessageSquare className="size-[18px] text-primary" />
                  {isAr ? 'تعليقات ومناقشات الطلاب' : 'Student Comments'}
                  <Badge variant="secondary" className="ms-auto text-[10px] font-bold">
                    {comments.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {comments.length === 0 ? (
                  <div className="py-12 text-center">
                    <MessageSquare className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-gray-400">
                      {isAr ? 'لا توجد أسئلة أو تعليقات بعد.' : 'No student comments yet.'}
                    </p>
                  </div>
                ) : (
                  <ScrollArea className="h-[480px] pr-2 no-scrollbar">
                    <div className="space-y-3.5">
                      {comments.map((comment) => (
                        <div
                          key={comment.id}
                          className="space-y-2 rounded-2xl border border-gray-200/60 dark:border-gray-800 bg-white dark:bg-gray-950/40 p-4 transition-all hover:border-primary/20"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-xs shadow-sm">
                                {comment.user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                              </div>
                              <span className="text-xs font-bold text-gray-900 dark:text-white truncate max-w-[100px]">
                                {comment.user?.fullName || (isAr ? 'مستخدم' : 'User')}
                              </span>
                            </div>
                            <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400">
                              {new Date(comment.createdAt).toLocaleDateString(isAr ? 'ar-EG' : 'fr-FR')}
                            </span>
                          </div>
                          <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400 font-semibold">
                            {comment.content}
                          </p>
                          <div className="flex justify-end pt-1">
                            <button
                              onClick={() => handleDeleteComment(comment.id)}
                              className="inline-flex items-center gap-1 text-[10px] font-black text-error hover:opacity-80 transition-opacity cursor-pointer"
                            >
                              <Trash2 className="h-3 w-3" />
                              {isAr ? 'حذف' : 'Delete'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Dialog: Ajouter un chapitre — pied de page fixe hors zone de défilement */}
      <Dialog open={isChapterModalOpen} onOpenChange={setIsChapterModalOpen}>
        <DialogContent className="sm:max-w-lg bg-white dark:bg-gray-950 border border-gray-200/60 dark:border-gray-800 rounded-3xl shadow-2xl p-0 overflow-hidden flex flex-col max-h-[85vh]">
          <div className="px-6 pt-6 shrink-0">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-sm font-black text-gray-900 dark:text-white">
                <div className="p-2 rounded-xl bg-primary/10">
                  <Layers className="w-4 h-4 text-primary" />
                </div>
                {isAr ? 'إضافة فصل جديد' : 'New Chapter'}
              </DialogTitle>
            </DialogHeader>
          </div>

          <form id="chapter-form" onSubmit={handleAddChapter} className="flex-1 overflow-y-auto px-6 pt-5 pb-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FieldBox label={isAr ? 'عنوان الفصل (الإنجليزية)' : 'Chapter Title (English)'} required>
                <Input
                  required
                  value={chapTitleEn}
                  onChange={e => setChapTitleEn(e.target.value)}
                  placeholder={isAr ? 'مثال: مقدمة عامة' : 'e.g. Getting started'}
                  className="h-12 px-4 border-0 rounded-2xl bg-transparent shadow-none focus-visible:ring-0"
                />
              </FieldBox>
              <FieldBox label={isAr ? 'عنوان الفصل (عربي)' : 'Chapter Title (Arabic)'} required>
                <Input
                  required
                  dir="rtl"
                  value={chapTitleAr}
                  onChange={e => setChapTitleAr(e.target.value)}
                  placeholder="مثال: مقدمة عامة"
                  className="h-12 px-4 border-0 rounded-2xl bg-transparent shadow-none focus-visible:ring-0"
                />
              </FieldBox>
            </div>

            <FieldBox label={isAr ? 'الترتيب' : 'Order'} required>
              <Input
                type="number"
                required
                value={chapOrder}
                onChange={e => setChapOrder(e.target.value)}
                placeholder="1"
                className="h-12 px-4 border-0 rounded-2xl bg-transparent shadow-none focus-visible:ring-0"
              />
            </FieldBox>
          </form>

          {/* Pied fixe — toujours visible, hors du bloc défilant */}
          <DialogFooter className="flex-col gap-2 px-6 pb-6 pt-4 shrink-0 border-t border-gray-100 dark:border-gray-800">
            <Button type="submit" form="chapter-form" disabled={actionLoading} className="w-full h-12 rounded-2xl bg-primary-dark hover:bg-primary-dark/90 text-white font-bold text-sm">
              {actionLoading && <Loader2 className="me-1.5 h-3.5 w-3.5 animate-spin" />}
              {isAr ? 'حفظ الفصل' : 'Save Chapter'}
            </Button>
            <Button type="button" variant="outline" disabled={actionLoading} onClick={() => setIsChapterModalOpen(false)} className="w-full h-11 rounded-2xl border-2 border-gray-200 dark:border-gray-800">
              {isAr ? 'إلغاء' : 'Cancel'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog: Ajouter / Modifier une leçon — pied de page fixe (le bouton Enregistrer
          était auparavant DANS la zone défilante et pouvait rester hors champ). */}
      <Dialog open={isLessonModalOpen} onOpenChange={(open) => { if (!open) resetLessonForm(); setIsLessonModalOpen(open); }}>
        <DialogContent className="sm:max-w-2xl bg-white dark:bg-gray-950 border border-gray-200/60 dark:border-gray-800 rounded-3xl shadow-2xl p-0 overflow-hidden flex flex-col max-h-[85vh]">
          <div className="px-6 pt-6 shrink-0">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-sm font-black text-gray-900 dark:text-white">
                <div className="p-2 rounded-xl bg-primary/10">
                  {editingLesson ? <Edit className="w-4 h-4 text-primary" /> : <Plus className="w-4 h-4 text-primary" />}
                </div>
                {editingLesson ? (isAr ? 'تعديل بيانات الدرس' : 'Edit Lesson') : (isAr ? 'إضافة درس جديد' : 'New Lesson')}
              </DialogTitle>
            </DialogHeader>
          </div>

          <form id="lesson-form" onSubmit={handleAddLesson} className="flex-1 overflow-y-auto px-6 pt-5 pb-4 space-y-4">
            <FieldBox label={isAr ? 'الفصل' : 'Chapter'} required>
              <Select value={selectedChapterId} onValueChange={setSelectedChapterId} required>
                <SelectTrigger className="h-12 border-0 rounded-2xl bg-transparent shadow-none focus:ring-0">
                  <SelectValue placeholder={isAr ? '-- اختر الفصل --' : '-- Choose Chapter --'} />
                </SelectTrigger>
                <SelectContent>
                  {course.chapters?.map(ch => (
                    <SelectItem key={ch.id} value={String(ch.id)}>
                      {isAr ? ch.titleAr : ch.titleEn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FieldBox>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FieldBox label={isAr ? 'عنوان الدرس (الإنجليزية)' : 'Lesson Title (English)'} required>
                <Input
                  required
                  value={lessonTitleEn}
                  onChange={e => setLessonTitleEn(e.target.value)}
                  placeholder={isAr ? 'مثال: تثبيت البيئة' : 'e.g. Environment setup'}
                  className="h-12 px-4 border-0 rounded-2xl bg-transparent shadow-none focus-visible:ring-0"
                />
              </FieldBox>
              <FieldBox label={isAr ? 'عنوان الدرس (عربي)' : 'Lesson Title (Arabic)'} required>
                <Input
                  required
                  dir="rtl"
                  value={lessonTitleAr}
                  onChange={e => setLessonTitleAr(e.target.value)}
                  placeholder="مثال: تثبيت البيئة"
                  className="h-12 px-4 border-0 rounded-2xl bg-transparent shadow-none focus-visible:ring-0"
                />
              </FieldBox>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FieldBox label={isAr ? 'الملخص أو الوصف (الإنجليزية)' : 'Syllabus/Notes (English)'}>
                <Textarea
                  rows={3}
                  value={writtenContentEn}
                  onChange={e => setWrittenContentEn(e.target.value)}
                  placeholder={isAr ? 'ملخص مختصر للدرس' : 'A short summary of the lesson'}
                  className="p-4 border-0 rounded-2xl bg-transparent shadow-none resize-none focus-visible:ring-0"
                />
              </FieldBox>
              <FieldBox label={isAr ? 'الملخص أو الوصف (عربي)' : 'Syllabus/Notes (Arabic)'}>
                <Textarea
                  rows={3}
                  dir="rtl"
                  value={writtenContentAr}
                  onChange={e => setWrittenContentAr(e.target.value)}
                  placeholder="ملخص مختصر للدرس"
                  className="p-4 border-0 rounded-2xl bg-transparent shadow-none resize-none focus-visible:ring-0"
                />
              </FieldBox>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FieldBox label={isAr ? 'الترتيب' : 'Order'} required>
                <Input
                  type="number"
                  required
                  value={lessonOrder}
                  onChange={e => setLessonOrder(e.target.value)}
                  placeholder="1"
                  className="h-12 px-4 border-0 rounded-2xl bg-transparent shadow-none focus-visible:ring-0"
                />
              </FieldBox>

              <FileDropField
                label={isAr ? 'ملف الفيديو (Backblaze)' : 'Video File (B2)'}
                icon={UploadCloud}
                accept="video/*"
                file={videoFile}
                onChange={e => setVideoFile(e.target.files[0])}
                onClear={() => setVideoFile(null)}
                hint={editingLesson ? (isAr ? 'استبدال الفيديو (اختياري)' : 'Replace video (optional)') : (isAr ? 'اختر ملف فيديو' : 'Choose video')}
                tone="primary"
              />

              <FileDropField
                label={isAr ? 'ملف مرفق (PDF, Zip)' : 'Resource Document (PDF, Zip)'}
                icon={FileUp}
                accept="application/pdf,application/zip,application/x-zip-compressed"
                file={documentFile}
                onChange={e => setDocumentFile(e.target.files[0])}
                onClear={() => setDocumentFile(null)}
                hint={editingLesson ? (isAr ? 'استبدال الملف (اختياري)' : 'Replace file (optional)') : (isAr ? 'اختر ملف (PDF/Zip)' : 'Choose file (PDF/Zip)')}
                tone="accent"
              />
            </div>

            {actionLoading && uploadProgress > 0 && (
              <div className="space-y-2 p-4 bg-primary/5 rounded-2xl border-2 border-primary/20">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-primary">{isAr ? 'جاري الرفع إلى السحابة...' : 'Uploading content to B2...'}</span>
                  <span className="text-primary">{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}
          </form>

          {/* Pied fixe — toujours visible, hors du bloc défilant : c'est ce qui
              corrige le bouton "invisible" signalé. */}
          <DialogFooter className="flex-col gap-2 px-6 pb-6 pt-4 shrink-0 border-t border-gray-100 dark:border-gray-800">
            <Button type="submit" form="lesson-form" disabled={actionLoading} className="w-full h-12 rounded-2xl bg-primary-dark hover:bg-primary-dark/90 text-white font-bold text-sm">
              {actionLoading && <Loader2 className="me-1.5 h-3.5 w-3.5 animate-spin" />}
              {actionLoading
                ? (isAr ? 'جاري الرفع...' : 'Uploading...')
                : editingLesson
                  ? (isAr ? 'حفظ التعديلات' : 'Save Changes')
                  : (isAr ? 'حفظ الدرس والملفات' : 'Save Lesson & Files')}
            </Button>
            <Button type="button" variant="outline" disabled={actionLoading} onClick={() => setIsLessonModalOpen(false)} className="w-full h-11 rounded-2xl border-2 border-gray-200 dark:border-gray-800">
              {isAr ? 'إلغاء' : 'Cancel'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog: Video Preview */}
      <Dialog open={!!previewVideoUrl} onOpenChange={(open) => !open && setPreviewVideoUrl(null)}>
        <DialogContent className="sm:max-w-3xl bg-white dark:bg-gray-950 border border-gray-200/60 dark:border-gray-800 rounded-3xl shadow-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-sm font-black text-gray-900 dark:text-white">
              <Play className="w-5 h-5 text-primary" />
              {isAr ? 'معاينة فيديو الدرس' : 'Preview Lesson Video'}
            </DialogTitle>
          </DialogHeader>
          <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-xl">
            <video
              src={previewVideoUrl}
              controls
              controlsList="nodownload"
              className="h-full w-full object-contain"
              autoPlay
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}