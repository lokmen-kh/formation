import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { withAuth } from '@/lib/middleware/withAuth';
import { withRole } from '@/lib/middleware/withRole';

export const dynamic = 'force-dynamic';

async function getCourseStudentsHandler(request, { params }) {
  try {
    // FIX : Résoudre la promesse params pour Next.js 15+ [1]
    const { courseId } = await params;

    // 1. Récupérer le cours pour vérifier les droits d'auteur
    const course = await db.course.findUnique({
      where: { id: courseId },
      include: {
        chapters: {
          include: { lessons: { select: { id: true } } }
        }
      }
    });

    if (!course) {
      return NextResponse.json({ error: 'Cours introuvable.' }, { status: 404 });
    }

    // BARRIÈRE DE SÉCURITÉ : L'enseignant doit être le propriétaire attitré de ce cours [5]
    if (request.user.role !== 'ADMIN' && course.instructorId !== request.user.userId) {
      return NextResponse.json({ error: 'Accès interdit.' }, { status: 403 });
    }

    const lessonIds = course.chapters.flatMap(c => c.lessons.map(l => l.id));
    const totalLessonsCount = lessonIds.length;

    // 2. Récupérer toutes les inscriptions approuvées pour ce cours
    const enrollments = await db.enrollment.findMany({
      where: {
        courseId: courseId,
        status: 'APPROVED'
      },
      include: {
        user: {
          // FIX CORRECTIF : Sélectionner uniquement les champs réels validés par Prisma
          select: {
            id: true,
            fullName: true,
            email: true,
            audience: true // Utilisation du champ réel de votre schéma
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // 3. Calculer la progression réelle de chaque étudiant [2]
    const studentsWithProgress = await Promise.all(
      enrollments.map(async (e) => {
        let completedCount = 0;
        
        if (totalLessonsCount > 0) {
          completedCount = await db.videoProgress.count({
            where: {
              userId: e.userId,
              lessonId: { in: lessonIds },
              completed: true
            }
          });
        }

        const progressPct = totalLessonsCount > 0 
          ? Math.round((completedCount / totalLessonsCount) * 100)
          : 0;

        return {
          enrollmentId: e.id,
          user: e.user,
          joinedAt: e.createdAt,
          expiresAt: e.expiresAt,
          progress: progressPct,
          completedCount,
          totalLessonsCount
        };
      })
    );

    return NextResponse.json({ 
      success: true, 
      students: studentsWithProgress, 
      courseTitle: { ar: course.titleAr, en: course.titleEn } 
    });
  } catch (error) {
    console.error('Error fetching course students:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur.' }, { status: 500 });
  }
}

export const GET = withAuth(withRole(['INSTRUCTOR', 'ADMIN'], getCourseStudentsHandler));