import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { withAuth } from '@/lib/middleware/withAuth';
import { withRole } from '@/lib/middleware/withRole';
import bcrypt from 'bcryptjs';

// 1. Lister les professeurs (GET)
async function getInstructorsHandler(request) {
  try {
    const instructors = await db.user.findMany({
      where: { role: 'INSTRUCTOR' }, // Filtrer uniquement les enseignants [5]
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, instructors });
  } catch (error) {
    console.error('Error fetching instructors:', error);
    return NextResponse.json({ error: 'Erreur lors du chargement des enseignants.' }, { status: 500 });
  }
}

// 2. Créer un professeur avec mot de passe haché (POST)
async function createInstructorHandler(request) {
  try {
    const body = await request.json();
    const { fullName, email, password } = body;

    if (!fullName || !email || !password) {
      return NextResponse.json({ error: 'Tous les champs obligatoires doivent être remplis.' }, { status: 400 });
    }

    // Vérifier l'unicité de l'adresse e-mail
    const existingUser = await db.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Un utilisateur avec cet e-mail existe déjà.' }, { status: 400 });
    }

    // Hachage sécurisé du mot de passe avant insertion
    const hashedPassword = await bcrypt.hash(password, 10);

    const newInstructor = await db.user.create({
      data: {
        fullName: fullName.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role: 'INSTRUCTOR' // Rôle strict [5]
      }
    });

    return NextResponse.json({ success: true, instructor: newInstructor });
  } catch (error) {
    console.error('Error creating instructor:', error);
    return NextResponse.json({ error: 'Erreur interne lors de la création du compte.' }, { status: 500 });
  }
}

// 3. Supprimer un compte enseignant (DELETE)
async function deleteUserHandler(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID de l’utilisateur manquant.' }, { status: 400 });
    }

    const userToDelete = await db.user.findUnique({ where: { id } });
    if (!userToDelete) {
      return NextResponse.json({ error: 'Utilisateur introuvable.' }, { status: 404 });
    }

    // Barrière de sécurité : Ne jamais autoriser la suppression d'un ADMIN depuis cette API
    if (userToDelete.role === 'ADMIN') {
      return NextResponse.json({ error: 'Action interdite : Impossible de supprimer un compte Administrateur.' }, { status: 403 });
    }

    await db.user.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Compte supprimé.' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Erreur lors du traitement de la suppression.' }, { status: 500 });
  }
}

export const GET = withAuth(withRole(['ADMIN'], getInstructorsHandler));
export const POST = withAuth(withRole(['ADMIN'], createInstructorHandler));
export const DELETE = withAuth(withRole(['ADMIN'], deleteUserHandler));