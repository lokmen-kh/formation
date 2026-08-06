import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const categories = await db.category.findMany({
      orderBy: { nameEn: 'asc' }
    });
    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Échec de la récupération des catégories :', error);
    return NextResponse.json({ error: 'Erreur interne du serveur.' }, { status: 500 });
  }
}