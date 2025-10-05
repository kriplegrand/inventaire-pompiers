# 🚒 Inventaire Pompiers - Guide d'Installation

Application React de gestion d'inventaire des camions de pompiers avec Firebase Firestore.

## 📋 Prérequis

- Node.js version 18 ou supérieure ([Télécharger ici](https://nodejs.org))
- Un compte Firebase (déjà configuré)
- Un éditeur de code (VS Code recommandé)

## 🚀 Installation Locale

### 1. Créer la structure du projet

Créez un dossier `inventaire-pompiers` sur votre ordinateur et recréez cette structure :

```
inventaire-pompiers/
├── public/
├── src/
│   ├── components/
│   │   ├── admin/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── TabInventaire.jsx
│   │   │   ├── TabVehicules.jsx
│   │   │   ├── TabMateriels.jsx
│   │   │   ├── TabUsers.jsx
│   │   │   └── TabConfig.jsx
│   │   ├── InitScreen.jsx
│   │   ├── LoginScreen.jsx
│   │   ├── SelectionScreen.jsx
│   │   └── ControleScreen.jsx
│   ├── services/
│   │   └── db.js
│   ├── firebase.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── .gitignore
```

### 2. Copiez tous les fichiers

Copiez le contenu de chaque artifact dans le fichier correspondant.

**IMPORTANT** : Dans `src/firebase.js`, vos clés Firebase sont déjà remplies.

### 3. Installer les dépendances

Ouvrez un terminal dans le dossier du projet et exécutez :

```bash
npm install
```

Cette commande va installer toutes les librairies nécessaires (React, Firebase, Tailwind, etc.)

### 4. Lancer l'application en local

```bash
npm run dev
```

L'application devrait s'ouvrir automatiquement dans votre navigateur à l'adresse : `http://localhost:3000`

## 🔥 Configuration Firebase (Déjà faite)

Votre Firebase est déjà configuré avec :
- ✅ Projet créé : `inventaire-pompiers`
- ✅ Firestore Database activée (région Paris)
- ✅ Règles de sécurité configurées
- ✅ Clés de connexion dans `src/firebase.js`

## 📱 Test de l'Application

1. **Premier lancement** : Vous verrez l'écran d'initialisation
2. **Entrez** :
   - Email super admin (celui que vous avez configuré sur Firebase)
   - Email chef de corps
3. **Cliquez sur "Initialiser"**
4. Vous êtes redirigé vers la page de connexion
5. **Entrez votre email** de super admin pour accéder au tableau de bord

## 🌐 Déploiement sur Vercel

### Étape 1 : Créer un compte Vercel

1. Allez sur [vercel.com](https://vercel.com)
2. Cliquez sur "Sign Up" (Inscription)
3. Connectez-vous avec GitHub (recommandé) ou email

### Étape 2 : Préparer le projet

1. Créez un compte GitHub si vous n'en avez pas
2. Créez un nouveau repository (dépôt) sur GitHub
3. Poussez votre code vers GitHub :

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/VOTRE-USERNAME/inventaire-pompiers.git
git push -u origin main
```

### Étape 3 : Déployer

1. Sur Vercel, cliquez sur "New Project"
2. Importez votre repository GitHub
3. Vercel détectera automatiquement Vite
4. Cliquez sur "Deploy"

✅ Votre application sera en ligne en 2-3 minutes !

Vous recevrez une URL du type : `https://inventaire-pompiers.vercel.app`

## 🔒 Sécurité

- Vos clés Firebase sont publiques MAIS protégées par les règles Firestore
- Ne commitez JAMAIS de fichier `.env` contenant des secrets
- Les règles Firestore empêchent les accès non autorisés

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez que Node.js est bien installé : `node --version`
2. Vérifiez que les dépendances sont installées : `npm install`
3. Vérifiez la console du navigateur (F12) pour les erreurs

## 🎯 Commandes utiles

```bash
npm run dev      # Lancer en mode développement
npm run build    # Construire pour la production
npm run preview  # Prévisualiser la version de production
```