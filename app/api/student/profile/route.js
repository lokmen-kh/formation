import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { withAuth } from '@/lib/middleware/withAuth';

// 1. Lire les informations de profil de l'étudiant connecté (GET)
async function getProfileHandler(request) {
  try {
    const user = await db.user.findUnique({
      where: { id: request.user.userId },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        educationLevel: true,
        birthDate: true,
        jobStatus: true,
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur introuvable.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Error loading profile:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur.' }, { status: 500 });
  }
}

// 2. Mettre à jour les informations complexes du profil (PUT)
async function updateProfileHandler(request) {
  try {
    const body = await request.json();
    const { fullName, phone, educationLevel, birthDate, jobStatus } = body;

    // Mise à jour sécurisée dans la table User [5]
    const updatedUser = await db.user.update({
      where: { id: request.user.userId },
      data: {
        fullName: fullName?.trim(),
        phone: phone?.trim(),
        educationLevel: educationLevel?.trim(),
        // Conversion sécurisée de la date de naissance pour PostgreSQL
        birthDate: birthDate ? new Date(birthDate) : null,
        jobStatus: jobStatus, // 'STUDENT' ou 'EMPLOYEE'
      }
    });

    return NextResponse.json({ 
      success: true, 
      user: {
        id: updatedUser.id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        phone: updatedUser.phone,
        educationLevel: updatedUser.educationLevel,
        birthDate: updatedUser.birthDate,
        jobStatus: updatedUser.jobStatus
      }
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Échec de l’enregistrement des modifications.' }, { status: 500 });
  }
}

export const GET = withAuth(getProfileHandler);
export const PUT = withAuth(updateProfileHandler);