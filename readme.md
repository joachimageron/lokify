# Lokify 🔒

Une application web moderne de réservation de casiers sécurisés.

## 📋 Description

Lokify est une plateforme complète permettant aux utilisateurs de réserver des casiers sécurisés en ligne. L'application offre une solution simple et efficace pour la gestion des espaces de stockage temporaire avec un système de réservation flexible.

## ✨ Fonctionnalités

### 🔐 Authentification

- Inscription et connexion utilisateur
- Vérification d'email
- Réinitialisation de mot de passe
- Gestion des sessions sécurisées

### 📦 Gestion des casiers

- Casiers de différentes tailles (S, M, L)
- Visualisation en temps réel de la disponibilité
- Réservation avec date et heure
- Notifications par email

### 🌐 Interface utilisateur

- Design moderne et responsive
- Navigation intuitive
- Thème sombre/clair
- Animations fluides

## 🛠️ Technologies utilisées

### Backend (API)

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **TypeScript** - Langage de programmation typé
- **MongoDB** - Base de données NoSQL
- **Mongoose** - ODM pour MongoDB
- **JWT** - Authentification par tokens
- **bcrypt** - Hachage des mots de passe
- **Mailgun** - Service d'envoi d'emails

### Frontend

- **Next.js 15** - Framework React
- **React 19** - Bibliothèque UI
- **TypeScript** - Langage de programmation typé
- **Tailwind CSS** - Framework CSS
- **HeroUI** - Composants UI
- **Framer Motion** - Animations
- **React Query** - Gestion des états serveur

## 🚀 Installation

### Prérequis

- Node.js 18+
- pnpm (gestionnaire de paquets)
- MongoDB (local ou distant)
- Compte Mailgun pour les emails

### Configuration

1. **Cloner le projet**

```bash
git clone https://github.com/joachimageron/lokify.git
cd lokify
```

2. **Installer les dépendances**

```bash
# Backend
cd api
pnpm install

# Frontend
cd ../front
pnpm install
```

3. **Configuration des variables d'environnement**

Créer les fichiers `.env.local` dans `/api` et `/front` :

**API (.env.local):**

```env
NODE_ENV=local
PORT=5000
MONGODB_URI=mongodb://localhost:27017/lokify
JWT_SECRET=your-jwt-secret-key
CLIENT_URL=http://localhost:3000
MAILGUN_API_KEY=your-mailgun-api-key
MAILGUN_DOMAIN=your-mailgun-domain
```

**Frontend (.env.local):**

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

4. **Lancer l'application**

```bash
# Backend (port 5000)
cd api
pnpm dev

# Frontend (port 3000)
cd front
pnpm dev
```

## 📁 Structure du projet

```
lokify/
├── api/                    # Backend API
│   ├── config/            # Configuration DB
│   ├── middleware/        # Middlewares Express
│   ├── models/           # Modèles Mongoose
│   ├── routes/           # Routes API
│   ├── templates/        # Templates emails
│   └── utils/            # Utilitaires
├── front/                # Frontend Next.js
│   ├── app/              # Pages et composants
│   ├── components/       # Composants réutilisables
│   ├── public/           # Assets statiques
│   └── utils/            # Utilitaires frontend
└── README.md
```

## 🔧 Scripts disponibles

### Backend

```bash
pnpm dev      # Développement avec hot-reload
pnpm build    # Build pour production
pnpm start    # Démarrage en production
```

### Frontend

```bash
pnpm dev      # Développement avec Turbopack
pnpm build    # Build pour production
pnpm start    # Démarrage en production
pnpm lint     # Linting du code
```

## 📚 API Documentation

### Endpoints principaux

#### Authentification

- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `POST /api/auth/logout` - Déconnexion
- `GET /api/auth/me` - Profil utilisateur
- `POST /api/auth/forgot-password` - Mot de passe oublié
- `POST /api/auth/reset-password/:token` - Réinitialisation

#### Casiers

- `GET /api/lockers` - Liste des casiers disponibles

## 🤝 Contribution

Les contributions sont les bienvenues ! Veuillez :

1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Commiter vos changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT.

## 👥 Équipe

- **Joachim Ageron** - Développeur principal

## 📞 Support

Pour toute question ou problème, ouvrez une issue sur GitHub.
