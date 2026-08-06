import { NextResponse } from 'next/server';

export function withRole(roles, handler) {
  return async (request, context) => {
    if (!request.user) {
      return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });
    }

    if (!roles.includes(request.user.role)) {
      return NextResponse.json({ error: 'Accès interdit : Privilèges insuffisants.' }, { status: 403 });
    }

    return handler(request, context);
  };
}