"use client";

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { Mail, Key, LogIn, GraduationCap, ShieldAlert, Loader2, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const { language, t } = useLanguage();
  const { login, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isAr = language === 'ar';
  const redirectPath = searchParams.get('redirect') || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Appel de la méthode d'authentification de votre hook
      const result = await login(email, password);

      // CORRECTION CLÉ : Résolution robuste et sécurisée du rôle utilisateur [5]
      // Supporte toutes les variantes de retour de la fonction login (brut, enveloppé, ou état global)
      const loggedUser = result?.user || (result?.role ? result : null) || user;
      const userRole = loggedUser?.role?.toUpperCase();

      if (redirectPath) {
        router.push(redirectPath);
      } else {
        // Aiguillage précis vers les vraies pages rôles de votre projet
        if (userRole === 'ADMIN') {
          router.push('/admin/enrollments'); // Route d'approbation d'administration
        } else if (userRole === 'INSTRUCTOR') {
          router.push('/instructor'); // Tableau de bord du professeur que nous avons créé
        } else {
          router.push('/my-courses'); // Espace étudiant standard
        }
      }
    } catch (err) {
      console.error('Login submit error:', err);
      setError(isAr ? 'خطأ في البريد الإلكتروني أو كلمة المرور.' : 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-[#f8f9fb] dark:bg-gray-950 flex flex-col items-center justify-center p-6 ${isAr ? 'font-cairo' : 'font-sans'}`}>
      
      {/* Retour à l'accueil */}
      <Link href="/" className="absolute top-6 start-6 flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-primary transition-colors select-none">
        <ArrowLeft className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} />
        {isAr ? 'العودة للرئيسية' : 'Back to Home'}
      </Link>

      <div className="w-full max-w-md space-y-6">
        
        {/* Logo d'authentification épuré */}
        <div className="text-center space-y-2">
          <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/25 mx-auto mb-2">
            <GraduationCap className="size-6 text-white" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
            {isAr ? 'تسجيل الدخول إلى حسابك' : 'Sign In to Your Account'}
          </h2>
          <p className="text-xs text-gray-450 dark:text-gray-500 font-bold">
            {isAr ? 'منصة EduPlus لتمكين جيل البوصلة التعليمية' : 'EduPlus bilingual space for modern learning'}
          </p>
        </div>

        {/* Boîte de Connexion Card */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-slate-150/40 dark:border-gray-850/50 p-6 sm:p-8 shadow-xl shadow-slate-100/30 dark:shadow-none space-y-6">
          
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 rounded-xl text-xs font-bold flex items-start gap-2 animate-fade-in">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Champ Email */}
            <div className="space-y-1.5">
              <Label className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider">{isAr ? 'البريد الإلكتروني' : 'Email Address'}</Label>
              <div className="relative">
                <Mail className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input 
                  type="email"
                  required 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="student@eduplus.dz"
                  className="rounded-xl border-gray-200 ps-9 focus:border-primary/50 text-xs sm:text-sm font-semibold" 
                />
              </div>
            </div>

            {/* Champ Mot de passe */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <Label className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider">{isAr ? 'كلمة المرور' : 'Password'}</Label>
                <Link href="/forgot-password" className="text-[10px] font-black text-primary hover:underline">
                  {isAr ? 'نسيت كلمة المرور؟' : 'Forgot?'}
                </Link>
              </div>
              <div className="relative">
                <Key className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input 
                  type="password" 
                  required 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="••••••••"
                  className="rounded-xl border-gray-200 ps-9 focus:border-primary/50 text-xs sm:text-sm" 
                />
              </div>
            </div>

            {/* Bouton de soumission */}
            <div className="pt-3">
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/95 text-white font-black py-3.5 rounded-2xl text-xs sm:text-sm tracking-wide shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-transform active:scale-95 cursor-pointer"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4.5 h-4.5 animate-spin" />
                    {isAr ? 'جاري التحقق...' : 'Signing In...'}
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <LogIn className="w-4.5 h-4.5 text-white" />
                    {isAr ? 'تسجيل الدخول الآن' : 'Sign In Account'}
                  </span>
                )}
              </Button>
            </div>

          </form>

          {/* Redirection d'inscription */}
          <div className="text-center pt-2 border-t border-gray-100 dark:border-gray-800/80 text-xs">
            <span className="text-gray-450 font-semibold">{isAr ? 'ليس لديك حساب بعد؟' : "Don't have an account?"} </span>
            <Link href="/register" className="font-black text-primary hover:underline">
              {isAr ? 'إنشاء حساب جديد مجاناً' : 'Sign Up Free'}
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}