import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { withAuth } from '@/lib/middleware/withAuth';
import { withRole } from '@/lib/middleware/withRole';

async function getEnrollments(request) {
  try {
    const enrollments = await db.enrollment.findMany({
      include: {
        user: { select: { fullName: true, email: true } },
        course: { select: { titleAr: true, titleEn: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ enrollments });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}

export const GET = withAuth(withRole(['ADMIN'], getEnrollments));