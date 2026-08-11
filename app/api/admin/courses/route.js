import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { withAuth } from '@/lib/middleware/withAuth';
import { withRole } from '@/lib/middleware/withRole';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs/promises';
import path from 'path';

// Force cette route à être dynamique
export const dynamic = 'force-dynamic';

// Initialisation du client B2 S3
const b2Client = new S3Client({
  endpoint: `https://${process.env.B2_ENDPOINT}`,
  region: process.env.B2_REGION || 'us-west-004',
  credentials: {
    accessKeyId: process.env.B2_APPLICATION_KEY_ID,
    secretAccessKey: process.env.B2_APPLICATION_KEY,
  },
});

// Aide au téléversement vers Backblaze B2 [2]
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
    console.error('Fetch courses error:', error);
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}

// Créer un cours (Avec professeur optionnel et upload d'intro vidéo vers Backblaze B2) [2, 5]
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
    const introVideoFile = formData.get('introVideo'); // Fichier vidéo d'intro [2]

    // Récupération et conversion du tableau d'offres envoyé en JSON [2]
    const offersData = JSON.parse(formData.get('offers') || '[]');

    if (!titleAr || !titleEn || !slug) {
      return NextResponse.json({ error: 'Champs requis manquants.' }, { status: 400 });
    }

    let imageUrl = null;
    let videoUrl = null; // Nommé "videoUrl" pour correspondre exactement à votre schéma Prisma

    // Téléverser l'image et l'intro vidéo vers Backblaze B2 [2]
    if (imageFile && typeof imageFile !== 'string' && imageFile.size > 0) {
      imageUrl = await uploadToB2(imageFile, 'covers');
    }
    if (introVideoFile && typeof introVideoFile !== 'string' && introVideoFile.size > 0) {
      videoUrl = await uploadToB2(introVideoFile, 'intro-videos');
    }

    // Préparation des relations optionnelles [5]
    const relationData = {};
    if (instructorId && instructorId.trim() !== '') {
      relationData.instructor = { connect: { id: instructorId } };
    }
    if (categoryId && categoryId.trim() !== '') {
      relationData.category = { connect: { id: categoryId } };
    }

    // Création imbriquée Prisma
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
        videoUrl, // Enregistré en BDD
        published,
        ...relationData, // Injection des liaisons optionnelles [5]
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