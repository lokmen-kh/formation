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
  Calendar,
  DollarSign,
  Globe,
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
  UserCheck,
  ExternalLink,
  Sparkles,
  Tag,
  ChevronDown,
  ChevronRight,
  Loader2,
  Grid,
  LayoutGrid,
} from 'lucide-react';

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
  
  // Form sections collapsible
  const [sections, setSections] = useState({
    basic: true,
    description: true,
    learning: true,
    offers: true,
    media: true,
  });

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
  
  const [offers, setOffers] = useState([
    { nameAr: '', nameEn: '', durationMonths: 1, price: '', oldPrice: '' }
  ]);

  const isAr = language === 'ar';

  const toggleSection = (section) => {
    setSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

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
      const dataUsers = await parseResponseJson(resUsers);
      if (dataUsers.users) {
        setInstructors(dataUsers.users.filter(u => u.role === 'INSTRUCTOR' || u.role === 'ADMIN'));
      }

      const resCats = await fetch('/api/admin/categories');
      const dataCats = await parseResponseJson(resCats);
      if (dataCats.categories) setCategories(dataCats.categories);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchInstructorsAndCategories();
  }, []);

  const addOfferField = () => {
    setOffers([...offers, { nameAr: '', nameEn: '', durationMonths: 1, price: '', oldPrice: '' }]);
  };

  const removeOfferField = (index) => {
    setOffers(offers.filter((_, i) => i !== index));
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

      const url = editingCourse 
        ? `/api/admin/courses/${editingCourse.id}` 
        : '/api/admin/courses';
      
      const method = editingCourse ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        body: formData
      });

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
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setTitleAr(''); setTitleEn(''); setSlug(''); setDescriptionAr(''); setDescriptionEn('');
    setWhatYouWillLearnAr(''); setWhatYouWillLearnEn('');
    setInstructorId(''); setCategoryId(''); setImageFile(null); setPublished(false);
    setOffers([{ nameAr: '', nameEn: '', durationMonths: 1, price: '', oldPrice: '' }]);
    setEditingCourse(null);
    setImagePreview('');
    setImageDragOver(false);
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

  const SectionHeader = ({ icon: Icon, title, section, isOpen }) => (
    <button
      type="button"
      onClick={() => toggleSection(section)}
      className="w-full flex items-center justify-between p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl border border-blue-200/50 dark:border-blue-800/50 hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-200 group shadow-sm"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
          <Icon className="w-4 h-4" />
        </div>
        <span className="text-sm font-bold text-gray-900 dark:text-white">{title}</span>
        <Badge variant="secondary" className="text-[9px] bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400">
          {isOpen ? '▼' : '▶'}
        </Badge>
      </div>
      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100/30 to-purple-50 dark:from-gray-950 dark:via-blue-950/20 dark:to-gray-950 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header with Blue Gradient */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-500 p-8 border border-blue-400/20 shadow-2xl shadow-blue-500/30">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          
          <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm shadow-lg shadow-white/10">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-sm">
                  {isAr ? 'إدارة المناهج والمساقات' : 'Course Management'}
                </h1>
                <p className="text-sm text-blue-100 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-white/70" />
                  {isAr ? 'إدارة المساقات التعليمية والمحتوى' : 'Manage your educational courses and content'}
                </p>
              </div>
            </div>
            <Button 
              onClick={() => { resetForm(); setIsModalOpen(true); }} 
              className="gap-2 bg-white text-blue-600 hover:bg-blue-50 shadow-lg shadow-white/25 hover:shadow-white/40 transition-all duration-300 hover:scale-105 group font-bold rounded-xl px-6 py-3"
            >
              <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
              {isAr ? 'إضافة مساق جديد' : 'Add Course'}
            </Button>
          </div>
        </div>

        {/* Stats Cards with Glassmorphism */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: BookOpen, label: isAr ? 'إجمالي المساقات' : 'Total Courses', value: courses.length, color: 'blue' },
            { icon: CheckCircle, label: isAr ? 'منشورة' : 'Published', value: publishedCount, color: 'emerald' },
            { icon: Users, label: isAr ? 'طلاب مسجلين' : 'Enrolled Students', value: totalStudents, color: 'purple' },
            { icon: TrendingUp, label: isAr ? 'تصنيفات' : 'Categories', value: categories.length, color: 'amber' },
          ].map((stat, index) => (
            <div 
              key={index}
              className="group bg-white/80 dark:bg-gray-900/80 backdrop-blur-md p-6 rounded-2xl border border-white/30 dark:border-gray-800/50 shadow-lg hover:shadow-xl hover:border-blue-400/50 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl bg-${stat.color}-500/20 group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className={`w-5 h-5 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                </div>
                <div>
                  <p className="text-2xl font-black text-gray-900 dark:text-white">{stat.value}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search and Filter with Glassmorphism */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-md p-4 rounded-2xl border border-white/30 dark:border-gray-800/50 shadow-lg">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isAr ? 'ابحث عن مساق...' : 'Search courses...'}
              className="w-full text-sm bg-white/50 dark:bg-gray-950/50 border-2 border-gray-200/50 dark:border-gray-800/50 focus:border-blue-500 focus:bg-white dark:focus:bg-gray-900 rounded-xl py-2.5 pl-10 pr-4 outline-none transition-all duration-200 text-gray-900 dark:text-white placeholder:text-gray-400"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-sm bg-white/50 dark:bg-gray-950/50 border-2 border-gray-200/50 dark:border-gray-800/50 focus:border-blue-500 rounded-xl px-3 py-2.5 outline-none transition-all duration-200 text-gray-900 dark:text-white cursor-pointer"
            >
              <option value="all">{isAr ? 'الكل' : 'All'}</option>
              <option value="published">{isAr ? 'منشور' : 'Published'}</option>
              <option value="draft">{isAr ? 'مسودة' : 'Draft'}</option>
            </select>
            <div className="flex gap-1 p-1 bg-white/50 dark:bg-gray-950/50 rounded-xl border border-gray-200/50 dark:border-gray-800/50">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all duration-200 ${viewMode === 'grid' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all duration-200 ${viewMode === 'list' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Grid/List View */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-3xl border border-white/30 dark:border-gray-800/50 shadow-lg">
            <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-900/50 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin" />
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              {isAr ? 'جاري تحميل المساقات...' : 'Loading courses...'}
            </p>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-3xl border-2 border-dashed border-gray-200/50 dark:border-gray-800/50 p-16 text-center shadow-lg">
            <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-blue-500" />
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
                className={`group bg-white/80 dark:bg-gray-900/80 backdrop-blur-md p-6 rounded-2xl border border-white/30 dark:border-gray-800/50 shadow-lg hover:shadow-xl hover:border-blue-400/50 transition-all duration-300 hover:-translate-y-1 overflow-hidden ${
                  viewMode === 'list' ? 'flex flex-col sm:flex-row gap-6' : ''
                }`}
              >
                {viewMode === 'list' && (
                  <div className="w-full sm:w-48 h-32 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                    {course.imageUrl ? (
                      <img src={course.imageUrl} alt={course.titleEn} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="w-8 h-8 text-blue-400/50" />
                      </div>
                    )}
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <Link href={`/courses-admin/${course.slug}/manage`}>
                        <h3 className="font-bold text-gray-900 dark:text-white text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer leading-snug flex items-center gap-2">
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
                          <Badge variant="outline" className="gap-1.5 px-3 py-1 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400">
                            <Folder className="w-3 h-3" />
                            {isAr ? course.category.nameAr : course.category.nameEn}
                          </Badge>
                        )}
                        {course.offers && course.offers.length > 0 && (
                          <Badge variant="primary" className="gap-1.5 px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400">
                            <Tag className="w-3 h-3" />
                            {course.offers.length} {isAr ? 'عروض' : 'Offers'}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-1 ml-2 flex-shrink-0">
                      <button 
                        onClick={() => handleEditCourse(course)} 
                        className="p-1.5 rounded-lg hover:bg-blue-500/10 text-gray-400 hover:text-blue-600 transition-all duration-200 cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => handleDeleteCourse(course.id)} 
                        className="p-1.5 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-600 transition-all duration-200 cursor-pointer"
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
                      <span className="flex items-center gap-1 font-bold text-blue-600 dark:text-blue-400">
                        <DollarSign className="w-3 h-3" />
                        {course.offers?.[0] ? course.offers[0].price : 0} DZD
                      </span>
                      <span className="inline-flex items-center gap-1 font-bold text-gray-700 dark:text-gray-300">
                        <Users className="w-3.5 h-3.5 text-blue-500" />
                        {course._count?.enrollments || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modern Modal Form with Blue Background */}
        <Modal 
          isOpen={isModalOpen} 
          onClose={() => { setIsModalOpen(false); resetForm(); }} 
          className="max-w-4xl"
          title={
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                {editingCourse ? <Edit className="w-5 h-5 text-blue-600" /> : <Plus className="w-5 h-5 text-blue-600" />}
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
          }
        >
          <form onSubmit={handleCreateSubmit} className="space-y-6 max-h-[80vh] overflow-y-auto px-1 py-2 bg-gradient-to-b from-blue-50/50 to-purple-50/50 dark:from-gray-950 dark:to-blue-950/20 rounded-2xl p-4">
            
            {/* Section 1: Basic Information */}
            <div className="space-y-3">
              <SectionHeader icon={Type} title={isAr ? 'المعلومات الأساسية' : 'Basic Information'} section="basic" isOpen={sections.basic} />
              
              {sections.basic && (
                <div className="p-6 bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm rounded-xl border border-blue-200/50 dark:border-blue-800/50 space-y-4 animate-fade-in shadow-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        <span className="flex items-center gap-1.5">
                          <Type className="w-3.5 h-3.5 text-blue-500" />
                          {isAr ? 'العنوان بالعربية' : 'Title (Arabic)'} <span className="text-red-500">*</span>
                        </span>
                      </label>
                      <Input 
                        required 
                        value={titleAr} 
                        onChange={e => setTitleAr(e.target.value)} 
                        className="w-full bg-white dark:bg-gray-950 border-2 border-gray-200/50 dark:border-gray-800/50 focus:border-blue-500 rounded-xl py-3 px-4 text-sm" 
                        placeholder={isAr ? 'أدخل عنوان المساق بالعربية' : 'Enter course title in Arabic'}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        <span className="flex items-center gap-1.5">
                          <Type className="w-3.5 h-3.5 text-blue-500" />
                          {isAr ? 'العنوان بالإنجليزية' : 'Title (English)'} <span className="text-red-500">*</span>
                        </span>
                      </label>
                      <Input 
                        required 
                        value={titleEn} 
                        onChange={e => setTitleEn(e.target.value)} 
                        className="w-full bg-white dark:bg-gray-950 border-2 border-gray-200/50 dark:border-gray-800/50 focus:border-blue-500 rounded-xl py-3 px-4 text-sm" 
                        placeholder={isAr ? 'أدخل عنوان المساق بالإنجليزية' : 'Enter course title in English'}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      <span className="flex items-center gap-1.5">
                        <Hash className="w-3.5 h-3.5 text-blue-500" />
                        {isAr ? 'الرابط المختصر (Slug)' : 'Slug (URL identifier)'} <span className="text-red-500">*</span>
                      </span>
                    </label>
                    <Input 
                      required 
                      value={slug} 
                      onChange={e => setSlug(e.target.value)} 
                      placeholder="ex: introduction-to-programming" 
                      className="w-full bg-white dark:bg-gray-950 border-2 border-gray-200/50 dark:border-gray-800/50 focus:border-blue-500 rounded-xl py-3 px-4 text-sm font-mono" 
                    />
                    <p className="text-[10px] text-gray-400 mt-1.5">
                      {isAr ? 'يستخدم في رابط المساق (URL)' : 'Used in the course URL'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Section 2: Description */}
            <div className="space-y-3">
              <SectionHeader icon={FileText} title={isAr ? 'الوصف' : 'Description'} section="description" isOpen={sections.description} />
              
              {sections.description && (
                <div className="p-6 bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm rounded-xl border border-blue-200/50 dark:border-blue-800/50 space-y-4 animate-fade-in shadow-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        {isAr ? 'الوصف بالعربية' : 'Description (Arabic)'} <span className="text-red-500">*</span>
                      </label>
                      <textarea 
                        required 
                        value={descriptionAr} 
                        onChange={e => setDescriptionAr(e.target.value)} 
                        className="w-full p-4 border-2 border-gray-200/50 dark:border-gray-800/50 focus:border-blue-500 rounded-xl bg-white dark:bg-gray-950 outline-none resize-none transition-all duration-200 text-sm" 
                        rows={4}
                        placeholder={isAr ? 'أدخل وصف المساق بالعربية' : 'Enter course description in Arabic'}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        {isAr ? 'الوصف بالإنجليزية' : 'Description (English)'} <span className="text-red-500">*</span>
                      </label>
                      <textarea 
                        required 
                        value={descriptionEn} 
                        onChange={e => setDescriptionEn(e.target.value)} 
                        className="w-full p-4 border-2 border-gray-200/50 dark:border-gray-800/50 focus:border-blue-500 rounded-xl bg-white dark:bg-gray-950 outline-none resize-none transition-all duration-200 text-sm" 
                        rows={4}
                        placeholder={isAr ? 'أدخل وصف المساق بالإنجليزية' : 'Enter course description in English'}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Section 3: What You'll Learn */}
            <div className="space-y-3">
              <SectionHeader icon={ListChecks} title={isAr ? 'ماذا ستتعلم' : 'What You\'ll Learn'} section="learning" isOpen={sections.learning} />
              
              {sections.learning && (
                <div className="p-6 bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm rounded-xl border border-blue-200/50 dark:border-blue-800/50 space-y-4 animate-fade-in shadow-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        {isAr ? 'ماذا ستتعلم (عربي)' : 'What You\'ll Learn (Arabic)'} <span className="text-red-500">*</span>
                      </label>
                      <textarea 
                        required 
                        value={whatYouWillLearnAr} 
                        onChange={e => setWhatYouWillLearnAr(e.target.value)} 
                        className="w-full p-4 border-2 border-gray-200/50 dark:border-gray-800/50 focus:border-blue-500 rounded-xl bg-white dark:bg-gray-950 outline-none resize-none transition-all duration-200 text-sm" 
                        rows={4}
                        placeholder={isAr ? 'أدخل ما سيتعلمه الطالب بالعربية' : 'Enter what students will learn in Arabic'}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        {isAr ? 'ماذا ستتعلم (إنجليزي)' : 'What You\'ll Learn (English)'} <span className="text-red-500">*</span>
                      </label>
                      <textarea 
                        required 
                        value={whatYouWillLearnEn} 
                        onChange={e => setWhatYouWillLearnEn(e.target.value)} 
                        className="w-full p-4 border-2 border-gray-200/50 dark:border-gray-800/50 focus:border-blue-500 rounded-xl bg-white dark:bg-gray-950 outline-none resize-none transition-all duration-200 text-sm" 
                        rows={4}
                        placeholder={isAr ? 'أدخل ما سيتعلمه الطالب بالإنجليزية' : 'Enter what students will learn in English'}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Section 4: Subscription Offers */}
            <div className="space-y-3">
              <SectionHeader icon={DollarSign} title={isAr ? 'عروض الاشتراك' : 'Subscription Offers'} section="offers" isOpen={sections.offers} />
              
              {sections.offers && (
                <div className="p-6 bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm rounded-xl border border-blue-200/50 dark:border-blue-800/50 space-y-4 animate-fade-in shadow-lg">
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {isAr ? 'أضف عروض وباقات اشتراك للمساق' : 'Add subscription plans and offers'}
                    </p>
                    <Button 
                      type="button" 
                      onClick={addOfferField} 
                      size="sm" 
                      variant="outline" 
                      className="gap-2 text-xs font-bold border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400 hover:bg-blue-500/10 rounded-xl px-4 py-2"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      {isAr ? 'إضافة عرض' : 'Add Offer'}
                    </Button>
                  </div>

                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                    {offers.map((offer, index) => (
                      <div 
                        key={index} 
                        className="relative p-4 bg-white/70 dark:bg-gray-950/70 rounded-xl border border-blue-200/50 dark:border-blue-800/50 hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-200"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
                          <Input 
                            label={isAr ? 'الاسم (عربي)' : 'Name (Ar)'} 
                            required 
                            value={offer.nameAr} 
                            onChange={e => handleOfferChange(index, 'nameAr', e.target.value)} 
                            className="bg-white dark:bg-gray-950"
                          />
                          <Input 
                            label={isAr ? 'الاسم (En)' : 'Name (En)'} 
                            required 
                            value={offer.nameEn} 
                            onChange={e => handleOfferChange(index, 'nameEn', e.target.value)} 
                            className="bg-white dark:bg-gray-950"
                          />
                          <Input 
                            label={isAr ? 'المدة (شهور)' : 'Months'} 
                            type="number" 
                            required 
                            value={offer.durationMonths} 
                            onChange={e => handleOfferChange(index, 'durationMonths', e.target.value)} 
                            className="bg-white dark:bg-gray-950"
                          />
                          <Input 
                            label={isAr ? 'السعر' : 'Price'} 
                            type="number" 
                            required 
                            value={offer.price} 
                            onChange={e => handleOfferChange(index, 'price', e.target.value)} 
                            className="bg-white dark:bg-gray-950"
                          />
                          <div className="flex gap-2 items-end">
                            <Input 
                              label={isAr ? 'السعر القديم' : 'Old Price'} 
                              type="number" 
                              value={offer.oldPrice} 
                              onChange={e => handleOfferChange(index, 'oldPrice', e.target.value)} 
                              className="bg-white dark:bg-gray-950"
                            />
                            {offers.length > 1 && (
                              <button 
                                type="button" 
                                onClick={() => removeOfferField(index)} 
                                className="p-2.5 rounded-xl bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-all cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="absolute -top-2 -right-2">
                          <Badge variant="secondary" className="text-[8px] bg-blue-500/20 text-blue-600 dark:text-blue-400">
                            #{index + 1}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Section 5: Media & Publishing */}
            <div className="space-y-3">
              <SectionHeader icon={Image} title={isAr ? 'الوسائط والنشر' : 'Media & Publishing'} section="media" isOpen={sections.media} />
              
              {sections.media && (
                <div className="p-6 bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm rounded-xl border border-blue-200/50 dark:border-blue-800/50 space-y-4 animate-fade-in shadow-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        <span className="flex items-center gap-1.5">
                          <Folder className="w-3.5 h-3.5 text-blue-500" />
                          {isAr ? 'التصنيف' : 'Category'} <span className="text-red-500">*</span>
                        </span>
                      </label>
                      <select 
                        value={categoryId} 
                        required 
                        onChange={e => setCategoryId(e.target.value)} 
                        className="w-full px-4 py-3 text-sm border-2 border-gray-200/50 dark:border-gray-800/50 focus:border-blue-500 rounded-xl bg-white dark:bg-gray-950 outline-none transition-all duration-200 text-gray-900 dark:text-white cursor-pointer"
                      >
                        <option value="">{isAr ? '-- اختر التصنيف --' : '-- Choose Category --'}</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{isAr ? cat.nameAr : cat.nameEn}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        <span className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-blue-500" />
                          {isAr ? 'المدرب (اختياري)' : 'Instructor (Optional)'}
                        </span>
                      </label>
                      <select 
                        value={instructorId} 
                        onChange={e => setInstructorId(e.target.value)} 
                        className="w-full px-4 py-3 text-sm border-2 border-gray-200/50 dark:border-gray-800/50 focus:border-blue-500 rounded-xl bg-white dark:bg-gray-950 outline-none transition-all duration-200 text-gray-900 dark:text-white cursor-pointer"
                      >
                        <option value="">{isAr ? '-- اختر المدرب (اختياري) --' : '-- Choose Instructor (Optional) --'}</option>
                        {instructors.map(inst => (
                          <option key={inst.id} value={inst.id}>{inst.fullName}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      <span className="flex items-center gap-1.5">
                        <Image className="w-3.5 h-3.5 text-blue-500" />
                        {isAr ? 'صورة الغلاف' : 'Cover Image'}
                      </span>
                    </label>
                    <div 
                      className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                        imageDragOver 
                          ? 'border-blue-500 bg-blue-500/10' 
                          : 'border-gray-300/50 dark:border-gray-700/50 hover:border-blue-400'
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
                          <img src={imagePreview} alt="Preview" className="max-h-48 mx-auto rounded-lg object-cover" />
                          <button
                            type="button"
                            onClick={() => { setImageFile(null); setImagePreview(''); }}
                            className="absolute -top-2 -right-2 p-1 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <Upload className="w-10 h-10 mx-auto text-gray-400" />
                          <div>
                            <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                              {isAr ? 'اسحب وأفلت الصورة هنا' : 'Drag and drop image here'}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {isAr ? 'أو' : 'or'}
                            </p>
                          </div>
                          <label className="inline-block px-4 py-2 text-xs font-bold rounded-xl bg-blue-600 text-white hover:bg-blue-700 cursor-pointer transition-colors shadow-lg shadow-blue-500/30">
                            {isAr ? 'اختر صورة' : 'Choose Image'}
                            <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} className="hidden" />
                          </label>
                        </div>
                      )}
                    </div>
                    {imageFile && !imagePreview && (
                      <p className="text-xs text-emerald-600 font-semibold mt-2 flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5" />
                        {imageFile.name}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <input 
                      type="checkbox" 
                      id="published" 
                      checked={published} 
                      onChange={e => setPublished(e.target.checked)} 
                      className="w-5 h-5 text-blue-600 rounded border-2 border-gray-300/50 dark:border-gray-600/50 focus:ring-blue-500 focus:ring-2 cursor-pointer" 
                    />
                    <label htmlFor="published" className="text-sm font-semibold text-gray-700 dark:text-gray-300 cursor-pointer flex items-center gap-2">
                      {published ? <Eye className="w-4 h-4 text-blue-600" /> : <EyeOff className="w-4 h-4 text-gray-400" />}
                      {isAr ? 'نشر المساق للجميع' : 'Publish Course'}
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-blue-200/50 dark:border-blue-800/50">
              <Button 
                onClick={() => { setIsModalOpen(false); resetForm(); }} 
                variant="outline" 
                className="gap-2 px-6 py-2.5 rounded-xl border-2 border-gray-300/50 dark:border-gray-700/50 hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-all duration-200"
              >
                <XCircle className="w-4 h-4" />
                {isAr ? 'إلغاء' : 'Cancel'}
              </Button>
              <Button 
                type="submit" 
                disabled={submitting} 
                className="gap-2 px-8 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 text-white font-bold"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {isAr ? 'جاري الحفظ...' : 'Saving...'}
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    {isAr ? 'حفظ' : 'Save'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}