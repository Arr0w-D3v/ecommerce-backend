# 🛒 Backend E-commerce - Node.js + Express + SQLite

Backend complet pour application e-commerce avec authentification JWT, gestion de produits, panier, commandes, avis et wishlist.

## 📋 Table des matières

- [Caractéristiques](#-caractéristiques)
- [Stack technique](#-stack-technique)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Utilisation](#-utilisation)
- [Documentation API](#-documentation-api)
- [Structure du projet](#-structure-du-projet)
- [Base de données](#-base-de-données)
- [Sécurité](#-sécurité)

## ✨ Caractéristiques

- ✅ **Authentification JWT** complète (inscription, connexion)
- ✅ **Gestion des utilisateurs** avec rôles (user, admin)
- ✅ **CRUD Produits** avec pagination, recherche et filtres
- ✅ **Gestion des catégories**
- ✅ **Panier d'achat** (ajouter, modifier, supprimer)
- ✅ **Système de commandes** avec gestion des statuts
- ✅ **Avis et notes** sur les produits
- ✅ **Wishlist/Favoris**
- ✅ **Validation des données** avec express-validator
- ✅ **Gestion d'erreurs** centralisée
- ✅ **Sécurité** : bcrypt, helmet, CORS

## 🛠 Stack technique

- **Runtime** : Node.js
- **Framework** : Express.js
- **Base de données** : SQLite3
- **Authentification** : JWT (jsonwebtoken)
- **Hashing** : bcryptjs
- **Validation** : express-validator
- **Sécurité** : helmet, cors
- **Environnement** : dotenv

## 📦 Installation

### Prérequis

- Node.js (v14 ou supérieur)
- npm ou yarn

### Étapes

1. **Cloner le projet**
   ```bash
   git clone <url-du-repo>
   cd ecommerce-backend
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement**
   ```bash
   cp .env.example .env
   ```

   Modifier le fichier `.env` :
   ```env
   PORT=3000
   NODE_ENV=development
   JWT_SECRET=votre_secret_jwt_super_securise
   JWT_EXPIRES_IN=24h
   DB_PATH=./ecommerce.db
   ```

4. **Initialiser la base de données avec des données de test**
   ```bash
   npm run seed
   ```

5. **Démarrer le serveur**
   ```bash
   # Mode développement (avec nodemon)
   npm run dev

   # Mode production
   npm start
   ```

Le serveur démarre sur `http://localhost:3000`

## ⚙️ Configuration

### Variables d'environnement

| Variable | Description | Défaut |
|----------|-------------|---------|
| `PORT` | Port du serveur | `3000` |
| `NODE_ENV` | Environnement (development/production) | `development` |
| `JWT_SECRET` | Secret pour signer les tokens JWT | **REQUIS** |
| `JWT_EXPIRES_IN` | Durée de validité du token | `24h` |
| `DB_PATH` | Chemin vers la base SQLite | `./ecommerce.db` |

## 🚀 Utilisation

### Comptes de test (après seed)

**Admin**
- Email: `admin@ecommerce.com`
- Password: `admin123`

**Utilisateur**
- Email: `john@example.com`
- Password: `user123`

### Scripts disponibles

```bash
npm start      # Démarrer le serveur
npm run dev    # Démarrer en mode développement
npm run seed   # Remplir la DB avec données de test
```

## 📚 Documentation API

### URL de base

```
http://localhost:3000/api
```

### Codes de réponse HTTP

| Code | Description |
|------|-------------|
| 200 | Succès |
| 201 | Créé avec succès |
| 400 | Requête invalide |
| 401 | Non authentifié |
| 403 | Accès interdit |
| 404 | Ressource non trouvée |
| 500 | Erreur serveur |

### Format des réponses

**Succès**
```json
{
  "success": true,
  "message": "Message de succès",
  "data": { ... }
}
```

**Erreur**
```json
{
  "success": false,
  "message": "Message d'erreur",
  "errors": [ ... ]
}
```

---

## 🔐 Authentification

### 1. Inscription

**Endpoint** : `POST /api/auth/register`

**Body** :
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Exemple curl** :
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Réponse** :
```json
{
  "success": true,
  "message": "Utilisateur créé avec succès",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### 2. Connexion

**Endpoint** : `POST /api/auth/login`

**Body** :
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Exemple curl** :
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Réponse** :
```json
{
  "success": true,
  "message": "Connexion réussie",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    }
  }
}
```

### 3. Profil utilisateur

**Endpoint** : `GET /api/auth/profile`
**Authentification** : Requise

**Headers** :
```
Authorization: Bearer <token>
```

**Exemple curl** :
```bash
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer <votre_token>"
```

---

## 📦 Produits

### 1. Lister tous les produits

**Endpoint** : `GET /api/products`

**Query params** :
- `page` (number) : Numéro de page (défaut: 1)
- `limit` (number) : Éléments par page (défaut: 10)
- `category_id` (number) : Filtrer par catégorie
- `search` (string) : Recherche dans nom/description
- `min_price` (number) : Prix minimum
- `max_price` (number) : Prix maximum

**Exemple curl** :
```bash
# Tous les produits
curl http://localhost:3000/api/products

# Avec filtres
curl "http://localhost:3000/api/products?page=1&limit=5&category_id=1&search=iphone&min_price=100&max_price=2000"
```

**Réponse** :
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": 1,
        "name": "iPhone 15 Pro",
        "description": "Smartphone Apple...",
        "price": 1199.99,
        "stock": 25,
        "category_id": 1,
        "category_name": "Électronique",
        "image_url": "https://...",
        "created_at": "2024-01-01 10:00:00"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 16,
      "totalPages": 2
    }
  }
}
```

### 2. Détails d'un produit

**Endpoint** : `GET /api/products/:id`

**Exemple curl** :
```bash
curl http://localhost:3000/api/products/1
```

**Réponse** : Inclut les avis et la note moyenne

### 3. Créer un produit (Admin)

**Endpoint** : `POST /api/products`
**Authentification** : Requise (Admin)

**Body** :
```json
{
  "name": "Nouveau produit",
  "description": "Description du produit",
  "price": 99.99,
  "stock": 50,
  "category_id": 1,
  "image_url": "https://..."
}
```

**Exemple curl** :
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nouveau produit",
    "description": "Description",
    "price": 99.99,
    "stock": 50,
    "category_id": 1
  }'
```

### 4. Modifier un produit (Admin)

**Endpoint** : `PUT /api/products/:id`
**Authentification** : Requise (Admin)

**Exemple curl** :
```bash
curl -X PUT http://localhost:3000/api/products/1 \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "price": 1099.99,
    "stock": 30
  }'
```

### 5. Supprimer un produit (Admin)

**Endpoint** : `DELETE /api/products/:id`
**Authentification** : Requise (Admin)

**Exemple curl** :
```bash
curl -X DELETE http://localhost:3000/api/products/1 \
  -H "Authorization: Bearer <admin_token>"
```

---

## 📁 Catégories

### 1. Lister toutes les catégories

**Endpoint** : `GET /api/categories`

**Exemple curl** :
```bash
curl http://localhost:3000/api/categories
```

### 2. Détails d'une catégorie

**Endpoint** : `GET /api/categories/:id`

Retourne la catégorie avec tous ses produits.

### 3. Créer une catégorie (Admin)

**Endpoint** : `POST /api/categories`
**Authentification** : Requise (Admin)

**Body** :
```json
{
  "name": "Nouvelle catégorie",
  "description": "Description de la catégorie"
}
```

### 4. Modifier une catégorie (Admin)

**Endpoint** : `PUT /api/categories/:id`

### 5. Supprimer une catégorie (Admin)

**Endpoint** : `DELETE /api/categories/:id`

---

## 🛒 Panier

**Toutes les routes nécessitent une authentification**

### 1. Voir mon panier

**Endpoint** : `GET /api/cart`

**Exemple curl** :
```bash
curl http://localhost:3000/api/cart \
  -H "Authorization: Bearer <token>"
```

**Réponse** :
```json
{
  "success": true,
  "data": {
    "cart_id": 1,
    "items": [
      {
        "id": 1,
        "product_id": 1,
        "name": "iPhone 15 Pro",
        "price": 1199.99,
        "quantity": 1,
        "stock": 25,
        "subtotal": 1199.99,
        "image_url": "https://..."
      }
    ],
    "total": "1199.99",
    "items_count": 1
  }
}
```

### 2. Ajouter au panier

**Endpoint** : `POST /api/cart/add`

**Body** :
```json
{
  "product_id": 1,
  "quantity": 2
}
```

**Exemple curl** :
```bash
curl -X POST http://localhost:3000/api/cart/add \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": 1,
    "quantity": 2
  }'
```

### 3. Modifier la quantité

**Endpoint** : `PUT /api/cart/item/:item_id`

**Body** :
```json
{
  "quantity": 3
}
```

### 4. Retirer un article

**Endpoint** : `DELETE /api/cart/item/:item_id`

**Exemple curl** :
```bash
curl -X DELETE http://localhost:3000/api/cart/item/1 \
  -H "Authorization: Bearer <token>"
```

### 5. Vider le panier

**Endpoint** : `DELETE /api/cart/clear`

---

## 📝 Commandes

**Toutes les routes nécessitent une authentification**

### 1. Créer une commande (depuis le panier)

**Endpoint** : `POST /api/orders`

Crée une commande à partir des articles du panier, met à jour le stock et vide le panier.

**Exemple curl** :
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Authorization: Bearer <token>"
```

**Réponse** :
```json
{
  "success": true,
  "message": "Commande créée avec succès",
  "data": {
    "order_id": 1,
    "total": "1479.98",
    "status": "pending"
  }
}
```

### 2. Mes commandes

**Endpoint** : `GET /api/orders/my-orders`

**Exemple curl** :
```bash
curl http://localhost:3000/api/orders/my-orders \
  -H "Authorization: Bearer <token>"
```

### 3. Détails d'une commande

**Endpoint** : `GET /api/orders/:id`

**Exemple curl** :
```bash
curl http://localhost:3000/api/orders/1 \
  -H "Authorization: Bearer <token>"
```

**Réponse** :
```json
{
  "success": true,
  "data": {
    "id": 1,
    "user_id": 2,
    "total": 1479.98,
    "status": "pending",
    "created_at": "2024-01-01 14:30:00",
    "items": [
      {
        "id": 1,
        "product_id": 1,
        "name": "iPhone 15 Pro",
        "quantity": 1,
        "unit_price": 1199.99,
        "image_url": "https://..."
      },
      {
        "id": 2,
        "product_id": 4,
        "name": "AirPods Pro",
        "quantity": 1,
        "unit_price": 279.99,
        "image_url": "https://..."
      }
    ]
  }
}
```

### 4. Toutes les commandes (Admin)

**Endpoint** : `GET /api/orders`
**Authentification** : Requise (Admin)

**Query params** :
- `page` : Numéro de page
- `limit` : Éléments par page
- `status` : Filtrer par statut

**Exemple curl** :
```bash
curl "http://localhost:3000/api/orders?page=1&limit=10&status=pending" \
  -H "Authorization: Bearer <admin_token>"
```

### 5. Mettre à jour le statut (Admin)

**Endpoint** : `PUT /api/orders/:id/status`
**Authentification** : Requise (Admin)

**Body** :
```json
{
  "status": "shipped"
}
```

**Statuts valides** : `pending`, `processing`, `shipped`, `delivered`, `cancelled`

**Exemple curl** :
```bash
curl -X PUT http://localhost:3000/api/orders/1/status \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{"status": "shipped"}'
```

---

## ⭐ Avis et Notes

### 1. Avis d'un produit

**Endpoint** : `GET /api/reviews/product/:product_id`

**Exemple curl** :
```bash
curl http://localhost:3000/api/reviews/product/1
```

**Réponse** :
```json
{
  "success": true,
  "data": {
    "reviews": [
      {
        "id": 1,
        "product_id": 1,
        "user_id": 2,
        "user_name": "John Doe",
        "rating": 5,
        "comment": "Excellent produit !",
        "created_at": "2024-01-01 15:00:00"
      }
    ],
    "avg_rating": "4.5",
    "reviews_count": 2
  }
}
```

### 2. Créer un avis

**Endpoint** : `POST /api/reviews/product/:product_id`
**Authentification** : Requise

**Body** :
```json
{
  "rating": 5,
  "comment": "Excellent produit, je recommande !"
}
```

**Exemple curl** :
```bash
curl -X POST http://localhost:3000/api/reviews/product/1 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "rating": 5,
    "comment": "Excellent produit !"
  }'
```

### 3. Modifier un avis

**Endpoint** : `PUT /api/reviews/:id`
**Authentification** : Requise (propriétaire ou admin)

### 4. Supprimer un avis

**Endpoint** : `DELETE /api/reviews/:id`
**Authentification** : Requise (propriétaire ou admin)

---

## ❤️ Wishlist (Favoris)

**Toutes les routes nécessitent une authentification**

### 1. Voir ma wishlist

**Endpoint** : `GET /api/wishlist`

**Exemple curl** :
```bash
curl http://localhost:3000/api/wishlist \
  -H "Authorization: Bearer <token>"
```

**Réponse** :
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "product_id": 3,
        "name": "MacBook Pro 16\"",
        "description": "Ordinateur portable...",
        "price": 2499.99,
        "stock": 15,
        "image_url": "https://...",
        "created_at": "2024-01-01 16:00:00"
      }
    ],
    "count": 1
  }
}
```

### 2. Ajouter à la wishlist

**Endpoint** : `POST /api/wishlist`

**Body** :
```json
{
  "product_id": 3
}
```

**Exemple curl** :
```bash
curl -X POST http://localhost:3000/api/wishlist \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"product_id": 3}'
```

### 3. Retirer de la wishlist

**Endpoint** : `DELETE /api/wishlist/:product_id`

**Exemple curl** :
```bash
curl -X DELETE http://localhost:3000/api/wishlist/3 \
  -H "Authorization: Bearer <token>"
```

### 4. Vérifier si un produit est dans la wishlist

**Endpoint** : `GET /api/wishlist/check/:product_id`

---

## 🗂 Structure du projet

```
ecommerce-backend/
├── src/
│   ├── config/
│   │   └── database.js         # Configuration SQLite
│   ├── controllers/
│   │   ├── authController.js   # Logique authentification
│   │   ├── productController.js
│   │   ├── categoryController.js
│   │   ├── cartController.js
│   │   ├── orderController.js
│   │   ├── reviewController.js
│   │   └── wishlistController.js
│   ├── middlewares/
│   │   ├── auth.js             # Middleware JWT
│   │   ├── errorHandler.js     # Gestion d'erreurs
│   │   └── validator.js        # Validation des données
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── reviewRoutes.js
│   │   ├── wishlistRoutes.js
│   │   └── index.js            # Point d'entrée des routes
│   ├── utils/
│   │   └── seed.js             # Script de seed
│   └── server.js               # Point d'entrée de l'app
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## 🗄 Base de données

### Schéma SQLite

**users**
- id (PRIMARY KEY)
- name
- email (UNIQUE)
- password (hashé)
- role (user|admin)
- created_at

**categories**
- id (PRIMARY KEY)
- name (UNIQUE)
- description
- created_at

**products**
- id (PRIMARY KEY)
- name
- description
- price
- stock
- category_id (FOREIGN KEY)
- image_url
- created_at

**cart**
- id (PRIMARY KEY)
- user_id (FOREIGN KEY, UNIQUE)
- created_at

**cart_items**
- id (PRIMARY KEY)
- cart_id (FOREIGN KEY)
- product_id (FOREIGN KEY)
- quantity
- created_at

**orders**
- id (PRIMARY KEY)
- user_id (FOREIGN KEY)
- total
- status
- created_at

**order_items**
- id (PRIMARY KEY)
- order_id (FOREIGN KEY)
- product_id (FOREIGN KEY)
- quantity
- unit_price
- created_at

**reviews**
- id (PRIMARY KEY)
- product_id (FOREIGN KEY)
- user_id (FOREIGN KEY)
- rating (1-5)
- comment
- created_at

**wishlist**
- id (PRIMARY KEY)
- user_id (FOREIGN KEY)
- product_id (FOREIGN KEY)
- created_at

### Relations

- `users` 1-1 `cart`
- `users` 1-N `orders`
- `users` 1-N `reviews`
- `users` 1-N `wishlist`
- `categories` 1-N `products`
- `products` 1-N `cart_items`
- `products` 1-N `order_items`
- `products` 1-N `reviews`
- `cart` 1-N `cart_items`
- `orders` 1-N `order_items`

## 🔒 Sécurité

### Mesures implémentées

- ✅ **Mots de passe hashés** avec bcrypt (10 rounds)
- ✅ **JWT** pour l'authentification stateless
- ✅ **Helmet** pour sécuriser les headers HTTP
- ✅ **CORS** configuré
- ✅ **Validation des entrées** avec express-validator
- ✅ **Contraintes SQL** (clés étrangères, types, unique)
- ✅ **Middleware d'autorisation** (admin, ownership)

### Bonnes pratiques recommandées

- Changer `JWT_SECRET` en production (utiliser une longue chaîne aléatoire)
- Activer HTTPS en production
- Limiter les tentatives de connexion (rate limiting)
- Logger les actions sensibles
- Auditer les dépendances npm (`npm audit`)

## 📝 Licence

MIT

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

---

**Fait avec ❤️ en Node.js**
