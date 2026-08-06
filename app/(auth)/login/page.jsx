'use client';

import { useState, Suspense } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useRouter, useSearchParams } from 'next/navigation';
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
/* Écrin Visuel d'Authentification (Design Unifié)                            */
/* -------------------------------------------------------------------------- */

function AuthShell({ title, subtitle, children, footer }) {
  const { language, toggleLanguage } = useLanguage();
  const isAr = language === 'ar';
  const dir = isAr ? 'rtl' : 'ltr';

  // Traducteur local infaillible pour résoudre le problème d'I18n [1]
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
    <div dir={dir} lang={language} className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
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

        {/* Colonne droite - Formulaire de Connexion */}
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
            
            {/* Bascule bilingue et mode sombre */}
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

          {/* Formulaire interne */}
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
/* Composant interne qui utilise useSearchParams() - séparé pour Suspense     */
/* -------------------------------------------------------------------------- */

function LoginForm() {
  const { login, loading } = useAuth();
  const { language } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const isAr = language === 'ar';
  const redirectPath = searchParams.get("redirect");

  // Traducteur local infaillible [1]
  const localT = (en, ar) => (isAr ? ar : en);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Éviter les erreurs d'insensibilité à la casse sous PostgreSQL [11]
    const sanitizedEmail = email.trim().toLowerCase();

    const result = await login(sanitizedEmail, password);
    
    if (result.success) {
      if (redirectPath) {
        router.push(redirectPath);
      } else {
        if (result.user.role === 'ADMIN' || result.user.role === 'INSTRUCTOR') {
          router.push('/dashboard');
        } else {
          router.push('/my-courses');
        }
      }
    } else {
      setError(result.error);
    }
  };

  return (
    <>
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/50 px-3 py-2.5 text-xs text-red-650 dark:text-red-400">
          {error}
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
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
            onChange={e => setEmail(e.target.value)} 
            autoComplete="email" 
            className="w-full border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
        
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-xs font-bold text-gray-700 dark:text-gray-300">
              {localT("Password", "كلمة المرور")}
            </label>
            <button type="button" className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline transition-colors cursor-pointer">
              {localT("Forgot?", "نسيتها؟")}
            </button>
          </div>
          <Input 
            id="password" 
            type="password" 
            required 
            placeholder="••••••••" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            autoComplete="current-password" 
            className="w-full border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        <Button 
          type="submit" 
          className="w-full gap-2 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.01] text-xs py-2.5" 
          disabled={loading}
        >
          {loading 
            ? localT("Loading...", "جاري التحميل...") 
            : localT("Sign in", "تسجيل الدخول")
          }
          <IconArrow className="w-4 h-4 rtl:rotate-180" />
        </Button>
      </form>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Page de Connexion Principale - avec Suspense                               */
/* -------------------------------------------------------------------------- */

export default function LoginPage() {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  
  const localT = (en, ar) => (isAr ? ar : en);

  return (
    <AuthShell
      title={localT("Welcome back", "مرحباً بعودتك")}
      subtitle={localT(
        "Sign in to continue where you left off.",
        "سجل الدخول لمتابعة مسيرتك التعليمية.",
      )}
      footer={
        <>
          {localT("No account yet?", "ليس لديك حساب بعد؟")}{" "}
          <Link href="/register" className="font-bold text-blue-600 dark:text-blue-400 hover:underline transition-colors">
            {localT("Create one", "أنشئ حساباً جديداً")}
          </Link>
        </>
      }
    >
      {/* Wrap LoginForm in Suspense to handle useSearchParams */}
      <Suspense fallback={
        <div className="flex justify-center py-8">
          <div className="animate-pulse text-gray-500 dark:text-gray-400">
            {localT("Loading...", "جاري التحميل...")}
          </div>
        </div>
      }>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}