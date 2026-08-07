import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { withAuth } from '@/lib/middleware/withAuth';
import { withRole } from '@/lib/middleware/withRole';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// Initialisation du client S3 compatible Backblaze B2
const b2Client = new S3Client({
  endpoint: `https://${process.env.B2_ENDPOINT}`,
  region: process.env.B2_REGION || 'us-west-004',
  credentials: {
    accessKeyId: process.env.B2_APPLICATION_KEY_ID,
    secretAccessKey: process.env.B2_APPLICATION_KEY,
  },
});

// Fonction d'aide pour téléverser un fichier sur Backblaze B2 [2]
async function uploadToB2(file, folder = 'uploads') {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  // Formatage propre du nom de fichier unique
  const filename = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
  const key = `${folder}/${filename}`;

  // Commande d'écriture dans le Bucket B2
  await b2Client.send(
    new PutObjectCommand({
      Bucket: process.env.B2_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    })
  );

  // URL publique d'accès au fichier
  return `https://${process.env.B2_BUCKET_NAME}.${process.env.B2_ENDPOINT}/${key}`;
}

async function uploadLessonHandler(request) {
  try {
    // Vérification de la configuration requise
    if (!process.env.B2_APPLICATION_KEY_ID || !process.env.B2_BUCKET_NAME) {
      return NextResponse.json({ error: 'Les clés de stockage cloud ne sont pas configurées.' }, { status: 500 });
    }

    const formData = await request.formData();
    const chapterId = formData.get('chapterId');
    const titleAr = formData.get('titleAr');
    const titleEn = formData.get('titleEn');
    const writtenContentAr = formData.get('writtenContentAr') || '';
    const writtenContentEn = formData.get('writtenContentEn') || '';
    const order = parseInt(formData.get('order')) || 1;

    if (!chapterId || !titleAr || !titleEn) {
      return NextResponse.json({ error: 'Champs obligatoires manquants.' }, { status: 400 });
    }

    const videoFile = formData.get('video');
    const documentFile = formData.get('document');

    let videoUrl = null;
    let documentUrl = null;

    // 1. Téléverser la vidéo vers Backblaze B2 [2]
    if (videoFile && typeof videoFile !== 'string' && videoFile.size > 0) {
      videoUrl = await uploadToB2(videoFile, 'videos');
    }

    // 2. Téléverser le document vers Backblaze B2 [2]
    if (documentFile && typeof documentFile !== 'string' && documentFile.size > 0) {
      documentUrl = await uploadToB2(documentFile, 'documents');
    }

    // 3. Création de la leçon liée en Base de Données
    const newLesson = await db.lesson.create({
      data: {
        chapterId,
        titleAr,
        titleEn,
        writtenContentAr,
        writtenContentEn,
        order,
        videoUrl,    // URL Backblaze B2 de la vidéo
        documentUrl,  // URL Backblaze B2 du document
      }
    });

    return NextResponse.json({ success: true, lesson: newLesson });
  } catch (error) {
    console.error('B2 upload lesson API error:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur lors du téléversement.' }, { status: 500 });
  }
}

export const POST = withAuth(withRole(['ADMIN', 'INSTRUCTOR'], uploadLessonHandler));