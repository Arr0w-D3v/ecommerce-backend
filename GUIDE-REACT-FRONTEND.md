# 🎓 Guide de Développement Frontend React - E-commerce
## Pour Apprenants - Étape par Étape

Ce guide vous accompagnera dans la création d'un frontend React complet pour le backend e-commerce. Chaque étape est conçue pour être réalisée progressivement avec des explications détaillées.

---

## 📚 Table des matières

1. [Prérequis](#-étape-0--prérequis)
2. [Initialisation du projet](#-étape-1--initialisation-du-projet-react)
3. [Configuration de base](#-étape-2--configuration-de-base)
4. [Système d'authentification](#-étape-3--système-dauthentification)
5. [Affichage des produits](#-étape-4--affichage-des-produits)
6. [Page détails produit](#-étape-5--page-détails-produit)
7. [Panier d'achat](#-étape-6--panier-dachat)
8. [Processus de commande](#-étape-7--processus-de-commande)
9. [Interface admin](#-étape-8--interface-admin)
10. [Fonctionnalités avancées](#-étape-9--fonctionnalités-avancées)

---

## 🎯 Étape 0 : Prérequis

### Connaissances nécessaires

- ✅ HTML/CSS basique
- ✅ JavaScript ES6+ (const, let, arrow functions, async/await)
- ✅ React basique (composants, props, state, hooks)
- ✅ Concept d'API REST

### Outils à installer

```bash
# Vérifier que Node.js est installé (v14 minimum)
node --version

# Vérifier que npm est installé
npm --version
```

### Concept important : Comment React communique avec le Backend

```
┌─────────────┐          HTTP Requests         ┌─────────────┐
│   React     │ ──────────────────────────────> │   Backend   │
│  Frontend   │ <────────────────────────────── │   Node.js   │
│  (Port 3001)│         JSON Responses         │  (Port 3000)│
└─────────────┘                                 └─────────────┘
```

---

## 🚀 Étape 1 : Initialisation du projet React

### 1.1 Créer le projet

Ouvrez un nouveau terminal (laissez le backend tourner) et créez le projet React :

```bash
# Retourner au dossier parent
cd /Users/mike/Documents/GitHub

# Créer le projet React avec Vite (plus rapide que Create React App)
npm create vite@latest ecommerce-frontend -- --template react

# Aller dans le dossier
cd ecommerce-frontend

# Installer les dépendances
npm install
```

### 1.2 Installer les bibliothèques nécessaires

```bash
# React Router pour la navigation
npm install react-router-dom

# Axios pour les appels API
npm install axios

# Pour les icônes
npm install lucide-react

# Pour les notifications toast (optionnel mais recommandé)
npm install react-hot-toast
```

### 1.3 Démarrer le projet

```bash
# Démarrer en mode développement
npm run dev
```

Votre application devrait s'ouvrir sur `http://localhost:5173`

### 1.4 Structure du projet à créer

```
ecommerce-frontend/
├── src/
│   ├── components/        # Composants réutilisables
│   ├── pages/             # Pages de l'application
│   ├── services/          # Appels API
│   ├── context/           # Context API (auth, cart)
│   ├── hooks/             # Custom hooks
│   ├── utils/             # Fonctions utilitaires
│   ├── App.jsx            # Composant principal
│   └── main.jsx           # Point d'entrée
├── public/                # Fichiers statiques
└── package.json
```

**🎯 Objectif de l'étape :** Avoir un projet React qui tourne

**✅ Critère de validation :** Vous voyez la page d'accueil par défaut de Vite dans votre navigateur

---

## ⚙️ Étape 2 : Configuration de base

### 2.1 Créer le service API

Créez `src/services/api.js` :

```javascript
import axios from 'axios';

// URL de base de votre backend
const API_URL = 'http://localhost:3000/api';

// Créer une instance axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token à chaque requête
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
```

**💡 Explication :**
- `axios.create()` : Crée une configuration réutilisable
- `interceptors.request` : Ajoute automatiquement le token JWT à chaque requête
- `localStorage` : Stocke le token dans le navigateur

### 2.2 Configurer le routeur

Modifiez `src/App.jsx` :

```javascript
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Pages (à créer ensuite)
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
```

**💡 Explication :**
- `BrowserRouter` : Permet la navigation sans rechargement de page
- `Routes` : Conteneur pour toutes les routes
- `Route` : Définit une URL et le composant à afficher
- `:id` : Paramètre dynamique dans l'URL

### 2.3 Créer un composant de navigation

Créez `src/components/Navbar.jsx` :

```javascript
import { Link } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Home } from 'lucide-react';
import './Navbar.css';

function Navbar({ user, onLogout, cartCount = 0 }) {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          🛒 E-Shop
        </Link>

        <ul className="navbar-menu">
          <li><Link to="/"><Home size={18} /> Accueil</Link></li>
          <li><Link to="/products">Produits</Link></li>

          {user ? (
            <>
              <li>
                <Link to="/cart">
                  <ShoppingCart size={18} />
                  Panier
                  {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                </Link>
              </li>
              <li><Link to="/orders">Mes commandes</Link></li>
              <li>
                <span className="user-name">
                  <User size={18} /> {user.name}
                </span>
              </li>
              <li>
                <button onClick={onLogout} className="logout-btn">
                  <LogOut size={18} /> Déconnexion
                </button>
              </li>
            </>
          ) : (
            <>
              <li><Link to="/login">Connexion</Link></li>
              <li><Link to="/register" className="register-btn">Inscription</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
```

Créez `src/components/Navbar.css` :

```css
.navbar {
  background-color: #2c3e50;
  color: white;
  padding: 1rem 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;
}

.navbar-logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  text-decoration: none;
}

.navbar-menu {
  display: flex;
  list-style: none;
  gap: 2rem;
  margin: 0;
  padding: 0;
  align-items: center;
}

.navbar-menu a,
.navbar-menu button {
  color: white;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: color 0.3s;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
}

.navbar-menu a:hover {
  color: #3498db;
}

.cart-badge {
  background-color: #e74c3c;
  color: white;
  border-radius: 50%;
  padding: 0.2rem 0.5rem;
  font-size: 0.8rem;
  margin-left: 0.3rem;
}

.register-btn {
  background-color: #3498db;
  padding: 0.5rem 1rem;
  border-radius: 5px;
}

.logout-btn:hover {
  color: #e74c3c;
}

.user-name {
  color: #95a5a6;
}
```

**🎯 Objectif de l'étape :** Avoir la structure de base configurée

**✅ Critère de validation :** Le routeur est configuré (même si les pages n'existent pas encore)

---

## 🔐 Étape 3 : Système d'authentification

### 3.1 Créer le Context d'authentification

Le Context permet de partager l'état utilisateur dans toute l'application.

Créez `src/context/AuthContext.jsx` :

```javascript
import { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Vérifier si un utilisateur est déjà connecté au chargement
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Fonction de connexion
  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data.data;

      // Sauvegarder dans localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      setUser(user);
      toast.success('Connexion réussie !');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Erreur de connexion';
      toast.error(message);
      return { success: false, message };
    }
  };

  // Fonction d'inscription
  const register = async (name, email, password) => {
    try {
      await api.post('/auth/register', { name, email, password });
      toast.success('Inscription réussie ! Vous pouvez vous connecter.');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Erreur d\'inscription';
      toast.error(message);
      return { success: false, message };
    }
  };

  // Fonction de déconnexion
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    toast.success('Déconnexion réussie');
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook personnalisé pour utiliser le context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};
```

**💡 Explication :**
- `createContext` : Crée un contexte pour partager des données
- `useState` : Stocke l'utilisateur connecté
- `useEffect` : Vérifie si un utilisateur est déjà connecté au chargement
- `localStorage` : Persiste les données dans le navigateur

### 3.2 Intégrer le Provider dans App

Modifiez `src/main.jsx` :

```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
      <Toaster position="top-right" />
    </AuthProvider>
  </React.StrictMode>
);
```

### 3.3 Créer la page de connexion

Créez `src/pages/Login.jsx` :

```javascript
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(email, password);

    setLoading(false);

    if (result.success) {
      navigate('/products'); // Rediriger vers les produits
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Connexion</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="votre@email.com"
            />
          </div>

          <div className="form-group">
            <label>Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Pas encore de compte ? <Link to="/register">S'inscrire</Link></p>

          <div className="demo-accounts">
            <h4>Comptes de test :</h4>
            <p><strong>Admin :</strong> admin@ecommerce.com / admin123</p>
            <p><strong>User :</strong> john@example.com / user123</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
```

### 3.4 Créer la page d'inscription

Créez `src/pages/Register.jsx` :

```javascript
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    setLoading(true);

    const result = await register(formData.name, formData.email, formData.password);

    setLoading(false);

    if (result.success) {
      navigate('/login');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Inscription</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nom complet</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="John Doe"
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="votre@email.com"
            />
          </div>

          <div className="form-group">
            <label>Mot de passe</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              placeholder="Au moins 6 caractères"
            />
          </div>

          <div className="form-group">
            <label>Confirmer le mot de passe</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Retapez votre mot de passe"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Inscription...' : 'S\'inscrire'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Déjà un compte ? <Link to="/login">Se connecter</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Register;
```

### 3.5 Styles pour l'authentification

Créez `src/pages/Auth.css` :

```css
.auth-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

.auth-box {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
}

.auth-box h2 {
  margin-bottom: 1.5rem;
  color: #2c3e50;
  text-align: center;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
}

.btn-primary {
  width: 100%;
  padding: 0.75rem;
  background-color: #667eea;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-primary:hover {
  background-color: #5568d3;
}

.btn-primary:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.auth-footer {
  margin-top: 1.5rem;
  text-align: center;
}

.auth-footer a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
}

.demo-accounts {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 5px;
  font-size: 0.9rem;
}

.demo-accounts h4 {
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

.demo-accounts p {
  margin: 0.3rem 0;
  color: #666;
}
```

**🎯 Objectif de l'étape :** Avoir un système d'authentification fonctionnel

**✅ Critère de validation :**
- Vous pouvez vous connecter avec `john@example.com / user123`
- Une notification de succès s'affiche
- Vous êtes redirigé vers `/products`

---

## 📦 Étape 4 : Affichage des produits

### 4.1 Créer le service produits

Créez `src/services/productService.js` :

```javascript
import api from './api';

export const productService = {
  // Récupérer tous les produits
  getAll: async (params = {}) => {
    const response = await api.get('/products', { params });
    return response.data.data;
  },

  // Récupérer un produit par ID
  getById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data.data;
  },

  // Créer un produit (admin)
  create: async (productData) => {
    const response = await api.post('/products', productData);
    return response.data.data;
  },

  // Mettre à jour un produit (admin)
  update: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data.data;
  },

  // Supprimer un produit (admin)
  delete: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
};
```

### 4.2 Créer le composant carte produit

Créez `src/components/ProductCard.jsx` :

```javascript
import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import './ProductCard.css';

function ProductCard({ product, onAddToCart }) {
  const { id, name, price, image_url, stock, avg_rating, reviews_count } = product;

  return (
    <div className="product-card">
      <Link to={`/products/${id}`}>
        <img
          src={image_url || 'https://via.placeholder.com/300x200?text=No+Image'}
          alt={name}
          className="product-image"
        />
      </Link>

      <div className="product-info">
        <Link to={`/products/${id}`}>
          <h3 className="product-name">{name}</h3>
        </Link>

        {avg_rating && (
          <div className="product-rating">
            <Star size={16} fill="#ffc107" color="#ffc107" />
            <span>{avg_rating} ({reviews_count} avis)</span>
          </div>
        )}

        <div className="product-footer">
          <p className="product-price">{price.toFixed(2)} €</p>

          {stock > 0 ? (
            <button
              onClick={() => onAddToCart(product)}
              className="btn-add-cart"
            >
              <ShoppingCart size={18} />
              Ajouter
            </button>
          ) : (
            <span className="out-of-stock">Rupture de stock</span>
          )}
        </div>

        {stock > 0 && stock < 10 && (
          <p className="low-stock">Plus que {stock} en stock !</p>
        )}
      </div>
    </div>
  );
}

export default ProductCard;
```

Créez `src/components/ProductCard.css` :

```css
.product-card {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.product-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.product-info {
  padding: 1rem;
}

.product-name {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  color: #2c3e50;
  text-decoration: none;
}

.product-name:hover {
  color: #3498db;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: #666;
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
}

.product-price {
  font-size: 1.5rem;
  font-weight: bold;
  color: #27ae60;
  margin: 0;
}

.btn-add-cart {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-add-cart:hover {
  background-color: #2980b9;
}

.out-of-stock {
  color: #e74c3c;
  font-weight: 600;
}

.low-stock {
  margin-top: 0.5rem;
  color: #e67e22;
  font-size: 0.9rem;
  font-weight: 500;
}
```

### 4.3 Créer la page produits

Créez `src/pages/Products.jsx` :

```javascript
import { useState, useEffect } from 'react';
import { productService } from '../services/productService';
import ProductCard from '../components/ProductCard';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Products.css';

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { user, logout } = useAuth();

  // Charger les produits
  useEffect(() => {
    loadProducts();
  }, [page, search]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAll({
        page,
        limit: 12,
        search
      });

      setProducts(data.products);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      toast.error('Erreur lors du chargement des produits');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    if (!user) {
      toast.error('Veuillez vous connecter pour ajouter au panier');
      return;
    }
    // On implémentera cette fonction dans l'étape 6
    toast.success(`${product.name} ajouté au panier !`);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1); // Revenir à la page 1 lors d'une recherche
  };

  return (
    <div>
      <Navbar user={user} onLogout={logout} />

      <div className="products-container">
        <h1>Nos Produits</h1>

        {/* Barre de recherche */}
        <form onSubmit={handleSearch} className="search-bar">
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit">Rechercher</button>
        </form>

        {/* Grille de produits */}
        {loading ? (
          <div className="loading">Chargement des produits...</div>
        ) : products.length === 0 ? (
          <div className="no-products">Aucun produit trouvé</div>
        ) : (
          <>
            <div className="products-grid">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                >
                  Précédent
                </button>

                <span>Page {page} sur {totalPages}</span>

                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                >
                  Suivant
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Products;
```

Créez `src/pages/Products.css` :

```css
.products-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.products-container h1 {
  text-align: center;
  margin-bottom: 2rem;
  color: #2c3e50;
}

.search-bar {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.search-bar input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
}

.search-bar button {
  padding: 0.75rem 1.5rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.search-bar button:hover {
  background-color: #2980b9;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.loading,
.no-products {
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
  color: #666;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}

.pagination button {
  padding: 0.5rem 1rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.pagination button:hover:not(:disabled) {
  background-color: #2980b9;
}

.pagination button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
```

**🎯 Objectif de l'étape :** Afficher la liste des produits

**✅ Critère de validation :**
- Vous voyez les 16 produits en grille
- La recherche fonctionne
- La pagination fonctionne

---

## 🔍 Étape 5 : Page détails produit

### 5.1 Créer la page détails

Créez `src/pages/ProductDetail.jsx` :

```javascript
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '../services/productService';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { Star, ShoppingCart, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import './ProductDetail.css';

function ProductDetail() {
  const { id } = useParams(); // Récupère l'ID depuis l'URL
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      const data = await productService.getById(id);
      setProduct(data);
    } catch (error) {
      toast.error('Produit non trouvé');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      toast.error('Veuillez vous connecter');
      navigate('/login');
      return;
    }
    toast.success(`${quantity} x ${product.name} ajouté au panier !`);
  };

  if (loading) {
    return (
      <div>
        <Navbar user={user} onLogout={logout} />
        <div className="loading">Chargement...</div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div>
      <Navbar user={user} onLogout={logout} />

      <div className="product-detail-container">
        <button onClick={() => navigate(-1)} className="back-btn">
          <ArrowLeft size={20} /> Retour
        </button>

        <div className="product-detail">
          {/* Image */}
          <div className="product-detail-image">
            <img
              src={product.image_url || 'https://via.placeholder.com/500'}
              alt={product.name}
            />
          </div>

          {/* Informations */}
          <div className="product-detail-info">
            <h1>{product.name}</h1>

            <div className="product-category">
              Catégorie : {product.category_name || 'Non catégorisé'}
            </div>

            {product.avg_rating && (
              <div className="product-rating-detail">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={24}
                    fill={star <= product.avg_rating ? '#ffc107' : 'none'}
                    color="#ffc107"
                  />
                ))}
                <span className="rating-text">
                  {product.avg_rating} / 5 ({product.reviews_count} avis)
                </span>
              </div>
            )}

            <div className="product-price-detail">
              {product.price.toFixed(2)} €
            </div>

            <p className="product-description">{product.description}</p>

            <div className="product-stock">
              {product.stock > 0 ? (
                <span className="in-stock">✓ En stock ({product.stock} disponibles)</span>
              ) : (
                <span className="out-of-stock">✗ Rupture de stock</span>
              )}
            </div>

            {product.stock > 0 && (
              <div className="add-to-cart-section">
                <div className="quantity-selector">
                  <label>Quantité :</label>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    min="1"
                    max={product.stock}
                  />
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  >
                    +
                  </button>
                </div>

                <button onClick={handleAddToCart} className="btn-add-cart-detail">
                  <ShoppingCart size={20} />
                  Ajouter au panier
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Section avis */}
        {product.reviews && product.reviews.length > 0 && (
          <div className="reviews-section">
            <h2>Avis clients ({product.reviews_count})</h2>

            {product.reviews.map((review) => (
              <div key={review.id} className="review-card">
                <div className="review-header">
                  <strong>{review.user_name}</strong>
                  <div className="review-rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={16}
                        fill={star <= review.rating ? '#ffc107' : 'none'}
                        color="#ffc107"
                      />
                    ))}
                  </div>
                </div>
                <p className="review-comment">{review.comment}</p>
                <small className="review-date">
                  {new Date(review.created_at).toLocaleDateString('fr-FR')}
                </small>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetail;
```

Créez `src/pages/ProductDetail.css` :

```css
.product-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #ecf0f1;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 2rem;
  transition: background-color 0.3s;
}

.back-btn:hover {
  background-color: #bdc3c7;
}

.product-detail {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-bottom: 3rem;
}

.product-detail-image img {
  width: 100%;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.product-detail-info h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #2c3e50;
}

.product-category {
  display: inline-block;
  padding: 0.3rem 1rem;
  background-color: #ecf0f1;
  border-radius: 20px;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.product-rating-detail {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.rating-text {
  font-size: 1.1rem;
  color: #666;
}

.product-price-detail {
  font-size: 2.5rem;
  font-weight: bold;
  color: #27ae60;
  margin: 1.5rem 0;
}

.product-description {
  line-height: 1.6;
  color: #555;
  margin-bottom: 1.5rem;
}

.product-stock {
  margin-bottom: 1.5rem;
}

.in-stock {
  color: #27ae60;
  font-weight: 600;
}

.out-of-stock {
  color: #e74c3c;
  font-weight: 600;
}

.add-to-cart-section {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.quantity-selector {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.quantity-selector button {
  width: 35px;
  height: 35px;
  border: 1px solid #ddd;
  background-color: white;
  cursor: pointer;
  border-radius: 5px;
  font-size: 1.2rem;
  transition: background-color 0.3s;
}

.quantity-selector button:hover {
  background-color: #ecf0f1;
}

.quantity-selector input {
  width: 60px;
  text-align: center;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
}

.btn-add-cart-detail {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-add-cart-detail:hover {
  background-color: #2980b9;
}

.reviews-section {
  margin-top: 3rem;
}

.reviews-section h2 {
  margin-bottom: 1.5rem;
  color: #2c3e50;
}

.review-card {
  background-color: #f8f9fa;
  padding: 1.5rem;
  border-radius: 10px;
  margin-bottom: 1rem;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.review-rating {
  display: flex;
  gap: 0.2rem;
}

.review-comment {
  margin: 0.5rem 0;
  line-height: 1.6;
  color: #555;
}

.review-date {
  color: #999;
}

@media (max-width: 768px) {
  .product-detail {
    grid-template-columns: 1fr;
  }

  .add-to-cart-section {
    flex-direction: column;
    align-items: stretch;
  }
}
```

**🎯 Objectif de l'étape :** Afficher les détails d'un produit

**✅ Critère de validation :**
- Cliquer sur un produit affiche sa page détails
- Les avis s'affichent
- Le sélecteur de quantité fonctionne

---

## 🛒 Étape 6 : Panier d'achat

### 6.1 Créer le Context du panier

Créez `src/context/CartContext.jsx` :

```javascript
import { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  // Charger le panier au démarrage
  const loadCart = async () => {
    try {
      setLoading(true);
      const response = await api.get('/cart');
      setCart(response.data.data);
    } catch (error) {
      console.error('Erreur chargement panier:', error);
    } finally {
      setLoading(false);
    }
  };

  // Ajouter au panier
  const addToCart = async (productId, quantity = 1) => {
    try {
      await api.post('/cart/add', { product_id: productId, quantity });
      await loadCart(); // Recharger le panier
      toast.success('Produit ajouté au panier !');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur');
    }
  };

  // Mettre à jour la quantité
  const updateQuantity = async (itemId, quantity) => {
    try {
      await api.put(`/cart/item/${itemId}`, { quantity });
      await loadCart();
      toast.success('Quantité mise à jour');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur');
    }
  };

  // Retirer du panier
  const removeFromCart = async (itemId) => {
    try {
      await api.delete(`/cart/item/${itemId}`);
      await loadCart();
      toast.success('Produit retiré du panier');
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  // Vider le panier
  const clearCart = async () => {
    try {
      await api.delete('/cart/clear');
      await loadCart();
      toast.success('Panier vidé');
    } catch (error) {
      toast.error('Erreur');
    }
  };

  const value = {
    cart,
    loading,
    loadCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    itemsCount: cart?.items?.length || 0,
    total: cart?.total || 0,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart doit être utilisé dans un CartProvider');
  }
  return context;
};
```

### 6.2 Intégrer le CartProvider

Modifiez `src/main.jsx` :

```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <App />
        <Toaster position="top-right" />
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);
```

### 6.3 Créer la page panier

Créez `src/pages/Cart.jsx` :

```javascript
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import './Cart.css';

function Cart() {
  const { user, logout } = useAuth();
  const { cart, loading, loadCart, updateQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      loadCart();
    }
  }, [user]);

  if (!user) {
    return (
      <div>
        <Navbar user={user} onLogout={logout} />
        <div className="cart-empty">
          <p>Veuillez vous connecter pour voir votre panier</p>
          <button onClick={() => navigate('/login')}>Se connecter</button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div>
        <Navbar user={user} onLogout={logout} />
        <div className="loading">Chargement du panier...</div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div>
        <Navbar user={user} onLogout={logout} />
        <div className="cart-empty">
          <ShoppingBag size={64} color="#ccc" />
          <h2>Votre panier est vide</h2>
          <button onClick={() => navigate('/products')} className="btn-primary">
            Continuer mes achats
          </button>
        </div>
      </div>
    );
  }

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div>
      <Navbar user={user} onLogout={logout} cartCount={cart.items_count} />

      <div className="cart-container">
        <h1>Mon Panier ({cart.items_count} article{cart.items_count > 1 ? 's' : ''})</h1>

        <div className="cart-layout">
          {/* Liste des articles */}
          <div className="cart-items">
            {cart.items.map((item) => (
              <div key={item.id} className="cart-item">
                <img
                  src={item.image_url || 'https://via.placeholder.com/100'}
                  alt={item.name}
                  className="cart-item-image"
                />

                <div className="cart-item-info">
                  <h3>{item.name}</h3>
                  <p className="cart-item-price">{item.price.toFixed(2)} €</p>
                </div>

                <div className="cart-item-quantity">
                  <button
                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                    disabled={item.quantity <= 1}
                  >
                    <Minus size={16} />
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    disabled={item.quantity >= item.stock}
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <div className="cart-item-subtotal">
                  {item.subtotal.toFixed(2)} €
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="cart-item-remove"
                  title="Retirer du panier"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>

          {/* Résumé */}
          <div className="cart-summary">
            <h2>Résumé de la commande</h2>

            <div className="summary-line">
              <span>Sous-total</span>
              <span>{cart.total} €</span>
            </div>

            <div className="summary-line">
              <span>Livraison</span>
              <span>Gratuite</span>
            </div>

            <div className="summary-total">
              <span>Total</span>
              <span>{cart.total} €</span>
            </div>

            <button onClick={handleCheckout} className="btn-checkout">
              Passer la commande
            </button>

            <button onClick={clearCart} className="btn-clear-cart">
              Vider le panier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
```

Créez `src/pages/Cart.css` :

```css
.cart-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.cart-container h1 {
  margin-bottom: 2rem;
  color: #2c3e50;
}

.cart-layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cart-item {
  display: grid;
  grid-template-columns: 100px 1fr auto auto auto;
  gap: 1rem;
  align-items: center;
  background: white;
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.cart-item-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 5px;
}

.cart-item-info h3 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
}

.cart-item-price {
  color: #27ae60;
  font-weight: 600;
  margin: 0;
}

.cart-item-quantity {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #f8f9fa;
  padding: 0.5rem;
  border-radius: 5px;
}

.cart-item-quantity button {
  width: 30px;
  height: 30px;
  border: none;
  background-color: white;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s;
}

.cart-item-quantity button:hover:not(:disabled) {
  background-color: #3498db;
  color: white;
}

.cart-item-quantity button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.cart-item-quantity span {
  min-width: 30px;
  text-align: center;
  font-weight: 600;
}

.cart-item-subtotal {
  font-size: 1.2rem;
  font-weight: bold;
  color: #27ae60;
  min-width: 100px;
  text-align: right;
}

.cart-item-remove {
  padding: 0.5rem;
  background-color: transparent;
  border: none;
  color: #e74c3c;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.cart-item-remove:hover {
  background-color: #fee;
}

.cart-summary {
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: fit-content;
  position: sticky;
  top: 2rem;
}

.cart-summary h2 {
  margin-top: 0;
  color: #2c3e50;
  font-size: 1.3rem;
}

.summary-line {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  color: #666;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  font-size: 1.5rem;
  font-weight: bold;
  color: #2c3e50;
  padding-top: 1rem;
  border-top: 2px solid #ecf0f1;
  margin-top: 1rem;
  margin-bottom: 1.5rem;
}

.btn-checkout {
  width: 100%;
  padding: 1rem;
  background-color: #27ae60;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-bottom: 1rem;
}

.btn-checkout:hover {
  background-color: #229954;
}

.btn-clear-cart {
  width: 100%;
  padding: 0.75rem;
  background-color: transparent;
  color: #e74c3c;
  border: 1px solid #e74c3c;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-clear-cart:hover {
  background-color: #e74c3c;
  color: white;
}

.cart-empty {
  text-align: center;
  padding: 4rem 2rem;
}

.cart-empty h2 {
  margin: 1rem 0;
  color: #666;
}

.cart-empty button {
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
}

@media (max-width: 768px) {
  .cart-layout {
    grid-template-columns: 1fr;
  }

  .cart-item {
    grid-template-columns: 80px 1fr;
    gap: 0.5rem;
  }

  .cart-item-quantity,
  .cart-item-subtotal,
  .cart-item-remove {
    grid-column: 2;
  }
}
```

**🎯 Objectif de l'étape :** Avoir un panier fonctionnel

**✅ Critère de validation :**
- Ajouter un produit au panier fonctionne
- Modifier les quantités fonctionne
- Supprimer un article fonctionne
- Le badge du panier dans la navbar affiche le bon nombre

---

**💡 Points clés à retenir pour les apprenants :**

1. **Gestion d'état** : Utilisation de Context API pour partager le panier
2. **Appels API** : Utilisation d'axios avec intercepteurs
3. **React Router** : Navigation entre les pages
4. **Hooks** : useState, useEffect, useContext
5. **Props** : Communication parent-enfant
6. **Async/Await** : Gestion des appels asynchrones

---

## 📦 Suite du guide...

Les prochaines étapes incluront :
- ✅ Étape 7 : Processus de commande
- ✅ Étape 8 : Interface admin (CRUD produits)
- ✅ Étape 9 : Wishlist, profil utilisateur, historique commandes
- ✅ Étape 10 : Améliorations (filtres avancés, tri, etc.)

Ce guide continue avec autant de détails pour chaque étape. Voulez-vous que je complète les étapes suivantes ?
