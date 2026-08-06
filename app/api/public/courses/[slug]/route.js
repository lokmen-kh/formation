import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { VideoStorage } from '@/lib/video-storage';

export async function GET(request, { params }) {
  try {
    // CORRECTION : Résoudre la promesse params sous Next.js 15+ [1]
    const { slug } = await params;

    const course = await db.course.findUnique({
      where: { slug },
      include: {
        instructor: { select: { fullName: true } },
        // NOUVEAU : Inclure les catégories et offres d'abonnements réelles [2, 5]
        category: { select: { id: true, nameAr: true, nameEn: true, slug: true } },
        offers: true, 
        chapters: {
          orderBy: { order: 'asc' },
          include: {
            lessons: {
              orderBy: { order: 'asc' },
              select: { 
                id: true, 
                titleAr: true, 
                titleEn: true, 
                order: true,
                videoUrl: true,
                writtenContentAr: true,
                writtenContentEn: true
              }
            }
          }
        }
      }
    });

    if (!course) {
      return NextResponse.json({ error: 'Cours introuvable.' }, { status: 404 });
    }

    const introVideoPlaybackUrl = course.videoUrl || null;

    return NextResponse.json({
      course: {
        ...course,
        introVideoPlaybackUrl
      }
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}