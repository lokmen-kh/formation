import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export const dynamic = 'force-dynamic';

// Initialisation du client Backblaze B2 (S3 compatible)
const b2Client = new S3Client({
  endpoint: `https://${process.env.B2_ENDPOINT}`,
  region: process.env.B2_REGION || 'us-west-004',
  credentials: {
    accessKeyId: process.env.B2_APPLICATION_KEY_ID,
    secretAccessKey: process.env.B2_APPLICATION_KEY,
  },
});

export async function GET(request, { params }) {
  try {
    const resolvedParams = await params;
    
    // Puisque le dossier est nommé [slug], Next.js injecte la valeur de l'URL dans 'slug'
    const target = resolvedParams.slug || resolvedParams.id || resolvedParams.courseId;

    if (!target) {
      return NextResponse.json({ error: 'Identifiant ou slug du cours manquant.' }, { status: 400 });
    }

    // Recherche flexible : on cherche si 'target' correspond à l'ID ou au SLUG du cours
    const course = await db.course.findFirst({
      where: {
        OR: [
          { id: target },
          { slug: target }
        ]
      },
      select: { videoUrl: true }
    });

    if (!course || !course.videoUrl) {
      return NextResponse.json({ error: "Vidéo d'introduction introuvable." }, { status: 404 });
    }

    // Extraction propre de la clé de fichier (Key)
    let key = '';
    try {
      const urlObj = new URL(course.videoUrl);
      key = urlObj.pathname.startsWith('/') ? urlObj.pathname.substring(1) : urlObj.pathname;
    } catch (urlError) {
      console.error("Format d'URL de vidéo d'introduction invalide :", urlError);
      return NextResponse.json({ playbackUrl: course.videoUrl }); // Fallback
    }

    // Génération de l'URL signée temporaire (valide pendant 1 heure)
    const command = new GetObjectCommand({
      Bucket: process.env.B2_BUCKET_NAME,
      Key: key,
    });

    const signedUrl = await getSignedUrl(b2Client, command, { expiresIn: 3600 });

    return NextResponse.json({ success: true, playbackUrl: signedUrl });
  } catch (error) {
    console.error('Error generating signed URL for intro video:', error);
    return NextResponse.json({ error: "Erreur lors de la génération de l'accès à la vidéo." }, { status: 500 });
  }
}