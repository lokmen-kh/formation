import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ message: 'Déconnexion effectuée.' });
  // Expiration immédiate des jetons d'accès
  response.cookies.set('accessToken', '', { maxAge: 0 });
  response.cookies.set('refreshToken', '', { maxAge: 0 });
  return response;
}