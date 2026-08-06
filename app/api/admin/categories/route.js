import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { withAuth } from '@/lib/middleware/withAuth';
import { withRole } from '@/lib/middleware/withRole';

// Lister toutes les catégories (Bilingues)
async function getCategories() {
  try {
    const categories = await db.category.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ categories });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erreur de récupération.' }, { status: 500 });
  }
}

// Ajouter une nouvelle catégorie
async function createCategoryHandler(request) {
  try {
    const { nameAr, nameEn, slug } = await request.json();

    if (!nameAr || !nameEn || !slug) {
      return NextResponse.json({ error: 'Champs requis manquants.' }, { status: 400 });
    }

    const sanitizedSlug = slug.trim().toLowerCase();

    const existing = await db.category.findUnique({ where: { slug: sanitizedSlug } });
    if (existing) {
      return NextResponse.json({ error: 'Ce slug de catégorie existe déjà.' }, { status: 400 });
    }

    const category = await db.category.create({
      data: {
        nameAr,
        nameEn,
        slug: sanitizedSlug
      }
    });

    return NextResponse.json({ success: true, category });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Échec de la création.' }, { status: 500 });
  }
}

export const GET = withAuth(withRole(['ADMIN'], getCategories));
export const POST = withAuth(withRole(['ADMIN'], createCategoryHandler));