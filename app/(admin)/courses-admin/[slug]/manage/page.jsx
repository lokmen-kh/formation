"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import {
  Layers, Play, FileText, Trash2, BookOpen, MessageSquare, Loader2, UploadCloud,
  ChevronDown, ChevronRight, Clock, User, Calendar, Eye, EyeOff, Edit, Plus,
  CheckCircle, XCircle, Sparkles, Grid, List, ArrowLeft, ArrowRight,
} from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
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

export default function AdminCourseDetailsPage() {
  const { slug } = useParams();
  const { language } = useLanguage();
  const router = useRouter();

  const [course, setCourse] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');

  const [isChapterModalOpen, setIsChapterModalOpen] = useState(false);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewVideoUrl, setPreviewVideoUrl] = useState(null);

  const [openChapters, setOpenChapters] = useState([]);

  const [chapTitleAr, setChapTitleAr] = useState('');
  const [chapTitleEn, setChapTitleEn] = useState('');
  const [chapOrder, setChapOrder] = useState('');

  const [selectedChapterId, setSelectedChapterId] = useState('');
  const [lessonTitleAr, setLessonTitleAr] = useState('');
  const [lessonTitleEn, setLessonTitleEn] = useState('');
  const [writtenContentAr, setWrittenContentAr] = useState('');
  const [writtenContentEn, setWrittenContentEn] = useState('');
  const [lessonOrder, setLessonOrder] = useState('');
  const [videoFile, setVideoFile] = useState(null);

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

  useEffect(() => {
    if (course?.chapters?.length && openChapters.length === 0) {
      setOpenChapters([String(course.chapters[0].id)]);
    }
  }, [course]);

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
    if (videoFile) {
      formData.append('video', videoFile);
    }

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/instructor/upload-video', true);

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
            setLessonTitleAr(''); setLessonTitleEn(''); setWrittenContentAr(''); setWrittenContentEn(''); setLessonOrder(''); setVideoFile(null);
            setUploadProgress(0);
            fetchCourseDetails();
          } else {
            alert(data.error || 'Échec du téléversement.');
          }
        } catch {
          alert('Erreur lors du traitement de la réponse serveur.');
        }
      } else {
        alert('Échec du téléversement avec le statut : ' + xhr.status);
      }
    };

    xhr.onerror = () => {
      setActionLoading(false);
      alert('Une erreur réseau est survenue lors du téléversement de la vidéo.');
    };

    xhr.send(formData);
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-blue-100/30 to-purple-50 dark:from-gray-950 dark:via-blue-950/20 dark:to-gray-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-900/50 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {isAr ? 'جاري التحميل...' : 'Chargement...'}
          </p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100/30 to-purple-50 dark:from-gray-950 dark:via-blue-950/20 dark:to-gray-950 p-8">
        <Card className="max-w-2xl mx-auto p-12 text-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-blue-200/50 dark:border-blue-800/50 shadow-xl">
          <div className="w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-10 h-10 text-blue-500" />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {isAr
              ? 'عذراً، لم نتمكن من العثور على بيانات هذا الكورس أو تحميلها.'
              : 'Sorry, we could not retrieve or load this course details.'}
          </p>
          <Button 
            onClick={() => router.push('/admin/courses')} 
            className="mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {isAr ? 'العودة إلى القائمة' : 'Back to list'}
          </Button>
        </Card>
      </div>
    );
  }

  const title = isAr ? course.titleAr : course.titleEn;
  const totalLessons = course.chapters?.reduce((acc, c) => acc + (c.lessons?.length || 0), 0) || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100/30 to-purple-50 dark:from-gray-950 dark:via-blue-950/20 dark:to-gray-950 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with Gradient */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-500 p-8 border border-blue-400/20 shadow-2xl shadow-blue-500/30">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000" />
          
          <div className="relative">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm shadow-lg shadow-white/10">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl lg:text-3xl font-black text-white tracking-tight drop-shadow-sm">
                      {title}
                    </h1>
                    <Badge className="bg-white/20 text-white border-white/30">
                      {course.published ? <CheckCircle className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                      {course.published ? (isAr ? 'منشور' : 'Published') : (isAr ? 'مسودة' : 'Draft')}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-sm text-blue-100 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-white/70" />
                      {isAr ? 'إدارة المحتوى التعليمي' : 'Course Content Management'}
                    </span>
                    <span className="text-xs text-blue-200/60">•</span>
                    <span className="text-xs text-blue-200/60 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(course.createdAt).toLocaleDateString(isAr ? 'ar-EG' : 'fr-FR')}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant="outline" 
                  className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 hover:text-white"
                  onClick={() => setIsChapterModalOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {isAr ? 'إضافة فصل' : 'Add Chapter'}
                </Button>
                <Button 
                  className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg shadow-white/25"
                  onClick={() => setIsLessonModalOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {isAr ? 'إضافة درس' : 'Add Lesson'}
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2 text-white/80">
                <Layers className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {course.chapters?.length || 0} {isAr ? 'فصل' : 'Chapters'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <BookOpen className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {totalLessons} {isAr ? 'درس' : 'Lessons'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <User className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {course.instructor?.fullName || (isAr ? 'مدرب غير معين' : 'Unassigned Instructor')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Syllabus Section */}
          <div className="lg:col-span-2">
            <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-white/30 dark:border-gray-800/50 shadow-xl">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-500" />
                  {isAr ? 'فصول ودروس المنهج' : 'Syllabus & Lessons'}
                </CardTitle>
                <div className="flex gap-1 p-1 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-md transition-all duration-200 ${viewMode === 'grid' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <Grid className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-md transition-all duration-200 ${viewMode === 'list' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                {course.chapters?.length === 0 ? (
                  <div className="py-16 text-center">
                    <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
                      <Layers className="w-8 h-8 text-blue-500" />
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {isAr ? 'لم يتم إضافة فصول بعد. اضغط على "إضافة فصل" للبدء.' : 'No chapters created yet. Click "Add Chapter" to begin.'}
                    </p>
                  </div>
                ) : (
                  <Accordion
                    type="multiple"
                    value={openChapters}
                    onValueChange={setOpenChapters}
                    className="space-y-3"
                  >
                    {course.chapters?.map((chapter) => (
                      <AccordionItem
                        key={chapter.id}
                        value={String(chapter.id)}
                        className="rounded-xl border border-blue-200/50 dark:border-blue-800/50 bg-white/50 dark:bg-gray-950/50 overflow-hidden data-[state=open]:border-blue-400 dark:data-[state=open]:border-blue-600 transition-all duration-300"
                      >
                        <AccordionTrigger className="gap-3 px-5 py-4 text-sm hover:no-underline hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-colors">
                          <div className="flex min-w-0 flex-1 items-center gap-3">
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-xs font-bold text-blue-600 dark:text-blue-400">
                              {chapter.order}
                            </span>
                            <span className="truncate font-semibold text-gray-900 dark:text-white">
                              {isAr ? chapter.titleAr : chapter.titleEn}
                            </span>
                          </div>
                          <span className="mr-2 shrink-0 text-xs font-medium text-gray-500 dark:text-gray-400">
                            {chapter.lessons?.length || 0} {isAr ? 'دروس' : 'lessons'}
                          </span>
                        </AccordionTrigger>

                        <AccordionContent className="px-5 pb-4">
                          {chapter.lessons?.length === 0 ? (
                            <p className="pl-1 text-xs italic text-gray-500 dark:text-gray-400">
                              {isAr ? 'لا توجد دروس في هذا الفصل بعد.' : 'No lessons in this chapter yet.'}
                            </p>
                          ) : (
                            <ul className="space-y-2">
                              {chapter.lessons?.map((les) => (
                                <li
                                  key={les.id}
                                  className="flex items-center gap-3 rounded-xl border border-blue-200/50 dark:border-blue-800/50 bg-white/80 dark:bg-gray-950/80 p-3 transition-all duration-200 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-md"
                                >
                                  {/* Video thumbnail */}
                                  <button
                                    type="button"
                                    onClick={() => les.videoUrl && setPreviewVideoUrl(les.videoUrl)}
                                    disabled={!les.videoUrl}
                                    className={`group relative h-16 w-28 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 ${les.videoUrl ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
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
                                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-blue-600 shadow-lg">
                                            <Play className="h-4 w-4 fill-current" />
                                          </span>
                                        </span>
                                      </>
                                    ) : (
                                      <span className="flex h-full items-center justify-center text-[10px] font-medium uppercase tracking-wide text-white/70">
                                        {isAr ? 'لا فيديو' : 'No video'}
                                      </span>
                                    )}
                                  </button>

                                  {/* Lesson info */}
                                  <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                                      {isAr ? les.titleAr : les.titleEn}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                      <Badge
                                        variant={les.writtenContentAr ? 'default' : 'secondary'}
                                        className="gap-1 text-[10px] font-normal"
                                      >
                                        <FileText className="h-3 w-3" />
                                        {les.writtenContentAr ? (isAr ? 'محتوى مكتوب' : 'Has notes') : (isAr ? 'بدون محتوى' : 'No notes')}
                                      </Badge>
                                      {les.videoUrl && (
                                        <Badge variant="success" className="gap-1 text-[10px] font-normal">
                                          <Play className="h-3 w-3" />
                                          {isAr ? 'فيديو' : 'Video'}
                                        </Badge>
                                      )}
                                    </div>
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

          {/* Comments Section */}
          <div className="lg:col-span-1">
            <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-white/30 dark:border-gray-800/50 shadow-xl">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base font-bold">
                  <MessageSquare className="w-4 h-4 text-blue-500" />
                  {isAr ? 'التعليقات والمناقشات' : 'Course Comments'}
                  <Badge variant="secondary" className="ml-auto">
                    {comments.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {comments.length === 0 ? (
                  <div className="py-12 text-center">
                    <MessageSquare className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {isAr ? 'لا توجد تعليقات بعد.' : 'No comments yet.'}
                    </p>
                  </div>
                ) : (
                  <ScrollArea className="h-[500px] pr-2">
                    <div className="space-y-3">
                      {comments.map((comment) => (
                        <div
                          key={comment.id}
                          className="space-y-2 rounded-xl border border-blue-200/50 dark:border-blue-800/50 bg-white/50 dark:bg-gray-950/50 p-4 transition-all hover:border-blue-400 dark:hover:border-blue-600"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-xs">
                                {comment.user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                              </div>
                              <span className="text-xs font-semibold text-gray-900 dark:text-white">
                                {comment.user?.fullName || (isAr ? 'مستخدم' : 'User')}
                              </span>
                            </div>
                            <span className="text-[10px] text-gray-400">
                              {new Date(comment.createdAt).toLocaleDateString(isAr ? 'ar-EG' : 'fr-FR')}
                            </span>
                          </div>
                          <p className="text-xs leading-relaxed text-gray-700 dark:text-gray-300">
                            {comment.content}
                          </p>
                          <div className="flex justify-end pt-1">
                            <button
                              onClick={() => handleDeleteComment(comment.id)}
                              className="inline-flex items-center gap-1 text-[10px] font-medium text-red-600 hover:text-red-700 transition-colors"
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

      {/* Dialog: Add Chapter */}
      <Dialog open={isChapterModalOpen} onOpenChange={setIsChapterModalOpen}>
        <DialogContent className="sm:max-w-lg bg-white/95 dark:bg-gray-950/95 backdrop-blur-md border border-blue-200/50 dark:border-blue-800/50">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-500" />
              {isAr ? 'إضافة فصل جديد' : 'New Chapter'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddChapter} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Chapter Title (English) <span className="text-red-500">*</span></Label>
              <Input required value={chapTitleEn} onChange={e => setChapTitleEn(e.target.value)} className="bg-white dark:bg-gray-950 border-blue-200 dark:border-blue-800 focus:border-blue-500" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold">عنوان الفصل (عربي) <span className="text-red-500">*</span></Label>
              <Input required value={chapTitleAr} onChange={e => setChapTitleAr(e.target.value)} dir="rtl" className="bg-white dark:bg-gray-950 border-blue-200 dark:border-blue-800 focus:border-blue-500" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Order <span className="text-red-500">*</span></Label>
              <Input type="number" required value={chapOrder} onChange={e => setChapOrder(e.target.value)} className="bg-white dark:bg-gray-950 border-blue-200 dark:border-blue-800 focus:border-blue-500" />
            </div>

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => setIsChapterModalOpen(false)} className="border-gray-300 dark:border-gray-700">
                {isAr ? 'إلغاء' : 'Cancel'}
              </Button>
              <Button type="submit" disabled={actionLoading} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25">
                {actionLoading && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
                {isAr ? 'حفظ الفصل' : 'Save Chapter'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog: Add Lesson with Upload Progress */}
      <Dialog open={isLessonModalOpen} onOpenChange={setIsLessonModalOpen}>
        <DialogContent className="sm:max-w-2xl bg-white/95 dark:bg-gray-950/95 backdrop-blur-md border border-blue-200/50 dark:border-blue-800/50">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-500" />
              {isAr ? 'إضافة درس جديد' : 'New Lesson'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddLesson} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Chapter <span className="text-red-500">*</span></Label>
              <Select value={selectedChapterId} onValueChange={setSelectedChapterId} required>
                <SelectTrigger className="border-blue-200 dark:border-blue-800 bg-white dark:bg-gray-950">
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-semibold">Lesson Title (English) <span className="text-red-500">*</span></Label>
                <Input required value={lessonTitleEn} onChange={e => setLessonTitleEn(e.target.value)} className="bg-white dark:bg-gray-950 border-blue-200 dark:border-blue-800 focus:border-blue-500" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold">عنوان الدرس (عربي) <span className="text-red-500">*</span></Label>
                <Input required value={lessonTitleAr} onChange={e => setLessonTitleAr(e.target.value)} dir="rtl" className="bg-white dark:bg-gray-950 border-blue-200 dark:border-blue-800 focus:border-blue-500" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-semibold">Written Content (English)</Label>
                <Textarea rows={3} value={writtenContentEn} onChange={e => setWrittenContentEn(e.target.value)} className="bg-white dark:bg-gray-950 border-blue-200 dark:border-blue-800 focus:border-blue-500" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold">المحتوى المكتوب (عربي)</Label>
                <Textarea rows={3} value={writtenContentAr} onChange={e => setWrittenContentAr(e.target.value)} dir="rtl" className="bg-white dark:bg-gray-950 border-blue-200 dark:border-blue-800 focus:border-blue-500" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-semibold">Order <span className="text-red-500">*</span></Label>
                <Input type="number" required value={lessonOrder} onChange={e => setLessonOrder(e.target.value)} className="bg-white dark:bg-gray-950 border-blue-200 dark:border-blue-800 focus:border-blue-500" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold">Video File</Label>
                <label className="flex h-10 w-full cursor-pointer items-center gap-2 rounded-xl border-2 border-dashed border-blue-300 dark:border-blue-700 bg-blue-50/50 dark:bg-blue-950/20 px-3 text-xs text-blue-600 dark:text-blue-400 transition-colors hover:bg-blue-100 dark:hover:bg-blue-950/40">
                  <UploadCloud className="h-4 w-4" />
                  <span className="truncate">{videoFile ? videoFile.name : (isAr ? 'اختر ملف فيديو' : 'Choose video')}</span>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={e => setVideoFile(e.target.files[0])}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {actionLoading && uploadProgress > 0 && (
              <div className="space-y-2 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-200 dark:border-blue-800">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-blue-600 dark:text-blue-400">
                    {isAr ? 'جاري الرفع...' : 'Uploading...'}
                  </span>
                  <span className="text-blue-600 dark:text-blue-400">{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2 bg-blue-200 dark:bg-blue-900/50">
                  <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                </Progress>
              </div>
            )}

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" disabled={actionLoading} onClick={() => setIsLessonModalOpen(false)} className="border-gray-300 dark:border-gray-700">
                {isAr ? 'إلغاء' : 'Cancel'}
              </Button>
              <Button type="submit" disabled={actionLoading} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25">
                {actionLoading && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
                {actionLoading ? (isAr ? 'جاري الإرسال...' : 'Uploading...') : (isAr ? 'حفظ الدرس' : 'Save Lesson')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog: Video Preview */}
      <Dialog open={!!previewVideoUrl} onOpenChange={(open) => !open && setPreviewVideoUrl(null)}>
        <DialogContent className="sm:max-w-3xl bg-white/95 dark:bg-gray-950/95 backdrop-blur-md border border-blue-200/50 dark:border-blue-800/50">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Play className="w-5 h-5 text-blue-500" />
              {isAr ? 'معاينة فيديو الدرس' : 'Preview Lesson Video'}
            </DialogTitle>
          </DialogHeader>
          <div className="aspect-video w-full overflow-hidden rounded-xl bg-black shadow-xl">
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