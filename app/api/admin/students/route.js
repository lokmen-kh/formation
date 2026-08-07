import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { withAuth } from '@/lib/middleware/withAuth';
import { withRole } from '@/lib/middleware/withRole';

async function getStudentsHandler(request) {
  try {
    // Récupération de tous les utilisateurs inscrits en tant qu'étudiants [5]
    const students = await db.user.findMany({
      where: {
        role: 'STUDENT'
      },
      include: {
        // Inclure l'historique de toutes les inscriptions [2]
        enrollments: {
          include: {
            course: { select: { titleAr: true, titleEn: true, slug: true } },
            offer: true // Détails de l'offre dynamique souscrite
          },
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, students });
  } catch (error) {
    console.error('Error fetching students for admin:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur lors du chargement des données.' }, { status: 500 });
  }
}

export const GET = withAuth(withRole(['ADMIN'], getStudentsHandler));