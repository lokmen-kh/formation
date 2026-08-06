"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import {Input} from '@/components/ui/Input';
import {Button} from '@/components/ui/Button';

export default function UploadLessonPage() {
  const { slug: courseSlug } = useParams();
  const { language } = useLanguage();
  const router = useRouter();

  const [chapters, setChapters] = useState([]);
  const [chapterId, setChapterId] = useState('');
  const [titleAr, setTitleAr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [writtenContentAr, setWrittenContentAr] = useState('');
  const [writtenContentEn, setWrittenContentEn] = useState('');
  const [order, setOrder] = useState('');
  const [videoFile, setVideoFile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const isAr = language === 'ar';

  useEffect(() => {
    if (courseSlug) {
      fetch(`/api/public/courses/${courseSlug}`)
        .then(res => res.json())
        .then(data => {
          if (data.course?.chapters) {
            setChapters(data.course.chapters);
          }
        })
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [courseSlug]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('chapterId', chapterId);
      formData.append('titleAr', titleAr);
      formData.append('titleEn', titleEn);
      formData.append('writtenContentAr', writtenContentAr);
      formData.append('writtenContentEn', writtenContentEn);
      formData.append('order', order);
      if (videoFile) {
        formData.append('video', videoFile);
      }

      const res = await fetch('/api/instructor/upload-video', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Échec de la publication.');

      alert(isAr ? 'تم إضافة الدرس بنجاح !' : 'Lesson published successfully !');
      router.push(`/dashboard`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-layout-md text-xs text-gray-400">Chargement...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-card border border-gray-150 shadow-sm space-y-6">
      <h1 className="text-xl font-black text-gray-900">
        {isAr ? 'رفع درس جديد (فيديو + محتوى)' : 'Upload New Lesson'}
      </h1>

      {error && (
        <div className="p-3 text-xs text-error bg-error-light/10 border border-error-light/20 rounded-btn">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-gray-700 block mb-1">
            {isAr ? 'الفصل الدراسي المختار' : 'Target Chapter'}
          </label>
          <select
            value={chapterId}
            required
            onChange={e => setChapterId(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-input bg-white"
          >
            <option value="">{isAr ? '-- اختر الفصل --' : '-- Choose Chapter --'}</option>
            {chapters.map(ch => (
              <option key={ch.id} value={ch.id}>
                {isAr ? ch.titleAr : ch.titleEn}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input label="Title (English)" required value={titleEn} onChange={e => setTitleEn(e.target.value)} />
          <Input label="العنوان (بالعربية)" required value={titleAr} onChange={e => setTitleAr(e.target.value)} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">Written Content (English)</label>
            <textarea
              value={writtenContentEn}
              onChange={e => setWrittenContentEn(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-input focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">المحتوى المكتوب (بالعربية)</label>
            <textarea
              value={writtenContentAr}
              onChange={e => setWrittenContentAr(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-input focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 items-end">
          <Input label={isAr ? 'الترتيب' : 'Lesson Order'} type="number" required value={order} onChange={e => setOrder(e.target.value)} />
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              {isAr ? 'ملف الفيديو ( Bunny Stream )' : 'Video File (Bunny Stream)'}
            </label>
            <input
              type="file"
              accept="video/*"
              onChange={e => setVideoFile(e.target.files[0])}
              className="w-full text-xs text-gray-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-btn file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 space-x-2">
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? 'Transfert vers Bunny.net...' : isAr ? 'رفع وحفظ الدرس' : 'Save Lesson'}
          </Button>
        </div>
      </form>
    </div>
  );
}