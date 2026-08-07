"use client";

import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import { 
  Users, Search, BookOpen, Calendar, Clock, CreditCard, 
  CheckCircle, XCircle, ArrowRight, Eye, Mail, ShieldAlert 
} from 'lucide-react';

export default function AdminStudentsPage() {
  const { language } = useLanguage();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);

  const isAr = language === 'ar';
  const nf = new Intl.NumberFormat('fr-FR');

  const fetchStudents = async () => {
    try {
      const res = await fetch('/api/admin/students');
      const data = await res.json();
      if (data.students) setStudents(data.students);
    } catch (err) {
      console.error('Failed to load students:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Filtrer les étudiants en temps réel par Nom ou par E-mail
  const filteredStudents = students.filter(student => {
    const term = searchTerm.trim().toLowerCase();
    const fullName = student.fullName?.toLowerCase() || '';
    const email = student.email?.toLowerCase() || '';
    return !term || fullName.includes(term) || email.includes(term);
  });

  // Déterminer si un abonnement est actif
  const isSubscriptionActive = (enrollment) => {
    if (enrollment.status !== 'APPROVED') return false;
    if (!enrollment.expiresAt) return true; // Accès à vie par défaut
    return new Date(enrollment.expiresAt) > new Date();
  };

  return (
    <div className={`max-w-7xl mx-auto space-y-8 py-6 ${isAr ? 'font-cairo' : 'font-sans'}`}>
      
      {/* En-tête de la page */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Users className="w-6 h-6 text-primary" />
            </div>
            {isAr ? 'قائمة الطلاب والاشتراكات' : 'Students & Subscriptions'}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            {isAr ? 'استعرض حسابات الطلاب المسجلين بالمنصة وراقب فترات انتهاء صلاحية اشتراكاتهم' : 'Consult student accounts and monitor their active or expired subscriptions'}
          </p>
        </div>
      </div>

      {/* Cartes de Statistiques de Synthèse */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { 
            label: isAr ? 'إجمالي الطلاب المسجلين' : 'Total Students', 
            val: students.length, 
            color: 'from-blue-500/10 to-indigo-500/10 text-primary',
            Icon: Users 
          },
          { 
            label: isAr ? 'أعضاء ذوي اشتراك نشط' : 'Active Subscribers', 
            val: students.filter(s => s.enrollments?.some(e => isSubscriptionActive(e))).length, 
            color: 'from-emerald-500/10 to-teal-500/10 text-emerald-600',
            Icon: CheckCircle 
          },
          { 
            label: isAr ? 'اشتراكات بانتظار التفعيل' : 'Pending Requests', 
            val: students.reduce((acc, s) => acc + s.enrollments?.filter(e => e.status === 'PENDING').length, 0), 
            color: 'from-amber-500/10 to-orange-500/10 text-amber-600',
            Icon: Clock 
          }
        ].map((stat, i) => (
          <div key={i} className="flex items-center gap-4 p-5 rounded-3xl bg-white dark:bg-gray-900 border border-slate-150/40 dark:border-gray-800 shadow-sm">
            <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shrink-0`}>
              <stat.Icon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{stat.label}</div>
              <div className="text-lg font-black text-gray-900 dark:text-white mt-1 leading-none">{stat.val}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Barre de recherche */}
      <div className="relative rounded-3xl border border-slate-150/40 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-sm max-w-md">
        <div className="relative">
          <Search className={`absolute ${isAr ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-450`} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={isAr ? 'ابحث باسم الطالب أو بريده الإلكتروني...' : 'Search by name or email address...'}
            className="w-full text-xs sm:text-sm bg-gray-50/50 dark:bg-gray-950/45 border border-gray-200/60 dark:border-gray-800 focus:border-primary/50 rounded-2xl py-3 ps-10 pe-10 outline-none transition-all duration-200"
          />
        </div>
      </div>

      {/* Conteneur principal (Tableau des étudiants) */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 animate-pulse">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Syncing Records...</span>
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 p-16 rounded-3xl border border-dashed border-gray-150 dark:border-gray-800 text-center">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-sm font-bold text-gray-455">{isAr ? 'لم نجد أي طالب مطابق للبحث' : 'No matching student records found.'}</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-150 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-950/50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-gray-800">
                  <th className="p-5">{isAr ? 'الطالب' : 'Student'}</th>
                  <th className="p-5">{isAr ? 'تاريخ التسجيل بالمنصة' : 'Member Since'}</th>
                  <th className="p-5 text-center">{isAr ? 'المساقات المشترك فيها' : 'Active Tracks'}</th>
                  <th className="p-5 text-right">{isAr ? 'الملف الشخصي' : 'Details'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                {filteredStudents.map((student) => {
                  const activeSubsCount = student.enrollments?.filter(e => isSubscriptionActive(e)).length || 0;
                  
                  return (
                    <tr key={student.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-850/30 transition-colors">
                      {/* Élève Info */}
                      <td className="p-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary/10 to-indigo-500/10 flex items-center justify-center text-primary font-bold">
                            {student.fullName?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div>
                            <div className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">{student.fullName}</div>
                            <div className="text-[10px] font-medium text-gray-450 flex items-center gap-1 mt-0.5">
                              <Mail className="w-3.5 h-3.5 shrink-0" />
                              {student.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Création de compte */}
                      <td className="p-5">
                        <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 dark:text-gray-400">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          <span>
                            {new Date(student.createdAt).toLocaleDateString(isAr ? 'ar-DZ' : 'en-US', {
                              year: 'numeric', month: 'short', day: 'numeric'
                            })}
                          </span>
                        </div>
                      </td>

                      {/* Nombre d'abonnements actifs */}
                      <td className="p-5 text-center">
                        <Badge variant={activeSubsCount > 0 ? 'success' : 'secondary'} className="text-xs px-2.5 py-0.5">
                          {activeSubsCount} {isAr ? 'مساقات مفعلة' : 'active'}
                        </Badge>
                      </td>

                      {/* Actions : Voir historique d'abonnement */}
                      <td className="p-5 text-right">
                        <button
                          onClick={() => setSelectedStudent(student)}
                          className="inline-flex items-center gap-1.5 text-primary hover:bg-primary/5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border border-primary/20"
                        >
                          <Eye className="w-4 h-4 shrink-0" />
                          {isAr ? 'استعراض الاشتراكات' : 'View Subscriptions'}
                        </button>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODALE D'HISTORIQUE DE TOUS LES ABONNEMENTS D'UN ÉTUDIANT */}
      <Modal 
        isOpen={!!selectedStudent} 
        onClose={() => setSelectedStudent(null)} 
        title={isAr ? `اشتراكات الطالب: ${selectedStudent?.fullName}` : `Subscriptions History: ${selectedStudent?.fullName}`}
      >
        <div className="space-y-5 py-2">
          
          {selectedStudent?.enrollments?.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-gray-100 rounded-2xl">
              <ShieldAlert className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-gray-400">{isAr ? 'لا يوجد أي سجل اشتراكات لهذا الطالب' : 'No subscription records found for this student.'}</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1 no-scrollbar">
              {selectedStudent?.enrollments?.map((enrollment) => {
                const isActive = isSubscriptionActive(enrollment);
                const hasReceipt = !!enrollment.receiptUrl;

                return (
                  <div 
                    key={enrollment.id} 
                    className={`rounded-2xl border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300 ${
                      isActive 
                        ? 'border-emerald-500/20 bg-emerald-500/[0.01]' 
                        : 'border-slate-150/40 dark:border-gray-800 bg-white/40 dark:bg-gray-950/20'
                    }`}
                  >
                    {/* Infos de l'inscription */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-primary" />
                        <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
                          {isAr ? enrollment.course?.titleAr : enrollment.course?.titleEn}
                        </span>
                      </div>

                      {/* Détails de l'offre dynamique liée [2] */}
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400">
                        <Badge variant="primary" className="text-[10px] px-2 py-0.5 shrink-0">
                          {enrollment.offer ? (isAr ? enrollment.offer.nameAr : enrollment.offer.nameEn) : enrollment.planType}
                        </Badge>
                        {enrollment.offer && (
                          <span>
                            {nf.format(enrollment.offer.price)} {isAr ? 'دج' : 'DZD'}
                          </span>
                        )}
                      </div>

                      {/* Date de délai/expiration de l'accès */}
                      <div className="flex items-center gap-2 text-xs text-gray-450">
                        <Calendar className="w-3.5 h-3.5 shrink-0" />
                        <span>
                          {isAr ? 'ينتهي في:' : 'Expires:'}{' '}
                          {enrollment.expiresAt ? (
                            <span className={`font-bold ${isActive ? 'text-emerald-600' : 'text-red-500'}`}>
                              {new Date(enrollment.expiresAt).toLocaleDateString(isAr ? 'ar-DZ' : 'en-US')}
                            </span>
                          ) : (
                            <span className="italic">{isAr ? 'غير محدد (وصول دائم)' : 'Not specified'}</span>
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Statut & Mode de paiement */}
                    <div className="flex flex-col sm:items-end gap-2 shrink-0">
                      <Badge variant={
                        enrollment.status === 'APPROVED' ? 'success' :
                        enrollment.status === 'REJECTED' ? 'error' : 'warning'
                      }>
                        {enrollment.status}
                      </Badge>
                      
                      <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wide">
                        {hasReceipt 
                          ? (isAr ? 'حوالة CCP بريدية' : 'CCP Postal Transfer') 
                          : (isAr ? 'دفع إلكتروني آلي' : 'Online Payment')}
                      </span>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-900 flex justify-end">
            <Button onClick={() => setSelectedStudent(null)} variant="outline" size="sm">
              {isAr ? 'إغلاق' : 'Close'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}