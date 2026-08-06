"use client";

import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import {Button} from '@/components/ui/Button';
import {Badge} from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import {Input} from '@/components/ui/Input';

export default function AdminInstructorsPage() {
  const { language } = useLanguage();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Formulaire Professeur
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const isAr = language === 'ar';

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.users) setUsers(data.users);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateInstructor = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password })
      });

      if (res.ok) {
        setIsModalOpen(false);
        setFullName(''); setEmail(''); setPassword('');
        fetchUsers();
      } else {
        const data = await res.json();
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 opacity-0 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-black text-gray-900 dark:text-white">
          {isAr ? 'إدارة الأساتذة' : 'Instructor Roster'}
        </h1>
        <Button onClick={() => setIsModalOpen(true)} variant="primary">
          {isAr ? 'إنشاء حساب أستاذ جديد' : 'Create Instructor Account'}
        </Button>
      </div>

      {loading ? (
        <div className="text-xs text-gray-500">Chargement...</div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-card border border-gray-150 dark:border-gray-800 overflow-hidden shadow-sm transition-colors duration-300">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-950 text-[10px] font-bold text-gray-500 border-b border-gray-100 dark:border-gray-800 uppercase">
                <th className="p-4">{isAr ? 'الاسم الكامل' : 'Full Name'}</th>
                <th className="p-4">{isAr ? 'البريد الإلكتروني' : 'Email'}</th>
                <th className="p-4">{isAr ? 'الدور الحالي' : 'Active Role'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800 text-xs text-gray-600 dark:text-gray-400">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-950/20">
                  <td className="p-4 font-bold text-gray-900 dark:text-white">{user.fullName}</td>
                  <td className="p-4 text-gray-500">{user.email}</td>
                  <td className="p-4">
                    <Badge variant={user.role === 'ADMIN' ? 'accent' : user.role === 'INSTRUCTOR' ? 'success' : 'primary'}>
                      {user.role}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal d'ajout de Professeur */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isAr ? 'حساب أستاذ جديد' : 'New Instructor Account'}>
        <form onSubmit={handleCreateInstructor} className="space-y-4">
          <Input label="Full Name" required value={fullName} onChange={e => setFullName(e.target.value)} />
          <Input label="Email" type="email" required value={email} onChange={e => setEmail(e.target.value)} />
          <Input label="Password" type="password" required value={password} onChange={e => setPassword(e.target.value)} />

          <div className="flex justify-end pt-4 space-x-2">
            <Button onClick={() => setIsModalOpen(false)} variant="outline" size="sm">{isAr ? 'إلغاء' : 'Cancel'}</Button>
            <Button type="submit" variant="primary" size="sm" disabled={actionLoading}>
              {actionLoading ? 'Création...' : isAr ? 'حفظ الحساب' : 'Create Account'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}