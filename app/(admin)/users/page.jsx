"use client";

import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import { 
  UserPlus, Mail, Key, Trash2, ShieldAlert, Users, 
  GraduationCap, Calendar, Loader2, CheckCircle, Clock 
} from 'lucide-react';

export default function AdminUsersPage() {
  const { language } = useLanguage();
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Champs de création de compte
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');

  const isAr = language === 'ar';

  const fetchInstructors = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.instructors) setInstructors(data.instructors);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstructors();
  }, []);

  const handleCreateInstructor = async (e) => {
    e.preventDefault();
    setFormError('');
    setActionLoading(true);

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password })
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || (isAr ? 'فشلت عملية إنشاء الحساب.' : 'Account creation failed.'));
      }

      setIsAddModalOpen(false);
      setFullName(''); setEmail(''); setPassword('');
      fetchInstructors();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteInstructor = async (id) => {
    if (!confirm(isAr ? 'هل أنت متأكد من حذف حساب الأستاذ هذا ؟ سيفقد حق الوصول بالكامل.' : 'Are you sure you want to delete this instructor? They will lose all platform access.')) return;
    try {
      const res = await fetch(`/api/admin/users?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchInstructors();
      } else {
        const data = await res.json();
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={`max-w-7xl mx-auto space-y-8 py-6 ${isAr ? 'font-cairo' : 'font-sans'}`}>
      
      {/* En-tête */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-150/40 dark:border-gray-900">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <GraduationCap className="w-6 h-6 text-primary" />
            </div>
            {isAr ? 'إدارة هيئة التدريس' : 'Instructors Management'}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            {isAr ? 'قم بإنشاء وتعديل حسابات الأساتذة والمدربين المعتمدين في منصة EduPlus' : 'Create, manage and authorize official instructor accounts on EduPlus'}
          </p>
        </div>
        <Button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-primary hover:bg-primary/95 text-white font-bold py-3 px-6 rounded-2xl text-xs shadow-md shadow-primary/15 transition-transform active:scale-95 cursor-pointer"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          {isAr ? 'إنشاء حساب أستاذ' : 'Add Instructor'}
        </Button>
      </div>

      {/* Liste des Enseignants */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 animate-pulse">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Loading Records...</span>
        </div>
      ) : instructors.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 p-16 rounded-3xl border border-dashed border-gray-150 dark:border-gray-800 text-center">
          <Users className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <p className="text-sm font-bold text-gray-400">{isAr ? 'لا يوجد أي حساب أستاذ حالياً' : 'No instructor accounts registered yet.'}</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-150 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-950/50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-gray-800">
                  <th className="p-5">{isAr ? 'الأستاذ' : 'Instructor'}</th>
                  <th className="p-5">{isAr ? 'البريد الإلكتروني' : 'Email Address'}</th>
                  <th className="p-5">{isAr ? 'تاريخ التعيين' : 'Appointed Since'}</th>
                  <th className="p-5 text-center">{isAr ? 'الحالة' : 'Status'}</th>
                  <th className="p-5 text-right">{isAr ? 'الإجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                {instructors.map((inst) => (
                  <tr key={inst.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-850/30 transition-colors">
                    
                    {/* Profil */}
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                          {inst.fullName?.charAt(0).toUpperCase() || 'P'}
                        </div>
                        <span className="font-bold text-gray-900 dark:text-white">{inst.fullName}</span>
                      </div>
                    </td>

                    {/* E-mail */}
                    <td className="p-5">
                      <span className="font-semibold text-gray-600 dark:text-gray-400 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-gray-400" />
                        {inst.email}
                      </span>
                    </td>

                    {/* Date de création */}
                    <td className="p-5">
                      <span className="font-semibold text-gray-550 dark:text-gray-400 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        {new Date(inst.createdAt).toLocaleDateString(isAr ? 'ar-DZ' : 'en-US', {
                          year: 'numeric', month: 'short', day: 'numeric'
                        })}
                      </span>
                    </td>

                    {/* Statut */}
                    <td className="p-5 text-center">
                      <Badge variant="success" className="text-xs px-2.5 py-0.5">
                        <CheckCircle className="w-3 h-3 mr-1 inline" /> {isAr ? 'نشط' : 'Active'}
                      </Badge>
                    </td>

                    {/* Supprimer compte */}
                    <td className="p-5 text-right">
                      <button
                        onClick={() => handleDeleteInstructor(inst.id)}
                        className="inline-flex items-center gap-1.5 text-red-650 hover:bg-red-50 dark:hover:bg-red-950/20 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border border-red-500/20"
                      >
                        <Trash2 className="w-4 h-4 shrink-0" />
                        {isAr ? 'حذف الحساب' : 'Delete'}
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL : CRÉER COMPTE PROFESSEUR */}
      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        title={isAr ? 'إنشاء حساب أستاذ جديد' : 'Create New Instructor Account'}
      >
        <form onSubmit={handleCreateInstructor} className="space-y-4 py-2">
          
          {formError && (
            <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 rounded-xl text-xs font-bold flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{formError}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <Label className="text-xs font-black text-gray-500 uppercase tracking-wider">{isAr ? 'الاسم الكامل للبروفيسور' : 'Full Name'}</Label>
            <div className="relative">
              <User className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input 
                required 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)} 
                placeholder={isAr ? 'أ. أحمد بن علي' : 'e.g. Prof. Ahmed Benali'}
                className="rounded-xl border-gray-200 ps-9 focus:border-primary/50" 
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-black text-gray-500 uppercase tracking-wider">{isAr ? 'البريد الإلكتروني المهني' : 'Email Address'}</Label>
            <div className="relative">
              <Mail className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input 
                type="email" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="instructor@eduplus.dz"
                className="rounded-xl border-gray-200 ps-9 focus:border-primary/50" 
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-black text-gray-500 uppercase tracking-wider">{isAr ? 'كلمة المرور الافتراضية' : 'Temporary Password'}</Label>
            <div className="relative">
              <Key className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input 
                type="password" 
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••"
                className="rounded-xl border-gray-200 ps-9 focus:border-primary/50" 
              />
            </div>
            <p className="text-[10px] text-gray-400 font-semibold">{isAr ? 'سيستخدم الأستاذ هذا البريد وكلمة المرور لتسجيل الدخول.' : 'The instructor will use these credentials to authenticate.'}</p>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-900 flex justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsAddModalOpen(false)}>
              {isAr ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button 
              type="submit" 
              disabled={actionLoading}
              className="bg-primary hover:bg-primary/95 text-white font-bold py-2.5 px-6 rounded-xl text-xs transition-transform active:scale-95"
            >
              {actionLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {isAr ? 'جاري الإنشاء...' : 'Creating...'}
                </span>
              ) : (
                isAr ? 'إنشاء الحساب وتفعيل' : 'Create Account'
              )}
            </Button>
          </div>

        </form>
      </Modal>
    </div>
  );
}