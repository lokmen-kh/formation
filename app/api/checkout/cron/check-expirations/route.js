import { NextResponse } from 'next/server';
import { expireEnrollments } from '@/lib/enrollment/expireEnrollments';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const secretParam = searchParams.get('secret');
    const authHeader = request.headers.get('authorization');
    
    const cronSecret = process.env.CRON_SECRET || 'secret_cron_par_defaut_robuste';
    const providedSecret = secretParam || (authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null);

    // Blocage si le secret fourni ne correspond pas à la clé d'environnement
    if (!providedSecret || providedSecret !== cronSecret) {
      return NextResponse.json({ error: 'Non autorisé : Jeton Cron invalide.' }, { status: 401 });
    }

    const result = await expireEnrollments();

    return NextResponse.json({
      success: true,
      message: 'Traitement des expirations effectué avec succès.',
      expiredCount: result.count
    });
  } catch (error) {
    console.error('Échec de l’exécution du Cron Job d’expiration :', error);
    return NextResponse.json({ error: 'Erreur interne du serveur.' }, { status: 500 });
  }
}