"use client";

import { useState, useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import {
  Layers, Play, FileText, Trash2, BookOpen, MessageSquare, Loader2, UploadCloud,
  ChevronDown, ChevronRight, Clock, User, Calendar, Eye, EyeOff, Edit, Plus,
  CheckCircle, XCircle, Sparkles, Grid, List, ArrowLeft, ArrowRight, Download, FileUp,
  Filter, X, Search, Flag, Users, FolderOpen, AlertCircle
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
import { Separator } from '@/components/ui/separator';

// Types pour les filtres
interface TaskFilter {
  priority: string[];
  status: string[];
  author: string[];
  assignee: string[];
  project: string[];
  deadlineApproaching: boolean;
  deadlineOverdue: boolean;
  noAssignee: boolean;
  noDate: boolean;
}

export default function AdminCourseDetailsPage() {
  const { slug } = useParams();
  const { language } = useLanguage();
  const router = useRouter();

  const [course, setCourse] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');

  // États des modales
  const [isChapterModalOpen, setIsChapterModalOpen] = useState(false);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // États upload
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewVideoUrl, setPreviewVideoUrl] = useState(null);

  // États syllabus
  const [openChapters, setOpenChapters] = useState([]);

  // États chapitre
  const [chapTitleAr, setChapTitleAr] = useState('');
  const [chapTitleEn, setChapTitleEn] = useState('');
  const [chapOrder, setChapOrder] = useState('');

  // États leçon
  const [selectedChapterId, setSelectedChapterId] = useState('');
  const [lessonTitleAr, setLessonTitleAr] = useState('');
  const [lessonTitleEn, setLessonTitleEn] = useState('');
  const [writtenContentAr, setWrittenContentAr] = useState('');
  const [writtenContentEn, setWrittenContentEn] = useState('');
  const [lessonOrder, setLessonOrder] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [documentFile, setDocumentFile] = useState(null);

  // États filtres (style photo)
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<TaskFilter>({
    priority: [],
    status: [],
    author: [],
    assignee: [],
    project: [],
    deadlineApproaching: false,
    deadlineOverdue: false,
    noAssignee: false,
    noDate: false,
  });

  const isAr = language === 'ar';

  // Données mock pour les filtres
  const priorities = [
    { value: 'high', label: isAr ? 'عالية' : 'High', color: 'red' },
    { value: 'medium', label: isAr ? 'متوسطة' : 'Medium', color: 'amber' },
    { value: 'low', label: isAr ? 'منخفضة' : 'Low', color: 'blue' },
  ];

  const statuses = [
    { value: 'new', label: isAr ? 'جديدة' : 'New' },
    { value: 'in_progress', label: isAr ? 'قيد التنفيذ' : 'In Progress' },
    { value: 'review', label: isAr ? 'مراجعة' : 'Review' },
    { value: 'completed', label: isAr ? 'مكتملة' : 'Completed' },
    { value: 'blocked', label: isAr ? 'معلقة' : 'Blocked' },
  ];

  const authors = [
    { id: '1', name: 'Shlykova L. S.' },
    { id: '2', name: 'Ivanov P. A.' },
    { id: '3', name: 'Petrova M. V.' },
    { id: '4', name: 'Sidorov D. N.' },
  ];

  const assignees = [
    { id: '5', name: 'Loginov R. V.' },
    { id: '6', name: 'Smirnova E. A.' },
    { id: '7', name: 'Volkov D. S.' },
    { id: '8', name: 'Morozov A. I.' },
  ];

  const projects = [
    { value: 'project-a', label: 'Project Alpha' },
    { value: 'project-b', label: 'Project Beta' },
    { value: 'project-c', label: 'Project Gamma' },
  ];

  // Handlers filtres
  const toggleFilter = (category: keyof TaskFilter, value: string) => {
    setFilters(prev => {
      const current = prev[category] as string[];
      return {
        ...prev,
        [category]: current.includes(value)
          ? current.filter(v => v !== value)
          : [...current, value]
      };
    });
  };

  const toggleCheckbox = (key: keyof TaskFilter) => {
    setFilters(prev => ({
      ...prev,
      [key]: !prev[key] as boolean
    }));
  };

  const handleApplyFilters = () => {
    console.log('Applied filters:', filters);
    setIsFilterOpen(false);
  };

  const handleClearFilters = () => {
    setFilters({
      priority: [],
      status: [],
      author: [],
      assignee: [],
      project: [],
      deadlineApproaching: false,
      deadlineOverdue: false,
      noAssignee: false,
      noDate: false,
    });
    setSearchQuery('');
  };

  // Nombre de filtres actifs
  const activeFilterCount = 
    filters.priority.length +
    filters.status.length +
    filters.author.length +
    filters.assignee.length +
    filters.project.length +
    (filters.deadlineApproaching ? 1 : 0) +
    (filters.deadlineOverdue ? 1 : 0) +
    (filters.noAssignee ? 1 : 0) +
    (filters.noDate ? 1 : 0);

  // API
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
    if (documentFile) {
      formData.append('document', documentFile);
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
            setLessonTitleAr(''); setLessonTitleEn(''); setWrittenContentAr(''); 
            setWrittenContentEn(''); setLessonOrder(''); setVideoFile(null); 
            setDocumentFile(null);
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
      alert('Une erreur réseau est survenue lors du téléversement de la leçon.');
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

  if (!course) {
    return (
      <div className="min-h-screen bg-[#f8f9fb] dark:bg-gray-950 p-8">
        <Card className="max-w-2xl mx-auto p-12 text-center bg-white dark:bg-gray-900 border border-slate-150/40 dark:border-gray-800 shadow-xl">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-10 h-10 text-primary" />
          </div>
          <p className="text-sm font-semibold text-gray-500">
            {isAr
              ? 'عذراً، لم نتمكن من العثور على بيانات هذا الكورس أو تحميلها.'
              : 'Sorry, we could not retrieve or load this course details.'}
          </p>
          <Button
            onClick={() => router.push('/admin/courses')}
            className="mt-4 bg-primary text-white"
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
    <div className={`min-h-screen bg-[#f8f9fb] dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300 pb-16 ${isAr ? 'font-cairo' : 'font-sans'}`}>
      <div className="max-w-7xl mx-auto space-y-6 pt-8">

        {/* Header Premium */}
        <div className="relative overflow-hidden rounded-3xl bg-primary-dark p-8 border border-white/10 shadow-2xl shadow-slate-900/10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />

          <div className="relative">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm shadow-md">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight drop-shadow-sm">
                      {title}
                    </h1>
                    <Badge className="bg-white/20 text-white border-white/10">
                      {course.published ? (isAr ? 'منشور' : 'Published') : (isAr ? 'مسودة' : 'Draft')}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-white/70">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      {isAr ? 'إدارة المحتوى التعليمي' : 'Course Content Management'}
                    </span>
                    <span>•</span>
                    <span>
                      {new Date(course.createdAt).toLocaleDateString(isAr ? 'ar-EG' : 'fr-FR')}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 hover:text-white rounded-xl"
                  onClick={() => setIsChapterModalOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {isAr ? 'إضافة فصل' : 'Add Chapter'}
                </Button>
                <Button
                  className="bg-white text-primary hover:bg-white/90 shadow-lg rounded-xl font-bold"
                  onClick={() => setIsLessonModalOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {isAr ? 'إضافة درس' : 'Add Lesson'}
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-white/10 text-white/80">
              <div className="flex items-center gap-2 text-xs font-bold">
                <Layers className="w-4 h-4" />
                <span>{course.chapters?.length || 0} {isAr ? 'فصل' : 'Chapters'}</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold">
                <BookOpen className="w-4 h-4" />
                <span>{totalLessons} {isAr ? 'درس' : 'Lessons'}</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold">
                <User className="w-4 h-4" />
                <span>{course.instructor?.fullName || (isAr ? 'مدرب غير معين' : 'Unassigned Instructor')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Barre de filtres - style photo */}
        <Card className="bg-white dark:bg-gray-900 rounded-3xl border border-slate-150/40 dark:border-gray-850/50 shadow-sm overflow-hidden">
          <div className="p-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              {/* Search */}
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder={isAr ? 'بحث عن مهمة...' : 'Search tasks...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 rounded-xl border-slate-200 dark:border-gray-700 bg-slate-50/50 dark:bg-gray-800/50 focus:border-primary/50 h-10 text-sm"
                />
              </div>

              {/* Bouton Filtres */}
              <Button
                variant="outline"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`rounded-xl border-slate-200 dark:border-gray-700 h-10 px-4 gap-2 font-semibold text-sm ${
                  activeFilterCount > 0 ? 'bg-primary/10 text-primary border-primary/30' : ''
                }`}
              >
                <Filter className="w-4 h-4" />
                {isAr ? 'تصفية' : 'Filters'}
                {activeFilterCount > 0 && (
                  <Badge variant="primary" className="ml-1 text-[10px] px-1.5 py-0 min-w-[18px] flex items-center justify-center">
                    {activeFilterCount}
                  </Badge>
                )}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
              </Button>

              {/* Affichage des filtres actifs sous forme de badges */}
              {activeFilterCount > 0 && (
                <div className="flex flex-wrap items-center gap-1.5">
                  {filters.priority.map(p => {
                    const label = priorities.find(pr => pr.value === p)?.label;
                    const color = priorities.find(pr => pr.value === p)?.color;
                    return (
                      <Badge key={p} variant="outline" className={`text-[9px] font-bold bg-${color}-50 text-${color}-600 border-${color}-200`}>
                        {label}
                      </Badge>
                    );
                  })}
                  {filters.status.map(s => {
                    const label = statuses.find(st => st.value === s)?.label;
                    return (
                      <Badge key={s} variant="outline" className="text-[9px] font-bold bg-blue-50 text-blue-600 border-blue-200">
                        {label}
                      </Badge>
                    );
                  })}
                  <button
                    onClick={handleClearFilters}
                    className="text-[10px] font-bold text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

            {/* Panneau de filtres déroulant */}
            {isFilterOpen && (
              <div className="mt-4 pt-4 border-t border-slate-200/60 dark:border-gray-800 space-y-4">
                {/* Priority */}
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Flag className="w-3.5 h-3.5" />
                    {isAr ? 'الأولوية' : 'Priority'}
                  </Label>
                  <div className="flex flex-wrap gap-1.5">
                    {priorities.map(p => (
                      <button
                        key={p.value}
                        onClick={() => toggleFilter('priority', p.value)}
                        className={`px-3 py-1 rounded-xl text-[10px] font-bold transition-all duration-200 border ${
                          filters.priority.includes(p.value)
                            ? `bg-${p.color}-500 text-white border-${p.color}-500`
                            : `bg-gray-50 dark:bg-gray-800 text-gray-500 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700`
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Status */}
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5" />
                    {isAr ? 'الحالة' : 'Status'}
                  </Label>
                  <div className="flex flex-wrap gap-1.5">
                    {statuses.map(s => (
                      <button
                        key={s.value}
                        onClick={() => toggleFilter('status', s.value)}
                        className={`px-3 py-1 rounded-xl text-[10px] font-bold transition-all duration-200 border ${
                          filters.status.includes(s.value)
                            ? 'bg-primary text-white border-primary'
                            : `bg-gray-50 dark:bg-gray-800 text-gray-500 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700`
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Author */}
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" />
                      {isAr ? 'المؤلف' : 'Author'}
                    </Label>
                    <div className="flex flex-wrap gap-1.5">
                      {authors.map(a => (
                        <button
                          key={a.id}
                          onClick={() => toggleFilter('author', a.id)}
                          className={`px-3 py-1 rounded-xl text-[10px] font-bold transition-all duration-200 border ${
                            filters.author.includes(a.id)
                              ? 'bg-primary text-white border-primary'
                              : `bg-gray-50 dark:bg-gray-800 text-gray-500 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700`
                          }`}
                        >
                          {a.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Assignee */}
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" />
                      {isAr ? 'المنفذ' : 'Assignee'}
                    </Label>
                    <div className="flex flex-wrap gap-1.5">
                      {assignees.map(a => (
                        <button
                          key={a.id}
                          onClick={() => toggleFilter('assignee', a.id)}
                          className={`px-3 py-1 rounded-xl text-[10px] font-bold transition-all duration-200 border ${
                            filters.assignee.includes(a.id)
                              ? 'bg-primary text-white border-primary'
                              : `bg-gray-50 dark:bg-gray-800 text-gray-500 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700`
                          }`}
                        >
                          {a.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Project */}
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                    <FolderOpen className="w-3.5 h-3.5" />
                    {isAr ? 'المشروع' : 'Project'}
                  </Label>
                  <div className="flex flex-wrap gap-1.5">
                    {projects.map(p => (
                      <button
                        key={p.value}
                        onClick={() => toggleFilter('project', p.value)}
                        className={`px-3 py-1 rounded-xl text-[10px] font-bold transition-all duration-200 border ${
                          filters.project.includes(p.value)
                            ? 'bg-violet-500 text-white border-violet-500'
                            : `bg-gray-50 dark:bg-gray-800 text-gray-500 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700`
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Options additionnelles - style photo */}
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" />
                    {isAr ? 'خيارات إضافية' : 'Additional Options'}
                  </Label>
                  <div className="flex flex-wrap gap-3">
                    <label className="flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.deadlineApproaching}
                        onChange={() => toggleCheckbox('deadlineApproaching')}
                        className="w-3.5 h-3.5 rounded border-gray-300 text-amber-500 focus:ring-amber-500/20"
                      />
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-500" />
                        {isAr ? 'الموعد يقترب' : 'Deadline approaching'}
                      </span>
                    </label>
                    <label className="flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.deadlineOverdue}
                        onChange={() => toggleCheckbox('deadlineOverdue')}
                        className="w-3.5 h-3.5 rounded border-gray-300 text-red-500 focus:ring-red-500/20"
                      />
                      <span className="flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                        {isAr ? 'الموعد منتهي' : 'Deadline overdue'}
                      </span>
                    </label>
                    <label className="flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.noAssignee}
                        onChange={() => toggleCheckbox('noAssignee')}
                        className="w-3.5 h-3.5 rounded border-gray-300 text-primary focus:ring-primary/20"
                      />
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-gray-400" />
                        {isAr ? 'بدون منفذ' : 'No assignee'}
                      </span>
                    </label>
                    <label className="flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.noDate}
                        onChange={() => toggleCheckbox('noDate')}
                        className="w-3.5 h-3.5 rounded border-gray-300 text-primary focus:ring-primary/20"
                      />
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        {isAr ? 'بدون تاريخ' : 'No start/end date'}
                      </span>
                    </label>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60 dark:border-gray-800">
                  <Button
                    onClick={handleClearFilters}
                    variant="ghost"
                    size="sm"
                    className="text-xs font-semibold text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
                  >
                    {isAr ? 'مسح الكل' : 'Clear all'}
                  </Button>
                  <Button
                    onClick={handleApplyFilters}
                    className="ml-auto bg-primary text-white hover:bg-primary/90 rounded-xl px-6 font-bold text-xs shadow-sm h-9"
                  >
                    {isAr ? 'تطبيق' : 'Apply'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Moteur de gestion (Syllabus & Commentaires) */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* Section index du syllabus */}
          <div className="lg:col-span-2">
            <Card className="bg-white dark:bg-gray-900 rounded-3xl border border-slate-150/40 dark:border-gray-850/50 shadow-sm">
              <CardHeader className="pb-3 flex flex-row items-center justify-between border-b border-gray-100 dark:border-gray-800">
                <CardTitle className="text-sm font-black flex items-center gap-2 text-gray-900 dark:text-white">
                  <BookOpen className="w-4.5 h-4.5 text-primary" />
                  {isAr ? 'فصول ودروس المنهج الدراسي' : 'Syllabus & Lessons'}
                </CardTitle>
                <div className="flex gap-1 p-1 bg-gray-50 dark:bg-gray-950/20 rounded-xl">
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
                  <div className="py-16 text-center border-2 border-dashed border-gray-100 rounded-2xl">
                    <Layers className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-gray-400">
                      {isAr ? 'لم يتم إضافة فصول بعد. اضغط على "إضافة فصل" للبدء.' : 'No chapters created yet. Click "Add Chapter" to begin.'}
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
                        className="rounded-2xl border border-slate-150/40 dark:border-gray-800 bg-white/40 dark:bg-gray-950/20 overflow-hidden data-[state=open]:border-primary/40 transition-all duration-300"
                      >
                        <AccordionTrigger className="gap-3 px-5 py-4 text-xs sm:text-sm hover:no-underline hover:bg-gray-50/50 dark:hover:bg-gray-900/30 transition-colors">
                          <div className="flex min-w-0 flex-1 items-center gap-3">
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-black text-primary">
                              {chapter.order}
                            </span>
                            <span className="truncate font-black text-gray-900 dark:text-white">
                              {isAr ? chapter.titleAr : chapter.titleEn}
                            </span>
                          </div>
                          <span className="mr-2 shrink-0 text-[10px] font-extrabold text-gray-400 dark:text-gray-500 uppercase">
                            {chapter.lessons?.length || 0} {isAr ? 'دروس' : 'lessons'}
                          </span>
                        </AccordionTrigger>

                        <AccordionContent className="px-5 pb-4">
                          {chapter.lessons?.length === 0 ? (
                            <p className="pl-1 text-xs italic text-gray-400">
                              {isAr ? 'لا توجد دروس في هذا الفصل بعد.' : 'No lessons in this chapter yet.'}
                            </p>
                          ) : (
                            <ul className="space-y-3.5 pt-4 border-t border-gray-100 dark:border-gray-900">
                              {chapter.lessons?.map((les) => (
                                <li
                                  key={les.id}
                                  className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl border border-slate-150/40 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 transition-all duration-200 hover:border-primary/30 hover:shadow-md"
                                >
                                  {/* Miniature Vidéo */}
                                  <button
                                    type="button"
                                    onClick={() => les.videoUrl && setPreviewVideoUrl(les.videoUrl)}
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
                                          {isAr ? 'فيديو حصري' : 'Video Unlocked'}
                                        </Badge>
                                      )}
                                      {les.documentUrl && (
                                        <a
                                          href={les.documentUrl}
                                          download
                                          onClick={(e) => e.stopPropagation()}
                                          className="inline-flex items-center gap-1 text-[9px] font-bold bg-accent/10 text-accent-dark dark:text-accent px-2 py-0.5 rounded-full border border-accent/20 hover:bg-accent/20"
                                        >
                                          <Download className="h-3 w-3 shrink-0" />
                                          {isAr ? 'تحميل المورد (PDF)' : 'Download Resource'}
                                        </a>
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

          {/* Section Commentaires */}
          <div className="lg:col-span-1">
            <Card className="bg-white dark:bg-gray-900 rounded-3xl border border-slate-150/40 dark:border-gray-850/50 shadow-sm">
              <CardHeader className="pb-3 border-b border-gray-100 dark:border-gray-800">
                <CardTitle className="flex items-center gap-2 text-sm font-black text-gray-900 dark:text-white">
                  <MessageSquare className="w-4.5 h-4.5 text-primary" />
                  {isAr ? 'التعليقات والمناقشات' : 'Course Comments'}
                  <Badge variant="secondary" className="ml-auto text-[10px] font-bold">
                    {comments.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {comments.length === 0 ? (
                  <div className="py-12 text-center">
                    <MessageSquare className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-gray-400">
                      {isAr ? 'لا توجد تعليقات بعد.' : 'No comments yet.'}
                    </p>
                  </div>
                ) : (
                  <ScrollArea className="h-[480px] pr-2 no-scrollbar">
                    <div className="space-y-3.5">
                      {comments.map((comment) => (
                        <div
                          key={comment.id}
                          className="space-y-2 rounded-2xl border border-slate-150/40 dark:border-gray-800 bg-white/40 dark:bg-gray-950/20 p-4 transition-all hover:border-primary/20"
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
                            <span className="text-[10px] font-bold text-gray-400">
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

      {/* Dialog: Ajouter un chapitre */}
      <Dialog open={isChapterModalOpen} onOpenChange={setIsChapterModalOpen}>
        <DialogContent className="sm:max-w-lg bg-white dark:bg-gray-950 border border-slate-150/40 dark:border-gray-800 rounded-3xl shadow-2xl p-0 overflow-hidden">
          <div className="px-6 pt-6">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-sm font-black text-gray-900 dark:text-white">
                <Layers className="w-5 h-5 text-primary" />
                {isAr ? 'إضافة فصل جديد' : 'New Chapter'}
              </DialogTitle>
            </DialogHeader>
          </div>

          <form onSubmit={handleAddChapter} className="px-6 pb-6 pt-4 space-y-4">
            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                {isAr ? 'عنوان الفصل (الإنجليزية)' : 'Chapter Title (English)'} <span className="text-error">*</span>
              </Label>
              <Input required value={chapTitleEn} onChange={e => setChapTitleEn(e.target.value)} className="h-11 rounded-xl border-gray-200 dark:border-gray-800 focus:border-primary focus:ring-2 focus:ring-primary/10" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                {isAr ? 'عنوان الفصل (عربي)' : 'Chapter Title (Arabic)'} <span className="text-error">*</span>
              </Label>
              <Input required value={chapTitleAr} onChange={e => setChapTitleAr(e.target.value)} dir="rtl" className="h-11 rounded-xl border-gray-200 dark:border-gray-800 focus:border-primary focus:ring-2 focus:ring-primary/10" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                {isAr ? 'الترتيب' : 'Order'} <span className="text-error">*</span>
              </Label>
              <Input type="number" required value={chapOrder} onChange={e => setChapOrder(e.target.value)} className="h-11 rounded-xl border-gray-200 dark:border-gray-800 focus:border-primary focus:ring-2 focus:ring-primary/10" />
            </div>

            <DialogFooter className="flex-col gap-2 pt-2">
              <Button type="submit" disabled={actionLoading} className="w-full h-11 rounded-xl bg-primary-dark hover:bg-primary-dark/90 text-white font-bold text-sm">
                {actionLoading && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
                {isAr ? 'حفظ الفصل' : 'Save Chapter'}
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsChapterModalOpen(false)} className="w-full h-11 rounded-xl border-gray-200 dark:border-gray-800">
                {isAr ? 'إلغاء' : 'Cancel'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog: Ajouter une leçon */}
      <Dialog open={isLessonModalOpen} onOpenChange={setIsLessonModalOpen}>
        <DialogContent className="sm:max-w-2xl bg-white dark:bg-gray-950 border border-slate-150/40 dark:border-gray-800 rounded-3xl shadow-2xl p-0 overflow-hidden">
          <div className="px-6 pt-6">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-sm font-black text-gray-900 dark:text-white">
                <Plus className="w-5 h-5 text-primary" />
                {isAr ? 'إضافة درس جديد' : 'New Lesson'}
              </DialogTitle>
            </DialogHeader>
          </div>

          <form onSubmit={handleAddLesson} className="px-6 pb-6 pt-4 space-y-4 max-h-[70vh] overflow-y-auto">
            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                {isAr ? 'الفصل' : 'Chapter'} <span className="text-error">*</span>
              </Label>
              <Select value={selectedChapterId} onValueChange={setSelectedChapterId} required>
                <SelectTrigger className="h-11 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 rounded-xl">
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
              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  {isAr ? 'عنوان الدرس (الإنجليزية)' : 'Lesson Title (English)'} <span className="text-error">*</span>
                </Label>
                <Input required value={lessonTitleEn} onChange={e => setLessonTitleEn(e.target.value)} className="h-11 rounded-xl border-gray-200 dark:border-gray-800 focus:border-primary focus:ring-2 focus:ring-primary/10" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  {isAr ? 'عنوان الدرس (عربي)' : 'Lesson Title (Arabic)'} <span className="text-error">*</span>
                </Label>
                <Input required value={lessonTitleAr} onChange={e => setLessonTitleAr(e.target.value)} dir="rtl" className="h-11 rounded-xl border-gray-200 dark:border-gray-800 focus:border-primary focus:ring-2 focus:ring-primary/10" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  {isAr ? 'المحتوى المكتوب (الإنجليزية)' : 'Written Content (English)'}
                </Label>
                <Textarea rows={3} value={writtenContentEn} onChange={e => setWrittenContentEn(e.target.value)} className="rounded-xl border-gray-200 dark:border-gray-800 focus:border-primary focus:ring-2 focus:ring-primary/10" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  {isAr ? 'المحتوى المكتوب (عربي)' : 'Written Content (Arabic)'}
                </Label>
                <Textarea rows={3} value={writtenContentAr} onChange={e => setWrittenContentAr(e.target.value)} dir="rtl" className="rounded-xl border-gray-200 dark:border-gray-800 focus:border-primary focus:ring-2 focus:ring-primary/10" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  {isAr ? 'الترتيب' : 'Order'} <span className="text-error">*</span>
                </Label>
                <Input type="number" required value={lessonOrder} onChange={e => setLessonOrder(e.target.value)} className="h-11 rounded-xl border-gray-200 dark:border-gray-800 focus:border-primary focus:ring-2 focus:ring-primary/10" />
              </div>

              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  {isAr ? 'ملف الفيديو' : 'Video File'}
                </Label>
                <label className="flex h-11 w-full cursor-pointer items-center gap-2 rounded-xl border-2 border-dashed border-primary/25 bg-primary/5 px-3 text-xs font-semibold text-primary transition-colors hover:bg-primary/10">
                  <UploadCloud className="h-4 w-4 shrink-0" />
                  <span className="truncate">{videoFile ? videoFile.name : (isAr ? 'اختر ملف فيديو' : 'Choose video')}</span>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={e => setVideoFile(e.target.files[0])}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  {isAr ? 'مستند مرفق (PDF, Zip)' : 'Resource Document (PDF, Zip)'}
                </Label>
                <label className="flex h-11 w-full cursor-pointer items-center gap-2 rounded-xl border-2 border-dashed border-accent/40 bg-accent/5 px-3 text-xs font-semibold text-accent-dark dark:text-accent transition-colors hover:bg-accent/10">
                  <FileUp className="h-4 w-4 shrink-0" />
                  <span className="truncate">{documentFile ? documentFile.name : (isAr ? 'اختر مستند (PDF/Zip)' : 'Choose file (PDF/Zip)')}</span>
                  <input
                    type="file"
                    accept="application/pdf,application/zip,application/x-zip-compressed"
                    onChange={e => setDocumentFile(e.target.files[0])}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {actionLoading && uploadProgress > 0 && (
              <div className="space-y-2 p-4 bg-primary/5 rounded-xl border border-primary/20">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-primary">{isAr ? 'جاري رفع محتوى الدرس...' : 'Uploading lesson content...'}</span>
                  <span className="text-primary">{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2 bg-primary/20">
                  <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                </Progress>
              </div>
            )}

            <DialogFooter className="flex-col gap-2 pt-2">
              <Button type="submit" disabled={actionLoading} className="w-full h-11 rounded-xl bg-primary-dark hover:bg-primary-dark/90 text-white font-bold text-sm">
                {actionLoading && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
                {actionLoading ? (isAr ? 'جاري الرفع...' : 'Uploading...') : (isAr ? 'حفظ الدرس والملفات' : 'Save Lesson & Files')}
              </Button>
              <Button type="button" variant="outline" disabled={actionLoading} onClick={() => setIsLessonModalOpen(false)} className="w-full h-11 rounded-xl border-gray-200 dark:border-gray-800">
                {isAr ? 'إلغاء' : 'Cancel'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog: Video Preview */}
      <Dialog open={!!previewVideoUrl} onOpenChange={(open) => !open && setPreviewVideoUrl(null)}>
        <DialogContent className="sm:max-w-3xl bg-white dark:bg-gray-950 border border-slate-150/40 dark:border-gray-850/50 rounded-3xl shadow-2xl">
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