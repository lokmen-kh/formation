"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import {Badge} from '@/components/ui/Badge';

export default function CourseStudentsPage() {
  const { slug: courseSlug } = useParams();
  const { language } = useLanguage();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const isAr = language === 'ar';

  useEffect(() => {
    if (courseSlug) {
      // Résolution du slug pour trouver le courseId
      fetch(`/api/public/courses/${courseSlug}`)
        .then(res => res.json())
        .then(data => {
          if (data.course?.id) {
            fetch(`/api/instructor/students/${data.course.id}`)
              .then(r => r.json())
              .then(d => {
                if (d.enrollments) setStudents(d.enrollments);
              });
          }
        })
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [courseSlug]);

  if (loading) {
    return <div className="p-layout-md text-xs text-gray-400">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-black text-gray-900">
        {isAr ? 'متابعة تقدم الطلاب' : 'Student Progress Reports'}
      </h1>

      {students.length === 0 ? (
        <div className="bg-white p-8 rounded-card border text-center text-xs text-gray-400">
          {isAr ? 'لا يوجد طلاب مسجلين في هذا الكورس بعد.' : 'No active students enrolled.'}
        </div>
      ) : (
        <div className="bg-white rounded-card border border-gray-150 overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-[10px] font-bold text-gray-500 border-b border-gray-100 uppercase">
                <th className="p-4">{isAr ? 'الطالب' : 'Student Name'}</th>
                <th className="p-4">{isAr ? 'البريد الإلكتروني' : 'Email'}</th>
                <th className="p-4">{isAr ? 'الخطة' : 'Plan'}</th>
                <th className="p-4">{isAr ? 'الدروس المنجزة' : 'Lessons Completed'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs text-gray-600">
              {students.map((enrollment) => {
                const completedCount = enrollment.user?.videoProgresses?.filter(p => p.completed).length || 0;
                const totalProgressed = enrollment.user?.videoProgresses?.length || 0;

                return (
                  <tr key={enrollment.id} className="hover:bg-gray-50/50">
                    <td className="p-4 font-bold text-gray-900">{enrollment.user?.fullName}</td>
                    <td className="p-4 text-gray-500">{enrollment.user?.email}</td>
                    <td className="p-4">
                      <Badge variant={enrollment.planType === 'PREMIUM' ? 'accent' : 'primary'}>
                        {enrollment.planType}
                      </Badge>
                    </td>
                    <td className="p-4 font-bold text-primary">
                      {completedCount} / {totalProgressed} {isAr ? 'منجز' : 'completed'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}