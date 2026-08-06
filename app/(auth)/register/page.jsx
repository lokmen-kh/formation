"use client";

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import ThemeToggle from '@/components/ThemeToggle';
import Link from 'next/link';

/* -------------------------------------------------------------------------- */
/* Icônes Linéaires Vectorielles                                             */
/* -------------------------------------------------------------------------- */

function IconArrow(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M5 12h14" />
      <path d="M12 5l7 7-7 7" />
    </svg>
  );
}

function IconCheck(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function IconGraduationCap(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" />
    </svg>
  );
}

function IconShieldLock(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Écrin Visuel d'Authentification (AuthShell autonome intégré)               */
/* -------------------------------------------------------------------------- */

function AuthShell({ title, subtitle, children, footer }) {
  const { language, toggleLanguage } = useLanguage();
  const isAr = language === 'ar';
  const dir = isAr ? 'rtl' : 'ltr';

  // Traducteur local infaillible [1]
  const localT = (en, ar) => (isAr ? ar : en);

  const perks = [
    {
      en: "Sequential lessons that unlock as you progress",
      ar: "دروس متتالية تُفتح مع تقدمك الدراسي",
    },
    {
      en: "Secure streaming, no downloads or leaks",
      ar: "بث آمن ومشفر دون تنزيل أو تسريب",
    },
    {
      en: "Local payment options and flexible access",
      ar: "طرق دفع محلية مرنة ووصول كامل لدروسك",
    },
  ];

  return (
    <div dir={dir} lang={language} className={`min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300 ${
      isAr ? 'font-cairo tracking-wide' : 'font-sans'
    }`}>
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Colonne gauche - Dégradé Bleu Technique */}
        <div className="relative hidden flex-col justify-between bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-10 text-white lg:flex">
          {/* Grille quadrillée technique en arrière-plan */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none animate-drift-grid"
            style={{
              backgroundImage:
                'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)',
              backgroundSize: '40px 48px',
            }}
          />
          
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-blue-400/20 blur-[120px] rounded-full pointer-events-none" />
          
          <Link href="/" className="relative z-10 flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
              <IconGraduationCap className="size-5" />
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
                    <IconCheck className="size-3 text-white" />
                  </span>
                  <span>{localT(p.en, p.ar)}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <p className="relative z-10 flex items-center gap-2 text-xs text-white/75">
            <IconShieldLock className="size-4 shrink-0" />
            <span>{localT("Your data stays private and encrypted.", "جميع بياناتك محمية ومشفرة بالكامل.")}</span>
          </p>
        </div>

        {/* Colonne droite - Formulaire de Saisie */}
        <div className="flex flex-col px-6 py-8 sm:px-12 bg-white dark:bg-gray-950 transition-colors duration-300">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 lg:invisible select-none">
              <span className="bg-gradient-to-br from-blue-600 to-indigo-800 flex size-9 items-center justify-center rounded-xl text-white">
                <IconGraduationCap className="size-5" />
              </span>
              <span className="font-display text-lg font-extrabold tracking-tight text-gray-900 dark:text-white">
                {isAr ? 'منصة' : 'Edu'}
                <span className="text-blue-600 dark:text-blue-400">{isAr ? ' التعليم بلس' : 'Plus'}</span>
              </span>
            </Link>
            
            {/* Outils de langue et de thèmes */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={toggleLanguage}
                className="rounded-lg border border-gray-200 dark:border-gray-800 px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300 transition-all hover:border-blue-400 hover:text-blue-600 dark:hover:border-blue-400 dark:hover:text-blue-400 cursor-pointer"
              >
                {language === "en" ? "العربية" : "English"}
              </button>
              <span className="text-gray-200 dark:text-gray-800 select-none text-xs">|</span>
              <ThemeToggle />
            </div>
          </div>

          <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10 opacity-0 animate-fade-in-up">
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
/* Page d'Inscription Principale                                              */
/* -------------------------------------------------------------------------- */

export default function RegisterPage() {
  const { register, loading } = useAuth();
  const { language } = useLanguage();
  const router = useRouter();
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const isAr = language === 'ar';

  // Traducteur local bilingue [1]
  const localT = (en, ar) => (isAr ? ar : en);

  const handleSubmit = async (e) => {
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

    // Trimming et mise en minuscules de sécurité pour PostgreSQL [11]
    const sanitizedEmail = email.trim().toLowerCase();

    // Envoi par défaut du rôle de type 'STUDENT'
    const result = await register(fullName, sanitizedEmail, password, 'STUDENT');
    if (!result.success) {
      setError(result.error);
    } else {
      router.push('/login?registered=true');
    }
  };

  return (
    <AuthShell
      title={localT("Create your account", "أنشئ حسابك الجديد")}
      subtitle={localT(
        "Join EduPlus and start your learning journey today.",
        "انضم إلى منصة التعليم بلس وابدأ مسيرتك الدراسية الآن.",
      )}
      footer={
        <>
          {localT("Already have an account?", "لديك حساب بالفعل؟")}{" "}
          <Link href="/login" className="font-bold text-blue-600 dark:text-blue-400 hover:underline transition-colors">
            {localT("Sign in", "تسجيل الدخول")}
          </Link>
        </>
      }
    >
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/50 px-3 py-2.5 text-xs text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-1.5">
          <label htmlFor="fullName" className="text-xs font-bold text-gray-700 dark:text-gray-300">
            {localT("Full Name", "الاسم الكامل")}
          </label>
          <Input
            id="fullName"
            type="text"
            required
            placeholder={isAr ? "أحمد محمد" : "John Doe"}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            autoComplete="name"
            className="w-full border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="email" className="text-xs font-bold text-gray-700 dark:text-gray-300">
            {localT("Email Address", "البريد الإلكتروني")}
          </label>
          <Input
            id="email"
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            className="w-full border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="password" className="text-xs font-bold text-gray-700 dark:text-gray-300">
            {localT("Password", "كلمة المرور")}
          </label>
          <Input
            id="password"
            type="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            className="w-full border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          <p className="text-[10px] text-gray-500 dark:text-gray-400">
            {localT("Minimum 6 characters", "حد أدنى 6 أحرف")}
          </p>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="confirmPassword" className="text-xs font-bold text-gray-700 dark:text-gray-300">
            {localT("Confirm Password", "تأكيد كلمة المرور")}
          </label>
          <Input
            id="confirmPassword"
            type="password"
            required
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            className="w-full border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        <Button
          type="submit"
          className="w-full gap-2 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.01] text-xs py-2.5"
          disabled={loading}
        >
          {loading 
            ? localT("Creating account...", "جاري إنشاء الحساب...") 
            : localT("Create account", "إنشاء حساب")
          }
          <IconArrow className="w-4 h-4 rtl:rotate-180" />
        </Button>
      </form>
    </AuthShell>
  );
}