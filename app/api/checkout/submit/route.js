import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { withAuth } from '@/lib/middleware/withAuth';
import fs from 'fs/promises';
import path from 'path';

async function checkoutHandler(request) {
  try {
    const formData = await request.formData();
    const courseId = formData.get('courseId');
    const paymentMethod = formData.get('paymentMethod'); // 'CCP' ou 'SLICKPAY'
    
    // Récupération bivalente
    const offerId = formData.get('offerId');
    const planType = formData.get('planType'); // 'STANDARD', 'PREMIUM', 'yearly', 'monthly'

    // Validation des paramètres obligatoires
    if (!courseId || !paymentMethod || (!offerId && !planType)) {
      return NextResponse.json({ error: 'Paramètres d’achat manquants ou invalides.' }, { status: 400 });
    }

    // Récupération du cours
    const course = await db.course.findUnique({ where: { id: courseId } });
    if (!course) {
      return NextResponse.json({ error: 'Cours introuvable.' }, { status: 404 });
    }

    // Évaluation du tarif et résolution de l'Enum PlanType requis par Prisma
    let price = 0;
    let resolvedPlanType = 'STANDARD'; // Valeur par défaut pour l'Enum PlanType (STANDARD ou PREMIUM)

    if (offerId) {
      // Si une offre d'abonnement dynamique est sélectionnée [2]
      const offer = await db.offer.findUnique({ where: { id: offerId } });
      if (!offer || offer.courseId !== courseId) {
        return NextResponse.json({ error: 'Offre d’abonnement introuvable pour ce cours.' }, { status: 404 });
      }
      price = offer.price;
      // Pour les offres dynamiques, on utilise par défaut la valeur STANDARD de l'Enum
      resolvedPlanType = 'STANDARD'; 
    } else {
      // Fallback de secours (ancien modèle de plans génériques)
      if (planType === 'PREMIUM') {
        price = course.pricePremium;
        resolvedPlanType = 'PREMIUM';
      } else if (planType === 'yearly') {
        price = course.priceYearly || 0;
        resolvedPlanType = 'STANDARD';
      } else if (planType === 'monthly') {
        price = course.priceMonthly || 0;
        resolvedPlanType = 'STANDARD';
      } else {
        price = course.priceStandard || 0;
        resolvedPlanType = 'STANDARD';
      }
    }

    // Vérification de l'existence d'une inscription active approuvée
    const existingEnrollment = await db.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: request.user.userId,
          courseId: courseId,
        },
      },
    });

    if (existingEnrollment && existingEnrollment.status === 'APPROVED') {
      return NextResponse.json({ error: 'Vous possédez déjà un accès actif à ce cours.' }, { status: 400 });
    }

    // 1. SCÉNARIO : Paiement manuel par virement CCP
    if (paymentMethod === 'CCP') {
      const receiptFile = formData.get('receipt');
      if (!receiptFile || typeof receiptFile === 'string') {
        return NextResponse.json({ error: 'Le téléversement du reçu est obligatoire pour le paiement CCP.' }, { status: 400 });
      }

      // Écriture du fichier téléversé dans le répertoire public/uploads
      const bytes = await receiptFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const filename = `${Date.now()}-${receiptFile.name.replace(/\s+/g, '_')}`;
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      
      // Assurer la création du dossier de destination
      await fs.mkdir(uploadDir, { recursive: true });
      const filepath = path.join(uploadDir, filename);
      await fs.writeFile(filepath, buffer);

      const receiptUrl = `/uploads/${filename}`;

      // Enregistrement de l'inscription en attente (status: PENDING)
      const enrollment = await db.enrollment.upsert({
        where: {
          userId_courseId: {
            userId: request.user.userId,
            courseId: courseId,
          },
        },
        update: {
          planType: resolvedPlanType, // Valeur Enum valide ('STANDARD' ou 'PREMIUM')
          offerId: offerId || null,   // Enregistre l'ID d'offre s'il est configuré dans votre BDD [2]
          status: 'PENDING',
          receiptUrl,
        },
        create: {
          userId: request.user.userId,
          courseId,
          planType: resolvedPlanType, // Valeur Enum valide ('STANDARD' ou 'PREMIUM')
          offerId: offerId || null,   // Enregistre l'ID d'offre s'il est configuré dans votre BDD [2]
          status: 'PENDING',
          receiptUrl,
        },
      });

      return NextResponse.json({ success: true, method: 'CCP', enrollment });
    }

    // 2. SCÉNARIO : Paiement en ligne direct (SlickPay / SATIM)
    if (paymentMethod === 'SLICKPAY') {
      const SLICKPAY_KEY = process.env.SLICK_PAY_PUBLIC_KEY || '54|BZ7F6N4KwSD46GEXToOv3ZBpJpf7WVxnBzK5cOE6';
      const SLICKPAY_URL = process.env.NODE_ENV === 'production'
        ? 'https://prodapi.slick-pay.com/api/v2/users/invoices'
        : 'https://devapi.slick-pay.com/api/v2/users/invoices';

      // URL de redirection après traitement SATIM
      const origin = request.headers.get('origin') || 'http://localhost:3000';
      const redirectBackUrl = `${origin}/checkout/pending?courseId=${courseId}`;

      // Appel à la passerelle SlickPay
      const slickPayResponse = await fetch(SLICKPAY_URL, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SLICKPAY_KEY}`,
        },
        body: JSON.stringify({
          amount: price,
          url: redirectBackUrl,
          items: [
            {
              name: `Accès cours : ${course.titleEn} (${offerId ? `Offre: ${offerId}` : resolvedPlanType})`,
              price: price,
              quantity: 1,
            }
          ]
        }),
      });

      const data = await slickPayResponse.json();

      if (!slickPayResponse.ok || !data.success) {
        console.error('Échec SlickPay :', data);
        return NextResponse.json({ error: 'La passerelle de paiement en ligne est actuellement indisponible.' }, { status: 502 });
      }

      // Enregistrement de l'inscription initiale en attente de la confirmation SATIM
      await db.enrollment.upsert({
        where: {
          userId_courseId: {
            userId: request.user.userId,
            courseId: courseId,
          },
        },
        update: {
          planType: resolvedPlanType, // Valeur Enum valide ('STANDARD' ou 'PREMIUM')
          offerId: offerId || null,   // Enregistre l'ID d'offre s'il est configuré dans votre BDD [2]
          status: 'PENDING',
        },
        create: {
          userId: request.user.userId,
          courseId,
          planType: resolvedPlanType, // Valeur Enum valide ('STANDARD' ou 'PREMIUM')
          offerId: offerId || null,   // Enregistre l'ID d'offre s'il est configuré dans votre BDD [2]
          status: 'PENDING',
        },
      });

      return NextResponse.json({ success: true, method: 'SLICKPAY', paymentUrl: data.data.url });
    }

    return NextResponse.json({ error: 'Mode de paiement invalide.' }, { status: 400 });
  } catch (error) {
    console.error('Checkout validation error:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur lors du traitement.' }, { status: 500 });
  }
}

export const POST = withAuth(checkoutHandler);