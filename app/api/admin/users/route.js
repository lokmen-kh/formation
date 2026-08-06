import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword } from '@/lib/auth/bcrypt';
import { withAuth } from '@/lib/middleware/withAuth';
import { withRole } from '@/lib/middleware/withRole';

// Lister tous les utilisateurs
async function getUsers() {
  try {
    const users = await db.user.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json({ users });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}

// Créer un compte professeur (Action réservée à l'ADMIN)
async function createInstructor(request) {
  try {
    const { fullName, email, password } = await request.json();

    if (!fullName || !email || !password) {
      return NextResponse.json({ error: 'Veuillez remplir tous les champs.' }, { status: 400 });
    }

    const sanitizedEmail = email.trim().toLowerCase();

    const existingUser = await db.user.findUnique({ where: { email: sanitizedEmail } });
    if (existingUser) {
      return NextResponse.json({ error: 'Cette adresse email est déjà utilisée.' }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);
    const user = await db.user.create({
      data: {
        fullName,
        email: sanitizedEmail,
        password: hashedPassword,
        role: 'INSTRUCTOR' // Forcé en tant qu'enseignant
      }
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Échec de la création du compte.' }, { status: 500 });
  }
}

export const GET = withAuth(withRole(['ADMIN'], getUsers));
export const POST = withAuth(withRole(['ADMIN'], createInstructor));