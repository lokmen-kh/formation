"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/Badge';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { 
  BookOpen, UploadCloud, Plus, Trash2, ArrowLeft, Loader2, 
  CheckCircle, Globe, ShieldAlert, Sparkles, Layers, DollarSign,
  ChevronDown, Type, Hash, FileText, Image, Eye, EyeOff, HelpCircle, ArrowRight, Tag, Calendar, Video, PlayCircle, XCircle
} from 'lucide-react';
import Link from 'next/link';

/* -------------------------------------------------------------------------- */
/* Éléments de formulaire façon "onboarding bancaire" (réf. capture DNB)      */
/* -------------------------------------------------------------------------- */

/** Petit label en majuscules au-dessus d'un groupe de champs */
function SectionLabel({ children }) {
  return (
    <p className="text-[10px] font-black text-gray-550 dark:text-gray-400 uppercase tracking-wider mb-2.5">
      {children}
    </p>
  );
}

/** Champ à bordure avec label flottant sur la bordure + texte d'aide optionnel sous le champ. */
function FieldBox({ label, required, hint, children, className = '' }) {
  return (
    <div className={className}>
      <div className="relative">
        <span className="absolute -top-2.5 start-3 px-1.5 bg-white dark:bg-gray-950 text-[10px] font-bold text-gray-455 dark:text-gray-500 uppercase tracking-wide z-10">
          {label} {required && <span className="text-error">*</span>}
        </span>
        <div className="border-2 border-gray-200 dark:border-gray-800 focus-within:border-primary rounded-2xl transition-colors duration-200">
          {children}
        </div>
      </div>
      {hint && <p className="mt-1.5 ps-1 text-[10px] text-gray-400 dark:text-gray-500 font-semibold">{hint}</p>}
    </div>
  );
}

/** Petit bouton d'aide circulaire (point d'interrogation) */
function HelpDot({ label }) {
  return (
    <button
      type="button"
      title={label}
      className="shrink-0 w-8 h-8 rounded-full border-2 border-gray-200 dark:border-gray-800 text-gray-400 hover:text-primary hover:border-primary/40 flex items-center justify-center transition-colors"
    >
      <HelpCircle className="w-4 h-4" />
    </button>
  );
}

export default function InstructorCourseEditPage() {
  const { slug } = useParams();
  const { language } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [course, setCourse] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Formulaire Course
  const [courseSlug, setCourseSlug] = useState('');
  const [titleAr, setTitleAr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [descriptionAr, setDescriptionAr] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [published, setPublished] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  // NOUVEAU : États d'intégration vidéo d'intro S3/B2 [2]
  const [introVideoFile, setIntroVideoFile] = useState(null);
  const [introVideoPreview, setIntroVideoPreview] = useState('');

  // Offres dynamiques [2]
  const [offers, setOffers] = useState([]);

  const isAr = language === 'ar';
  const nf = new Intl.NumberFormat('fr-FR');

  useEffect(() => {
    if (!slug) return;

    // Charger les cours, les catégories publiques, et les détails
    Promise.all([
      fetch(`/api/public/courses/${slug}`).then(res => res.json()),
      fetch('/api/public/categories').then(res => res.json())
    ])
      .then(([courseData, catData]) => {
        if (courseData.course) {
          const c = courseData.course;
          setCourse(c);
          setCourseSlug(c.slug || '');
          setTitleAr(c.titleAr || '');
          setTitleEn(c.titleEn || '');
          setDescriptionAr(c.descriptionAr || '');
          setDescriptionEn(c.descriptionEn || '');
          setCategoryId(c.categoryId || '');
          setPublished(c.published || false);
          setImagePreview(c.imageUrl || '');
          
          // Alignement correct de la vidéo d'introduction sur "videoUrl" [2]
          setIntroVideoPreview(c.videoUrl || '');
          setOffers(c.offers || []);
        }
        if (catData.categories) {
          setCategories(catData.categories);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [slug]);

  // Contrôle de sécurité professeur [5]
  useEffect(() => {
    if (!authLoading && user && course) {
      const role = user.role?.toUpperCase();
      if (role !== 'ADMIN' && course.instructorId !== user.id) {
        router.replace('/instructor');
      }
    }
  }, [user, authLoading, course, router]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Gérer la manipulation dynamique des offres [2]
  const handleAddOffer = () => {
    setOffers(prev => [
      ...prev,
      { id: `temp-${Date.now()}`, nameAr: '', nameEn: '', durationMonths: 1, price: 0, oldPrice: null }
    ]);
  };

  const handleRemoveOffer = (id) => {
    setOffers(prev => prev.filter(o => o.id !== id));
  };

  const handleOfferChange = (id, field, value) => {
    setOffers(prev => prev.map(o => o.id === id ? { ...o, [field]: value } : o));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setSubmitting(true);

    const formData = new FormData();
    formData.append('slug', courseSlug.trim());
    formData.append('titleAr', titleAr.trim());
    formData.append('titleEn', titleEn.trim());
    formData.append('descriptionAr', descriptionAr.trim());
    formData.append('descriptionEn', descriptionEn.trim());
    formData.append('categoryId', categoryId);
    formData.append('published', String(published));
    
    if (imageFile) {
      formData.append('image', imageFile);
    }
    
    // NOUVEAU : Transmission du fichier d'intro vidéo [2]
    if (introVideoFile) {
      formData.append('introVideo', introVideoFile);
    }

    // Filtrer et envoyer les offres d'abonnements [2]
    const cleanedOffers = offers.map(o => ({
      nameAr: o.nameAr,
      nameEn: o.nameEn,
      durationMonths: parseInt(o.durationMonths) || 1,
      price: parseFloat(o.price) || 0,
      oldPrice: o.oldPrice ? parseFloat(o.oldPrice) : null
    }));
    formData.append('offers', JSON.stringify(cleanedOffers));

    try {
      const res = await fetch(`/api/instructor/courses/${course.id}`, {
        method: 'PUT',
        body: formData
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Modification failed.');

      setSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fb] dark:bg-gray-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-[#f8f9fb] dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300 pb-20 ${isAr ? 'font-cairo' : 'font-sans'}`}>
      <div className="max-w-4xl mx-auto space-y-6 pt-8 px-4">
        
        {/* Retour au Dashboard */}
        <Link href="/instructor" className="inline-flex items-center gap-2 text-xs font-bold text-gray-550 hover:text-primary transition-colors select-none">
          <ArrowLeft className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} />
          {isAr ? 'العودة إلى لوحة التحكم' : 'Back to Dashboard'}
        </Link>

        {/* Titre Principal */}
        <div className="space-y-1 pb-4 border-b border-gray-150/40 dark:border-gray-900">
          <h1 className="text-2xl font-black text-gray-955 dark:text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary shrink-0" />
            {isAr ? 'تعديل مساقك التعليمي' : 'Edit Your Course Details'}
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {isAr ? 'قم بتحديث عنوان وصورة وتفاصيل الأسعار والأبواب الخاصة بكورس الطالب المعتمد' : 'Update your assigned course titles, descriptions, categories and subscription offers'}
          </p>
        </div>

        {/* Formulaire d'Édition Onboarding Bancaire */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {success && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl border border-emerald-150/10 text-emerald-600 dark:text-emerald-450 font-bold text-xs flex items-center gap-2.5 animate-fade-in">
              <CheckCircle className="w-4.5 h-4.5 shrink-0" />
              <span>{isAr ? 'تم حفظ تعديلات الكورس بنجاح !' : 'Course details saved successfully!'}</span>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 rounded-2xl text-xs font-bold flex items-start gap-2 animate-fade-in">
              <ShieldAlert className="w-4.5 h-4.5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Section 1 : Informations Générales */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-slate-150/40 dark:border-gray-855/50 p-6 sm:p-8 shadow-sm space-y-6">
            <SectionLabel>{isAr ? 'المعلومات العامة والتصنيف' : 'General Information'}</SectionLabel>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FieldBox label={isAr ? 'عنوان الدورة (En)' : 'Course Title (English)'} required>
                <Input required value={titleEn} onChange={e => setTitleEn(e.target.value)} className="h-12 px-4 border-0 rounded-2xl bg-transparent shadow-none focus-visible:ring-0 text-sm font-semibold" />
              </FieldBox>
              <FieldBox label={isAr ? 'عنوان الدورة (Ar)' : 'Course Title (Arabic)'} required>
                <Input required value={titleAr} onChange={e => setTitleAr(e.target.value)} dir="rtl" className="h-12 px-4 border-0 rounded-2xl bg-transparent shadow-none focus-visible:ring-0 text-sm font-semibold" />
              </FieldBox>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FieldBox label={isAr ? 'الرابط المختصر (Slug)' : 'Course Slug (URL identifier)'} required hint={isAr ? 'معرف فريد للرابط (ex: web-development-bac)' : 'Unique URL path (e.g., react-syllabus)'}>
                <Input required value={courseSlug} onChange={e => setCourseSlug(e.target.value)} placeholder="e.g. data-science-bac" className="h-12 px-4 border-0 rounded-2xl bg-transparent shadow-none focus-visible:ring-0 text-sm font-mono font-bold" />
              </FieldBox>
              
              <FieldBox label={isAr ? 'التصنيف التعليمي' : 'Category'} required>
                <Select value={categoryId} onValueChange={setCategoryId} required>
                  <SelectTrigger className="h-12 border-0 rounded-2xl bg-transparent shadow-none focus:ring-0">
                    <SelectValue placeholder={isAr ? '-- اختر التصنيف --' : '-- Choose Category --'} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.id} value= {isAr ? cat.nameAr : cat.nameEn}>
                        {isAr ? cat.nameAr : cat.nameEn}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldBox>
            </div>
          </div>

          {/* Section 2 : Descriptions */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-slate-150/40 dark:border-gray-855/50 p-6 sm:p-8 shadow-sm space-y-6">
            <SectionLabel>{isAr ? 'المحتوى البيداغوجي والوصف المعروض' : 'Pedagogical Content'}</SectionLabel>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FieldBox label={isAr ? 'وصف المساق (En)' : 'Description (English)'} required>
                <Textarea required rows={4} value={descriptionEn} onChange={e => setDescriptionEn(e.target.value)} className="p-4 border-0 rounded-2xl bg-transparent shadow-none resize-none focus-visible:ring-0 text-xs sm:text-sm" />
              </FieldBox>
              <FieldBox label={isAr ? 'وصف المساق (Ar)' : 'Description (Arabic)'} required>
                <Textarea required rows={4} value={descriptionAr} onChange={e => setDescriptionAr(e.target.value)} dir="rtl" className="p-4 border-0 rounded-2xl bg-transparent shadow-none resize-none focus-visible:ring-0 text-xs sm:text-sm" />
              </FieldBox>
            </div>
          </div>

          {/* Section 3 : Image de Couverture, Vidéo d'Introduction (B2) & Publication [2] */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-slate-150/40 dark:border-gray-855/50 p-6 sm:p-8 shadow-sm space-y-6">
            <SectionLabel>{isAr ? 'الوسائط وحالة النشر' : 'Media & Course Visibility'}</SectionLabel>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              
              {/* Image de couverture */}
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <FieldBox label={isAr ? 'صورة الغلاف' : 'Cover Image'} required>
                    <label className="flex h-12 w-full cursor-pointer items-center gap-2 rounded-2xl bg-primary/5 hover:bg-primary/10 transition-colors px-4 text-xs font-semibold text-primary">
                      <UploadCloud className="h-4 w-4 shrink-0" />
                      <span className="truncate">{imageFile ? imageFile.name : (isAr ? 'تحديث صورة الغلاف' : 'Upload Cover Image')}</span>
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                  </FieldBox>
                </div>
                <HelpDot label={isAr ? 'تظهر صورة غلاف المساق في الواجهة وفي بطاقة الكورس' : 'Visual cover image shown in the courses catalog card'} />
              </div>

              {/* Statut de publication */}
              <FieldBox label={isAr ? 'حالة النشر الحالية للمساق' : 'Course Status'} required>
                <div className="grid grid-cols-2 gap-1 p-1 bg-gray-50/50 dark:bg-gray-955/20 rounded-2xl">
                  {[
                    { val: false, labelAr: 'مسودة', labelEn: 'Draft' },
                    { val: true, labelAr: 'منشور', labelEn: 'Active/Published' }
                  ].map(opt => {
                    const isSelected = published === opt.val;
                    return (
                      <div
                        key={opt.val ? 'pub' : 'dr'}
                        onClick={() => setPublished(opt.val)}
                        className={`py-2 rounded-xl cursor-pointer transition-all duration-300 text-center text-xs font-bold select-none ${
                          isSelected
                            ? 'bg-primary text-white shadow-sm'
                            : 'text-gray-550 hover:text-primary hover:bg-white/40 dark:hover:bg-gray-850/40'
                        }`}
                      >
                        {isAr ? opt.labelAr : opt.labelEn}
                      </div>
                    );
                  })}
                </div>
              </FieldBox>
            </div>

            {imagePreview && (
              <div className="pt-2">
                <img src={imagePreview} alt="Preview" className="h-28 rounded-2xl object-cover border dark:border-gray-850" />
              </div>
            )}

            <div className="border-t border-gray-100 dark:border-gray-800/80 pt-5">
              {/* NOUVEAU : Téléversement Vidéo d'introduction liée à Backblaze B2 [2] */}
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <FieldBox label={isAr ? 'الفيديو التعريفي للمساق (Backblaze)' : 'Intro Video / Teaser File (B2)'} hint={isAr ? 'فيديو ترويجي قصير يظهر للزوار قبل الاشتراك' : 'A short teaser shown to users before subscribing'}>
                    <label className="flex h-12 w-full cursor-pointer items-center gap-2 rounded-2xl bg-violet-500/5 hover:bg-violet-500/10 transition-colors px-4 text-xs font-semibold text-violet-650 dark:text-violet-400">
                      <Video className="h-4 w-4 shrink-0" />
                      <span className="truncate">{introVideoFile ? introVideoFile.name : (isAr ? 'رفع فيديو تعريفي جديد' : 'Upload Intro Video')}</span>
                      <input type="file" accept="video/*" onChange={e => {
                        const file = e.target.files[0];
                        if (file) {
                          setIntroVideoFile(file);
                          setIntroVideoPreview(URL.createObjectURL(file));
                        }
                      }} className="hidden" />
                    </label>
                  </FieldBox>
                </div>
                <HelpDot label={isAr ? 'يرفع مباشرة إلى Backblaze B2 آمن' : 'Uploaded directly to your secure Backblaze B2 bucket'} />
              </div>

              {introVideoPreview && (
                <div className="pt-4">
                  <video src={introVideoPreview} controls className="max-h-56 w-full rounded-2xl bg-black border dark:border-gray-850" />
                </div>
              )}
            </div>

          </div>

          {/* Section 4 : Gestion des offres d'abonnements dynamiques */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-slate-150/40 dark:border-gray-855/50 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-850 pb-4 flex-wrap gap-2">
              <SectionLabel>{isAr ? 'عروض الاشتراك وأسعار الباقات المفعّلة' : 'Subscription Offers & Billing Plans'}</SectionLabel>
              <button
                type="button"
                onClick={handleAddOffer}
                className="inline-flex items-center gap-1.5 text-[10px] font-black text-primary hover:underline cursor-pointer bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-xl transition-all hover:bg-primary/20"
              >
                <Plus className="w-3.5 h-3.5 shrink-0" />
                {isAr ? 'إضافة باقة جديدة' : 'Add New Plan'}
              </button>
            </div>
            
            {offers.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-gray-150 rounded-2xl">
                <p className="text-xs font-bold text-gray-400">
                  {isAr ? 'لم تقم بتكوين باقات اشتراك بعد. يجب إضافة عرض واحد على الأقل.' : 'Configure at least one subscription offer for students.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {offers.map((offer, idx) => (
                  <div 
                    key={offer.id} 
                    className="p-5 rounded-3xl border border-slate-150/40 dark:border-gray-800/80 bg-gray-50/50 dark:bg-gray-955/20 relative space-y-4 group animate-fade-in-up"
                  >
                    {/* Bouton de suppression d'offre */}
                    <button
                      type="button"
                      onClick={() => handleRemoveOffer(offer.id)}
                      className="absolute top-4 end-4 text-gray-400 hover:text-red-500 transition-colors p-1 cursor-pointer"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>

                    <div className="text-[10px] font-black text-primary uppercase tracking-wider">
                      {isAr ? `الباقة رقم ${idx + 1}:` : `Plan Formula #${idx + 1}:`}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FieldBox label={isAr ? 'اسم الباقة (En)' : 'Plan Name (English)'} required>
                        <Input required value={offer.nameEn} onChange={e => handleOfferChange(offer.id, 'nameEn', e.target.value)} placeholder="e.g. 3-Months Access" className="h-10 border-0 rounded-2xl bg-transparent shadow-none focus-visible:ring-0 text-xs font-semibold" />
                      </FieldBox>
                      <FieldBox label={isAr ? 'اسم الباقة (Ar)' : 'Plan Name (Arabic)'} required>
                        <Input required value={offer.nameAr} onChange={e => handleOfferChange(offer.id, 'nameAr', e.target.value)} dir="rtl" placeholder="مثال: وصول لمدة 3 أشهر" className="h-10 border-0 rounded-2xl bg-transparent shadow-none focus-visible:ring-0 text-xs font-semibold" />
                      </FieldBox>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                      <FieldBox label={isAr ? 'المدة (أشهر)' : 'Duration (months)'} required hint={isAr ? 'عدد أشهر صلاحية الوصول' : 'Access duration months'}>
                        <Input type="number" required value={offer.durationMonths} onChange={e => handleOfferChange(offer.id, 'durationMonths', e.target.value)} className="h-10 border-0 rounded-2xl bg-transparent shadow-none focus-visible:ring-0 text-xs font-semibold" />
                      </FieldBox>
                      <FieldBox label={isAr ? 'السعر (دج)' : 'Price (DZD)'} required hint={isAr ? 'السعر الفعلي للباقة' : 'Actual dynamic price'}>
                        <Input type="number" required value={offer.price} onChange={e => handleOfferChange(offer.id, 'price', e.target.value)} className="h-10 border-0 rounded-2xl bg-transparent shadow-none focus-visible:ring-0 text-xs font-semibold" />
                      </FieldBox>
                      <FieldBox label={isAr ? 'السعر القديم (دج)' : 'Old Price (DZD)'} hint={isAr ? 'لإظهار الخصم والنسبة المئوية' : 'Old price for discount badge'}>
                        <Input type="number" value={offer.oldPrice || ''} onChange={e => handleOfferChange(offer.id, 'oldPrice', e.target.value)} className="h-10 border-0 rounded-2xl bg-transparent shadow-none focus-visible:ring-0 text-xs font-semibold" />
                      </FieldBox>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Boutons d'action finaux style DNB : "Annuler" en simple lien, bouton principal en pilule aligné à droite */}
          <div className="pt-6 border-t border-gray-150/40 dark:border-gray-800 flex items-center justify-between sm:justify-between flex-row">
            <Link href="/instructor" className="text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors">
              {isAr ? 'إلغاء والتراجع' : 'Cancel'}
            </Link>
            
            <Button
              type="submit"
              disabled={submitting}
              className="rounded-full px-8 h-12 bg-primary hover:bg-primary-dark text-white font-bold text-sm gap-2 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-200"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {isAr ? 'جاري الحفظ...' : 'Saving...'}
                </>
              ) : (
                <>
                  {isAr ? 'حفظ تعديلات المساق' : 'Save'}
                  <ArrowRight className={`w-4 h-4 text-white shrink-0 ${isAr ? 'rotate-180' : ''}`} />
                </>
              )}
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
}