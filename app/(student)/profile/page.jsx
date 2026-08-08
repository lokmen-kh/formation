"use client";

import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/label';
import { 
  User, Phone, GraduationCap, Calendar, Briefcase, 
  Loader2, CheckCircle, ShieldAlert, ArrowLeft 
} from 'lucide-react';
import Link from 'next/link';

export default function StudentProfilePage() {
  const { language } = useLanguage();
  const { user: authUser, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [educationLevel, setEducationLevel] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [jobStatus, setJobStatus] = useState('STUDENT'); // 'STUDENT' ou 'EMPLOYEE'
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const isAr = language === 'ar';

  useEffect(() => {
    if (!authLoading && !authUser) {
      router.push('/login?redirect=/profile');
      return;
    }

    // Charger les détails de profil
    fetch('/api/student/profile')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setFullName(data.user.fullName || '');
          setEmail(data.user.email || '');
          setPhone(data.user.phone || '');
          setEducationLevel(data.user.educationLevel || '');
          setJobStatus(data.user.jobStatus || 'STUDENT');
          
          if (data.user.birthDate) {
            // Conversion yyyy-MM-dd pour le champ date HTML5
            setBirthDate(new Date(data.user.birthDate).toISOString().split('T')[0]);
          }
        }
      })
      .catch((err) => console.error('Failed to load student profile:', err))
      .finally(() => setLoading(false));
  }, [authUser, authLoading, router]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setSubmitting(true);

    try {
      const res = await fetch('/api/student/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          phone,
          educationLevel,
          birthDate,
          jobStatus
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Update failed.');

      setSuccess(true);
      // Masquer le message de succès après 3 secondes
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(isAr ? 'عذراً، حدث خطأ أثناء حفظ التعديلات.' : err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fb] dark:bg-gray-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-gray-500 tracking-wide">
            {isAr ? 'جاري تحميل ملفك الشخصي...' : 'Loading profile...'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-[#f8f9fb] dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300 py-10 px-4 sm:px-6 lg:px-8 ${isAr ? 'font-cairo' : 'font-sans'}`}>
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Lien de retour rapide */}
        <Link href="/my-courses" className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-primary transition-colors select-none">
          <ArrowLeft className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} />
          {isAr ? 'العودة إلى دوراتي المفعّلة' : 'Back to My Courses'}
        </Link>

        {/* Titre Principal */}
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-gray-955 dark:text-white">
            {isAr ? 'الملف الشخصي والبيانات' : 'Personal Profile Settings'}
          </h1>
          <p className="text-xs text-gray-500">
            {isAr ? 'يرجى ملء بياناتك الحقيقية لضمان تفعيل اشتراكاتك وإصدار الشهادات باسمك الصحيح' : 'Keep your accurate details updated to ensure smooth account authorizations'}
          </p>
        </div>

        {/* Formulaire Principal de profil */}
        <form onSubmit={handleUpdateProfile} className="bg-white dark:bg-gray-900 rounded-3xl border border-slate-150/40 dark:border-gray-850/50 p-6 sm:p-8 shadow-sm space-y-6">
          
          {success && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl border border-emerald-150/10 text-emerald-600 dark:text-emerald-450 font-bold text-xs flex items-center gap-2.5 animate-fade-in">
              <CheckCircle className="w-4.5 h-4.5 shrink-0" />
              <span>{isAr ? 'تم حفظ التعديلات بنجاح !' : 'Profile changes saved successfully!'}</span>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 rounded-2xl text-xs font-bold flex items-start gap-2 animate-fade-in">
              <ShieldAlert className="w-4.5 h-4.5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            
            {/* Nom complet */}
            <div className="space-y-1.5">
              <Label className="text-xs font-black text-gray-500 uppercase tracking-wider">{isAr ? 'الاسم الكامل للشهادة' : 'Full Name'}</Label>
              <div className="relative">
                <User className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input 
                  required 
                  value={fullName} 
                  onChange={(e) => setFullName(e.target.value)} 
                  className="rounded-xl border-gray-200 ps-10 focus:border-primary/50 text-xs sm:text-sm font-semibold" 
                />
              </div>
            </div>

            {/* Email (Lecture seule pour la sécurité) */}
            <div className="space-y-1.5">
              <Label className="text-xs font-black text-gray-500 uppercase tracking-wider opacity-60">{isAr ? 'البريد الإلكتروني (غير قابل للتعديل)' : 'Email (Read Only)'}</Label>
              <div className="relative opacity-60">
                <Input 
                  disabled 
                  value={email} 
                  className="rounded-xl border-gray-200 bg-gray-50 dark:bg-gray-950/20 text-xs sm:text-sm font-semibold cursor-not-allowed" 
                />
              </div>
            </div>

            {/* Numéro de téléphone */}
            <div className="space-y-1.5">
              <Label className="text-xs font-black text-gray-500 uppercase tracking-wider">{isAr ? 'رقم الهاتف' : 'Phone Number'}</Label>
              <div className="relative">
                <Phone className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input 
                  type="tel"
                  required 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  placeholder="06XXXXXXXX / 07XXXXXXXX"
                  className="rounded-xl border-gray-200 ps-10 focus:border-primary/50 text-xs sm:text-sm font-semibold" 
                />
              </div>
            </div>

            {/* Date de naissance */}
            <div className="space-y-1.5">
              <Label className="text-xs font-black text-gray-500 uppercase tracking-wider">{isAr ? 'تاريخ الميلاد' : 'Date of Birth'}</Label>
              <div className="relative">
                <Calendar className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input 
                  type="date"
                  required 
                  value={birthDate} 
                  onChange={(e) => setBirthDate(e.target.value)} 
                  className="rounded-xl border-gray-200 ps-10 focus:border-primary/50 text-xs sm:text-sm font-semibold" 
                />
              </div>
            </div>

            {/* Niveau d'étude */}
            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs font-black text-gray-500 uppercase tracking-wider">{isAr ? 'المستوى الدراسي الحالي' : 'Education Level'}</Label>
              <div className="relative">
                <GraduationCap className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input 
                  required 
                  value={educationLevel} 
                  onChange={(e) => setEducationLevel(e.target.value)} 
                  placeholder={isAr ? 'مثال: بكالوريا، ماستر، مهندس...' : 'e.g. Bachelor, Master, Engineer...'}
                  className="rounded-xl border-gray-200 ps-10 focus:border-primary/50 text-xs sm:text-sm font-semibold" 
                />
              </div>
            </div>

            {/* Domaine de travail (Étudiant / Employé) - Radios Premium */}
            <div className="space-y-2 sm:col-span-2">
              <Label className="text-xs font-black text-gray-500 uppercase tracking-wider block">{isAr ? 'الحالة المهنية (مجال العمل)' : 'Employment Status'}</Label>
              <div className="grid grid-cols-2 gap-3.5 pt-1">
                {[
                  { id: 'STUDENT', labelAr: 'طالب في الدراسة', labelEn: 'Student' },
                  { id: 'EMPLOYEE', labelAr: 'موظف / عامل حُر', labelEn: 'Employee / Freelancer' }
                ].map((option) => {
                  const isSelected = jobStatus === option.id;
                  return (
                    <div
                      key={option.id}
                      onClick={() => setJobStatus(option.id)}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 flex items-center gap-3 select-none ${
                        isSelected
                          ? 'border-primary bg-primary/[0.02] shadow-sm'
                          : 'border-gray-150 dark:border-gray-800 hover:border-primary/45 bg-white dark:bg-gray-900/40'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        isSelected ? 'border-primary bg-primary' : 'border-gray-300 dark:border-gray-700'
                      }`}>
                        {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                      </div>
                      <div className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Briefcase className="w-3.5 h-3.5 text-gray-400" />
                        <span>{isAr ? option.labelAr : option.labelEn}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Bouton Enregistrer */}
          <div className="pt-4 border-t border-gray-100 dark:border-gray-800/80 flex justify-end">
            <Button
              type="submit"
              disabled={submitting}
              className="bg-primary hover:bg-primary/95 text-white font-black py-3 px-8 rounded-2xl text-xs sm:text-sm tracking-wide shadow-md shadow-primary/20 hover:-translate-y-0.5 transition-transform duration-250 cursor-pointer"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {isAr ? 'جاري حفظ التعديلات...' : 'Saving...'}
                </span>
              ) : (
                isAr ? 'حفظ التعديلات' : 'Save Changes'
              )}
            </Button>
          </div>

        </form>

      </div>
    </div>
  );
}