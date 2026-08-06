import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { withAuth } from '@/lib/middleware/withAuth';
import { checkAccess } from '@/lib/enrollment/checkAccess';

async function videoTokenHandler(request, { params }) {
  try {
    // FIX : Résoudre la promesse params pour Next.js 15+ [1]
    const { lessonId } = await params;

    const lesson = await db.lesson.findUnique({
      where: { id: lessonId },
      include: {
        chapter: { select: { courseId: true } }
      }
    });

    if (!lesson) {
      return NextResponse.json({ error: 'Leçon introuvable.' }, { status: 404 });
    }

    const courseId = lesson.chapter.courseId;

    // 1. Contrôle de validité de l'inscription étudiante
    const access = await checkAccess(request.user.userId, courseId);
    if (!access.hasAccess) {
      return NextResponse.json({ error: 'Accès interdit : Abonnement inactif ou expiré.' }, { status: 403 });
    }

    // ACCÈS LIBRE : La mécanique de verrouillage progressif séquentiel a été retirée.
    // L'étudiant abonné peut désormais regarder n'importe quel cours librement [2].

    if (!lesson.videoUrl) {
      return NextResponse.json({ error: 'Aucun média vidéo n’est associé à cette leçon.' }, { status: 400 });
    }

    // Retourne le chemin d'accès local
    const signedUrl = lesson.videoUrl;

    return NextResponse.json({ success: true, playbackUrl: signedUrl });
  } catch (error) {
    console.error('Erreur video-token :', error);
    return NextResponse.json({ error: 'Erreur interne du serveur lors de la validation.' }, { status: 500 });
  }
}

export const GET = withAuth(videoTokenHandler);