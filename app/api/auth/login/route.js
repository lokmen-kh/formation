import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { comparePassword } from '@/lib/auth/bcrypt';
import { signAccessToken, signRefreshToken } from '@/lib/auth/jwt';

// Force cette route à être dynamique - ÉVITE LE PRÉ-RENDU
export const dynamic = 'force-dynamic';

// Optionnel : Désactiver la mise en cache
export const fetchCache = 'force-no-store';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email et mot de passe requis.' }, { status: 400 });
    }

    // Nettoyage de l'email (Trimming + conversion en minuscules obligatoire)
    const sanitizedEmail = email.trim().toLowerCase();

    const user = await db.user.findUnique({ where: { email: sanitizedEmail } });
    if (!user) {
      return NextResponse.json({ error: 'Identifiants invalides.' }, { status: 401 });
    }

    const match = await comparePassword(password, user.password);
    if (!match) {
      return NextResponse.json({ error: 'Identifiants invalides.' }, { status: 401 });
    }

    const payload = { userId: user.id, email: user.email, role: user.role };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    const response = NextResponse.json({
      message: 'Authentification réussie.',
      user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role }
    });

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