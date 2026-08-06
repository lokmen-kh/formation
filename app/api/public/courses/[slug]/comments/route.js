import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { withAuth } from '@/lib/middleware/withAuth';

// Lister tous les commentaires d'un cours
export async function GET(request, { params }) {
  try {
    // CORRECTION : Résoudre la promesse params avant d'extraire la clé "slug" [1]
    const { slug } = await params;

    const course = await db.course.findUnique({ where: { slug } });
    if (!course) {
      return NextResponse.json({ error: 'Cours introuvable.' }, { status: 404 });
    }

    const comments = await db.comment.findMany({
      where: { courseId: course.id },
      include: {
        user: { select: { fullName: true, role: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ comments });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erreur interne.' }, { status: 500 });
  }
}

// Ajouter un commentaire sous un cours (Tout utilisateur connecté)
async function addCommentHandler(request, { params }) {
  try {
    // CORRECTION : Résoudre la promesse params avant d'extraire la clé "slug" [1]
    const { slug } = await params;
    const { content } = await request.json();

    if (!content) {
      return NextResponse.json({ error: 'Le contenu est requis.' }, { status: 400 });
    }

    const course = await db.course.findUnique({ where: { slug } });
    if (!course) {
      return NextResponse.json({ error: 'Cours introuvable.' }, { status: 404 });
    }

    const comment = await db.comment.create({
      data: {
        content,
        userId: request.user.userId,
        courseId: course.id
      },
      include: {
        user: { select: { fullName: true, role: true } }
      }
    });

    return NextResponse.json({ success: true, comment });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Échec de la publication.' }, { status: 500 });
  }
}

export const POST = withAuth(addCommentHandler);