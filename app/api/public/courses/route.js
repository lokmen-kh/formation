import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const courses = await db.course.findMany({
      where: { published: true },
      select: {
        id: true,
        slug: true,
        titleAr: true,
        titleEn: true,
        descriptionAr: true,
        descriptionEn: true,
        imageUrl: true,
        instructor: {
          select: {
            fullName: true
          }
        },
        // NOUVEAU : Jointure optimisée des offres d'abonnement dynamiques réelles [2]
        offers: {
          select: {
            id: true,
            nameAr: true,
            nameEn: true,
            durationMonths: true,
            price: true,
            oldPrice: true
          }
        },
        // Récupération ultra-légère des leçons pour le calcul dynamique du volume
        chapters: {
          select: {
            lessons: {
              select: { id: true }
            }
          }
        },
        // Décompte automatique des inscriptions réelles en BDD [2]
        _count: {
          select: {
            enrollments: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json({ courses });
  } catch (error) {
    console.error('Échec de la récupération des cours publics :', error);
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}