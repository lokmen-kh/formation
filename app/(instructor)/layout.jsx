"use client";

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function InstructorLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || (user.role !== 'INSTRUCTOR' && user.role !== 'ADMIN'))) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-xs text-gray-400">Validation d'accès formateur...</div>;
  }

  if (!user || (user.role !== 'INSTRUCTOR' && user.role !== 'ADMIN')) {
    return null;
  }

  return <div className="instructor-layout">{children}</div>;
}