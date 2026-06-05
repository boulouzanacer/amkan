# Déploiement Amkan

## Web sur Vercel

- Root directory: `apps/web`
- Build command: `next build`
- Output: `.next`
- Variables obligatoires: voir `.env.example`

## Base MySQL

Railway, Render ou DigitalOcean conviennent. Utiliser une URL de connexion MySQL au format:

```text
mysql://USER:PASSWORD@HOST:PORT/DATABASE
```

Puis lancer:

```bash
npm run db:generate
npm run db:push
npm run db:seed
```

## Paiement

Le cahier des charges mentionne CASH et Stripe. Le scaffold garde les deux chemins: réservation manuelle en cash et endpoint Stripe à connecter avec les vraies clés.

## Mobile

```bash
npm run start --workspace @amkan/mobile
```

Configurer Firebase Cloud Messaging et Google Maps dans Expo avant publication.
