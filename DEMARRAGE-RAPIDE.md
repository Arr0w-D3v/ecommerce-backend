# 🚀 Démarrage Rapide - E-commerce Full Stack
## Backend + Frontend pour Débutants

Guide complet pour démarrer le projet en 10 minutes.

---

## 📦 Ce que vous allez créer

```
┌─────────────────────────────────────────────────────────────┐
│                    E-COMMERCE COMPLET                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐              ┌──────────────┐            │
│  │   FRONTEND   │              │   BACKEND    │            │
│  │              │    HTTP      │              │            │
│  │    React     │◄──────────► │  Node.js     │            │
│  │   (Port 5173)│   Requests   │  Express     │            │
│  │              │              │  (Port 3000) │            │
│  └──────────────┘              └──────┬───────┘            │
│                                        │                     │
│                                        ▼                     │
│                                 ┌──────────────┐            │
│                                 │   Database   │            │
│                                 │    SQLite    │            │
│                                 └──────────────┘            │
└─────────────────────────────────────────────────────────────┘
```

---

## ✅ Prérequis (5 minutes)

### 1. Vérifier les installations

```bash
# Node.js (minimum v14)
node --version
# Devrait afficher : v18.x.x ou supérieur

# npm
npm --version
# Devrait afficher : 8.x.x ou supérieur
```

### 2. Si Node.js n'est pas installé

- **Windows/Mac** : Télécharger depuis https://nodejs.org
- **Linux** :
  ```bash
  # Ubuntu/Debian
  sudo apt install nodejs npm

  # macOS avec Homebrew
  brew install node
  ```

---

## 🎯 Partie 1 : Démarrer le Backend (3 minutes)

### Étape 1 : Se positionner dans le dossier

```bash
cd /Users/mike/Documents/GitHub/ecommerce-backend
```

### Étape 2 : Vérifier les fichiers

```bash
ls -la
```

Vous devriez voir :
```
✅ package.json
✅ src/
✅ .env
✅ README.md
```

### Étape 3 : Installer les dépendances

```bash
npm install
```

**Temps estimé** : 1-2 minutes

### Étape 4 : Remplir la base de données

```bash
npm run seed
```

**Résultat attendu** :
```
✅ Utilisateurs créés
✅ Catégories créées
✅ Produits créés
✅ Avis créés
✅ Commandes créées
✅ Wishlists créées

📝 Comptes de test créés :
   Admin: admin@ecommerce.com / admin123
   User:  john@example.com / user123
```

### Étape 5 : Démarrer le serveur

```bash
npm start
```

**Résultat attendu** :
```
🚀 Serveur E-commerce démarré avec succès
📍 URL: http://localhost:3000
```

### Étape 6 : Tester l'API

**Ouvrir un NOUVEAU terminal** et tester :

```bash
# Test 1: Health check
curl http://localhost:3000/api/health

# Test 2: Connexion
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"user123"}'

# Test 3: Liste des produits
curl http://localhost:3000/api/products
```

✅ **Backend opérationnel !**

---

## 🎨 Partie 2 : Créer le Frontend (5 minutes)

### Étape 1 : Ouvrir un nouveau terminal

**Important** : Gardez le backend qui tourne dans le premier terminal !

### Étape 2 : Retourner au dossier parent

```bash
cd /Users/mike/Documents/GitHub
```

### Étape 3 : Créer le projet React

```bash
npm create vite@latest ecommerce-frontend -- --template react
```

Appuyez sur **Entrée** pour confirmer.

### Étape 4 : Aller dans le dossier

```bash
cd ecommerce-frontend
```

### Étape 5 : Installer les dépendances de base

```bash
npm install
```

### Étape 6 : Installer les bibliothèques nécessaires

```bash
npm install react-router-dom axios lucide-react react-hot-toast
```

### Étape 7 : Démarrer le frontend

```bash
npm run dev
```

**Résultat** :
```
  VITE ready in 500 ms

  ➜  Local:   http://localhost:5173/
```

### Étape 8 : Ouvrir dans le navigateur

Ouvrez votre navigateur et allez sur : **http://localhost:5173**

✅ **Frontend opérationnel !**

---

## 📝 État actuel

À ce stade, vous avez :

| Composant | État | URL |
|-----------|------|-----|
| Backend API | ✅ Running | http://localhost:3000 |
| Frontend React | ✅ Running | http://localhost:5173 |
| Base de données | ✅ Remplie | ecommerce.db |

---

## 🎯 Prochaines étapes

### Option 1 : Suivre le guide complet

Suivez le fichier **GUIDE-REACT-FRONTEND.md** pour créer le frontend étape par étape.

### Option 2 : Tester l'API avec Postman/Insomnia

1. Télécharger Postman : https://www.postman.com/downloads/
2. Importer la collection (voir plus bas)

### Option 3 : Coder directement

Commencez par créer la structure de base :

```bash
cd ecommerce-frontend/src

# Créer les dossiers
mkdir components pages services context hooks utils
```

---

## 🔥 Quick Start - Premiers composants

### 1. Créer le service API

Créez `src/services/api.js` :

```javascript
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
```

### 2. Créer une page simple

Créez `src/pages/Home.jsx` :

```javascript
import { useState, useEffect } from 'react';
import api from '../services/api';

function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get('/products')
      .then(res => setProducts(res.data.data.products))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1>Bienvenue sur notre E-commerce</h1>
      <h2>Nos produits :</h2>
      <ul>
        {products.map(p => (
          <li key={p.id}>{p.name} - {p.price}€</li>
        ))}
      </ul>
    </div>
  );
}

export default Home;
```

### 3. Utiliser dans App.jsx

Modifiez `src/App.jsx` :

```javascript
import Home from './pages/Home';

function App() {
  return <Home />;
}

export default App;
```

### 4. Voir le résultat

Rafraîchissez http://localhost:5173

Vous devriez voir la liste des produits !

---

## 🐛 Dépannage

### Problème 1 : Le backend ne démarre pas

**Erreur** : `Port 3000 is already in use`

**Solution** :
```bash
# Tuer le processus sur le port 3000
npx kill-port 3000

# Ou changer le port dans .env
PORT=3001
```

### Problème 2 : CORS Error dans le navigateur

**Erreur** : `Access to XMLHttpRequest has been blocked by CORS`

**Solution** : Le backend a déjà CORS activé, mais si le problème persiste :

Dans `src/server.js` (backend), vérifiez :
```javascript
app.use(cors()); // Doit être présent
```

### Problème 3 : Base de données verrouillée

**Erreur** : `database is locked`

**Solution** :
```bash
# Arrêter le serveur (Ctrl+C)
# Supprimer la base
rm ecommerce.db

# Relancer le seed
npm run seed

# Redémarrer
npm start
```

### Problème 4 : npm install échoue

**Solution** :
```bash
# Nettoyer le cache
npm cache clean --force

# Supprimer node_modules
rm -rf node_modules package-lock.json

# Réinstaller
npm install
```

---

## 📚 Collection Postman

Pour tester facilement toutes les routes API :

### Importer dans Postman

1. Créer une nouvelle collection "E-commerce API"
2. Ajouter ces requêtes :

**Authentification**
```
POST http://localhost:3000/api/auth/register
Body (JSON):
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}

POST http://localhost:3000/api/auth/login
Body (JSON):
{
  "email": "john@example.com",
  "password": "user123"
}
```

**Produits**
```
GET http://localhost:3000/api/products
GET http://localhost:3000/api/products/1
GET http://localhost:3000/api/products?search=iphone&page=1&limit=10
```

**Panier** (nécessite token)
```
GET http://localhost:3000/api/cart
Headers: Authorization: Bearer YOUR_TOKEN

POST http://localhost:3000/api/cart/add
Headers: Authorization: Bearer YOUR_TOKEN
Body (JSON):
{
  "product_id": 1,
  "quantity": 2
}
```

---

## 🎓 Ressources d'apprentissage

### Documentation officielle
- React : https://react.dev
- Express : https://expressjs.com
- Axios : https://axios-http.com

### Tutoriels vidéo recommandés
- React pour débutants (Grafikart)
- Node.js API REST (Hardcoders)
- Full Stack JavaScript (freeCodeCamp)

### Aide en ligne
- Stack Overflow : https://stackoverflow.com
- Discord React France
- Reddit r/reactjs

---

## ✅ Checklist du débutant

Avant de commencer le développement :

- [ ] Node.js et npm installés
- [ ] Backend démarré (port 3000)
- [ ] Frontend démarré (port 5173)
- [ ] Base de données remplie
- [ ] Test API réussi (curl)
- [ ] Page d'accueil React affichée
- [ ] Éditeur de code installé (VS Code recommandé)
- [ ] Extensions VS Code installées :
  - [ ] ES7+ React/Redux snippets
  - [ ] Prettier
  - [ ] ESLint
  - [ ] Auto Rename Tag

---

## 🚀 Challenge du jour

**Mission** : Afficher les produits en cartes

1. Créer un composant `ProductCard.jsx`
2. Styliser avec CSS
3. Afficher l'image, nom, prix
4. Ajouter un bouton "Voir détails"

**Temps estimé** : 30 minutes

**Indice** :
```javascript
function ProductCard({ product }) {
  return (
    <div className="card">
      <img src={product.image_url} alt={product.name} />
      <h3>{product.name}</h3>
      <p>{product.price} €</p>
      <button>Voir détails</button>
    </div>
  );
}
```

---

## 🎉 Félicitations !

Vous avez :
✅ Installé et démarré le backend
✅ Créé et lancé le frontend
✅ Connecté les deux applications
✅ Affiché vos premiers produits

**Prochaine étape** : Suivez le guide complet dans `GUIDE-REACT-FRONTEND.md` pour construire une application complète !

---

## 💡 Conseils pour bien démarrer

1. **Prenez votre temps** : Ne cherchez pas à tout faire en une fois
2. **Testez régulièrement** : Après chaque modification, vérifiez que ça fonctionne
3. **Utilisez la console** : `console.log()` est votre ami
4. **Lisez les erreurs** : Elles donnent souvent la solution
5. **Demandez de l'aide** : La communauté est là pour ça

**Bon courage ! 🚀**
