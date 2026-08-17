import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { withAuth } from '@/lib/middleware/withAuth';
import { withRole } from '@/lib/middleware/withRole';

export const dynamic = 'force-dynamic';

// Récupérer tous les cours associés à l'instructeur connecté (GET)
async function getInstructorCoursesHandler(request) {
  try {
    const userId = request.user.userId;
    const role = request.user.role;

    let courses = [];

    // Structure de requête incluant les relations requises par le Front-end
    const includeQuery = {
      category: true,
      offers: true,
      chapters: {
        include: {
          lessons: {
            select: { id: true } // Sélection minimale pour compter les leçons
          }
        }
      },
      _count: {
        select: { enrollments: true } // Compte des étudiants inscrits
      }
    };

    if (role === 'ADMIN') {
      // Les administrateurs voient l'intégralité des cours
      courses = await db.course.findMany({
        include: includeQuery,
        orderBy: { createdAt: 'desc' }
      });
    } else {
      // Les instructeurs voient uniquement leurs cours assignés
      courses = await db.course.findMany({
        where: {
          instructorId: userId
        },
        include: includeQuery,
        orderBy: { createdAt: 'desc' }
      });
    }

    return NextResponse.json({ success: true, courses });
  } catch (error) {
    console.error('Error fetching instructor courses:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération des cours.' }, { status: 500 });
  }
}

export const GET = withAuth(withRole(['INSTRUCTOR', 'ADMIN'], getInstructorCoursesHandler));