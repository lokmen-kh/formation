import crypto from 'crypto';

export class BunnyStrategy {
  constructor() {
    this.apiKey = process.env.BUNNY_API_KEY;
    this.libraryId = process.env.BUNNY_LIBRARY_ID;
    this.cdnHostname = process.env.BUNNY_CDN_HOSTNAME;
  }

  // Téléversement asynchrone en deux phases vers Bunny Stream
  async uploadVideo(fileBuffer, title) {
    if (!this.apiKey || !this.libraryId) {
      throw new Error('Identifiants Bunny Stream manquants dans le fichier d’environnement.');
    }

    // Étape A : Création de la fiche média pour obtenir le videoID (guid)
    const createUrl = `https://video.bunnycdn.com/library/${this.libraryId}/videos`;
    const createRes = await fetch(createUrl, {
      method: 'POST',
      headers: {
        'AccessKey': this.apiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ title })
    });

    const createData = await createRes.json();
    if (!createRes.ok || !createData.guid) {
      throw new Error(`Échec de génération de la fiche média Bunny : ${JSON.stringify(createData)}`);
    }

    const videoId = createData.guid;

    // Étape B : Upload du flux binaire brut vers le média alloué
    const uploadUrl = `https://video.bunnycdn.com/library/${this.libraryId}/videos/${videoId}`;
    const uploadRes = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'AccessKey': this.apiKey,
        'Content-Type': 'application/octet-stream'
      },
      body: fileBuffer
    });

    const uploadData = await uploadRes.json();
    if (!uploadRes.ok || !uploadData.success) {
      throw new Error(`Échec du transfert binaire vers Bunny : ${JSON.stringify(uploadData)}`);
    }

    return videoId; // Retourne l'ID unique de lecture
  }

  // Signature d'URL pour sécuriser le visionnage (valide 1 heure)
  generatePlaybackUrl(videoId) {
    if (!this.apiKey || !this.libraryId) {
      throw new Error('Identifiants requis absents pour signer l’URL.');
    }

    const expiration = Math.floor(Date.now() / 1000) + 3600; // +1h
    
    // Hash cryptographique : SHA256(apiKey + videoId + expiration)
    const hash = crypto
      .createHash('sha256')
      .update(this.apiKey + videoId + expiration)
      .digest('hex');

    // Retourne le player d'intégration sécurisé (iframe)
    return `https://iframe.mediadelivery.net/embed/${this.libraryId}/${videoId}?token=${hash}&expires=${expiration}`;
  }
}