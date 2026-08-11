"use client";

import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';
import {
  Trash2,
  Edit,
  Users,
  Plus,
  Search,
  BookOpen,
  Folder,
  User,
  DollarSign,
  Type,
  Hash,
  FileText,
  ListChecks,
  Image,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Eye,
  EyeOff,
  Upload,
  ExternalLink,
  Sparkles,
  Tag,
  ChevronDown,
  Loader2,
  Grid,
  LayoutGrid,
  X,
  Eraser,
  Calendar,
  Video,
  PlayCircle,
} from 'lucide-react';

/* -------------------------------------------------------------------------- */
/* Tokens statiques pour les cartes de stats — Tailwind ne peut pas résoudre  */
/* des classes construites dynamiquement (`bg-${color}-500`) : elles ne sont  */
/* jamais générées au build. On mappe donc chaque stat à des classes fixes.   */
/* -------------------------------------------------------------------------- */
const STAT_TONES = {
  primary: { bg: 'bg-primary/10', text: 'text-primary' },
  success: { bg: 'bg-success/10', text: 'text-success' },
  secondary: { bg: 'bg-secondary/10', text: 'text-secondary' },
  accent: { bg: 'bg-accent/10', text: 'text-accent-dark' },
};

/* -------------------------------------------------------------------------- */
/* Champs réutilisables — libellé discret au-dessus + style "ligne de filtre" */
/* -------------------------------------------------------------------------- */

function FieldLabel({ icon: Icon, children, required }) {
  return (
    <label className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">
      {Icon && <Icon className="w-3 h-3 text-primary shrink-0" />}
      {children} {required && <span className="text-error">*</span>}
    </label>
  );
}

function FieldSelect({ icon: Icon, value, onChange, required, placeholder, children }) {
  return (
    <div className="relative">
      {Icon && <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />}
      <select
        value={value}
        required={required}
        onChange={onChange}
        className={`w-full h-11 ${Icon ? 'pl-10' : 'pl-4'} pr-9 text-sm border-2 border-gray-200 dark:border-gray-800 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-xl bg-white dark:bg-gray-950 outline-none transition-all duration-200 text-gray-900 dark:text-white cursor-pointer appearance-none`}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {children}
      </select>
      <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Onglets du formulaire                                                      */
/* -------------------------------------------------------------------------- */

function TabBar({ tabs, active, onChange, isAr }) {
  return (
    <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800/50 rounded-xl border border-gray-200/60 dark:border-gray-700/60 overflow-x-auto no-scrollbar">
      {tabs.map((tab) => {
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all duration-200 shrink-0 ${
              isActive
                ? 'bg-white dark:bg-gray-900 text-primary shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5 shrink-0" />
            {isAr ? tab.labelAr : tab.labelEn}
            {tab.badge > 0 && (
              <span className={`inline-flex items-center justify-center size-4 rounded-full text-[9px] font-black ${
                isActive ? 'bg-primary/15 text-primary' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
              }`}>
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default function AdminCoursesPage() {
  const { language } = useLanguage();
  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [activeTab, setActiveTab] = useState('general');

  const [titleAr, setTitleAr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [slug, setSlug] = useState('');
  const [descriptionAr, setDescriptionAr] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [whatYouWillLearnAr, setWhatYouWillLearnAr] = useState('');
  const [whatYouWillLearnEn, setWhatYouWillLearnEn] = useState('');
  const [instructorId, setInstructorId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [published, setPublished] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [imageDragOver, setImageDragOver] = useState(false);

  // Vidéo d'introduction — distincte des vidéos de leçons gérées ailleurs
  const [introVideoFile, setIntroVideoFile] = useState(null);
  const [introVideoPreview, setIntroVideoPreview] = useState('');
  const [introVideoDragOver, setIntroVideoDragOver] = useState(false);

  const [offers, setOffers] = useState([
    { nameAr: '', nameEn: '', durationMonths: 1, price: '', oldPrice: '' }
  ]);
  const [expandedOfferIndex, setExpandedOfferIndex] = useState(0);

  const isAr = language === 'ar';

  const parseResponseJson = async (res) => {
    try {
      const text = await res.text();
      return text ? JSON.parse(text) : {};
    } catch (err) {
      console.warn("[JSON Decode] Échec du décodage :", err);
      return {};
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/admin/courses');
      const data = await parseResponseJson(res);
      if (data.courses) setCourses(data.courses);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchInstructorsAndCategories = async () => {
    try {
      const resUsers = await fetch('/api/admin/users');
      if (!resUsers.ok) {
        console.error('[fetchInstructorsAndCategories] /api/admin/users a répondu', resUsers.status);
      }
      const dataUsers = await parseResponseJson(resUsers);
console.log('Data received from /api/admin/users:', dataUsers);
      // La réponse peut prendre plusieurs formes selon l'API : un tableau brut,
      // { users: [...] }, ou { data: [...] }. On ne suppose plus une seule forme,
      // pour éviter que la liste reste vide silencieusement si le format diffère.
      const usersList = Array.isArray(dataUsers)
        ? dataUsers
        : (dataUsers.instructors ||  []);
        console.log('Parsed users list:', usersList);

      if (usersList.length === 0) {
        console.warn('[fetchInstructorsAndCategories] Aucun utilisateur reçu depuis /api/admin/users — vérifie la forme de la réponse ou l’authentification admin.');
      }

      // Comparaison insensible à la casse : évite qu'un rôle stocké en
      // 'instructor'/'Instructor' passe à travers un filtre strict 'INSTRUCTOR'.
      const filtered = usersList.filter(
        (u) => ['INSTRUCTOR', 'ADMIN'].includes((u.role || '').toUpperCase())
      );
console.log('Filtered instructors/admins:', filtered);
      if (usersList.length > 0 && filtered.length === 0) {
        console.warn('[fetchInstructorsAndCategories] Des utilisateurs ont été reçus mais aucun avec le rôle INSTRUCTOR/ADMIN. Rôles reçus :', [...new Set(usersList.map(u => u.role))]);
      }

      setInstructors(filtered);

      const resCats = await fetch('/api/admin/categories');
      const dataCats = await parseResponseJson(resCats);
      const categoriesList = Array.isArray(dataCats) ? dataCats : (dataCats.categories || dataCats.data || []);
      setCategories(categoriesList);
    } catch (err) {
      console.error('[fetchInstructorsAndCategories] Échec du chargement :', err);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchInstructorsAndCategories();
  }, []);

  const addOfferField = () => {
    setOffers([...offers, { nameAr: '', nameEn: '', durationMonths: 1, price: '', oldPrice: '' }]);
    setExpandedOfferIndex(offers.length);
  };

  const removeOfferField = (index) => {
    setOffers(offers.filter((_, i) => i !== index));
    if (expandedOfferIndex === index) setExpandedOfferIndex(null);
  };

  const handleOfferChange = (index, field, value) => {
    const updated = [...offers];
    updated[index][field] = value;
    setOffers(updated);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('titleAr', titleAr);
      formData.append('titleEn', titleEn);
      formData.append('slug', slug);
      formData.append('descriptionAr', descriptionAr);
      formData.append('descriptionEn', descriptionEn);
      formData.append('whatYouWillLearnAr', whatYouWillLearnAr);
      formData.append('whatYouWillLearnEn', whatYouWillLearnEn);
      formData.append('instructorId', instructorId);
      formData.append('categoryId', categoryId);
      formData.append('published', published);
      formData.append('offers', JSON.stringify(offers));

      if (imageFile) formData.append('image', imageFile);
      if (introVideoFile) formData.append('introVideo', introVideoFile);

      const url = editingCourse
        ? `/api/admin/courses/${editingCourse.id}`
        : '/api/admin/courses';

      const method = editingCourse ? 'PUT' : 'POST';

      const res = await fetch(url, { method, body: formData });
      const data = await parseResponseJson(res);

      if (res.ok) {
        setIsModalOpen(false);
        fetchCourses();
        resetForm();
      } else {
        alert(data.error || (isAr ? 'حدث خطأ أثناء حفظ المساق.' : 'An error occurred while saving the course.'));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!confirm(isAr ? 'حذف هذا الكورس نهائياً ؟' : 'Delete this course permanently?')) return;
    try {
      const res = await fetch(`/api/admin/courses/${id}`, { method: 'DELETE' });
      if (res.ok) fetchCourses();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setTitleAr(course.titleAr);
    setTitleEn(course.titleEn);
    setSlug(course.slug);
    setDescriptionAr(course.descriptionAr || '');
    setDescriptionEn(course.descriptionEn || '');
    setWhatYouWillLearnAr(course.whatYouWillLearnAr || '');
    setWhatYouWillLearnEn(course.whatYouWillLearnEn || '');
    setInstructorId(course.instructorId || '');
    setCategoryId(course.categoryId || '');
    setPublished(course.published || false);
    setImagePreview(course.imageUrl || '');
    setImageFile(null);
    setIntroVideoPreview(course.introVideoUrl || '');
    setIntroVideoFile(null);

    if (course.offers && course.offers.length > 0) {
      setOffers(course.offers.map(o => ({
        nameAr: o.nameAr,
        nameEn: o.nameEn,
        durationMonths: o.durationMonths,
        price: o.price.toString(),
        oldPrice: o.oldPrice ? o.oldPrice.toString() : ''
      })));
    } else {
      setOffers([{ nameAr: '', nameEn: '', durationMonths: 1, price: '', oldPrice: '' }]);
    }
    setExpandedOfferIndex(0);
    setActiveTab('general');
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setTitleAr(''); setTitleEn(''); setSlug(''); setDescriptionAr(''); setDescriptionEn('');
    setWhatYouWillLearnAr(''); setWhatYouWillLearnEn('');
    setInstructorId(''); setCategoryId(''); setImageFile(null); setPublished(false);
    setOffers([{ nameAr: '', nameEn: '', durationMonths: 1, price: '', oldPrice: '' }]);
    setExpandedOfferIndex(0);
    setEditingCourse(null);
    setImagePreview('');
    setImageDragOver(false);
    setIntroVideoFile(null);
    setIntroVideoPreview('');
    setIntroVideoDragOver(false);
    setActiveTab('general');
  };

  const filteredCourses = courses.filter(course => {
    const search = searchQuery.toLowerCase().trim();
    const matchesSearch = !search ||
      course.titleEn.toLowerCase().includes(search) ||
      course.titleAr.includes(search) ||
      course.slug.toLowerCase().includes(search) ||
      course.instructor?.fullName?.toLowerCase().includes(search);

    const matchesStatus = filterStatus === 'all' ||
      (filterStatus === 'published' && course.published) ||
      (filterStatus === 'draft' && !course.published);

    return matchesSearch && matchesStatus;
  });

  const totalStudents = courses.reduce((acc, c) => acc + (c._count?.enrollments || 0), 0);
  const publishedCount = courses.filter(c => c.published).length;

  const TABS = [
    { id: 'general', labelEn: 'General', labelAr: 'عام', icon: Type },
    { id: 'content', labelEn: 'Content', labelAr: 'المحتوى', icon: FileText },
    { id: 'offers', labelEn: 'Offers', labelAr: 'العروض', icon: DollarSign, badge: offers.length },
    { id: 'video', labelEn: 'Intro Video', labelAr: 'فيديو تعريفي', icon: Video },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fb] dark:bg-gray-950 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header — solid primary-dark, sans dégradé */}
        <div className="relative overflow-hidden rounded-3xl bg-primary-dark p-8 border border-white/10 shadow-2xl shadow-slate-900/10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />

          <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm shadow-md">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-sm">
                  {isAr ? 'إدارة المناهج والمساقات' : 'Course Management'}
                </h1>
                <p className="text-sm text-white/70 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-white/60" />
                  {isAr ? 'إدارة المساقات التعليمية والمحتوى' : 'Manage your educational courses and content'}
                </p>
              </div>
            </div>
            <Button
              onClick={() => { resetForm(); setIsModalOpen(true); }}
              className="gap-2 bg-white text-primary hover:bg-white/90 shadow-lg transition-all duration-300 hover:-translate-y-0.5 group font-bold rounded-xl px-6 py-3"
            >
              <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
              {isAr ? 'إضافة مساق جديد' : 'Add Course'}
            </Button>
          </div>
        </div>

        {/* Stats Cards — classes statiques (voir STAT_TONES) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: BookOpen, label: isAr ? 'إجمالي المساقات' : 'Total Courses', value: courses.length, tone: 'primary' },
            { icon: CheckCircle, label: isAr ? 'منشورة' : 'Published', value: publishedCount, tone: 'success' },
            { icon: Users, label: isAr ? 'طلاب مسجلين' : 'Enrolled Students', value: totalStudents, tone: 'secondary' },
            { icon: TrendingUp, label: isAr ? 'تصنيفات' : 'Categories', value: categories.length, tone: 'accent' },
          ].map((stat, index) => {
            const colors = STAT_TONES[stat.tone];
            return (
              <div
                key={index}
                className="group bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200/60 dark:border-gray-800/60 shadow-elegant hover:shadow-lg hover:border-primary/30 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${colors.bg} group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className={`w-5 h-5 ${colors.text}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-gray-900 dark:text-white">{stat.value}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{stat.label}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-200/60 dark:border-gray-800/60 shadow-elegant">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isAr ? 'ابحث عن مساق...' : 'Search courses...'}
              className="w-full text-sm bg-gray-50 dark:bg-gray-950/50 border-2 border-gray-200 dark:border-gray-800 focus:border-primary focus:bg-white dark:focus:bg-gray-900 rounded-xl py-2.5 pl-10 pr-4 outline-none transition-all duration-200 text-gray-900 dark:text-white placeholder:text-gray-400"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-sm bg-gray-50 dark:bg-gray-950/50 border-2 border-gray-200 dark:border-gray-800 focus:border-primary rounded-xl px-3 py-2.5 outline-none transition-all duration-200 text-gray-900 dark:text-white cursor-pointer"
            >
              <option value="all">{isAr ? 'الكل' : 'All'}</option>
              <option value="published">{isAr ? 'منشور' : 'Published'}</option>
              <option value="draft">{isAr ? 'مسودة' : 'Draft'}</option>
            </select>
            <div className="flex gap-1 p-1 bg-gray-50 dark:bg-gray-950/50 rounded-xl border border-gray-200 dark:border-gray-800">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all duration-200 ${viewMode === 'grid' ? 'bg-primary text-white shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all duration-200 ${viewMode === 'list' ? 'bg-primary text-white shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Grid/List View */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-900 rounded-3xl border border-gray-200/60 dark:border-gray-800/60 shadow-elegant">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              {isAr ? 'جاري تحميل المساقات...' : 'Loading courses...'}
            </p>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800 p-16 text-center shadow-elegant">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {isAr ? 'لا توجد مساقات' : 'No Courses Found'}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {isAr ? 'ابدأ بإضافة مساق جديد' : 'Start by adding a new course'}
            </p>
          </div>
        ) : (
          <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 lg:grid-cols-2 gap-6' : 'grid-cols-1 gap-4'}`}>
            {filteredCourses.map(course => (
              <div
                key={course.id}
                className={`group bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200/60 dark:border-gray-800/60 shadow-elegant hover:shadow-lg hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 overflow-hidden ${
                  viewMode === 'list' ? 'flex flex-col sm:flex-row gap-6' : ''
                }`}
              >
                {viewMode === 'list' && (
                  <div className="w-full sm:w-48 h-32 rounded-xl overflow-hidden flex-shrink-0 bg-primary/10">
                    {course.imageUrl ? (
                      <img src={course.imageUrl} alt={course.titleEn} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="w-8 h-8 text-primary/40" />
                      </div>
                    )}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <Link href={`/courses-admin/${course.slug}/manage`}>
                        <h3 className="font-bold text-gray-900 dark:text-white text-sm hover:text-primary transition-colors cursor-pointer leading-snug flex items-center gap-2">
                          {isAr ? course.titleAr : course.titleEn}
                          <ExternalLink className="w-3.5 h-3.5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </h3>
                      </Link>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <Badge variant={course.published ? 'success' : 'secondary'} className="gap-1.5 px-3 py-1">
                          {course.published ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          {course.published ? (isAr ? 'منشور' : 'Published') : (isAr ? 'مسودة' : 'Draft')}
                        </Badge>
                        {course.category && (
                          <Badge variant="outline" className="gap-1.5 px-3 py-1 border-primary/20 text-primary">
                            <Folder className="w-3 h-3" />
                            {isAr ? course.category.nameAr : course.category.nameEn}
                          </Badge>
                        )}
                        {course.offers && course.offers.length > 0 && (
                          <Badge variant="primary" className="gap-1.5 px-3 py-1 bg-primary/10 text-primary">
                            <Tag className="w-3 h-3" />
                            {course.offers.length} {isAr ? 'عروض' : 'Offers'}
                          </Badge>
                        )}
                        {course.introVideoUrl && (
                          <Badge variant="outline" className="gap-1.5 px-3 py-1 border-primary/20 text-primary">
                            <PlayCircle className="w-3 h-3" />
                            {isAr ? 'فيديو تعريفي' : 'Intro video'}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-1 ml-2 flex-shrink-0">
                      <button
                        onClick={() => handleEditCourse(course)}
                        className="p-1.5 rounded-lg hover:bg-primary/10 text-gray-400 hover:text-primary transition-all duration-200 cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteCourse(course.id)}
                        className="p-1.5 rounded-lg hover:bg-error/10 text-gray-400 hover:text-error transition-all duration-200 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {viewMode === 'grid' && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed mt-2">
                      {isAr ? course.descriptionAr : course.descriptionEn}
                    </p>
                  )}

                  <div className={`flex items-center justify-between pt-3 border-t border-gray-200/50 dark:border-gray-800/50 text-xs ${
                    viewMode === 'list' ? 'mt-3' : 'mt-2'
                  }`}>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                        <User className="w-3.5 h-3.5" />
                        <span className="truncate max-w-[100px]">{course.instructor?.fullName || (isAr ? 'لا يوجد' : 'None')}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1 font-bold text-primary">
                        <DollarSign className="w-3 h-3" />
                        {course.offers?.[0] ? course.offers[0].price : 0} DZD
                      </span>
                      <span className="inline-flex items-center gap-1 font-bold text-gray-700 dark:text-gray-300">
                        <Users className="w-3.5 h-3.5 text-primary" />
                        {course._count?.enrollments || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ==================================================================== */}
        {/* MODAL — Formulaire à onglets : Général / Contenu / Offres / Vidéo    */}
        {/* ==================================================================== */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => { setIsModalOpen(false); resetForm(); }}
          className="max-w-3xl"
          title={
            <div className="flex items-center justify-between w-full gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/10">
                  {editingCourse ? <Edit className="w-5 h-5 text-primary" /> : <Plus className="w-5 h-5 text-primary" />}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {editingCourse ? (isAr ? 'تعديل المساق' : 'Edit Course') : (isAr ? 'إنشاء مساق جديد' : 'Create Course')}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {isAr ? 'املأ جميع الحقول المطلوبة' : 'Fill in all required fields'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={resetForm}
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-primary transition-colors shrink-0"
              >
                <Eraser className="w-3.5 h-3.5" />
                {isAr ? 'إعادة تعيين' : 'Clear'}
              </button>
            </div>
          }
        >
          <form onSubmit={handleCreateSubmit} className="space-y-4">

            <TabBar tabs={TABS} active={activeTab} onChange={setActiveTab} isAr={isAr} />

            <div className="max-h-[60vh] overflow-y-auto px-1 py-1 space-y-4">

              {/* ---------------------------------------------------------- */}
              {/* ONGLET 1 — Informations générales                          */}
              {/* ---------------------------------------------------------- */}
              {activeTab === 'general' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <FieldLabel icon={Type} required>{isAr ? 'العنوان (عربي)' : 'Title (Arabic)'}</FieldLabel>
                      <Input
                        required
                        value={titleAr}
                        onChange={e => setTitleAr(e.target.value)}
                        placeholder={isAr ? 'مثال: أساسيات البرمجة' : 'e.g. Introduction to Programming'}
                        className="w-full h-11 bg-white dark:bg-gray-950 border-2 border-gray-200 dark:border-gray-800 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-xl px-4 text-sm"
                        dir="rtl"
                      />
                    </div>
                    <div>
                      <FieldLabel icon={Type} required>{isAr ? 'العنوان (إنجليزي)' : 'Title (English)'}</FieldLabel>
                      <Input
                        required
                        value={titleEn}
                        onChange={e => setTitleEn(e.target.value)}
                        placeholder="e.g. Introduction to Programming"
                        className="w-full h-11 bg-white dark:bg-gray-950 border-2 border-gray-200 dark:border-gray-800 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-xl px-4 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <FieldLabel icon={Hash} required>{isAr ? 'الرابط المختصر (Slug)' : 'Slug (URL identifier)'}</FieldLabel>
                    <Input
                      required
                      value={slug}
                      onChange={e => setSlug(e.target.value)}
                      placeholder="introduction-to-programming"
                      className="w-full h-11 bg-white dark:bg-gray-950 border-2 border-gray-200 dark:border-gray-800 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-xl px-4 text-sm font-mono"
                    />
                    <p className="text-[10px] text-gray-400 mt-1.5">
                      {isAr ? 'يُستخدم في رابط المساق: /courses/your-slug' : 'Used in the course URL: /courses/your-slug'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <FieldLabel icon={Folder} required>{isAr ? 'التصنيف' : 'Category'}</FieldLabel>
                      <FieldSelect
                        icon={Folder}
                        value={categoryId}
                        required
                        onChange={e => setCategoryId(e.target.value)}
                        placeholder={isAr ? 'اختر التصنيف' : 'Choose a category'}
                      >
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{isAr ? cat.nameAr : cat.nameEn}</option>
                        ))}
                      </FieldSelect>
                    </div>
                    <div>
                      <FieldLabel icon={User}>{isAr ? 'المدرب (اختياري)' : 'Instructor (optional)'}</FieldLabel>
                      <FieldSelect
                        icon={User}
                        value={instructorId}
                        onChange={e => setInstructorId(e.target.value)}
                        placeholder={
                          instructors.length === 0
                            ? (isAr ? 'لا يوجد مدربون متاحون' : 'No instructors available')
                            : (isAr ? 'اختر المدرب' : 'Choose an instructor')
                        }
                      >
                        {instructors.map(inst => (
                          <option key={inst.id} value={inst.id}>{inst.fullName || inst.email || inst.id}</option>
                        ))}
                      </FieldSelect>
                      {instructors.length === 0 && (
                        <p className="text-[10px] text-warning-dark dark:text-warning mt-1.5">
                          {isAr
                            ? 'لم يتم العثور على أي مستخدم بدور "مدرب" أو "مدير". تحقق من صفحة إدارة المستخدمين.'
                            : 'No user with role "Instructor" or "Admin" was found. Check the Users management page.'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ---------------------------------------------------------- */}
              {/* ONGLET 2 — Contenu pédagogique                              */}
              {/* ---------------------------------------------------------- */}
              {activeTab === 'content' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <FieldLabel required>{isAr ? 'الوصف (عربي)' : 'Description (Arabic)'}</FieldLabel>
                      <textarea
                        required
                        value={descriptionAr}
                        onChange={e => setDescriptionAr(e.target.value)}
                        dir="rtl"
                        className="w-full p-4 border-2 border-gray-200 dark:border-gray-800 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-xl bg-white dark:bg-gray-950 outline-none resize-none transition-all duration-200 text-sm"
                        rows={4}
                        placeholder={isAr ? 'وصف موجز وجذاب للمساق...' : 'Short, engaging course description...'}
                      />
                    </div>
                    <div>
                      <FieldLabel required>{isAr ? 'الوصف (إنجليزي)' : 'Description (English)'}</FieldLabel>
                      <textarea
                        required
                        value={descriptionEn}
                        onChange={e => setDescriptionEn(e.target.value)}
                        className="w-full p-4 border-2 border-gray-200 dark:border-gray-800 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-xl bg-white dark:bg-gray-950 outline-none resize-none transition-all duration-200 text-sm"
                        rows={4}
                        placeholder="Short, engaging course description..."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <FieldLabel icon={ListChecks} required>{isAr ? 'ماذا ستتعلم (عربي)' : "What You'll Learn (Arabic)"}</FieldLabel>
                      <textarea
                        required
                        value={whatYouWillLearnAr}
                        onChange={e => setWhatYouWillLearnAr(e.target.value)}
                        dir="rtl"
                        className="w-full p-4 border-2 border-gray-200 dark:border-gray-800 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-xl bg-white dark:bg-gray-950 outline-none resize-none transition-all duration-200 text-sm"
                        rows={4}
                        placeholder={isAr ? 'نقطة لكل سطر تفيد الطالب...' : 'One outcome per line...'}
                      />
                    </div>
                    <div>
                      <FieldLabel icon={ListChecks} required>{isAr ? 'ماذا ستتعلم (إنجليزي)' : "What You'll Learn (English)"}</FieldLabel>
                      <textarea
                        required
                        value={whatYouWillLearnEn}
                        onChange={e => setWhatYouWillLearnEn(e.target.value)}
                        className="w-full p-4 border-2 border-gray-200 dark:border-gray-800 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-xl bg-white dark:bg-gray-950 outline-none resize-none transition-all duration-200 text-sm"
                        rows={4}
                        placeholder="One outcome per line..."
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ---------------------------------------------------------- */}
              {/* ONGLET 3 — Offres, image de couverture et publication       */}
              {/* ---------------------------------------------------------- */}
              {activeTab === 'offers' && (
                <div className="space-y-5 animate-fade-in">
                  {/* Offres */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <FieldLabel icon={Tag}>{isAr ? 'عروض الاشتراك' : 'Subscription Offers'}</FieldLabel>
                      <button
                        type="button"
                        onClick={addOfferField}
                        className="inline-flex items-center gap-1.5 text-[11px] font-bold text-primary hover:underline"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        {isAr ? 'إضافة عرض' : 'Add offer'}
                      </button>
                    </div>

                    <div className="space-y-2">
                      {offers.map((offer, index) => {
                        const isExpanded = expandedOfferIndex === index;
                        const summaryLabel = offer.nameEn || offer.nameAr || (isAr ? `عرض ${index + 1}` : `Offer ${index + 1}`);
                        return (
                          <div
                            key={index}
                            className={`rounded-xl border-2 transition-all duration-200 overflow-hidden ${
                              isExpanded ? 'border-primary/40' : 'border-gray-200 dark:border-gray-800'
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() => setExpandedOfferIndex(isExpanded ? null : index)}
                              className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-white dark:bg-gray-950 text-left"
                            >
                              <span className="flex items-center gap-2 min-w-0">
                                <span className="inline-flex items-center justify-center size-5 rounded-full bg-primary/10 text-primary text-[10px] font-black shrink-0">
                                  {index + 1}
                                </span>
                                <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">
                                  {summaryLabel}
                                </span>
                                {offer.price && (
                                  <span className="text-xs font-bold text-primary shrink-0">{offer.price} DZD</span>
                                )}
                              </span>
                              <span className="flex items-center gap-1 shrink-0">
                                {offers.length > 1 && (
                                  <span
                                    role="button"
                                    tabIndex={0}
                                    onClick={(e) => { e.stopPropagation(); removeOfferField(index); }}
                                    className="p-1 rounded-full text-gray-400 hover:text-error hover:bg-error/10 transition-colors cursor-pointer"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </span>
                                )}
                                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                              </span>
                            </button>

                            {isExpanded && (
                              <div className="p-4 pt-1 bg-gray-50/60 dark:bg-gray-950/40 border-t border-gray-100 dark:border-gray-800 space-y-3">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  <div>
                                    <FieldLabel>{isAr ? 'اسم العرض (عربي)' : 'Offer Name (Arabic)'}</FieldLabel>
                                    <Input
                                      required
                                      value={offer.nameAr}
                                      onChange={e => handleOfferChange(index, 'nameAr', e.target.value)}
                                      placeholder={isAr ? 'مثال: باقة شهرية' : 'e.g. باقة شهرية'}
                                      dir="rtl"
                                      className="w-full h-10 bg-white dark:bg-gray-950 border-2 border-gray-200 dark:border-gray-800 focus:border-primary rounded-lg px-3 text-sm"
                                    />
                                  </div>
                                  <div>
                                    <FieldLabel>{isAr ? 'اسم العرض (En)' : 'Offer Name (En)'}</FieldLabel>
                                    <Input
                                      required
                                      value={offer.nameEn}
                                      onChange={e => handleOfferChange(index, 'nameEn', e.target.value)}
                                      placeholder="e.g. Monthly Plan"
                                      className="w-full h-10 bg-white dark:bg-gray-950 border-2 border-gray-200 dark:border-gray-800 focus:border-primary rounded-lg px-3 text-sm"
                                    />
                                  </div>
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                  <div>
                                    <FieldLabel icon={Calendar}>{isAr ? 'المدة (أشهر)' : 'Duration (months)'}</FieldLabel>
                                    <Input
                                      type="number"
                                      required
                                      min="1"
                                      value={offer.durationMonths}
                                      onChange={e => handleOfferChange(index, 'durationMonths', e.target.value)}
                                      placeholder="1"
                                      className="w-full h-10 bg-white dark:bg-gray-950 border-2 border-gray-200 dark:border-gray-800 focus:border-primary rounded-lg px-3 text-sm"
                                    />
                                  </div>
                                  <div>
                                    <FieldLabel icon={DollarSign}>{isAr ? 'السعر' : 'Price'}</FieldLabel>
                                    <Input
                                      type="number"
                                      required
                                      min="0"
                                      value={offer.price}
                                      onChange={e => handleOfferChange(index, 'price', e.target.value)}
                                      placeholder="2500"
                                      className="w-full h-10 bg-white dark:bg-gray-950 border-2 border-gray-200 dark:border-gray-800 focus:border-primary rounded-lg px-3 text-sm"
                                    />
                                  </div>
                                  <div>
                                    <FieldLabel icon={DollarSign}>{isAr ? 'السعر السابق' : 'Old Price'}</FieldLabel>
                                    <Input
                                      type="number"
                                      min="0"
                                      value={offer.oldPrice}
                                      onChange={e => handleOfferChange(index, 'oldPrice', e.target.value)}
                                      placeholder={isAr ? 'اختياري' : 'Optional'}
                                      className="w-full h-10 bg-white dark:bg-gray-950 border-2 border-gray-200 dark:border-gray-800 focus:border-primary rounded-lg px-3 text-sm"
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Image de couverture */}
                  <div>
                    <FieldLabel icon={Image}>{isAr ? 'صورة الغلاف' : 'Cover Image'}</FieldLabel>
                    <div
                      className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 ${
                        imageDragOver
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-300 dark:border-gray-700 hover:border-primary/50'
                      }`}
                      onDragOver={(e) => { e.preventDefault(); setImageDragOver(true); }}
                      onDragLeave={() => setImageDragOver(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setImageDragOver(false);
                        if (e.dataTransfer.files[0]) setImageFile(e.dataTransfer.files[0]);
                      }}
                    >
                      {imagePreview ? (
                        <div className="relative">
                          <img src={imagePreview} alt="Preview" className="max-h-40 mx-auto rounded-lg object-cover" />
                          <button
                            type="button"
                            onClick={() => { setImageFile(null); setImagePreview(''); }}
                            className="absolute -top-2 -right-2 p-1 rounded-full bg-error text-white hover:bg-error/90 transition-colors"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2.5">
                          <Upload className="w-8 h-8 mx-auto text-gray-400" />
                          <p className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                            {isAr ? 'اسحب وأفلت الصورة هنا، أو' : 'Drag and drop, or'}
                          </p>
                          <label className="inline-block px-4 py-2 text-xs font-bold rounded-xl bg-primary text-white hover:bg-primary/90 cursor-pointer transition-colors shadow-sm shadow-primary/25">
                            {isAr ? 'اختر صورة' : 'Choose Image'}
                            <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} className="hidden" />
                          </label>
                        </div>
                      )}
                    </div>
                    {imageFile && !imagePreview && (
                      <p className="text-xs text-success font-semibold mt-2 flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5" />
                        {imageFile.name}
                      </p>
                    )}
                  </div>

                  {/* Publier — puce filtre */}
                  <div>
                    <FieldLabel icon={Eye}>{isAr ? 'حالة النشر' : 'Publishing Status'}</FieldLabel>
                    <button
                      type="button"
                      onClick={() => setPublished((v) => !v)}
                      className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-xl border-2 transition-all duration-200 text-sm font-semibold cursor-pointer ${
                        published
                          ? 'bg-primary/5 border-primary/40 text-primary'
                          : 'bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      {published ? <Eye className="w-4 h-4 shrink-0" /> : <EyeOff className="w-4 h-4 shrink-0" />}
                      {published
                        ? (isAr ? 'منشور — مرئي لجميع الزوار' : 'Published — visible to everyone')
                        : (isAr ? 'مسودة — غير مرئي بعد' : 'Draft — not visible yet')}
                    </button>
                  </div>
                </div>
              )}

              {/* ---------------------------------------------------------- */}
              {/* ONGLET 4 — Vidéo d'introduction (nouveau)                   */}
              {/* ---------------------------------------------------------- */}
              {activeTab === 'video' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-primary/5 border border-primary/15">
                    <Video className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                      {isAr
                        ? 'فيديو قصير تعريفي يظهر في صفحة المساق قبل الاشتراك، لتحفيز الطلاب على التسجيل. مختلف عن فيديوهات الدروس التي تُدار من صفحة "إدارة المحتوى".'
                        : "A short teaser video shown on the course page before enrollment, to help convince students to sign up. This is separate from lesson videos, which are managed on the course's content page."}
                    </p>
                  </div>

                  <div>
                    <FieldLabel icon={Video}>{isAr ? 'ملف الفيديو التعريفي' : 'Intro Video File'}</FieldLabel>
                    <div
                      className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                        introVideoDragOver
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-300 dark:border-gray-700 hover:border-primary/50'
                      }`}
                      onDragOver={(e) => { e.preventDefault(); setIntroVideoDragOver(true); }}
                      onDragLeave={() => setIntroVideoDragOver(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIntroVideoDragOver(false);
                        const file = e.dataTransfer.files[0];
                        if (file) {
                          setIntroVideoFile(file);
                          setIntroVideoPreview(URL.createObjectURL(file));
                        }
                      }}
                    >
                      {introVideoPreview ? (
                        <div className="relative">
                          <video
                            src={introVideoPreview}
                            controls
                            className="max-h-56 w-full mx-auto rounded-lg bg-black"
                          />
                          <button
                            type="button"
                            onClick={() => { setIntroVideoFile(null); setIntroVideoPreview(''); }}
                            className="absolute -top-2 -right-2 p-1 rounded-full bg-error text-white hover:bg-error/90 transition-colors"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <PlayCircle className="w-10 h-10 mx-auto text-gray-400" />
                          <div>
                            <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                              {isAr ? 'اسحب وأفلت الفيديو هنا' : 'Drag and drop video here'}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">{isAr ? 'أو' : 'or'}</p>
                          </div>
                          <label className="inline-block px-4 py-2 text-xs font-bold rounded-xl bg-primary text-white hover:bg-primary/90 cursor-pointer transition-colors shadow-sm shadow-primary/25">
                            {isAr ? 'اختر فيديو' : 'Choose Video'}
                            <input
                              type="file"
                              accept="video/*"
                              onChange={e => {
                                const file = e.target.files[0];
                                if (file) {
                                  setIntroVideoFile(file);
                                  setIntroVideoPreview(URL.createObjectURL(file));
                                }
                              }}
                              className="hidden"
                            />
                          </label>
                        </div>
                      )}
                    </div>
                    {introVideoFile && (
                      <p className="text-xs text-success font-semibold mt-2 flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5" />
                        {introVideoFile.name}
                      </p>
                    )}
                    <p className="text-[10px] text-gray-400 mt-1.5">
                      {isAr ? 'اختياري — يمكن إضافته أو تعديله لاحقاً في أي وقت.' : 'Optional — can be added or changed later at any time.'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Actions finales — toujours visibles, quel que soit l'onglet actif */}
            <div className="flex flex-col gap-2 pt-2 pb-1 border-t border-gray-200 dark:border-gray-800 mt-2">
              <div className="pt-3">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-12 gap-2 rounded-xl bg-primary-dark hover:bg-primary-dark/90 transition-all duration-300 text-white font-bold text-sm"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {isAr ? 'جاري الحفظ...' : 'Saving...'}
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      {isAr ? 'حفظ المساق' : 'Save Course'}
                    </>
                  )}
                </Button>
              </div>
              <Button
                type="button"
                onClick={() => { setIsModalOpen(false); resetForm(); }}
                variant="outline"
                className="w-full h-11 gap-2 rounded-xl border-2 border-gray-200 dark:border-gray-800 hover:border-error/30 hover:text-error transition-all duration-200"
              >
                <XCircle className="w-4 h-4" />
                {isAr ? 'إلغاء' : 'Cancel'}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}