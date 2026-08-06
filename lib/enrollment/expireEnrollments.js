import { db } from '@/lib/db';

export async function expireEnrollments() {
  const now = new Date();

  // Recherche des inscriptions actives dont la date d'échéance est dépassée
  const expiredEnrollments = await db.enrollment.findMany({
    where: {
      status: 'APPROVED',
      expiresAt: {
        lt: now
      }
    }
  });

  if (expiredEnrollments.length === 0) {
    return { count: 0 };
  }

  // Suspension en modifiant le statut à REJECTED
  const result = await db.enrollment.updateMany({
    where: {
      status: 'APPROVED',
      expiresAt: {
        lt: now
      }
    },
    data: {
      status: 'REJECTED'
    }
  });

  return { count: result.count, expiredEnrollments };
}