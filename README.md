This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or# Application de Pointage - Next.js

Une application moderne de gestion des pointages avec géolocalisation, développée avec Next.js 14, Clerk, Prisma et Supabase.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 🌟 Fonctionnalités

- ✅ Authentification sécurisée avec Clerk
- 📍 Pointage avec géolocalisation
- 📊 Statistiques de temps de travail
- 📅 Historique des pointages
- 🕒 Suivi des quotas horaires (173.3h/mois)
- 📱 Interface responsive (mobile & desktop)
- 🗺️ Visualisation des pointages sur carte
- 👥 Gestion des rôles (Admin, Manager, RH, Employé)

## 🛠️ Technologies

- **Frontend:**
  - Next.js 14 (App Router)
  - React
  - TailwindCSS
  - DaisyUI
  - Leaflet (cartes)

- **Backend:**
  - Prisma (ORM)
  - Supabase (PostgreSQL)
  - Clerk (Authentification)

## 📋 Prérequis

- Node.js 18+
- npm ou yarn
- Une base de données PostgreSQL
- Un compte Clerk
- Un compte Supabase

## 🚀 Installation

1. **Cloner le repository**
```bash
git clone https://github.com/votre-username/pointage-app.git
cd pointage-app
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration des variables d'environnement**
```bash
cp .env.example .env
```
Remplissez les variables suivantes dans le fichier `.env`:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=votre_clerk_publishable_key
CLERK_SECRET_KEY=votre_clerk_secret_key
DATABASE_URL=votre_url_supabase_avec_pgbouncer
DIRECT_URL=votre_url_supabase_direct
```

4. **Initialiser la base de données**
```bash
npx prisma generate
npx prisma db push
```

5. **Lancer l'application**
```bash
npm run dev
```

## 📱 Utilisation

1. **Connexion**
   - Utilisez votre compte ou créez-en un nouveau
   - Les rôles sont attribués par l'administrateur

2. **Pointage**
   - Cliquez sur "Pointer" dans le menu
   - Autorisez la géolocalisation
   - Sélectionnez le type de pointage (Arrivée/Départ)

3. **Consultation**
   - Visualisez vos statistiques sur le dashboard
   - Consultez l'historique détaillé
   - Suivez votre quota horaire mensuel

## 🔒 Sécurité

- Authentification sécurisée via Clerk
- Données chiffrées en transit
- Validation des pointages par géolocalisation
- Gestion des rôles et permissions

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Forkez le projet
2. Créez une branche (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Pushez vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 License

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👥 Auteurs

- **Votre Nom** - *Développement initial* - [VotreGithub](https://github.com/jdtkd)

## 🙏 Remerciements

- L'équipe Clerk pour leur excellent service d'authentification
- La communauté Next.js pour leur documentation détaillée
- L'équipe Supabase pour leur plateforme performante
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.


version web:






![ version web](<Capture d’écran 2025-02-08 223345.png>) ![version mobil](<Capture d’écran 2025-02-08 223444.png>) ![version mobil](<Capture d’écran 2025-02-08 223215.png>)