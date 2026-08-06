import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { withAuth } from '@/lib/middleware/withAuth';

async function getMyCoursesHandler(request) {
  try {
    const enrollments = await db.enrollment.findMany({
      where: { userId: request.user.userId },
      include: {
        course: {
          select: {
            id: true,
            slug: true,
            titleAr: true,
            titleEn: true,
            descriptionAr: true,
            descriptionEn: true,
            imageUrl: true,
            instructor: { select: { fullName: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ enrollments });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Échec de la récupération de vos cours.' }, { status: 500 });
  }
}

export const GET = withAuth(getMyCoursesHandler);