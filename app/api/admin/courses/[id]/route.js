import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { withAuth } from '@/lib/middleware/withAuth';
import { withRole } from '@/lib/middleware/withRole';
import fs from 'fs/promises';
import path from 'path';

// Modifier un cours (PUT)
async function updateCourseHandler(request, { params }) {
  try {
    // CORRECTION : Résoudre la promesse params sous Next.js 15+ [1]
    const { id } = await params;
    
    const formData = await request.formData();
    const slug = formData.get('slug');
    const titleAr = formData.get('titleAr');
    const titleEn = formData.get('titleEn');
    const descriptionAr = formData.get('descriptionAr');
    const descriptionEn = formData.get('descriptionEn');
    const whatYouWillLearnAr = formData.get('whatYouWillLearnAr');
    const whatYouWillLearnEn = formData.get('whatYouWillLearnEn');
    
    // Récupération des clés optionnelles
    const instructorId = formData.get('instructorId') || '';
    const categoryId = formData.get('categoryId') || '';
    const published = formData.get('published') === 'true';

    const imageFile = formData.get('image');
    const offersData = JSON.parse(formData.get('offers') || '[]');

    const currentCourse = await db.course.findUnique({ where: { id } });
    if (!currentCourse) {
      return NextResponse.json({ error: 'Cours introuvable.' }, { status: 404 });
    }

    let imageUrl = currentCourse.imageUrl;

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

    // 1. ANNIHILER LA DUPLICATION : On supprime d'abord TOUS les anciens abonnements liés [2]
    await db.offer.deleteMany({ where: { courseId: id } });

    // 2. Mise à jour de la table Cours avec gestion sécurisée des relations optionnelles [5]
    const updated = await db.course.update({
      where: { id },
      data: {
        slug,
        titleAr,
        titleEn,
        descriptionAr,
        descriptionEn,
        whatYouWillLearnAr,
        whatYouWillLearnEn,
        published,
        imageUrl,
        
        // CORRECTION : Lier l'enseignant uniquement si fourni et non-vide, sinon le déconnecter [5]
        instructor: (instructorId && instructorId.trim() !== "") 
          ? { connect: { id: instructorId } } 
          : { disconnect: true },
          
        // Lier la catégorie uniquement si fournie et non-vide, sinon la déconnecter [5]
        category: (categoryId && categoryId.trim() !== "") 
          ? { connect: { id: categoryId } } 
          : { disconnect: true },
        
        // Recréer les offres d'abonnements dynamiques de manière propre [2]
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

    return NextResponse.json({ success: true, course: updated });
  } catch (error) {
    console.error('Update course error:', error);
    return NextResponse.json({ error: 'Échec de la modification du cours.' }, { status: 500 });
  }
}

// Supprimer un cours (DELETE)
async function deleteCourseHandler(request, { params }) {
  try {
    const { id } = await params;
    await db.course.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Cours supprimé.' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Échec de la suppression.' }, { status: 500 });
  }
}

export const PUT = withAuth(withRole(['ADMIN'], updateCourseHandler));
export const DELETE = withAuth(withRole(['ADMIN'], deleteCourseHandler));