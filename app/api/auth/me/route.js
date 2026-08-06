import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { withAuth } from '@/lib/middleware/withAuth';

async function meHandler(request) {
  try {
    const user = await db.user.findUnique({
      where: { id: request.user.userId },
      select: { id: true, email: true, fullName: true, role: true, createdAt: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur introuvable.' }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erreur interne.' }, { status: 500 });
  }
}

export const GET = withAuth(meHandler);