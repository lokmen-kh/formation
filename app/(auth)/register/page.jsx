"use client";

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/label';
import ThemeToggle from '@/components/ThemeToggle';
import Link from 'next/link';
import { 
  User, Mail, Key, Phone, Calendar, GraduationCap, 
  Briefcase, CheckCircle, Shield, Rocket, ArrowRight, ArrowLeft 
} from 'lucide-react';

/* -------------------------------------------------------------------------- */
/* Écrin Visuel d'Authentification (AuthShell autonome intégré)               */
/* -------------------------------------------------------------------------- */

function AuthShell({ title, subtitle, children, footer, currentStep }) {
  const { language, toggleLanguage } = useLanguage();
  const isAr = language === 'ar';
  const dir = isAr ? 'rtl' : 'ltr';

  const localT = (en, ar) => (isAr ? ar : en);

  const perks = [
    {
      en: "Watch all lessons directly with no restrictive progression locks",
      ar: "شاهد جميع الدروس مباشرة دون قيود أو حظر متتالي",
    },
    {
      en: "Secure streaming, no downloads or leaks",
      ar: "بث آمن ومشفر دون تنزيل أو تسريب",
    },
    {
      en: "Local payment options (CCP / BaridiMob) and flexible access",
      ar: "طرق دفع محلية مرنة (بريدي موب / CCP) ووصول كامل لدروسك",
    },
  ];

  return (
    <div dir={dir} lang={language} className={`min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300 ${
      isAr ? 'font-cairo tracking-wide' : 'font-sans'
    }`}>
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Colonne gauche - Dégradé Bleu Technique */}
        <div className="relative hidden flex-col justify-between bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-10 text-white lg:flex">
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)',
              backgroundSize: '40px 48px',
            }}
          />
          
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-blue-400/20 blur-[120px] rounded-full pointer-events-none" />
          
          <Link href="/" className="relative z-10 flex items-center gap-2.5 select-none">
            <span className="flex size-9 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
              <GraduationCap className="size-5" />
            </span>
            <span className="font-display text-base font-extrabold tracking-tight">
              {localT('EduPlus Platform', 'منصة التعليم بلس')}
            </span>
          </Link>
          
          <div className="relative z-10 max-w-md space-y-6">
            <h2 className="font-display text-[clamp(1.7rem,2.4vw,2.2rem)] font-extrabold leading-tight">
              {localT(
                "Learn with structure. Progress with proof.",
                "تعلم بتنظيم بيداغوجي وتطوّر بخطوات ثابتة.",
              )}
            </h2>
            <ul className="mt-8 space-y-4 text-xs text-white/95">
              {perks.map((p) => (
                <li key={p.en} className="flex items-start gap-3 leading-relaxed">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                    <CheckCircle className="size-3 text-white" />
                  </span>
                  <span>{localT(p.en, p.ar)}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <p className="relative z-10 flex items-center gap-2 text-xs text-white/75">
            <Shield className="size-4 shrink-0" />
            <span>{localT("Your data stays private and encrypted.", "جميع بياناتك محمية ومشفرة بالكامل.")}</span>
          </p>
        </div>

        {/* Colonne droite - Formulaire de Saisie */}
        <div className="flex flex-col px-6 py-8 sm:px-12 bg-white dark:bg-gray-950 transition-colors duration-300">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 lg:invisible select-none">
              <span className="bg-gradient-to-br from-blue-600 to-indigo-800 flex size-9 items-center justify-center rounded-xl text-white">
                <GraduationCap className="size-5" />
              </span>
              <span className="font-display text-lg font-extrabold tracking-tight text-gray-900 dark:text-white">
                {isAr ? 'منصة' : 'Edu'}
                <span className="text-blue-600 dark:text-blue-400">{isAr ? ' التعليم بلس' : 'Plus'}</span>
              </span>
            </Link>
            
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={toggleLanguage}
                className="rounded-lg border border-gray-250/20 dark:border-gray-800/80 px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300 transition-all hover:border-blue-400 hover:text-blue-600 dark:hover:border-blue-400 cursor-pointer"
              >
                {language === "en" ? "العربية" : "English"}
              </button>
              <span className="text-gray-200 dark:text-gray-800 select-none text-xs">|</span>
              <ThemeToggle />
            </div>
          </div>

          <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10 opacity-0 animate-fade-in-up">
            
            {/* Indicateur d'étape */}
            <div className="flex items-center gap-2 mb-6">
              <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${currentStep === 1 ? 'bg-primary/10 text-primary' : 'bg-emerald-500/10 text-emerald-600'}`}>
                {currentStep === 1 ? localT('Step 1 of 2', 'الخطوة 1 من 2') : localT('Step 2 of 2', 'الخطوة 2 من 2')}
              </span>
              <div className="flex-1 h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-primary transition-all duration-300" style={{ width: currentStep === 1 ? '50%' : '100%' }} />
              </div>
            </div>

            <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
              {title}
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
            
            <div className="mt-8">{children}</div>
            
            {footer && <div className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">{footer}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Page d'Inscription en 2 Étapes                                             */
/* -------------------------------------------------------------------------- */

export default function RegisterPage() {
  const { register, login, loading } = useAuth();
  const { language } = useLanguage();
  const router = useRouter();
  
  const [step, setStep] = useState(1); // Étape active (1 ou 2)

  // Étape 1 : Identifiants
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Étape 2 : Profil [2]
  const [phone, setPhone] = useState('');
  const [educationLevel, setEducationLevel] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [jobStatus, setJobStatus] = useState('STUDENT'); // 'STUDENT' ou 'EMPLOYEE'

  const [error, setError] = useState('');

  const isAr = language === 'ar';
  const localT = (en, ar) => (isAr ? ar : en);

  // Soumission Étape 1
  const handleNextStep = (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError(localT("Passwords do not match.", "كلمات المرور غير متطابقة."));
      return;
    }

    if (password.length < 6) {
      setError(localT("Password must be at least 6 characters.", "يجب أن تتكون كلمة المرور من 6 أحرف على الأقل."));
      return;
    }

    setStep(2); // Passer à l'étape suivante
  };

  // Soumission Finale Étape 2 (Création + Connexion Automatique + Enregistrement profil) [2]
  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const sanitizedEmail = email.trim().toLowerCase();

    // 1. Créer le compte utilisateur
    const result = await register(fullName, sanitizedEmail, password, 'STUDENT');
    if (!result.success) {
      setError(result.error);
      return;
    }

    // 2. Établir automatiquement la session [5]
    const loginResult = await login(sanitizedEmail, password);
    if (loginResult) {
      try {
        // 3. Enregistrer les informations complexes du profil en base de données [2]
        const profileRes = await fetch('/api/student/profile', {
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

        if (profileRes.ok) {
          router.push('/my-courses'); // Rediriger l'étudiant directement vers son espace !
        } else {
          router.push('/login?registered=true'); // Fallback en cas d'erreur réseau sur le profil
        }
      } catch (err) {
        console.error(err);
        router.push('/login?registered=true');
      }
    } else {
      router.push('/login?registered=true');
    }
  };

  return (
    <AuthShell
      currentStep={step}
      title={step === 1 ? localT("Create your account", "أنشئ حسابك الجديد") : localT("Tell us about yourself", "أكمل بياناتك الشخصية")}
      subtitle={step === 1 
        ? localT("Join EduPlus and start your learning journey today.", "انضم إلى منصة التعليم بلس وابدأ مسيرتك الدراسية الآن.") 
        : localT("These details are required to issue certificates in your name.", "هذه المعلومات ضرورية لتأكيد اشتراكاتك .")
      }
      footer={
        step === 1 && (
          <>
            {localT("Already have an account?", "لديك حساب بالفعل؟")}{" "}
            <Link href="/login" className="font-bold text-blue-600 dark:text-blue-400 hover:underline transition-colors">
              {localT("Sign in", "تسجيل الدخول")}
            </Link>
          </>
        )
      }
    >
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/50 px-3 py-2.5 text-xs text-red-600 dark:text-red-400 font-bold">
          {error}
        </div>
      )}

      {/* ÉTAPE 1 : Identifiants */}
      {step === 1 && (
        <form className="space-y-4" onSubmit={handleNextStep}>
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-gray-700 dark:text-gray-300">
              {localT("Full Name", "الاسم الكامل ")}
            </Label>
            <div className="relative">
              <User className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                required
                placeholder={isAr ? "أحمد محمد" : "John Doe"}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                autoComplete="name"
                className="w-full border-gray-200 dark:border-gray-800 ps-9 focus:ring-2 focus:ring-blue-500 transition-all font-semibold"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-gray-700 dark:text-gray-300">
              {localT("Email Address", "البريد الإلكتروني")}
            </Label>
            <div className="relative">
              <Mail className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="w-full border-gray-200 dark:border-gray-800 ps-9 focus:ring-2 focus:ring-blue-500 transition-all font-semibold"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-gray-700 dark:text-gray-300">
              {localT("Password", "كلمة المرور")}
            </Label>
            <div className="relative">
              <Key className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                className="w-full border-gray-200 dark:border-gray-800 ps-9 focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
            <p className="text-[10px] text-gray-500 dark:text-gray-400">
              {localT("Minimum 6 characters", "حد أدنى 6 أحرف")}
            </p>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-gray-700 dark:text-gray-300">
              {localT("Confirm Password", "تأكيد كلمة المرور")}
            </Label>
            <div className="relative">
              <Key className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="password"
                required
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                className="w-full border-gray-200 dark:border-gray-800 ps-9 focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full gap-2 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.01] text-xs py-2.5 font-bold cursor-pointer"
          >
            {localT("Continue to Step 2", "تابع للخطوة التالية")}
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </Button>
        </form>
      )}

      {/* ÉTAPE 2 : Profil utilisateur complexe */}
      {step === 2 && (
        <form className="space-y-4 animate-fade-in-up" onSubmit={handleFinalSubmit}>
          
          {/* Téléphone */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-gray-700 dark:text-gray-300">
              {localT("Phone Number", "رقم الهاتف")}
            </Label>
            <div className="relative">
              <Phone className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="tel"
                required
                placeholder="06XXXXXXXX / 07XXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border-gray-200 dark:border-gray-800 ps-9 focus:ring-2 focus:ring-blue-500 transition-all font-semibold"
              />
            </div>
          </div>

          {/* Date de naissance */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-gray-700 dark:text-gray-300">
              {localT("Date of Birth", "تاريخ الميلاد")}
            </Label>
            <div className="relative">
              <Calendar className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="date"
                required
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full border-gray-200 dark:border-gray-800 ps-9 focus:ring-2 focus:ring-blue-500 transition-all font-semibold"
              />
            </div>
          </div>

          {/* Niveau d'études */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-gray-700 dark:text-gray-300">
              {localT("Current Education Level", "المستوى الدراسي")}
            </Label>
            <div className="relative">
              <GraduationCap className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                required
                placeholder={isAr ? "ثانوي، بكالوريا، طالب جامعي، ماستر..." : "e.g. High School, Bachelor, Master..."}
                value={educationLevel}
                onChange={(e) => setEducationLevel(e.target.value)}
                className="w-full border-gray-200 dark:border-gray-800 ps-9 focus:ring-2 focus:ring-blue-500 transition-all font-semibold"
              />
            </div>
          </div>

          {/* Statut Professionnel */}
          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-500 dark:text-gray-450 uppercase tracking-wider block">
              {isAr ? 'مجال العمل أو الدراسة الحالي' : 'Current Employment Status'}
            </Label>
            <div className="grid grid-cols-2 gap-3 pt-1">
              {[
                { id: 'STUDENT', labelAr: 'طالب في الدراسة', labelEn: 'Student' },
                { id: 'EMPLOYEE', labelAr: 'موظف / عامل حُر', labelEn: 'Employee / Freelancer' }
              ].map((option) => {
                const isSelected = jobStatus === option.id;
                return (
                  <div
                    key={option.id}
                    onClick={() => setJobStatus(option.id)}
                    className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all duration-300 flex items-center gap-2 select-none ${
                      isSelected
                        ? 'border-primary bg-primary/[0.02] shadow-sm'
                        : 'border-gray-150 dark:border-gray-850 hover:border-primary/45 bg-white dark:bg-gray-900/40'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      isSelected ? 'border-primary bg-primary' : 'border-gray-300 dark:border-gray-700'
                    }`}>
                      {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                    </div>
                    <div className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-gray-400" />
                      <span>{isAr ? option.labelAr : option.labelEn}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions : Retour étape 1 et Inscription */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex items-center justify-center size-11 rounded-2xl border border-gray-200 hover:bg-gray-50 shrink-0 cursor-pointer"
            >
              <ArrowLeft className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} />
            </button>
            <Button
              type="submit"
              className="flex-1 gap-2 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.01] text-xs py-2.5 font-bold cursor-pointer"
              disabled={loading}
            >
              {loading 
                ? localT("Saving profile...", "جاري حفظ الملف والإنشاء...") 
                : localT("Complete & Create Account", "إنشاء الحساب وبدء التعلم")
              }
              <Rocket className="w-4 h-4 shrink-0 text-white" />
            </Button>
          </div>
        </form>
      )}

    </AuthShell>
  );
}