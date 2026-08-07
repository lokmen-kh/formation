import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { withAuth } from '@/lib/middleware/withAuth';
import { withRole } from '@/lib/middleware/withRole';

async function getInstructorCoursesHandler(request) {
  try {
    // Récupérer uniquement les cours assignés à ce professeur [5]
    const courses = await db.course.findMany({
      where: {
        instructorId: request.user.userId
      },
      include: {
        category: { select: { id: true, nameAr: true, nameEn: true } },
        chapters: {
          include: { lessons: true }
        },
        _count: {
          select: { enrollments: true } // Nombre total d'étudiants inscrits [2]
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, courses });
  } catch (error) {
    console.error('Error fetching instructor courses:', error);
    return NextResponse.json({ error: 'Erreur interne lors du chargement des cours.' }, { status: 500 });
  }
}

// Seuls les enseignants et les administrateurs peuvent accéder à cette API [5]
export const GET = withAuth(withRole(['INSTRUCTOR', 'ADMIN'], getInstructorCoursesHandler));