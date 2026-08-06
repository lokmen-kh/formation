import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { withAuth } from '@/lib/middleware/withAuth';

async function updateProgressHandler(request) {
  try {
    const { lessonId, progress, completed } = await request.json();

    if (!lessonId) {
      return NextResponse.json({ error: 'Identifiant de leçon manquant.' }, { status: 400 });
    }

    const updatedProgress = await db.videoProgress.upsert({
      where: {
        userId_lessonId: {
          userId: request.user.userId,
          lessonId
        }
      },
      update: {
        progress: parseFloat(progress) || 0,
        completed: !!completed
      },
      create: {
        userId: request.user.userId,
        lessonId,
        progress: parseFloat(progress) || 0,
        completed: !!completed
      }
    });

    return NextResponse.json({ success: true, progress: updatedProgress });
  } catch (error) {
    console.error('Erreur progression :', error);
    return NextResponse.json({ error: 'Erreur interne.' }, { status: 500 });
  }
}

export const POST = withAuth(updateProgressHandler);