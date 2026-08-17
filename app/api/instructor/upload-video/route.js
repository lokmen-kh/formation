import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { withAuth } from '@/lib/middleware/withAuth';
import { withRole } from '@/lib/middleware/withRole';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export const dynamic = 'force-dynamic';

const b2Client = new S3Client({
  endpoint: `https://${process.env.B2_ENDPOINT}`,
  region: process.env.B2_REGION || 'us-west-004',
  credentials: {
    accessKeyId: process.env.B2_APPLICATION_KEY_ID,
    secretAccessKey: process.env.B2_APPLICATION_KEY,
  },
});

async function uploadToB2(file, folder = 'uploads') {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const filename = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
  const key = `${folder}/${filename}`;

  await b2Client.send(
    new PutObjectCommand({
      Bucket: process.env.B2_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    })
  );

  return `https://${process.env.B2_BUCKET_NAME}.${process.env.B2_ENDPOINT}/${key}`;
}

// 1. CRÉATION D'UNE LEÇON (POST) [2]
async function createLessonHandler(request) {
  try {
    const formData = await request.formData();
    const chapterId = formData.get('chapterId');
    const titleAr = formData.get('titleAr');
    const titleEn = formData.get('titleEn');
    const writtenContentAr = formData.get('writtenContentAr') || '';
    const writtenContentEn = formData.get('writtenContentEn') || '';
    const order = parseInt(formData.get('order')) || 1;

    if (!chapterId || !titleAr || !titleEn) {
      return NextResponse.json({ error: 'Champs requis manquants.' }, { status: 400 });
    }

    const videoFile = formData.get('video');
    const documentFile = formData.get('document');

    let videoUrl = null;
    let documentUrl = null;

    if (videoFile && typeof videoFile !== 'string' && videoFile.size > 0) {
      videoUrl = await uploadToB2(videoFile, 'videos');
    }
    if (documentFile && typeof documentFile !== 'string' && documentFile.size > 0) {
      documentUrl = await uploadToB2(documentFile, 'documents');
    }

    const newLesson = await db.lesson.create({
      data: {
        chapterId,
        titleAr,
        titleEn,
        writtenContentAr,
        writtenContentEn,
        order,
        videoUrl,
        documentUrl,
      }
    });

    return NextResponse.json({ success: true, lesson: newLesson });
  } catch (error) {
    console.error('Create lesson API error:', error);
    return NextResponse.json({ error: 'Erreur serveur lors du téléversement.' }, { status: 500 });
  }
}

// 2. MODIFICATION D'UNE LEÇON (PUT) [2]
async function updateLessonHandler(request) {
  try {
    const formData = await request.formData();
    const id = formData.get('id'); // ID de la leçon à modifier
    const chapterId = formData.get('chapterId');
    const titleAr = formData.get('titleAr');
    const titleEn = formData.get('titleEn');
    const writtenContentAr = formData.get('writtenContentAr') || '';
    const writtenContentEn = formData.get('writtenContentEn') || '';
    const order = parseInt(formData.get('order')) || 1;

    if (!id || !chapterId || !titleAr || !titleEn) {
      return NextResponse.json({ error: 'Champs requis manquants.' }, { status: 400 });
    }

    const currentLesson = await db.lesson.findUnique({
      where: { id },
      include: { chapter: true }
    });

    if (!currentLesson) {
      return NextResponse.json({ error: 'Leçon introuvable.' }, { status: 404 });
    }

    // Sécurité : L'enseignant doit être le formateur attitré de ce cours [5]
    const course = await db.course.findUnique({ where: { id: currentLesson.chapter.courseId } });
    if (request.user.role !== 'ADMIN' && course.instructorId !== request.user.userId) {
      return NextResponse.json({ error: 'Accès interdit.' }, { status: 403 });
    }

    const videoFile = formData.get('video');
    const documentFile = formData.get('document');

    let videoUrl = currentLesson.videoUrl;
    let documentUrl = currentLesson.documentUrl;

    // Remplacer par de nouveaux fichiers sur B2 si téléversés [2]
    if (videoFile && typeof videoFile !== 'string' && videoFile.size > 0) {
      videoUrl = await uploadToB2(videoFile, 'videos');
    }
    if (documentFile && typeof documentFile !== 'string' && documentFile.size > 0) {
      documentUrl = await uploadToB2(documentFile, 'documents');
    }

    const updated = await db.lesson.update({
      where: { id },
      data: {
        chapterId,
        titleAr,
        titleEn,
        writtenContentAr,
        writtenContentEn,
        order,
        videoUrl,
        documentUrl
      }
    });

    return NextResponse.json({ success: true, lesson: updated });
  } catch (error) {
    console.error('Update lesson API error:', error);
    return NextResponse.json({ error: 'Erreur lors de la modification de la leçon.' }, { status: 500 });
  }
}

// 3. SUPPRESSION D'UNE LEÇON (DELETE) [5]
async function deleteLessonHandler(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID de leçon manquant.' }, { status: 400 });
    }

    const lesson = await db.lesson.findUnique({
      where: { id },
      include: { chapter: true }
    });

    if (!lesson) {
      return NextResponse.json({ error: 'Leçon introuvable.' }, { status: 404 });
    }

    // Sécurité [5]
    const course = await db.course.findUnique({ where: { id: lesson.chapter.courseId } });
    if (request.user.role !== 'ADMIN' && course.instructorId !== request.user.userId) {
      return NextResponse.json({ error: 'Accès interdit.' }, { status: 403 });
    }

    await db.lesson.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Leçon supprimée définitivement.' });
  } catch (error) {
    console.error('Delete lesson API error:', error);
    return NextResponse.json({ error: 'Erreur lors de la suppression de la leçon.' }, { status: 500 });
  }
}

export const POST = withAuth(withRole(['ADMIN', 'INSTRUCTOR'], createLessonHandler));
export const PUT = withAuth(withRole(['ADMIN', 'INSTRUCTOR'], updateLessonHandler));
export const DELETE = withAuth(withRole(['ADMIN', 'INSTRUCTOR'], deleteLessonHandler));