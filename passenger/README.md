# Configuration du Cron Job d'expiration (cPanel)

Pour automatiser la détection et la suspension des abonnements arrivés à échéance, vous devez configurer une tâche planifiée (Cron Job) depuis votre panneau de contrôle cPanel.

Cette tâche interrogera de manière sécurisée la route d'API `/api/cron/check-expirations` configurée dans votre application Next.js.

## Étape 1 : Définir votre clé secrète CRON
Assurez-vous que la variable `CRON_SECRET` est correctement renseignée dans votre fichier `.env` de production :
```env
CRON_SECRET="votre_cle_secrete_ultra_robuste_123"