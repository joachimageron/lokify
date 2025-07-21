# Lokify API 🔒

Backend REST API pour l'application de réservation de casiers Lokify.

## 📋 Description

L'API Lokify est construite avec Node.js et Express.js, offrant une interface REST complète pour la gestion des utilisateurs, l'authentification et la réservation de casiers. Elle utilise MongoDB comme base de données et intègre des fonctionnalités avancées comme l'envoi d'emails et la sécurité JWT.

## ✨ Fonctionnalités

### 🔐 Authentification

- Inscription et connexion utilisateur
- Hachage sécurisé des mots de passe avec bcrypt
- Authentification par tokens JWT
- Gestion des sessions avec cookies HTTPOnly
- Vérification d'email et réinitialisation de mot de passe

### 📦 Gestion des casiers

- CRUD complet pour les casiers
- Gestion des états (disponible/occupé)
- Système de réservation

### 📧 Notifications

- Envoi d'emails automatique via Mailgun
- Templates HTML personnalisés
- Emails de bienvenue, confirmation et réinitialisation

## 🛠️ Technologies

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **TypeScript** - Langage de programmation typé
- **MongoDB** - Base de données NoSQL
- **Mongoose** - ODM pour MongoDB
- **JWT** - Authentification par tokens
- **bcrypt** - Hachage des mots de passe
- **Mailgun** - Service d'envoi d'emails
- **CORS** - Gestion des requêtes cross-origin
- **Cookie Parser** - Gestion des cookies

## 🚀 Installation

### Prérequis

- Node.js 18+
- pnpm (gestionnaire de paquets)
- MongoDB (local ou distant)
- Compte Mailgun pour les emails

### Configuration

1. **Installer les dépendances**

```bash
pnpm install
```

2. **Variables d'environnement**

Créer un fichier `.env.local` :

```env
NODE_ENV=local
PORT=5000
MONGODB_URI=mongodb://localhost:27017/lokify
JWT_SECRET=your-jwt-secret-key
CLIENT_URL=http://localhost:3000
MAILGUN_API_KEY=your-mailgun-api-key
MAILGUN_DOMAIN=your-mailgun-domain
```

3. **Lancer le serveur**

```bash
# Développement
pnpm dev

# Production
pnpm build
pnpm start
```

## 📁 Structure du projet

```
api/
├── config/
│   └── database.ts          # Configuration MongoDB
├── middleware/
│   └── auth.ts              # Middleware d'authentification
├── models/
│   ├── User.ts              # Modèle utilisateur
│   └── Locker.ts            # Modèle casier
├── routes/
│   ├── auth.ts              # Routes d'authentification
│   └── lockers.ts           # Routes des casiers
├── templates/
│   └── emails/              # Templates d'emails HTML
├── utils/
│   └── mailgunClient.ts     # Client Mailgun
├── server.ts                # Point d'entrée principal
├── package.json
└── tsconfig.json
```

## 🔧 Scripts disponibles

```bash
pnpm dev      # Développement avec hot-reload
pnpm build    # Compilation TypeScript
pnpm start    # Démarrage en production
```

## 📚 API Endpoints

### Authentification (`/api/auth`)

#### POST `/register`

Inscription d'un nouvel utilisateur

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### POST `/login`

Connexion utilisateur

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### POST `/logout`

Déconnexion utilisateur (supprime le cookie)

#### GET `/me`

Récupère les informations de l'utilisateur connecté

#### POST `/forgot-password`

Demande de réinitialisation du mot de passe

```json
{
  "email": "user@example.com"
}
```

#### POST `/reset-password/:token`

Réinitialisation du mot de passe avec token

```json
{
  "password": "newPassword123"
}
```

#### POST `/send-verification-email`

Envoie un email de vérification

#### GET `/verify-email/:token`

Vérification de l'email avec token

### Casiers (`/api/lockers`)

#### GET `/`

Récupère la liste de tous les casiers disponibles

_Authentification requise pour tous les endpoints `/api/lockers`_

## 🔒 Sécurité

### Authentification

- Tokens JWT avec expiration (24h)
- Cookies HTTPOnly et sécurisés
- Politique SameSite strict

### Mots de passe

- Hachage avec bcrypt (salt rounds: 10)
- Validation côté serveur

### CORS

- Configuration pour autoriser uniquement le frontend
- Credentials inclus pour les cookies

## 📧 Système d'emails

### Templates disponibles

- `welcome.html` - Email de bienvenue
- `email-confirmation.html` - Confirmation d'email
- `password-reset.html` - Réinitialisation de mot de passe
- `password-reset-confirmation.html` - Confirmation de réinitialisation

### Configuration Mailgun

```typescript
const mailgunClient = MailgunClient.getInstance();
await mailgunClient.sendEmailWithTemplate(
  ["user@example.com"],
  "Subject",
  "template-name",
  { variables }
);
```

## 🗄️ Base de données

### Modèles

#### User

```typescript
{
  email: string; // Unique, requis
  password: string; // Haché avec bcrypt
  emailVerified: boolean; // État de vérification
  createdAt: Date; // Auto-généré
  updatedAt: Date; // Auto-généré
}
```

#### Locker

```typescript
{
  name: string; // Nom du casier
  createdAt: Date; // Auto-généré
  updatedAt: Date; // Auto-généré
}
```

## 🛡️ Middleware

### Auth Middleware

Vérifie l'authentification JWT pour les routes protégées :

```typescript
import { auth } from "../middleware/auth";
router.use(auth); // Applique à toutes les routes
```

## 🔧 Configuration

### Variables d'environnement

L'API supporte plusieurs environnements :

- `.env` - Variables de base
- `.env.local` - Variables locales (priorité)
- `.env.${NODE_ENV}` - Variables par environnement

### Base de données

Configuration MongoDB avec Mongoose :

```typescript
mongoose.connect(process.env.MONGODB_URI);
```

## 📝 Logs et debugging

Le serveur utilise `pretty-error` pour un affichage amélioré des erreurs en développement.

## 🤝 Contribution

1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Commiter vos changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT.
