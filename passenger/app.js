const path = require('path');
const next = require('next');

// Détection de l'environnement de production
const dev = process.env.NODE_ENV !== 'production';

// Configuration de Next.js en lui indiquant de remonter d'un niveau
// pour trouver la racine réelle du projet (.next, public, packages.json...)
const app = next({
  dev,
  dir: path.join(__dirname, '..')
});

const handle = app.getRequestHandler();

// Amorce de l'application Next.js de manière asynchrone
const preparePromise = app.prepare()
  .then(() => {
    console.log('[Passenger] Next.js préparé avec succès.');
  })
  .catch((err) => {
    console.error('[Passenger] Erreur critique lors de la préparation de Next.js :', err);
    process.exit(1);
  });

// Exportation de la fonction gestionnaire pour Phusion Passenger
module.exports = function (req, res) {
  preparePromise
    .then(() => {
      handle(req, res);
    })
    .catch((err) => {
      console.error('[Passenger] Erreur lors du traitement de la requête :', err);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Erreur Interne du Serveur : Next.js n\'a pas pu traiter la demande.');
    });
};