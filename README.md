# Amkan

Amkan est une marketplace web et mobile de location de vacances, construite comme une alternative originale aux plateformes du marché. Le projet inclut un frontend Next.js, une base MySQL avec Prisma, des API Next.js, une application Expo, et une documentation de déploiement.

## Stack

- Web: Next.js, React, TypeScript, Tailwind CSS
- Backend: API Routes Next.js
- Base de données: MySQL
- ORM: Prisma
- Auth: NextAuth prévu avec email, Google et Facebook
- Paiement: flux de réservation compatible Stripe, avec option paiement CASH/manuel
- Cartographie: Google Maps API
- Mobile: Expo / React Native
- Images: Firebase Storage ou Cloudinary
- Notifications: Firebase Cloud Messaging

## Installation

```bash
npm install
cp .env.example .env
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

Le web démarre sur `http://localhost:3000`.

## Structure

```text
apps/web      Application Next.js
apps/mobile   Application Expo
prisma        Schéma MySQL et seed
docs          Notes de déploiement
```

## Déploiement

1. Créer une base MySQL sur Railway, Render ou DigitalOcean.
2. Renseigner `DATABASE_URL` et les clés d'authentification dans Vercel.
3. Exécuter `prisma db push` puis `prisma db seed` depuis l'environnement de déploiement.
4. Déployer `apps/web` sur Vercel.
5. Déployer les services annexes, stockage images et notifications Firebase.

## Notes produit

Le projet ne réutilise ni nom, ni logo, ni textes protégés, ni interface exacte d'une plateforme existante. L'identité visuelle repose sur une palette propre à Amkan, avec une expérience claire, premium et responsive.

## Modules premium

Le dossier `docs/premium-audit.md` décrit les fonctionnalités avancées ajoutées: assistant hôte, calendrier professionnel, analytics, collections favoris, centre notifications, KYC, sécurité, admin opérations, SEO et mobile premium.
