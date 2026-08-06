import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { withAuth } from '@/lib/middleware/withAuth';
import { withRole } from '@/lib/middleware/withRole';

async function approveHandler(request, { params }) {
  try {
    // FIX : Attendre params pour Next.js 15+
    const { id } = await params;

    const enrollment = await db.enrollment.findUnique({ 
      where: { id },
      include: { offer: true } // Inclure l'offre pour connaître la durée
    });

    if (!enrollment) {
      return NextResponse.json({ error: 'Inscription introuvable.' }, { status: 404 });
    }

    // Calcul de la date d'expiration dynamique [2]
    const expiresAt = new Date();
    if (enrollment.offer) {
      // Si une offre dynamique est liée, on utilise sa durée en mois
      expiresAt.setMonth(expiresAt.getMonth() + enrollment.offer.durationMonths);
    } else {
      // Fallback si c'est un ancien plan legacy
      const daysToAdd = enrollment.planType === 'PREMIUM' ? 365 : 30;
      expiresAt.setDate(expiresAt.getDate() + daysToAdd);
    }

    const updated = await db.enrollment.update({
      where: { id },
      data: {
        status: 'APPROVED',
        expiresAt
      }
    });

    return NextResponse.json({ success: true, enrollment: updated });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erreur interne.' }, { status: 500 });
  }
}

export const POST = withAuth(withRole(['ADMIN'], approveHandler));