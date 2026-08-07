"use client";

import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import { CheckCircle, XCircle, Eye, Clock, User, BookOpen, Calendar, CreditCard } from 'lucide-react';

export default function AdminEnrollmentsPage() {
  const { language } = useLanguage();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const isAr = language === 'ar';

  const fetchEnrollments = async () => {
    try {
      const res = await fetch('/api/admin/enrollments');
      const data = await res.json();
      if (data.enrollments) setEnrollments(data.enrollments);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEnrollments(); }, []);

  const handleApprove = async (id) => {
    if (!confirm(isAr ? 'تأكيد تفعيل هذا الاشتراك ؟' : 'Confirm and approve?')) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/enrollments/${id}/approve`, { method: 'POST' });
      if (res.ok) fetchEnrollments();
    } finally { setActionLoading(false); }
  };

  const handleReject = async (id) => {
    if (!confirm(isAr ? 'تأكيد رفض الطلب ؟' : 'Confirm and reject?')) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/enrollments/${id}/reject`, { method: 'POST' });
      if (res.ok) fetchEnrollments();
    } finally { setActionLoading(false); }
  };

  // Formatage de la date d'échéance/délai d'accès
  const formatExpiration = (enrollment) => {
    if (enrollment.status !== 'APPROVED') {
      const months = enrollment.offer?.durationMonths || (enrollment.planType === 'PREMIUM' ? 12 : 1);
      return (
        <span className="text-gray-400 dark:text-gray-500 italic font-normal">
          {isAr ? `+ ${months} أشهر (عند التفعيل)` : `+ ${months} months (upon approval)`}
        </span>
      );
    }
    if (!enrollment.expiresAt) return '—';
    return new Date(enrollment.expiresAt).toLocaleDateString(isAr ? 'ar-DZ' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const pendingCount = enrollments.filter((e) => e.status === 'PENDING').length;

  const PaymentInfo = ({ enrollment }) => {
    const hasReceipt = !!enrollment.receiptUrl;
    return (
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <CreditCard className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
            {hasReceipt
              ? (isAr ? 'حوالة CCP بريدية' : 'CCP Postal Transfer')
              : (isAr ? 'دفع إلكتروني (SlickPay)' : 'SlickPay Online')}
          </span>
        </div>
        {hasReceipt ? (
          <button
            onClick={() => setSelectedReceipt(enrollment.receiptUrl)}
            className="inline-flex items-center gap-1.5 text-primary hover:bg-primary/5 px-2 py-1 rounded-lg text-[10px] font-black transition-all cursor-pointer border border-primary/20"
          >
            <Eye className="w-3 h-3" />
            {isAr ? 'عرض إيصال الدفع' : 'Verify Receipt'}
          </button>
        ) : (
          <span className="text-[10px] text-success font-bold">{isAr ? 'دفع آلي مؤكد' : 'Automated'}</span>
        )}
      </div>
    );
  };

  const ActionButtons = ({ enrollment, full = false }) => (
    <div className={`flex gap-2 ${full ? 'w-full' : 'justify-end'}`}>
      <Button
        onClick={() => handleApprove(enrollment.id)}
        className={`bg-success hover:bg-success/90 text-white rounded-xl py-2 px-4 text-[11px] font-bold shadow-sm shadow-success/20 ${full ? 'flex-1' : ''}`}
        disabled={actionLoading}
      >
        <CheckCircle className="w-3.5 h-3.5 mr-1.5 inline" /> {isAr ? 'قبول' : 'Approve'}
      </Button>
      <Button
        onClick={() => handleReject(enrollment.id)}
        variant="danger"
        className={`rounded-xl py-2 px-4 text-[11px] font-bold ${full ? 'flex-1' : ''}`}
        disabled={actionLoading}
      >
        <XCircle className="w-3.5 h-3.5 mr-1.5 inline" /> {isAr ? 'رفض' : 'Reject'}
      </Button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 py-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <CheckCircle className="w-6 h-6 text-primary" />
            </div>
            {isAr ? 'إدارة طلبات الاشتراك' : 'Enrollment Management'}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            {isAr ? 'تحقق من وصولات CCP وقم بتفعيل حسابات الطلاب وحساب تواريخ انتهاء الصلاحية' : 'Verify CCP receipts, activate student accounts and calculate expiration dates'}
          </p>
        </div>

        {pendingCount > 0 && (
          <span className="inline-flex items-center gap-2 self-start md:self-auto px-3.5 py-2 rounded-xl bg-warning/10 border border-warning/25 text-warning-dark dark:text-warning text-xs font-bold">
            <Clock className="w-3.5 h-3.5" />
            {pendingCount} {isAr ? 'بانتظار المراجعة' : 'pending review'}
          </span>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 animate-pulse">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Loading Records...</span>
        </div>
      ) : enrollments.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 p-16 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800 text-center">
          <Clock className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <p className="text-sm font-bold text-gray-400">{isAr ? 'لا توجد طلبات اشتراك حالياً' : 'No enrollment requests found.'}</p>
        </div>
      ) : (
        <>
          {/* Vue tableau — desktop/tablette (md+) */}
          <div className="hidden md:block bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-950/50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-gray-800">
                    <th className="p-5">{isAr ? 'الطالب' : 'Student'}</th>
                    <th className="p-5">{isAr ? 'الكورس والعرض المختار' : 'Course & Offer'}</th>
                    <th className="p-5">{isAr ? 'طريقة الدفع والوصل' : 'Payment & Receipt'}</th>
                    <th className="p-5">{isAr ? 'تاريخ انتهاء الصلاحية' : 'Expiration Deadline'}</th>
                    <th className="p-5 text-center">{isAr ? 'الحالة' : 'Status'}</th>
                    <th className="p-5 text-right">{isAr ? 'الإجراءات' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                  {enrollments.map((enrollment) => {
                    const initial = (enrollment.user?.fullName || '?').trim().charAt(0).toUpperCase();
                    return (
                      <tr key={enrollment.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors align-top">

                        {/* Étudiant */}
                        <td className="p-5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-xs shrink-0">
                              {initial}
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-sm text-gray-900 dark:text-white truncate">{enrollment.user?.fullName}</div>
                              <div className="text-[10px] font-medium text-gray-400 truncate">{enrollment.user?.email}</div>
                            </div>
                          </div>
                        </td>

                        {/* Cours & Formule d'offre d'abonnement */}
                        <td className="p-5">
                          <div className="flex items-center gap-2 mb-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-primary shrink-0" />
                            <span className="text-xs font-bold text-gray-700 dark:text-gray-300 truncate max-w-[200px]">
                              {isAr ? enrollment.course?.titleAr : enrollment.course?.titleEn}
                            </span>
                          </div>
                          <Badge variant="primary" className="text-[9px] px-2 py-0.5">
                            {enrollment.offer ? (isAr ? enrollment.offer.nameAr : enrollment.offer.nameEn) : enrollment.planType}
                          </Badge>
                        </td>

                        {/* Type de paiement (CCP / SlickPay) & Reçu */}
                        <td className="p-5">
                          <PaymentInfo enrollment={enrollment} />
                        </td>

                        {/* Date limite d'accès (expiresAt) */}
                        <td className="p-5">
                          <div className="flex items-center gap-2 text-xs font-bold text-gray-700 dark:text-gray-300">
                            <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            <span>{formatExpiration(enrollment)}</span>
                          </div>
                        </td>

                        {/* Statut actuel */}
                        <td className="p-5 text-center">
                          <Badge variant={
                            enrollment.status === 'APPROVED' ? 'success' :
                            enrollment.status === 'REJECTED' ? 'error' : 'warning'
                          }>
                            {enrollment.status}
                          </Badge>
                        </td>

                        {/* Actions */}
                        <td className="p-5 text-right">
                          {enrollment.status === 'PENDING' ? (
                            <ActionButtons enrollment={enrollment} />
                          ) : (
                            <span className="text-[10px] text-gray-300 dark:text-gray-700">—</span>
                          )}
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Vue carte — mobile (<md), chaque donnée sur sa propre ligne */}
          <div className="md:hidden space-y-4">
            {enrollments.map((enrollment) => {
              const initial = (enrollment.user?.fullName || '?').trim().charAt(0).toUpperCase();
              return (
                <div
                  key={enrollment.id}
                  className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-4 space-y-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-xs shrink-0">
                        {initial}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-sm text-gray-900 dark:text-white truncate">{enrollment.user?.fullName}</div>
                        <div className="text-[10px] font-medium text-gray-400 truncate">{enrollment.user?.email}</div>
                      </div>
                    </div>
                    <Badge variant={
                      enrollment.status === 'APPROVED' ? 'success' :
                      enrollment.status === 'REJECTED' ? 'error' : 'warning'
                    } className="shrink-0">
                      {enrollment.status}
                    </Badge>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-gray-100 dark:border-gray-800 text-xs">
                    <div className="flex items-center justify-between gap-3">
                      <span className="flex items-center gap-1.5 text-gray-400 font-semibold shrink-0">
                        <BookOpen className="w-3.5 h-3.5" />
                        {isAr ? 'الكورس' : 'Course'}
                      </span>
                      <span className="font-bold text-gray-700 dark:text-gray-300 text-right truncate">
                        {isAr ? enrollment.course?.titleAr : enrollment.course?.titleEn}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <span className="text-gray-400 font-semibold shrink-0">{isAr ? 'العرض' : 'Offer'}</span>
                      <Badge variant="primary" className="text-[9px] px-2 py-0.5">
                        {enrollment.offer ? (isAr ? enrollment.offer.nameAr : enrollment.offer.nameEn) : enrollment.planType}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <span className="flex items-center gap-1.5 text-gray-400 font-semibold shrink-0">
                        <Calendar className="w-3.5 h-3.5" />
                        {isAr ? 'الانتهاء' : 'Expires'}
                      </span>
                      <span className="font-bold text-gray-700 dark:text-gray-300 text-right">
                        {formatExpiration(enrollment)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <span className="text-gray-400 font-semibold shrink-0">{isAr ? 'الدفع' : 'Payment'}</span>
                      <div className="text-right">
                        <PaymentInfo enrollment={enrollment} />
                      </div>
                    </div>
                  </div>

                  {enrollment.status === 'PENDING' && (
                    <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
                      <ActionButtons enrollment={enrollment} full />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Modal pour le reçu CCP */}
      <Modal
        isOpen={!!selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
        title={isAr ? 'إيصال دفع CCP للتحقق' : 'CCP Payment Receipt Verification'}
      >
        <div className="bg-gray-100 dark:bg-gray-950 p-2 rounded-2xl overflow-hidden border dark:border-gray-800">
          <img
            src={selectedReceipt}
            alt="Receipt"
            className="w-full h-auto max-h-[70vh] object-contain rounded-xl shadow-inner"
          />
        </div>
        <div className="mt-4 flex justify-end">
           <Button onClick={() => setSelectedReceipt(null)} variant="outline" size="sm">
             {isAr ? 'إغلاق المعاينة' : 'Close'}
           </Button>
        </div>
      </Modal>
    </div>
  );
}