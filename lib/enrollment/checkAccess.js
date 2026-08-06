import { db } from '@/lib/db';

export async function checkAccess(userId, courseId) {
  const enrollment = await db.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId,
      },
    },
  });

  // Accès refusé si l'inscription n'a pas été validée par l'administration
  if (!enrollment || enrollment.status !== 'APPROVED') {
    return { hasAccess: false, reason: 'NOT_ENROLLED' };
  }

  // Accès refusé si la date de validité de l'abonnement est dépassée
  if (enrollment.expiresAt && new Date() > enrollment.expiresAt) {
    return { hasAccess: false, reason: 'EXPIRED' };
  }

  return { hasAccess: true, enrollment };
}