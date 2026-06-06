# Audit Premium Amkan

Ce document synthétise l'écart entre le scaffold initial et une plateforme professionnelle de location de vacances.

## Ajouts réalisés

- Assistant hôte multi-étapes avec autosave local, reprise, progression, validation, mode brouillon, aperçu instantané, description IA simulée, SEO et tarification intelligente.
- Modèle Prisma enrichi pour brouillons, règles tarifaires, calendrier iCal, collections favoris, KYC, sécurité, notifications, litiges, rapports, remboursements, factures et payouts.
- Calendrier hôte professionnel avec vue mois, prix par date, statuts, import/export iCal et fournisseurs Airbnb, Booking, Google.
- Dashboard hôte avancé avec revenus jour/semaine/mois/année, graphiques, occupation, conversion, vues, favoris, réservations et annulations.
- Recherche avancée avec suggestions, quartiers, points d'intérêt, filtres premium et carte avec prix.
- Favoris avancés avec collections, partage, notes privées et comparaison.
- Messagerie professionnelle avec réponses rapides, pièces jointes, traduction et canal temps réel prêt.
- Avis premium avec sous-notes et réponses hôtes.
- Centre notifications web et API.
- Sécurité compte: 2FA, historique de connexion et détection d'activité suspecte côté modèle.
- Vérification hôte KYC: pièce d'identité, selfie, téléphone, email et statuts.
- Panneau admin opérations: annonces à vérifier, KYC, signalements, litiges et commissions.
- SEO: sitemap dynamique, robots.txt, Open Graph et Schema.org.
- Mobile Expo enrichi: favoris, messages, notifications, host dashboard et carte.
- Performance/UX: skeleton loading, animations Framer Motion, image Next, routes dynamiques pour API Prisma, dark mode système de base.

## Services externes à brancher pour production réelle

- IA: connecter `/api/host/pricing` et l'assistant description à OpenAI ou autre fournisseur.
- Carte: remplacer le placeholder par Google Maps avec clustering et bounds search.
- Messagerie temps réel: connecter WebSocket, Pusher, Ably ou Socket.IO.
- Notifications: connecter Firebase Cloud Messaging, SMTP et SMS provider.
- Paiements: implémenter Stripe Connect, webhooks, refunds, payouts et PDF invoices.
- KYC: connecter Stripe Identity, Persona, Onfido ou fournisseur local.
- iCal: parser les flux importés et générer des événements réels par disponibilité.
- Multilingue: ajouter fichiers de traduction complets FR/EN/AR et routage localisé.

## Commandes de validation

```bash
npm run lint --workspace @amkan/web
npm run typecheck --workspace @amkan/web
npx tsc --noEmit -p apps/mobile/tsconfig.json
DATABASE_URL='mysql://user:password@localhost:3306/amkan' npx prisma validate
npm run build --workspace @amkan/web
```
