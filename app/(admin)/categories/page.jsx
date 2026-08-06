"use client";

import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import {
  Folder,
  Plus,
  Search,
  Edit,
  Trash2,
  Tag,
  Layers,
  Grid3X3,
  ArrowRight,
  Sparkles,
  X,
  Check,
  AlertCircle,
  BookOpen,
  Hash,
  Globe,
  Type,
  TrendingUp,
  Users,
  Calendar,
  Loader2,
} from 'lucide-react';

export default function AdminCategoriesPage() {
  const { language } = useLanguage();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [viewMode, setViewMode] = useState('grid');

  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [slug, setSlug] = useState('');

  const isAr = language === 'ar';

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/admin/categories');
      const data = await res.json();
      if (data.categories) setCategories(data.categories);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const url = editingCategory 
        ? `/api/admin/categories/${editingCategory.id}` 
        : '/api/admin/categories';
      
      const method = editingCategory ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nameAr, nameEn, slug })
      });

      if (res.ok) {
        setIsModalOpen(false);
        setNameAr(''); setNameEn(''); setSlug('');
        setEditingCategory(null);
        fetchCategories();
      } else {
        const data = await res.json();
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setNameAr(category.nameAr);
    setNameEn(category.nameEn);
    setSlug(category.slug);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm(isAr ? 'هل أنت متأكد من حذف هذا التصنيف؟' : 'Are you sure you want to delete this category?')) {
      return;
    }
    
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        fetchCategories();
      } else {
        const data = await res.json();
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setNameAr('');
    setNameEn('');
    setSlug('');
  };

  const filteredCategories = categories.filter(cat => {
    const search = searchQuery.toLowerCase().trim();
    if (!search) return true;
    return cat.nameEn.toLowerCase().includes(search) || 
           cat.nameAr.includes(search) ||
           cat.slug.toLowerCase().includes(search);
  });

  const totalCourses = categories.reduce((acc, cat) => acc + (cat._count?.courses || 0), 0);
  const activeCategories = categories.filter(c => c._count?.courses > 0).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100/30 to-purple-50 dark:from-gray-950 dark:via-blue-950/20 dark:to-gray-950 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6 opacity-0 animate-fade-in-up">

        {/* Header with Blue Gradient */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-500 p-8 border border-blue-400/20 shadow-2xl shadow-blue-500/30">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000" />
          
          <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm shadow-lg shadow-white/10">
                <Layers className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-sm">
                  {isAr ? 'تصنيفات المساقات' : 'Categories Management'}
                </h1>
                <p className="text-sm text-blue-100 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-white/70" />
                  {isAr ? 'إدارة تصنيفات المساقات التعليمية' : 'Manage your course categories'}
                </p>
              </div>
            </div>
            <Button 
              onClick={() => setIsModalOpen(true)} 
              className="gap-2 bg-white text-blue-600 hover:bg-blue-50 shadow-lg shadow-white/25 hover:shadow-white/40 transition-all duration-300 hover:scale-105 group font-bold rounded-xl px-6 py-3"
            >
              <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
              {isAr ? 'إضافة تصنيف جديد' : 'Add Category'}
            </Button>
          </div>
        </div>

        {/* Stats Cards with Glassmorphism */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Folder, label: isAr ? 'إجمالي التصنيفات' : 'Total Categories', value: categories.length, color: 'blue' },
            { icon: BookOpen, label: isAr ? 'تصنيفات نشطة' : 'Active Categories', value: activeCategories, color: 'emerald' },
            { icon: Grid3X3, label: isAr ? 'مساقات مرتبطة' : 'Associated Courses', value: totalCourses, color: 'violet' },
            { icon: TrendingUp, label: isAr ? 'نمو التصنيفات' : 'Category Growth', value: '+12%', color: 'amber' },
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
              placeholder={isAr ? 'ابحث عن تصنيف...' : 'Search categories...'}
              className="w-full text-sm bg-white/50 dark:bg-gray-950/50 border-2 border-gray-200/50 dark:border-gray-800/50 focus:border-blue-500 focus:bg-white dark:focus:bg-gray-900 rounded-xl py-2.5 pl-10 pr-4 outline-none transition-all duration-200 text-gray-900 dark:text-white placeholder:text-gray-400"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="flex gap-1 p-1 bg-white/50 dark:bg-gray-950/50 rounded-xl border border-gray-200/50 dark:border-gray-800/50">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all duration-200 ${viewMode === 'grid' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all duration-200 ${viewMode === 'list' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
              >
                <Tag className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Categories Grid/List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-3xl border border-white/30 dark:border-gray-800/50 shadow-lg">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-900/50 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-6 bg-blue-500/20 rounded-full animate-pulse" />
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 animate-pulse">
              {isAr ? 'جاري تحميل التصنيفات...' : 'Loading categories...'}
            </p>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-3xl border-2 border-dashed border-gray-200/50 dark:border-gray-800/50 p-16 text-center shadow-lg">
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 rounded-full bg-blue-500/10">
                <Folder className="w-12 h-12 text-blue-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {isAr ? 'لا توجد تصنيفات' : 'No Categories Found'}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
                {isAr 
                  ? 'ابدأ بإضافة تصنيفات جديدة لتنظيم مساقاتك بشكل أفضل'
                  : 'Start adding categories to better organize your courses'}
              </p>
              <Button 
                onClick={() => setIsModalOpen(true)} 
                className="gap-2 mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
              >
                <Plus className="w-4 h-4" />
                {isAr ? 'إضافة تصنيف جديد' : 'Add Category'}
              </Button>
            </div>
          </div>
        ) : (
          <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' : 'grid-cols-1 gap-3'}`}>
            {filteredCategories.map((cat, index) => (
              <div 
                key={cat.id} 
                className={`group bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl border border-white/30 dark:border-gray-800/50 shadow-lg hover:shadow-xl hover:border-blue-400/50 transition-all duration-300 hover:-translate-y-1 overflow-hidden ${
                  viewMode === 'list' ? 'flex items-center p-4 gap-4' : 'p-6'
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {viewMode === 'list' ? (
                  // List View
                  <>
                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 group-hover:from-blue-500/20 group-hover:to-indigo-500/20 transition-all duration-300">
                      <Folder className="w-6 h-6 text-blue-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <h3 className="font-bold text-sm text-gray-900 dark:text-white truncate">
                          {isAr ? cat.nameAr : cat.nameEn}
                        </h3>
                        <span className="text-[10px] font-mono text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-md">
                          {cat.slug}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3 h-3" />
                          {cat._count?.courses || 0} {isAr ? 'مساق' : 'courses'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Globe className="w-3 h-3" />
                          {isAr ? cat.nameAr : cat.nameEn}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={() => handleEdit(cat)}
                        className="p-2 rounded-lg hover:bg-blue-500/10 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-600 transition-colors duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                ) : (
                  // Grid View
                  <>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 group-hover:from-blue-500/20 group-hover:to-indigo-500/20 transition-all duration-300">
                          <Folder className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                          <h3 className="font-bold text-sm text-gray-900 dark:text-white leading-tight">
                            {isAr ? cat.nameAr : cat.nameEn}
                          </h3>
                          <div className="flex items-center gap-1.5 mt-1">
                            <Hash className="w-3 h-3 text-gray-400" />
                            <span className="text-[10px] font-mono text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-md">
                              {cat.slug}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                          onClick={() => handleEdit(cat)}
                          className="p-1.5 rounded-lg hover:bg-blue-500/10 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id)}
                          className="p-1.5 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-600 transition-colors duration-200"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-200/50 dark:border-gray-800/50">
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                        <span>{cat._count?.courses || 0} {isAr ? 'مساق' : 'courses'}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Globe className="w-3 h-3 text-gray-400" />
                        <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400">
                          {isAr ? cat.nameAr : cat.nameEn}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Modal Add/Edit Category with Blue Theme */}
        <Modal 
          isOpen={isModalOpen} 
          onClose={handleCloseModal} 
          className="max-w-lg"
          title={
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10">
                {editingCategory ? (
                  <Edit className="w-5 h-5 text-blue-600" />
                ) : (
                  <Plus className="w-5 h-5 text-blue-600" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {editingCategory 
                    ? (isAr ? 'تعديل التصنيف' : 'Edit Category')
                    : (isAr ? 'إضافة تصنيف جديد' : 'Add Category')
                  }
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {editingCategory 
                    ? (isAr ? 'تحديث بيانات التصنيف' : 'Update category details')
                    : (isAr ? 'إنشاء تصنيف جديد للمساقات' : 'Create a new course category')
                  }
                </p>
              </div>
            </div>
          }
        >
          <form onSubmit={handleSubmit} className="space-y-5 bg-gradient-to-b from-blue-50/50 to-purple-50/50 dark:from-gray-950 dark:to-blue-950/20 rounded-2xl p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Type className="w-3.5 h-3.5 text-blue-500" />
                    {isAr ? 'الاسم بالعربية' : 'Name (Arabic)'} <span className="text-red-500">*</span>
                  </span>
                </label>
                <Input
                  required
                  value={nameAr}
                  onChange={e => setNameAr(e.target.value)}
                  placeholder={isAr ? 'أدخل الاسم بالعربية...' : 'Enter Arabic name...'}
                  className="w-full bg-white dark:bg-gray-950 border-blue-200 dark:border-blue-800 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Type className="w-3.5 h-3.5 text-blue-500" />
                    {isAr ? 'الاسم بالإنجليزية' : 'Name (English)'} <span className="text-red-500">*</span>
                  </span>
                </label>
                <Input
                  required
                  value={nameEn}
                  onChange={e => setNameEn(e.target.value)}
                  placeholder={isAr ? 'أدخل الاسم بالإنجليزية...' : 'Enter English name...'}
                  className="w-full bg-white dark:bg-gray-950 border-blue-200 dark:border-blue-800 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-blue-500" />
                  {isAr ? 'الرابط المختصر (Slug)' : 'Slug (URL identifier)'} <span className="text-red-500">*</span>
                </span>
              </label>
              <Input
                required
                value={slug}
                onChange={e => setSlug(e.target.value)}
                placeholder={isAr ? 'مثال: programming' : 'e.g., programming'}
                className="w-full bg-white dark:bg-gray-950 border-blue-200 dark:border-blue-800 focus:border-blue-500 font-mono"
              />
              <p className="mt-1.5 text-[10px] text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 text-blue-400" />
                {isAr 
                  ? 'يستخدم هذا الرابط في عنوان URL الخاص بالتصنيف'
                  : 'This will be used in the category URL'}
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-blue-200/50 dark:border-blue-800/50">
              <Button 
                onClick={handleCloseModal} 
                variant="outline" 
                className="gap-2 border-2 border-gray-300/50 dark:border-gray-700/50 hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-all duration-200"
              >
                <X className="w-4 h-4" />
                {isAr ? 'إلغاء' : 'Cancel'}
              </Button>
              <Button 
                type="submit" 
                disabled={submitting}
                className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {isAr ? 'جاري الحفظ...' : 'Saving...'}
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    {editingCategory 
                      ? (isAr ? 'تحديث' : 'Update')
                      : (isAr ? 'حفظ' : 'Save')
                    }
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