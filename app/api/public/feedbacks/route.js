import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { withAuth } from '@/lib/middleware/withAuth';

// Lister les 10 derniers avis utilisateurs réels
export async function GET() {
  try {
    const feedbacks = await db.feedback.findMany({
      include: {
        user: { select: { fullName: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    // Formatage des données de base de données pour correspondre à l'interface
    const mappedFeedbacks = feedbacks.map(f => ({
      name: f.user.fullName,
      avatar: f.user.fullName.charAt(0).toUpperCase(),
      role: "Membre de la plateforme",
      quote: f.content,
      rating: f.rating
    }));

    return NextResponse.json({ feedbacks: mappedFeedbacks });
  } catch (error) {
    console.error('Échec de la récupération des avis :', error);
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}

// Ajouter un avis global sur la plateforme (Action sécurisée)
async function submitFeedbackHandler(request) {
  try {
    const { content, rating } = await request.json();

    if (!content) {
      return NextResponse.json({ error: 'Le contenu de l’avis est obligatoire.' }, { status: 400 });
    }

    const feedback = await db.feedback.create({
      data: {
        content,
        rating: parseInt(rating) || 5,
        userId: request.user.userId
      }
    });

    return NextResponse.json({ success: true, feedback });
  } catch (error) {
    console.error('Échec de l’enregistrement de l’avis :', error);
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}

export const POST = withAuth(submitFeedbackHandler);