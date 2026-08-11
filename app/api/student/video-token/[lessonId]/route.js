import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { withAuth } from '@/lib/middleware/withAuth';
import { checkAccess } from '@/lib/enrollment/checkAccess';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Configuration du client B2 S3
const b2Client = new S3Client({
  endpoint: `https://${process.env.B2_ENDPOINT}`,
  region: process.env.B2_REGION || 'us-west-004',
  credentials: {
    accessKeyId: process.env.B2_APPLICATION_KEY_ID,
    secretAccessKey: process.env.B2_APPLICATION_KEY,
  },
});

async function videoTokenHandler(request, { params }) {
  try {
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

    // 1. Contrôle bivalent de validité (Bypass automatique pour le Staff : Admin / Prof du cours) [5]
    const userRole = request.user.role?.toUpperCase();
    let hasAccess = false;

    if (userRole === 'ADMIN') {
      hasAccess = true; // L'administrateur a un droit de regard universel
    } else if (userRole === 'INSTRUCTOR') {
      // Le professeur doit être le formateur attitré de ce cours spécifique [5]
      const course = await db.course.findUnique({ where: { id: courseId } });
      if (course && course.instructorId === request.user.userId) {
        hasAccess = true;
      }
    } else {
      // Élève standard : vérification classique de l'inscription CCP approuvée
      const access = await checkAccess(request.user.userId, courseId);
      hasAccess = access.hasAccess;
    }

    if (!hasAccess) {
      return NextResponse.json({ error: 'Accès interdit : Vous ne possédez pas d’abonnement actif pour ce cours.' }, { status: 403 });
    }

    if (!lesson.videoUrl) {
      return NextResponse.json({ error: 'Aucun média vidéo n’est associé à cette leçon.' }, { status: 400 });
    }

    let playbackUrl = lesson.videoUrl;

    // Si la vidéo est sur Backblaze B2, génération du lien signé d'une heure [2]
    if (lesson.videoUrl.includes(process.env.B2_ENDPOINT)) {
      const urlParts = lesson.videoUrl.split(`${process.env.B2_ENDPOINT}/`);
      if (urlParts.length > 1) {
        const fileKey = urlParts[1];

        const command = new GetObjectCommand({
          Bucket: process.env.B2_BUCKET_NAME,
          Key: fileKey,
        });

        playbackUrl = await getSignedUrl(b2Client, command, { expiresIn: 3600 });
      }
    }

    return NextResponse.json({ success: true, playbackUrl });
  } catch (error) {
    console.error('Erreur video-token :', error);
    return NextResponse.json({ error: 'Erreur interne du serveur lors de la validation.' }, { status: 500 });
  }
}

export const GET = withAuth(videoTokenHandler);