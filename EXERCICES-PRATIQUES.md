# 💪 Exercices Pratiques - Frontend React E-commerce
## Pour Apprenants

Ce document contient des exercices pratiques pour mettre en pratique ce que vous avez appris.

---

## 📋 Niveau 1 : Débutant

### Exercice 1.1 : Personnaliser la navbar

**Objectif** : Modifier l'apparence de la barre de navigation

**Consignes** :
1. Changer les couleurs de la navbar (fond et texte)
2. Ajouter un logo personnalisé
3. Changer les icônes

**Fichiers à modifier** :
- `src/components/Navbar.jsx`
- `src/components/Navbar.css`

**Critères de réussite** :
- ✅ La navbar a une nouvelle couleur
- ✅ Le logo s'affiche correctement
- ✅ Les icônes sont différentes

---

### Exercice 1.2 : Ajouter un footer

**Objectif** : Créer un composant Footer réutilisable

**Consignes** :
1. Créer `src/components/Footer.jsx`
2. Créer `src/components/Footer.css`
3. Afficher : liens, réseaux sociaux, copyright
4. L'ajouter sur toutes les pages

**Structure suggérée** :
```
Footer
├── Colonne 1 : À propos
├── Colonne 2 : Liens utiles
├── Colonne 3 : Contact
└── Copyright
```

**Critères de réussite** :
- ✅ Le footer s'affiche en bas de chaque page
- ✅ Il contient au moins 3 colonnes
- ✅ Le design est cohérent avec le site

---

### Exercice 1.3 : Créer une page "À propos"

**Objectif** : Ajouter une nouvelle page statique

**Consignes** :
1. Créer `src/pages/About.jsx`
2. Ajouter la route dans `App.jsx`
3. Ajouter un lien dans la navbar
4. Ajouter du contenu : histoire, mission, valeurs

**Critères de réussite** :
- ✅ La page est accessible via `/about`
- ✅ Le lien fonctionne dans la navbar
- ✅ La page contient du texte et des images

---

## 📋 Niveau 2 : Intermédiaire

### Exercice 2.1 : Filtres avancés pour les produits

**Objectif** : Ajouter des filtres sur la page produits

**Consignes** :
1. Ajouter un filtre par catégorie (dropdown)
2. Ajouter un filtre par prix (min/max)
3. Ajouter un filtre par disponibilité (en stock / tout)
4. Afficher le nombre de résultats

**Fichiers à modifier** :
- `src/pages/Products.jsx`
- `src/pages/Products.css`

**Exemple de code** :
```javascript
const [filters, setFilters] = useState({
  category: '',
  minPrice: '',
  maxPrice: '',
  inStock: false,
});

// Dans useEffect
useEffect(() => {
  loadProducts({
    ...filters,
    search,
    page,
  });
}, [filters, search, page]);
```

**Critères de réussite** :
- ✅ Les filtres fonctionnent
- ✅ Les résultats se mettent à jour en temps réel
- ✅ Le compteur de résultats est affiché
- ✅ Un bouton "Réinitialiser les filtres" est présent

---

### Exercice 2.2 : Tri des produits

**Objectif** : Permettre de trier les produits

**Consignes** :
1. Ajouter un dropdown "Trier par"
2. Options : Prix croissant, Prix décroissant, Nom A-Z, Nouveautés
3. Trier côté frontend (pas backend)

**Exemple** :
```javascript
const sortProducts = (products, sortBy) => {
  switch (sortBy) {
    case 'price_asc':
      return [...products].sort((a, b) => a.price - b.price);
    case 'price_desc':
      return [...products].sort((a, b) => b.price - a.price);
    case 'name':
      return [...products].sort((a, b) => a.name.localeCompare(b.name));
    default:
      return products;
  }
};
```

**Critères de réussite** :
- ✅ Le tri fonctionne pour toutes les options
- ✅ L'ordre change instantanément
- ✅ Le tri persiste lors de la pagination

---

### Exercice 2.3 : Ajouter un système de notation

**Objectif** : Permettre aux utilisateurs de noter les produits

**Consignes** :
1. Créer un composant `RatingStars.jsx`
2. Permettre de cliquer sur les étoiles pour noter
3. Envoyer la note au backend via API
4. Afficher un message de succès

**Fichiers à créer** :
- `src/components/RatingStars.jsx`
- `src/components/RatingStars.css`

**API à utiliser** :
- `POST /api/reviews/product/:product_id`

**Critères de réussite** :
- ✅ Les étoiles sont cliquables
- ✅ La note est envoyée au backend
- ✅ Un utilisateur ne peut noter qu'une fois
- ✅ Animation au survol des étoiles

---

### Exercice 2.4 : Système de recherche amélioré

**Objectif** : Améliorer la barre de recherche

**Consignes** :
1. Ajouter une recherche instantanée (autocomplete)
2. Afficher les suggestions pendant la frappe
3. Limiter à 5 suggestions max
4. Cliquer sur une suggestion redirige vers le produit

**Exemple** :
```javascript
const [suggestions, setSuggestions] = useState([]);
const [showSuggestions, setShowSuggestions] = useState(false);

const handleSearchChange = async (value) => {
  setSearch(value);

  if (value.length >= 2) {
    const data = await productService.getAll({
      search: value,
      limit: 5,
    });
    setSuggestions(data.products);
    setShowSuggestions(true);
  } else {
    setShowSuggestions(false);
  }
};
```

**Critères de réussite** :
- ✅ Les suggestions s'affichent après 2 caractères
- ✅ Les suggestions disparaissent si on clique ailleurs
- ✅ Cliquer sur une suggestion fonctionne
- ✅ Performance optimisée (debounce)

---

## 📋 Niveau 3 : Avancé

### Exercice 3.1 : Système de wishlist complet

**Objectif** : Implémenter la fonctionnalité wishlist

**Consignes** :
1. Créer `src/context/WishlistContext.jsx`
2. Créer `src/services/wishlistService.js`
3. Créer `src/pages/Wishlist.jsx`
4. Ajouter un bouton cœur sur chaque carte produit
5. Permettre d'ajouter/retirer de la wishlist
6. Créer une page dédiée `/wishlist`

**API à utiliser** :
- `GET /api/wishlist` : Obtenir la wishlist
- `POST /api/wishlist` : Ajouter un produit
- `DELETE /api/wishlist/:product_id` : Retirer un produit

**Fonctionnalités attendues** :
- Icône cœur plein si dans la wishlist
- Icône cœur vide sinon
- Badge dans la navbar avec le nombre d'items
- Page wishlist avec tous les produits favoris
- Bouton "Ajouter au panier" depuis la wishlist

**Critères de réussite** :
- ✅ Ajouter/retirer de la wishlist fonctionne
- ✅ L'état persiste (rechargement de page)
- ✅ Animation au clic sur le cœur
- ✅ Page wishlist affiche les produits

---

### Exercice 3.2 : Page profil utilisateur

**Objectif** : Créer une page de profil complète

**Consignes** :
1. Créer `src/pages/Profile.jsx`
2. Afficher les informations de l'utilisateur
3. Permettre de modifier : nom, email
4. Ajouter une section "Changer le mot de passe"
5. Afficher les statistiques : nombre de commandes, total dépensé

**Sections de la page** :
```
Profile
├── Informations personnelles
│   ├── Nom (éditable)
│   ├── Email (éditable)
│   └── Date d'inscription (lecture seule)
├── Changer le mot de passe
│   ├── Ancien mot de passe
│   ├── Nouveau mot de passe
│   └── Confirmer nouveau mot de passe
└── Statistiques
    ├── Nombre de commandes
    ├── Total dépensé
    └── Produit favoris
```

**Critères de réussite** :
- ✅ Les infos s'affichent correctement
- ✅ Modifier le nom fonctionne
- ✅ Modifier l'email fonctionne
- ✅ Changer le mot de passe fonctionne
- ✅ Les statistiques sont exactes

---

### Exercice 3.3 : Système de notifications

**Objectif** : Améliorer les notifications avec un centre de notifications

**Consignes** :
1. Créer un système de notifications persistantes
2. Afficher une icône cloche dans la navbar
3. Badge avec le nombre de notifications non lues
4. Dropdown affichant les notifications
5. Types de notifications :
   - Commande créée
   - Commande expédiée
   - Commande livrée
   - Produit ajouté à la wishlist

**Structure suggérée** :
```javascript
// NotificationContext.jsx
const notifications = [
  {
    id: 1,
    type: 'order',
    message: 'Votre commande #123 a été expédiée',
    read: false,
    createdAt: '2024-01-15T10:00:00',
  },
];
```

**Critères de réussite** :
- ✅ Les notifications s'affichent
- ✅ Le badge affiche le bon nombre
- ✅ Marquer comme lu fonctionne
- ✅ Supprimer une notification fonctionne
- ✅ Animation d'apparition des nouvelles notifications

---

### Exercice 3.4 : Dashboard admin avancé

**Objectif** : Améliorer le dashboard admin avec des graphiques

**Consignes** :
1. Installer une bibliothèque de graphiques (ex: recharts)
2. Ajouter un graphique des ventes par jour
3. Ajouter un graphique des produits les plus vendus
4. Ajouter un graphique de répartition par catégorie
5. Ajouter des filtres par période (7j, 30j, 1 an)

**Installation** :
```bash
npm install recharts
```

**Exemple de graphique** :
```javascript
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const data = [
  { date: '01/01', sales: 1200 },
  { date: '02/01', sales: 1800 },
  // ...
];

<LineChart width={600} height={300} data={data}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="date" />
  <YAxis />
  <Tooltip />
  <Line type="monotone" dataKey="sales" stroke="#8884d8" />
</LineChart>
```

**Critères de réussite** :
- ✅ 3 graphiques différents affichés
- ✅ Les données sont réelles (depuis le backend)
- ✅ Les filtres de période fonctionnent
- ✅ Design cohérent avec le reste du site

---

## 📋 Niveau 4 : Expert

### Exercice 4.1 : Optimisation des performances

**Objectif** : Optimiser l'application

**Tâches** :
1. Implémenter React.lazy() pour le code splitting
2. Utiliser useMemo pour les calculs coûteux
3. Utiliser useCallback pour les fonctions
4. Ajouter des skeleton screens pendant le chargement
5. Lazy loading des images

**Exemple de lazy loading** :
```javascript
import { lazy, Suspense } from 'react';

const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));

<Suspense fallback={<div>Chargement...</div>}>
  <AdminDashboard />
</Suspense>
```

**Critères de réussite** :
- ✅ Le bundle initial est réduit
- ✅ Les pages se chargent plus vite
- ✅ Les skeleton screens s'affichent
- ✅ Score Lighthouse > 90

---

### Exercice 4.2 : Tests unitaires

**Objectif** : Ajouter des tests

**Consignes** :
1. Installer Vitest et React Testing Library
2. Tester le composant ProductCard
3. Tester le hook useAuth
4. Tester le service API

**Installation** :
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

**Exemple de test** :
```javascript
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ProductCard from './ProductCard';

describe('ProductCard', () => {
  it('affiche le nom du produit', () => {
    const product = {
      id: 1,
      name: 'Test Product',
      price: 99.99,
      stock: 10,
    };

    render(<ProductCard product={product} />);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });
});
```

**Critères de réussite** :
- ✅ Au moins 10 tests créés
- ✅ Tous les tests passent
- ✅ Couverture de code > 70%

---

### Exercice 4.3 : Mode sombre

**Objectif** : Implémenter un thème sombre

**Consignes** :
1. Créer un ThemeContext
2. Ajouter un toggle dans la navbar
3. Persister le choix dans localStorage
4. Créer des variables CSS pour les couleurs
5. Adapter tous les composants

**Variables CSS** :
```css
:root {
  --bg-primary: #ffffff;
  --bg-secondary: #f8f9fa;
  --text-primary: #2c3e50;
  --text-secondary: #666;
}

[data-theme="dark"] {
  --bg-primary: #1a1a1a;
  --bg-secondary: #2d2d2d;
  --text-primary: #ffffff;
  --text-secondary: #b0b0b0;
}
```

**Critères de réussite** :
- ✅ Le toggle fonctionne
- ✅ Le thème persiste
- ✅ Tous les composants supportent les 2 thèmes
- ✅ Transition fluide entre les thèmes

---

### Exercice 4.4 : Multi-langues (i18n)

**Objectif** : Rendre l'application multilingue

**Consignes** :
1. Installer react-i18next
2. Configurer pour FR et EN
3. Traduire tous les textes
4. Ajouter un sélecteur de langue
5. Persister le choix

**Installation** :
```bash
npm install react-i18next i18next
```

**Configuration** :
```javascript
// i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        welcome: 'Welcome',
        products: 'Products',
      },
    },
    fr: {
      translation: {
        welcome: 'Bienvenue',
        products: 'Produits',
      },
    },
  },
  lng: 'fr',
  fallbackLng: 'fr',
});
```

**Critères de réussite** :
- ✅ Changement de langue fonctionne
- ✅ Tous les textes sont traduits
- ✅ Le choix persiste
- ✅ Support de 2+ langues

---

## 🎯 Projet final : Fonctionnalité au choix

**Choisissez une fonctionnalité parmi :**

1. **Système de code promo**
   - Appliquer des réductions
   - Gérer les codes promo (admin)
   - Afficher le montant économisé

2. **Comparateur de produits**
   - Sélectionner jusqu'à 3 produits
   - Afficher un tableau comparatif
   - Caractéristiques côte à côte

3. **Système de recommandations**
   - "Les clients ont aussi aimé"
   - Basé sur la catégorie
   - Afficher sur la page produit

4. **Chat support**
   - Widget de chat
   - Messages en temps réel (WebSocket)
   - Historique des conversations

5. **Export de données**
   - Exporter les commandes en PDF
   - Factures téléchargeables
   - Export CSV pour admin

---

## 📊 Checklist de progression

### Étape 1-3 (Bases)
- [ ] Projet initialisé
- [ ] Routeur configuré
- [ ] Authentification fonctionnelle
- [ ] Navbar et navigation
- [ ] Footer créé

### Étape 4-6 (Fonctionnalités core)
- [ ] Liste de produits
- [ ] Détails produit
- [ ] Panier fonctionnel
- [ ] Recherche et filtres

### Étape 7-9 (Avancé)
- [ ] Système de commandes
- [ ] Interface admin
- [ ] Wishlist
- [ ] Profil utilisateur

### Étape 10 (Optimisations)
- [ ] Performance optimisée
- [ ] Tests écrits
- [ ] Responsive design
- [ ] Mode sombre
- [ ] Multi-langues (bonus)

---

## 🏆 Défis bonus

1. **Animation avancée**
   - Transitions fluides
   - Micro-interactions
   - Loading skeletons animés

2. **PWA (Progressive Web App)**
   - Installable sur mobile
   - Fonctionne hors ligne
   - Notifications push

3. **Accessibilité (a11y)**
   - Navigation au clavier
   - Lecteurs d'écran
   - Contraste des couleurs

4. **SEO**
   - Meta tags dynamiques
   - Sitemap
   - Schema markup

---

## 📝 Grille d'évaluation

| Critère | Points | Obtenu |
|---------|--------|---------|
| **Fonctionnalités de base** | 40 | |
| - Authentification | 10 | |
| - Liste produits | 10 | |
| - Panier | 10 | |
| - Commandes | 10 | |
| **Fonctionnalités avancées** | 30 | |
| - Admin dashboard | 10 | |
| - Filtres et tri | 10 | |
| - Wishlist | 10 | |
| **Qualité du code** | 20 | |
| - Structure et organisation | 5 | |
| - Réutilisabilité | 5 | |
| - Gestion d'erreurs | 5 | |
| - Performance | 5 | |
| **UI/UX** | 10 | |
| - Design cohérent | 5 | |
| - Responsive | 5 | |
| **TOTAL** | **100** | |

---

## 🎓 Conclusion

En complétant ces exercices, vous aurez :

✅ Maîtrisé React et ses hooks
✅ Compris l'architecture d'une SPA
✅ Appris à communiquer avec une API
✅ Géré l'état global d'une application
✅ Créé une interface utilisateur moderne
✅ Développé des compétences en débogage

**Bon courage et amusez-vous bien ! 🚀**
