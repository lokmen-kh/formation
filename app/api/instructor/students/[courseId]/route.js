import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { withAuth } from '@/lib/middleware/withAuth';
import { withRole } from '@/lib/middleware/withRole';

async function getProgressHandler(request, { params }) {
  try {
    const { courseId } = params;

    const enrollments = await db.enrollment.findMany({
      where: { courseId, status: 'APPROVED' },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            videoProgresses: {
              include: {
                lesson: { select: { titleEn: true, titleAr: true } }
              }
            }
          }
        }
      }
    });

    return NextResponse.json({ enrollments });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erreur lors de la récupération.' }, { status: 500 });
  }
}

export const GET = withAuth(withRole(['INSTRUCTOR', 'ADMIN'], getProgressHandler));