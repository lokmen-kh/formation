import { NextResponse } from 'next/server';
import { verifyAccessToken } from '../auth/jwt';

export function withAuth(handler) {
  return async (request, context) => {
    // Vérification en priorité dans l'entête d'autorisation ou dans les cookies
    const authHeader = request.headers.get('authorization');
    const cookieToken = request.cookies.get('accessToken')?.value;
    const token = cookieToken || (authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null);

    if (!token) {
      return NextResponse.json({ error: 'Non autorisé : Jeton d’accès absent.' }, { status: 401 });
    }

    const decoded = verifyAccessToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Non autorisé : Jeton d’accès invalide ou expiré.' }, { status: 401 });
    }

    // Injection des données utilisateur dans l'objet de requête pour traitement ultérieur
    request.user = decoded;
    return handler(request, context);
  };
}