import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { withAuth } from '@/lib/middleware/withAuth';
import { withRole } from '@/lib/middleware/withRole';

// Supprimer un commentaire ciblé (Action réservée à l'ADMIN)
async function deleteCommentHandler(request, { params }) {
  try {
    const { id } = params;
    await db.comment.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Commentaire supprimé.' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Échec de la suppression.' }, { status: 500 });
  }
}

export const DELETE = withAuth(withRole(['ADMIN'], deleteCommentHandler));