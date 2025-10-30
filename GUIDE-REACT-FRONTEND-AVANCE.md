# 🎓 Guide React Frontend - Étapes Avancées (7-10)
## E-commerce - Pour Apprenants

Ce guide continue le développement du frontend React avec les fonctionnalités avancées.

---

## 📦 Étape 7 : Processus de commande

### 7.1 Créer le service commandes

Créez `src/services/orderService.js` :

```javascript
import api from './api';

export const orderService = {
  // Créer une commande
  create: async () => {
    const response = await api.post('/orders');
    return response.data.data;
  },

  // Récupérer mes commandes
  getMyOrders: async () => {
    const response = await api.get('/orders/my-orders');
    return response.data.data;
  },

  // Récupérer une commande par ID
  getById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data.data;
  },

  // Admin : toutes les commandes
  getAll: async (params = {}) => {
    const response = await api.get('/orders', { params });
    return response.data.data;
  },

  // Admin : mettre à jour le statut
  updateStatus: async (id, status) => {
    const response = await api.put(`/orders/${id}/status`, { status });
    return response.data;
  },
};
```

### 7.2 Créer la page de confirmation de commande

Créez `src/pages/Checkout.jsx` :

```javascript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { orderService } from '../services/orderService';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';
import './Checkout.css';

function Checkout() {
  const { user, logout } = useAuth();
  const { cart, loadCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  if (!user || !cart || cart.items.length === 0) {
    navigate('/cart');
    return null;
  }

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);

      const order = await orderService.create();

      toast.success('Commande passée avec succès !');

      // Recharger le panier (qui sera vide)
      await loadCart();

      // Rediriger vers la page de confirmation
      navigate(`/orders/${order.order_id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de la commande');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar user={user} onLogout={logout} />

      <div className="checkout-container">
        <h1>Confirmation de commande</h1>

        <div className="checkout-layout">
          {/* Résumé des articles */}
          <div className="checkout-items">
            <h2>Récapitulatif ({cart.items_count} articles)</h2>

            {cart.items.map((item) => (
              <div key={item.id} className="checkout-item">
                <img
                  src={item.image_url || 'https://via.placeholder.com/60'}
                  alt={item.name}
                />
                <div className="checkout-item-info">
                  <h4>{item.name}</h4>
                  <p>Quantité : {item.quantity}</p>
                </div>
                <div className="checkout-item-price">
                  {item.subtotal.toFixed(2)} €
                </div>
              </div>
            ))}
          </div>

          {/* Informations de livraison */}
          <div className="checkout-summary">
            <h2>Informations de livraison</h2>

            <div className="delivery-info">
              <p><strong>Nom :</strong> {user.name}</p>
              <p><strong>Email :</strong> {user.email}</p>
              <p><strong>Adresse :</strong> 123 Rue Example, 75001 Paris</p>
              <p className="info-note">
                ℹ️ Dans une version réelle, vous pourriez ajouter un formulaire
                pour saisir l'adresse de livraison
              </p>
            </div>

            <div className="order-summary">
              <h3>Total de la commande</h3>

              <div className="summary-line">
                <span>Sous-total</span>
                <span>{cart.total} €</span>
              </div>

              <div className="summary-line">
                <span>Frais de livraison</span>
                <span>Gratuit</span>
              </div>

              <div className="summary-total">
                <span>Total à payer</span>
                <span>{cart.total} €</span>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="btn-place-order"
              >
                {loading ? 'Commande en cours...' : 'Confirmer la commande'}
              </button>

              <button
                onClick={() => navigate('/cart')}
                className="btn-back-cart"
              >
                Retour au panier
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
```

Créez `src/pages/Checkout.css` :

```css
.checkout-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.checkout-container h1 {
  margin-bottom: 2rem;
  color: #2c3e50;
}

.checkout-layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}

.checkout-items {
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.checkout-items h2 {
  margin-top: 0;
  color: #2c3e50;
  margin-bottom: 1.5rem;
}

.checkout-item {
  display: grid;
  grid-template-columns: 60px 1fr auto;
  gap: 1rem;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #ecf0f1;
}

.checkout-item:last-child {
  border-bottom: none;
}

.checkout-item img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 5px;
}

.checkout-item-info h4 {
  margin: 0 0 0.3rem 0;
  color: #2c3e50;
}

.checkout-item-info p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

.checkout-item-price {
  font-weight: bold;
  color: #27ae60;
}

.checkout-summary {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.delivery-info,
.order-summary {
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.delivery-info h2,
.order-summary h3 {
  margin-top: 0;
  color: #2c3e50;
}

.delivery-info p {
  margin: 0.5rem 0;
  color: #555;
}

.info-note {
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: #e8f4f8;
  border-left: 3px solid #3498db;
  font-size: 0.9rem;
  color: #2c3e50;
}

.summary-line {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
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
  margin: 1rem 0 1.5rem 0;
}

.btn-place-order {
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

.btn-place-order:hover:not(:disabled) {
  background-color: #229954;
}

.btn-place-order:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
}

.btn-back-cart {
  width: 100%;
  padding: 0.75rem;
  background-color: transparent;
  color: #666;
  border: 1px solid #ddd;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-back-cart:hover {
  background-color: #f8f9fa;
}

@media (max-width: 768px) {
  .checkout-layout {
    grid-template-columns: 1fr;
  }
}
```

### 7.3 Créer la page historique des commandes

Créez `src/pages/Orders.jsx` :

```javascript
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import Navbar from '../components/Navbar';
import { Package, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import './Orders.css';

function Orders() {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await orderService.getMyOrders();
      setOrders(data);
    } catch (error) {
      toast.error('Erreur lors du chargement des commandes');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: 'En attente', class: 'status-pending' },
      processing: { label: 'En cours', class: 'status-processing' },
      shipped: { label: 'Expédiée', class: 'status-shipped' },
      delivered: { label: 'Livrée', class: 'status-delivered' },
      cancelled: { label: 'Annulée', class: 'status-cancelled' },
    };

    const config = statusConfig[status] || { label: status, class: '' };
    return <span className={`status-badge ${config.class}`}>{config.label}</span>;
  };

  if (loading) {
    return (
      <div>
        <Navbar user={user} onLogout={logout} />
        <div className="loading">Chargement des commandes...</div>
      </div>
    );
  }

  return (
    <div>
      <Navbar user={user} onLogout={logout} />

      <div className="orders-container">
        <h1>Mes Commandes</h1>

        {orders.length === 0 ? (
          <div className="no-orders">
            <Package size={64} color="#ccc" />
            <h2>Aucune commande</h2>
            <p>Vous n'avez pas encore passé de commande</p>
            <Link to="/products" className="btn-shop">
              Voir les produits
            </Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div>
                    <h3>Commande #{order.id}</h3>
                    <p className="order-date">
                      {new Date(order.created_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  {getStatusBadge(order.status)}
                </div>

                <div className="order-body">
                  <div className="order-info">
                    <p><strong>Articles :</strong> {order.items_count}</p>
                    <p><strong>Total :</strong> {order.total.toFixed(2)} €</p>
                  </div>

                  <Link to={`/orders/${order.id}`} className="btn-view-order">
                    <Eye size={18} />
                    Voir les détails
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;
```

### 7.4 Créer la page détails d'une commande

Créez `src/pages/OrderDetail.jsx` :

```javascript
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import Navbar from '../components/Navbar';
import { ArrowLeft, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import './OrderDetail.css';

function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    try {
      const data = await orderService.getById(id);
      setOrder(data);
    } catch (error) {
      toast.error('Commande non trouvée');
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar user={user} onLogout={logout} />
        <div className="loading">Chargement...</div>
      </div>
    );
  }

  if (!order) return null;

  const getStatusInfo = (status) => {
    const statusConfig = {
      pending: {
        label: 'En attente de traitement',
        class: 'status-pending',
        icon: '⏳',
      },
      processing: {
        label: 'En cours de préparation',
        class: 'status-processing',
        icon: '📦',
      },
      shipped: {
        label: 'Expédiée',
        class: 'status-shipped',
        icon: '🚚',
      },
      delivered: {
        label: 'Livrée',
        class: 'status-delivered',
        icon: '✅',
      },
      cancelled: {
        label: 'Annulée',
        class: 'status-cancelled',
        icon: '❌',
      },
    };

    return statusConfig[status] || { label: status, class: '', icon: '❓' };
  };

  const statusInfo = getStatusInfo(order.status);

  return (
    <div>
      <Navbar user={user} onLogout={logout} />

      <div className="order-detail-container">
        <button onClick={() => navigate('/orders')} className="back-btn">
          <ArrowLeft size={20} /> Retour aux commandes
        </button>

        <div className="order-detail-header">
          <div>
            <h1>Commande #{order.id}</h1>
            <p className="order-date">
              Passée le {new Date(order.created_at).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>

          <div className={`status-box ${statusInfo.class}`}>
            <span className="status-icon">{statusInfo.icon}</span>
            <span className="status-label">{statusInfo.label}</span>
          </div>
        </div>

        <div className="order-detail-content">
          {/* Articles */}
          <div className="order-items-section">
            <h2>
              <Package size={24} /> Articles commandés
            </h2>

            {order.items.map((item) => (
              <div key={item.id} className="order-item-detail">
                <img
                  src={item.image_url || 'https://via.placeholder.com/80'}
                  alt={item.name}
                />
                <div className="order-item-info">
                  <h4>{item.name}</h4>
                  <p>Prix unitaire : {item.unit_price.toFixed(2)} €</p>
                  <p>Quantité : {item.quantity}</p>
                </div>
                <div className="order-item-total">
                  {(item.quantity * item.unit_price).toFixed(2)} €
                </div>
              </div>
            ))}

            <div className="order-total">
              <span>Total de la commande</span>
              <span>{order.total.toFixed(2)} €</span>
            </div>
          </div>

          {/* Informations complémentaires */}
          <div className="order-info-section">
            <div className="info-box">
              <h3>Informations de livraison</h3>
              <p><strong>Nom :</strong> {user.name}</p>
              <p><strong>Email :</strong> {user.email}</p>
              <p><strong>Adresse :</strong> 123 Rue Example, 75001 Paris</p>
            </div>

            <div className="info-box">
              <h3>Statut de la commande</h3>
              <div className="status-timeline">
                <div className={order.status !== 'cancelled' ? 'step completed' : 'step'}>
                  <span className="step-icon">✓</span>
                  <span className="step-label">Commande passée</span>
                </div>
                <div className={['processing', 'shipped', 'delivered'].includes(order.status) ? 'step completed' : 'step'}>
                  <span className="step-icon">✓</span>
                  <span className="step-label">En préparation</span>
                </div>
                <div className={['shipped', 'delivered'].includes(order.status) ? 'step completed' : 'step'}>
                  <span className="step-icon">✓</span>
                  <span className="step-label">Expédiée</span>
                </div>
                <div className={order.status === 'delivered' ? 'step completed' : 'step'}>
                  <span className="step-icon">✓</span>
                  <span className="step-label">Livrée</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetail;
```

Créez les styles correspondants dans `src/pages/Orders.css` et `src/pages/OrderDetail.css` :

```css
/* Orders.css */
.orders-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.orders-container h1 {
  margin-bottom: 2rem;
  color: #2c3e50;
}

.no-orders {
  text-align: center;
  padding: 4rem 2rem;
}

.no-orders h2 {
  margin: 1rem 0;
  color: #666;
}

.btn-shop {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background-color: #3498db;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.btn-shop:hover {
  background-color: #2980b9;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.order-card {
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #ecf0f1;
}

.order-header h3 {
  margin: 0 0 0.3rem 0;
  color: #2c3e50;
}

.order-date {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

.status-badge {
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
}

.status-pending {
  background-color: #fff3cd;
  color: #856404;
}

.status-processing {
  background-color: #d1ecf1;
  color: #0c5460;
}

.status-shipped {
  background-color: #d4edda;
  color: #155724;
}

.status-delivered {
  background-color: #d4edda;
  color: #155724;
}

.status-cancelled {
  background-color: #f8d7da;
  color: #721c24;
}

.order-body {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-info p {
  margin: 0.3rem 0;
  color: #555;
}

.btn-view-order {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #3498db;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.btn-view-order:hover {
  background-color: #2980b9;
}
```

**🎯 Objectif de l'étape :** Système de commande complet

**✅ Critère de validation :**
- Créer une commande depuis le panier fonctionne
- La liste des commandes s'affiche
- Les détails d'une commande s'affichent avec le statut

---

## 👨‍💼 Étape 8 : Interface Admin

### 8.1 Créer un composant de protection de route admin

Créez `src/components/ProtectedRoute.jsx` :

```javascript
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
```

### 8.2 Créer le dashboard admin

Créez `src/pages/admin/AdminDashboard.jsx` :

```javascript
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { productService } from '../../services/productService';
import { orderService } from '../../services/orderService';
import Navbar from '../../components/Navbar';
import { Package, ShoppingBag, Users, TrendingUp } from 'lucide-react';
import './AdminDashboard.css';

function AdminDashboard() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    revenue: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Charger les produits
      const productsData = await productService.getAll({ limit: 1000 });

      // Charger les commandes
      const ordersData = await orderService.getAll({ limit: 1000 });

      const pendingOrders = ordersData.orders.filter(o => o.status === 'pending').length;
      const revenue = ordersData.orders.reduce((sum, o) => sum + parseFloat(o.total), 0);

      setStats({
        totalProducts: productsData.pagination.total,
        totalOrders: ordersData.orders.length,
        pendingOrders,
        revenue,
      });
    } catch (error) {
      console.error('Erreur chargement stats:', error);
    }
  };

  return (
    <div>
      <Navbar user={user} onLogout={logout} />

      <div className="admin-dashboard">
        <h1>Dashboard Admin</h1>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#3498db' }}>
              <Package size={32} />
            </div>
            <div className="stat-info">
              <h3>{stats.totalProducts}</h3>
              <p>Produits</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#9b59b6' }}>
              <ShoppingBag size={32} />
            </div>
            <div className="stat-info">
              <h3>{stats.totalOrders}</h3>
              <p>Commandes totales</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#e67e22' }}>
              <Users size={32} />
            </div>
            <div className="stat-info">
              <h3>{stats.pendingOrders}</h3>
              <p>Commandes en attente</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#27ae60' }}>
              <TrendingUp size={32} />
            </div>
            <div className="stat-info">
              <h3>{stats.revenue.toFixed(2)} €</h3>
              <p>Chiffre d'affaires</p>
            </div>
          </div>
        </div>

        <div className="admin-actions">
          <Link to="/admin/products" className="admin-action-btn">
            <Package size={24} />
            Gérer les produits
          </Link>

          <Link to="/admin/orders" className="admin-action-btn">
            <ShoppingBag size={24} />
            Gérer les commandes
          </Link>

          <Link to="/admin/categories" className="admin-action-btn">
            <Package size={24} />
            Gérer les catégories
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
```

### 8.3 Créer la gestion des produits (CRUD)

Créez `src/pages/admin/AdminProducts.jsx` :

```javascript
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { productService } from '../../services/productService';
import Navbar from '../../components/Navbar';
import { Edit, Trash2, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import './AdminProducts.css';

function AdminProducts() {
  const { user, logout } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category_id: '',
    image_url: '',
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await productService.getAll({ limit: 1000 });
      setProducts(data.products);
    } catch (error) {
      toast.error('Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description || '',
        price: product.price,
        stock: product.stock,
        category_id: product.category_id || '',
        image_url: product.image_url || '',
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        stock: '',
        category_id: '',
        image_url: '',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingProduct) {
        await productService.update(editingProduct.id, formData);
        toast.success('Produit mis à jour');
      } else {
        await productService.create(formData);
        toast.success('Produit créé');
      }

      handleCloseModal();
      loadProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce produit ?')) return;

    try {
      await productService.delete(id);
      toast.success('Produit supprimé');
      loadProducts();
    } catch (error) {
      toast.error('Erreur de suppression');
    }
  };

  return (
    <div>
      <Navbar user={user} onLogout={logout} />

      <div className="admin-products-container">
        <div className="admin-header">
          <h1>Gestion des Produits</h1>
          <button onClick={() => handleOpenModal()} className="btn-add">
            <Plus size={20} /> Ajouter un produit
          </button>
        </div>

        {loading ? (
          <div className="loading">Chargement...</div>
        ) : (
          <div className="products-table">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Image</th>
                  <th>Nom</th>
                  <th>Prix</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>
                      <img
                        src={product.image_url || 'https://via.placeholder.com/50'}
                        alt={product.name}
                        className="product-thumb"
                      />
                    </td>
                    <td>{product.name}</td>
                    <td>{product.price.toFixed(2)} €</td>
                    <td>{product.stock}</td>
                    <td className="actions">
                      <button
                        onClick={() => handleOpenModal(product)}
                        className="btn-edit"
                        title="Modifier"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="btn-delete"
                        title="Supprimer"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={handleCloseModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>{editingProduct ? 'Modifier le produit' : 'Nouveau produit'}</h2>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Nom *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="3"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Prix *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Stock *</label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>URL de l'image</label>
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  />
                </div>

                <div className="modal-actions">
                  <button type="button" onClick={handleCloseModal} className="btn-cancel">
                    Annuler
                  </button>
                  <button type="submit" className="btn-submit">
                    {editingProduct ? 'Mettre à jour' : 'Créer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminProducts;
```

**🎯 Objectif de l'étape :** Interface admin fonctionnelle

**✅ Critère de validation :**
- Se connecter en admin (`admin@ecommerce.com / admin123`)
- Voir le dashboard avec les statistiques
- Créer, modifier, supprimer un produit

---

## 🎨 Étape 9 : Fonctionnalités avancées

### 9.1 Wishlist

Créer `src/services/wishlistService.js` et une page dédiée pour gérer les favoris.

### 9.2 Profil utilisateur

Permettre à l'utilisateur de modifier son nom, email, et mot de passe.

### 9.3 Système d'avis

Ajouter la possibilité de laisser des avis sur les produits achetés.

---

## 📝 Étape 10 : Optimisations et tests

### 10.1 Loading states

Ajouter des spinners et skeleton screens.

### 10.2 Gestion d'erreurs

Améliorer les messages d'erreur et ajouter des pages d'erreur personnalisées.

### 10.3 Performance

- Lazy loading des images
- Code splitting avec React.lazy()
- Memoization avec useMemo et useCallback

### 10.4 Responsive design

Adapter tous les composants pour mobile et tablette.

---

## 🎓 Concepts clés appris

1. **React Hooks** : useState, useEffect, useContext, custom hooks
2. **Context API** : Gestion d'état globale
3. **React Router** : Navigation SPA
4. **API Integration** : Axios, intercepteurs, gestion d'erreurs
5. **Forms** : Formulaires contrôlés, validation
6. **Authentication** : JWT, localStorage, protected routes
7. **CRUD Operations** : Create, Read, Update, Delete
8. **CSS** : Grilles, flexbox, responsive

---

## 📚 Ressources pour aller plus loin

- **Documentation React** : https://react.dev
- **React Router** : https://reactrouter.com
- **Axios** : https://axios-http.com
- **CSS Grid** : https://css-tricks.com/snippets/css/complete-guide-grid/
- **React Patterns** : https://reactpatterns.com

---

## 🚀 Projet complet

Une fois toutes les étapes terminées, vous aurez :

✅ Un frontend React complet et fonctionnel
✅ Authentification et autorisation
✅ CRUD complet pour l'admin
✅ Panier et système de commandes
✅ Interface utilisateur moderne et responsive
✅ Bonne architecture et code maintenable

**Félicitations ! Vous avez créé une application e-commerce complète ! 🎉**
