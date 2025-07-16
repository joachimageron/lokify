# Lokify Frontend 🌐

Application frontend moderne pour la réservation de casiers Lokify, construite avec Next.js 15 et React 19.

## 📋 Description

Le frontend Lokify offre une interface utilisateur intuitive et moderne pour la gestion des réservations de casiers. Construit avec les dernières technologies React et Next.js, il propose une expérience utilisateur fluide avec un design responsive et des animations élégantes.

## ✨ Fonctionnalités

### 🔐 Authentification

- Interface de connexion et inscription
- Gestion des sessions utilisateur
- Réinitialisation de mot de passe
- Vérification d'email avec retour visuel

### 📦 Réservation de casiers

- Visualisation interactive des casiers disponibles
- Sélection multiple de casiers
- Calendrier intégré pour choisir date et heure
- Interface de réservation en temps réel

### 🎨 Interface utilisateur

- Design moderne avec Tailwind CSS
- Composants HeroUI pour une cohérence visuelle
- Animations fluides avec Framer Motion
- Thème responsive adaptatif
- Navigation intuitive

### 🔄 Gestion des états

- React Query pour la gestion des données serveur
- Contexte d'authentification global
- Gestion optimiste des mises à jour
- Cache intelligent des données

## 🛠️ Technologies

- **Next.js 15** - Framework React full-stack
- **React 19** - Bibliothèque UI moderne
- **TypeScript** - Langage de programmation typé
- **Tailwind CSS** - Framework CSS utilitaire
- **HeroUI** - Composants UI modernes
- **Framer Motion** - Animations et transitions
- **React Query** - Gestion des états serveur
- **Heroicons** - Icônes SVG

## 🚀 Installation

### Prérequis

- Node.js 18+
- pnpm (gestionnaire de paquets)
- API Lokify en cours d'exécution

### Configuration

1. **Installer les dépendances**

```bash
pnpm install
```

2. **Variables d'environnement**

Créer un fichier `.env.local` :

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

3. **Lancer l'application**

```bash
# Développement avec Turbopack
pnpm dev

# Build pour production
pnpm build
pnpm start
```

## 📁 Structure du projet

```
front/
├── app/
│   ├── globals.css          # Styles globaux
│   ├── layout.tsx           # Layout principal
│   ├── page.tsx             # Page d'accueil
│   ├── not-found.tsx        # Page 404
│   ├── auth/                # Pages d'authentification
│   │   ├── layout.tsx
│   │   ├── signin/
│   │   ├── register/
│   │   ├── forgot_password/
│   │   ├── reset_password/
│   │   └── verify-email/
│   ├── lockers/             # Pages des casiers
│   │   └── reservation/
│   └── components/          # Composants réutilisables
│       ├── base/
│       │   └── header.tsx
│       └── providers/
│           ├── AuthProvider.tsx
│           ├── Providers.tsx
│           └── ReactQueryProvider.tsx
├── public/
│   └── images/              # Images statiques
├── utils/
│   └── config.ts            # Configuration
├── next.config.ts           # Configuration Next.js
├── tailwind.config.ts       # Configuration Tailwind
└── tsconfig.json           # Configuration TypeScript
```

## 🔧 Scripts disponibles

```bash
pnpm dev      # Développement avec Turbopack
pnpm build    # Build pour production
pnpm start    # Démarrage en production
pnpm lint     # Linting du code
```

## 📱 Pages principales

### 🏠 Page d'accueil (`/`)

- Présentation des fonctionnalités
- Call-to-action vers la réservation
- Design attractif avec image de fond

### 🔐 Authentification (`/auth`)

- **Connexion** (`/auth/signin`)
- **Inscription** (`/auth/register`)
- **Mot de passe oublié** (`/auth/forgot_password`)
- **Réinitialisation** (`/auth/reset_password`)
- **Vérification email** (`/auth/verify-email`)

### 📦 Réservation (`/lockers/reservation`)

- Grille interactive des casiers
- Sélection multiple
- Calendrier de réservation
- Créneaux horaires

## 🎨 Design et UI

### Composants HeroUI

- `Button` - Boutons interactifs
- `Card` - Cartes de contenu
- `Input` - Champs de saisie
- `Select` - Sélecteurs
- `Divider` - Séparateurs visuels

### Animations Framer Motion

- Transitions de pages fluides
- Animations d'entrée/sortie
- Micro-interactions

### Thème Tailwind

- Palette de couleurs cohérente
- Responsive design mobile-first
- Utility classes optimisées

## 🔄 Gestion des états

### AuthProvider

Contexte global pour l'authentification :

```typescript
const { user, login, logout, register } = useAuth();
```

### React Query

Gestion optimisée des données serveur :

```typescript
const { data: lockers, isLoading } = useQuery({
  queryKey: ["lockers"],
  queryFn: fetchLockers,
});
```

## 🌐 API Integration

### Configuration

```typescript
// utils/config.ts
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
```

### Appels API

- Authentification avec cookies HTTPOnly
- Gestion des erreurs centralisée
- Retry automatique pour les requêtes échouées

## 📱 Responsive Design

### Breakpoints Tailwind

- `sm:` - 640px et plus
- `md:` - 768px et plus
- `lg:` - 1024px et plus
- `xl:` - 1280px et plus

### Composants adaptatifs

- Navigation mobile/desktop
- Grilles flexibles
- Typographie responsive

## 🔒 Sécurité

### Authentification

- Tokens JWT stockés dans des cookies HTTPOnly
- Validation côté client et serveur
- Redirections automatiques

### Validation

- Validation des formulaires en temps réel
- Sanitisation des entrées utilisateur
- Gestion des erreurs sécurisée

## 🚀 Performance

### Next.js 15 Features

- App Router pour le routing moderne
- Server Components par défaut
- Optimisations automatiques

### Turbopack

- Compilation ultra-rapide en développement
- Hot Module Replacement instantané

### Optimisations

- Lazy loading des composants
- Compression des images
- Bundle splitting automatique

## 🔧 Configuration

### next.config.ts

```typescript
const nextConfig = {
  // Configuration Next.js
  experimental: {
    turbo: true,
  },
};
```

### tailwind.config.ts

```typescript
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // Personnalisations
    },
  },
};
```

## 🧪 Tests et qualité

### ESLint

Configuration avec les règles Next.js :

```bash
pnpm lint
```

### TypeScript

Vérification de types stricte :

```bash
tsc --noEmit
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Respecter les conventions de code
4. Tester vos changements
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT.
