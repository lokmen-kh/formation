import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { withAuth } from '@/lib/middleware/withAuth';
import { withRole } from '@/lib/middleware/withRole';
import fs from 'fs/promises';
import path from 'path';

// Lister tous les cours avec comptage et jointure d'offres réelles
async function getCourses() {
  try {
    const courses = await db.course.findMany({
      include: {
        instructor: { select: { fullName: true } },
        category: { select: { nameAr: true, nameEn: true } },
        offers: true, // Nouvelle jointure d'offres réelles [2]
        _count: { select: { enrollments: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ courses });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}

// Créer un cours (Avec professeur 100% optionnel et sans colonnes de prix obsolètes)
async function createCourseHandler(request) {
  try {
    const formData = await request.formData();
    const slug = formData.get('slug');
    const titleAr = formData.get('titleAr');
    const titleEn = formData.get('titleEn');
    const descriptionAr = formData.get('descriptionAr') || '';
    const descriptionEn = formData.get('descriptionEn') || '';
    const whatYouWillLearnAr = formData.get('whatYouWillLearnAr') || '';
    const whatYouWillLearnEn = formData.get('whatYouWillLearnEn') || '';
    
    // Récupération des clés optionnelles (Prof et Catégorie)
    const instructorId = formData.get('instructorId') || '';
    const categoryId = formData.get('categoryId') || '';
    const published = formData.get('published') === 'true'; 

    const imageFile = formData.get('image');

    // Récupération et conversion du tableau d'offres envoyé en JSON [2]
    const offersData = JSON.parse(formData.get('offers') || '[]');

    // Validation : Le professeur n'est plus obligatoire pour la création [5]
    if (!titleAr || !titleEn || !slug) {
      return NextResponse.json({ error: 'Champs requis manquants.' }, { status: 400 });
    }

    let imageUrl = null;

    if (imageFile && typeof imageFile !== 'string' && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `course-img-${Date.now()}-${imageFile.name.replace(/\s+/g, '_')}`;
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      await fs.mkdir(uploadDir, { recursive: true });
      const filepath = path.join(uploadDir, filename);
      await fs.writeFile(filepath, buffer);
      imageUrl = `/uploads/${filename}`;
    }

    // Préparation des relations optionnelles (Prévient l'erreur de chaîne vide "" de Prisma) [5]
    const relationData = {};
    if (instructorId && instructorId.trim() !== '') {
      relationData.instructor = { connect: { id: instructorId } };
    }
    if (categoryId && categoryId.trim() !== '') {
      relationData.category = { connect: { id: categoryId } };
    }

    // Création imbriquée dans PostgreSQL (sans priceStandard ni pricePremium sur le modèle principal)
    const course = await db.course.create({
      data: {
        slug,
        titleAr,
        titleEn,
        descriptionAr,
        descriptionEn,
        whatYouWillLearnAr,
        whatYouWillLearnEn,
        imageUrl,
        published,
        ...relationData, // Injection sécurisée des liaisons optionnelles [5]
        offers: {
          create: offersData.map(o => ({
            nameAr: o.nameAr,
            nameEn: o.nameEn,
            durationMonths: parseInt(o.durationMonths) || 1,
            price: parseFloat(o.price) || 0,
            oldPrice: o.oldPrice ? parseFloat(o.oldPrice) : null
          }))
        }
      }
    });

    return NextResponse.json({ success: true, course });
  } catch (error) {
    console.error('Course creation error:', error);
    return NextResponse.json({ error: 'Échec de la création du cours.' }, { status: 500 });
  }
}

export const GET = withAuth(withRole(['ADMIN'], getCourses));
export const POST = withAuth(withRole(['ADMIN'], createCourseHandler));