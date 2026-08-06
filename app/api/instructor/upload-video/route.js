import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { withAuth } from '@/lib/middleware/withAuth';
import { withRole } from '@/lib/middleware/withRole';
import fs from 'fs/promises';
import path from 'path';

async function uploadLessonHandler(request) {
  try {
    const formData = await request.formData();
    const chapterId = formData.get('chapterId');
    const titleAr = formData.get('titleAr');
    const titleEn = formData.get('titleEn');
    const writtenContentAr = formData.get('writtenContentAr') || '';
    const writtenContentEn = formData.get('writtenContentEn') || '';
    const order = parseInt(formData.get('order')) || 0;
    
    const videoFile = formData.get('video');

    if (!chapterId || !titleAr || !titleEn) {
      return NextResponse.json({ error: 'Champs requis manquants.' }, { status: 400 });
    }

    let videoUrl = null;

    // Enregistrement physique du fichier vidéo sur votre propre serveur
    if (videoFile && typeof videoFile !== 'string' && videoFile.size > 0) {
      const bytes = await videoFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const filename = `lesson-${Date.now()}-${videoFile.name.replace(/\s+/g, '_')}`;
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      
      await fs.mkdir(uploadDir, { recursive: true });
      const filepath = path.join(uploadDir, filename);
      await fs.writeFile(filepath, buffer);
      
      // Enregistrement du chemin d'accès relatif dans la BDD
      videoUrl = `/uploads/${filename}`;
    }

    const lesson = await db.lesson.create({
      data: {
        chapterId,
        titleAr,
        titleEn,
        writtenContentAr,
        writtenContentEn,
        videoUrl, // Stocke le chemin local (ex: /uploads/lesson-...)
        order
      }
    });

    return NextResponse.json({ success: true, lesson });
  } catch (error) {
    console.error('Erreur écriture vidéo leçon :', error);
    return NextResponse.json({ error: 'Échec de la publication.' }, { status: 500 });
  }
}

export const POST = withAuth(withRole(['INSTRUCTOR', 'ADMIN'], uploadLessonHandler));