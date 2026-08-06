import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword } from '@/lib/auth/bcrypt';
import { signAccessToken, signRefreshToken } from '@/lib/auth/jwt';

export async function POST(request) {
  try {
    const { fullName, email, password } = await request.json();

    if (!fullName || !email || !password) {
      return NextResponse.json({ error: 'Veuillez remplir tous les champs.' }, { status: 400 });
    }

    // Nettoyage de l'email lors de l'inscription également !
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
        role: 'STUDENT'
      }
    });

    const payload = { userId: user.id, email: user.email, role: user.role };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    const response = NextResponse.json({
      message: 'Utilisateur créé.',
      user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role }
    }, { status: 201 });

    response.cookies.set('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 900
    });

    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 604800
    });

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erreur interne.' }, { status: 500 });
  }
}