import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { withAuth } from '@/lib/middleware/withAuth';
import { withRole } from '@/lib/middleware/withRole';

// Ajouter un Chapitre sous un Cours
async function addChapterHandler(request, { params }) {
  try {
    // CORRECTION : Résoudre la promesse params sous Next.js 15+ [1]
    const { id: courseId } = await params;
    
    const { titleAr, titleEn, order } = await request.json();

    if (!titleAr || !titleEn) {
      return NextResponse.json({ error: 'Champs requis manquants.' }, { status: 400 });
    }

    const chapter = await db.chapter.create({
      data: {
        courseId,
        titleAr,
        titleEn,
        order: parseInt(order) || 0
      }
    });

    return NextResponse.json({ success: true, chapter });
  } catch (error) {
    console.error('Erreur ajout chapitre :', error);
    return NextResponse.json({ error: 'Échec de l’ajout du chapitre.' }, { status: 500 });
  }
}

export const POST = withAuth(withRole(['ADMIN', 'INSTRUCTOR'], addChapterHandler));