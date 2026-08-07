import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { withAuth } from '@/lib/middleware/withAuth';
import { checkAccess } from '@/lib/enrollment/checkAccess';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const b2Client = new S3Client({
  endpoint: `https://${process.env.B2_ENDPOINT}`,
  region: process.env.B2_REGION || 'us-west-004',
  credentials: {
    accessKeyId: process.env.B2_APPLICATION_KEY_ID,
    secretAccessKey: process.env.B2_APPLICATION_KEY,
  },
});

async function documentTokenHandler(request, { params }) {
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

    // 1. Contrôle de validité de l'inscription étudiante
    const access = await checkAccess(request.user.userId, courseId);
    if (!access.hasAccess) {
      return NextResponse.json({ error: 'Accès interdit : Abonnement inactif.' }, { status: 403 });
    }

    if (!lesson.documentUrl) {
      return NextResponse.json({ error: 'Aucun document ressource n’est associé à cette leçon.' }, { status: 400 });
    }

    let downloadUrl = lesson.documentUrl;

    // Génération d'un lien signé de téléchargement de 15 minutes (900 secondes)
    if (lesson.documentUrl.includes(process.env.B2_ENDPOINT)) {
      const urlParts = lesson.documentUrl.split(`${process.env.B2_ENDPOINT}/`);
      if (urlParts.length > 1) {
        const fileKey = urlParts[1];

        const command = new GetObjectCommand({
          Bucket: process.env.B2_BUCKET_NAME,
          Key: fileKey,
        });

        downloadUrl = await getSignedUrl(b2Client, command, { expiresIn: 900 });
      }
    }

    return NextResponse.json({ success: true, downloadUrl });
  } catch (error) {
    console.error('Erreur document-token API:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur lors de la génération du lien.' }, { status: 500 });
  }
}

export const GET = withAuth(documentTokenHandler);