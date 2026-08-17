import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { withAuth } from '@/lib/middleware/withAuth';
import { withRole } from '@/lib/middleware/withRole';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export const dynamic = 'force-dynamic';

// Configuration du client de stockage Backblaze B2
const b2Client = new S3Client({
  endpoint: `https://${process.env.B2_ENDPOINT}`,
  region: process.env.B2_REGION || 'us-west-004',
  credentials: {
    accessKeyId: process.env.B2_APPLICATION_KEY_ID,
    secretAccessKey: process.env.B2_APPLICATION_KEY,
  },
});

// Utilitaire pour téléverser un fichier sur Backblaze B2
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

// Handler de mise à jour du cours (PUT)
async function updateCourseHandler(request, { params }) {
  try {
    const resolvedParams = await params;
    const targetId = resolvedParams.id || resolvedParams.courseId;

    if (!targetId) {
      return NextResponse.json({ error: 'Identifiant du cours manquant.' }, { status: 400 });
    }

    // 1. Récupération du cours existant
    const course = await db.course.findUnique({
      where: { id: targetId },
      include: { offers: true }
    });

    if (!course) {
      return NextResponse.json({ error: 'Cours introuvable dans la base de données.' }, { status: 404 });
    }

    // 2. Barrière de sécurité : l'utilisateur doit être l'instructeur assigné ou un administrateur
    if (request.user.role !== 'ADMIN' && course.instructorId !== request.user.userId) {
      return NextResponse.json({ error: 'Accès interdit.' }, { status: 403 });
    }

    // 3. Traitement des données reçues via le formulaire
    const formData = await request.formData();
    const slug = formData.get('slug');
    const titleAr = formData.get('titleAr');
    const titleEn = formData.get('titleEn');
    const descriptionAr = formData.get('descriptionAr');
    const descriptionEn = formData.get('descriptionEn');
    
    // Nettoyage de l'identifiant de catégorie
    const categoryIdRaw = formData.get('categoryId');
    const categoryId = (categoryIdRaw && categoryIdRaw !== 'null' && categoryIdRaw !== 'undefined' && categoryIdRaw !== '') 
      ? categoryIdRaw 
      : null;

    const published = formData.get('published') === 'true';
    const imageFile = formData.get('image');
    const introVideoFile = formData.get('introVideo');
    const offersJson = formData.get('offers');

    let imageUrl = course.imageUrl;
    let videoUrl = course.videoUrl;

    // 4. Téléversement de la nouvelle image de couverture sur B2 si présente
    if (imageFile && typeof imageFile !== 'string' && imageFile.size > 0) {
      imageUrl = await uploadToB2(imageFile, 'course-covers');
    }

    // 5. Téléversement de la nouvelle vidéo d'introduction sur B2 si présente
    if (introVideoFile && typeof introVideoFile !== 'string' && introVideoFile.size > 0) {
      videoUrl = await uploadToB2(introVideoFile, 'course-videos');
    }

    // 6. Mise à jour de l'enregistrement principal du cours
    const updatedCourse = await db.course.update({
      where: { id: targetId },
      data: {
        slug: slug ? slug.trim() : course.slug,
        titleAr: titleAr ? titleAr.trim() : course.titleAr,
        titleEn: titleEn ? titleEn.trim() : course.titleEn,
        descriptionAr: descriptionAr !== null ? descriptionAr.trim() : course.descriptionAr,
        descriptionEn: descriptionEn !== null ? descriptionEn.trim() : course.descriptionEn,
        categoryId,
        published,
        imageUrl,
        videoUrl,
      },
    });

    // 7. Synchronisation et mise à jour dynamique des offres d'abonnements
    if (offersJson) {
      const incomingOffers = JSON.parse(offersJson);
      const currentOffers = course.offers || [];
      const keepOfferIds = [];

      for (const offerData of incomingOffers) {
        const durationMonths = parseInt(offerData.durationMonths) || 1;
        const price = parseFloat(offerData.price) || 0;
        const oldPrice = offerData.oldPrice ? parseFloat(offerData.oldPrice) : null;

        let existingOffer = null;

        // Recherche par ID réel
        if (offerData.id && typeof offerData.id === 'string' && !offerData.id.startsWith('temp-')) {
          existingOffer = currentOffers.find((o) => o.id === offerData.id);
        }

        // Recherche par correspondance de nom si aucun ID n'est disponible
        if (!existingOffer) {
          existingOffer = currentOffers.find(
            (o) => o.nameEn === offerData.nameEn && o.durationMonths === durationMonths
          );
        }

        if (existingOffer) {
          const updated = await db.offer.update({
            where: { id: existingOffer.id },
            data: {
              nameAr: offerData.nameAr,
              nameEn: offerData.nameEn,
              durationMonths,
              price,
              oldPrice,
            },
          });
          keepOfferIds.push(updated.id);
        } else {
          const created = await db.offer.create({
            data: {
              courseId: targetId,
              nameAr: offerData.nameAr,
              nameEn: offerData.nameEn,
              durationMonths,
              price,
              oldPrice,
            },
          });
          keepOfferIds.push(created.id);
        }
      }

      // Suppression des offres obsolètes sans inscription active
      const offersToDelete = currentOffers.filter((o) => !keepOfferIds.includes(o.id));

      for (const oldOffer of offersToDelete) {
        const enrollmentsCount = await db.enrollment.count({
          where: { offerId: oldOffer.id },
        });

        if (enrollmentsCount === 0) {
          await db.offer.delete({
            where: { id: oldOffer.id },
          });
        } else {
          console.warn(`Impossible de supprimer l'offre ${oldOffer.id} car des étudiants y sont inscrits.`);
        }
      }
    }

    return NextResponse.json({ success: true, course: updatedCourse });
  } catch (error) {
    console.error('Error updating course:', error);
    return NextResponse.json({ error: 'Erreur lors de la mise à jour du cours.' }, { status: 500 });
  }
}

export const PUT = withAuth(withRole(['ADMIN', 'INSTRUCTOR'], updateCourseHandler));