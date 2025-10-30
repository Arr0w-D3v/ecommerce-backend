require('dotenv').config();
const bcrypt = require('bcryptjs');
const { runQuery, initDatabase, db } = require('../config/database');

const seedDatabase = async () => {
  try {
    console.log('🌱 Démarrage du seed de la base de données...\n');

    // Initialiser la base de données
    await initDatabase();

    // 1. Créer des utilisateurs
    console.log('👥 Création des utilisateurs...');
    const adminPassword = await bcrypt.hash('admin123', 10);
    const userPassword = await bcrypt.hash('user123', 10);

    const adminResult = await runQuery(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      ['Admin', 'admin@ecommerce.com', adminPassword, 'admin']
    );

    const userResult = await runQuery(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      ['John Doe', 'john@example.com', userPassword, 'user']
    );

    await runQuery(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      ['Jane Smith', 'jane@example.com', userPassword, 'user']
    );

    // Créer des paniers pour les utilisateurs
    await runQuery('INSERT INTO cart (user_id) VALUES (?)', [adminResult.lastID]);
    await runQuery('INSERT INTO cart (user_id) VALUES (?)', [userResult.lastID]);
    await runQuery('INSERT INTO cart (user_id) VALUES (?)', [userResult.lastID + 1]);

    console.log('✅ Utilisateurs créés\n');

    // 2. Créer des catégories
    console.log('📁 Création des catégories...');
    const categories = [
      { name: 'Électronique', description: 'Smartphones, ordinateurs, tablettes et accessoires' },
      { name: 'Vêtements', description: 'Mode homme, femme et enfant' },
      { name: 'Maison & Jardin', description: 'Décoration, meubles et outils de jardinage' },
      { name: 'Sports & Loisirs', description: 'Équipements sportifs et activités de loisir' },
      { name: 'Livres', description: 'Romans, essais, BD et livres techniques' }
    ];

    const categoryIds = [];
    for (const cat of categories) {
      const result = await runQuery(
        'INSERT INTO categories (name, description) VALUES (?, ?)',
        [cat.name, cat.description]
      );
      categoryIds.push(result.lastID);
    }
    console.log('✅ Catégories créées\n');

    // 3. Créer des produits
    console.log('📦 Création des produits...');
    const products = [
      // Électronique
      { name: 'iPhone 15 Pro', description: 'Smartphone Apple dernière génération', price: 1199.99, stock: 25, category_id: categoryIds[0], image_url: 'https://example.com/iphone15.jpg' },
      { name: 'Samsung Galaxy S24', description: 'Flagship Android de Samsung', price: 999.99, stock: 30, category_id: categoryIds[0], image_url: 'https://example.com/galaxy-s24.jpg' },
      { name: 'MacBook Pro 16"', description: 'Ordinateur portable professionnel', price: 2499.99, stock: 15, category_id: categoryIds[0], image_url: 'https://example.com/macbook.jpg' },
      { name: 'AirPods Pro', description: 'Écouteurs sans fil avec réduction de bruit', price: 279.99, stock: 50, category_id: categoryIds[0], image_url: 'https://example.com/airpods.jpg' },

      // Vêtements
      { name: 'T-shirt coton bio', description: 'T-shirt confortable en coton biologique', price: 29.99, stock: 100, category_id: categoryIds[1], image_url: 'https://example.com/tshirt.jpg' },
      { name: 'Jean slim fit', description: 'Jean moderne et confortable', price: 79.99, stock: 75, category_id: categoryIds[1], image_url: 'https://example.com/jean.jpg' },
      { name: 'Veste en cuir', description: 'Veste élégante en cuir véritable', price: 299.99, stock: 20, category_id: categoryIds[1], image_url: 'https://example.com/veste.jpg' },

      // Maison & Jardin
      { name: 'Canapé 3 places', description: 'Canapé confortable et moderne', price: 799.99, stock: 10, category_id: categoryIds[2], image_url: 'https://example.com/canape.jpg' },
      { name: 'Lampe design', description: 'Lampe de salon au design contemporain', price: 89.99, stock: 40, category_id: categoryIds[2], image_url: 'https://example.com/lampe.jpg' },
      { name: 'Set de jardinage', description: 'Ensemble complet d\'outils de jardinage', price: 59.99, stock: 35, category_id: categoryIds[2], image_url: 'https://example.com/jardinage.jpg' },

      // Sports & Loisirs
      { name: 'Vélo VTT', description: 'VTT tout-terrain 21 vitesses', price: 499.99, stock: 12, category_id: categoryIds[3], image_url: 'https://example.com/vtt.jpg' },
      { name: 'Tapis de yoga', description: 'Tapis antidérapant pour yoga et fitness', price: 34.99, stock: 60, category_id: categoryIds[3], image_url: 'https://example.com/tapis-yoga.jpg' },
      { name: 'Ballon de football', description: 'Ballon professionnel taille 5', price: 24.99, stock: 80, category_id: categoryIds[3], image_url: 'https://example.com/ballon.jpg' },

      // Livres
      { name: 'Le Petit Prince', description: 'Classique de la littérature française', price: 12.99, stock: 150, category_id: categoryIds[4], image_url: 'https://example.com/petit-prince.jpg' },
      { name: 'Clean Code', description: 'Guide des bonnes pratiques en programmation', price: 45.99, stock: 45, category_id: categoryIds[4], image_url: 'https://example.com/clean-code.jpg' },
      { name: 'Harry Potter - Coffret', description: 'Intégrale des 7 tomes', price: 89.99, stock: 25, category_id: categoryIds[4], image_url: 'https://example.com/harry-potter.jpg' }
    ];

    const productIds = [];
    for (const prod of products) {
      const result = await runQuery(
        'INSERT INTO products (name, description, price, stock, category_id, image_url) VALUES (?, ?, ?, ?, ?, ?)',
        [prod.name, prod.description, prod.price, prod.stock, prod.category_id, prod.image_url]
      );
      productIds.push(result.lastID);
    }
    console.log('✅ Produits créés\n');

    // 4. Créer des avis
    console.log('⭐ Création des avis...');
    const reviews = [
      { product_id: productIds[0], user_id: userResult.lastID, rating: 5, comment: 'Excellent produit, je recommande !' },
      { product_id: productIds[0], user_id: userResult.lastID + 1, rating: 4, comment: 'Très bon mais un peu cher' },
      { product_id: productIds[1], user_id: userResult.lastID, rating: 5, comment: 'Parfait pour mes besoins' },
      { product_id: productIds[4], user_id: userResult.lastID + 1, rating: 5, comment: 'Tissu de qualité, taille parfaite' },
      { product_id: productIds[7], user_id: userResult.lastID, rating: 4, comment: 'Confortable mais livraison lente' },
      { product_id: productIds[13], user_id: userResult.lastID + 1, rating: 5, comment: 'Un classique intemporel !' }
    ];

    for (const review of reviews) {
      await runQuery(
        'INSERT INTO reviews (product_id, user_id, rating, comment) VALUES (?, ?, ?, ?)',
        [review.product_id, review.user_id, review.rating, review.comment]
      );
    }
    console.log('✅ Avis créés\n');

    // 5. Créer une commande exemple
    console.log('📝 Création de commandes exemple...');
    const orderResult = await runQuery(
      'INSERT INTO orders (user_id, total, status) VALUES (?, ?, ?)',
      [userResult.lastID, 1479.98, 'delivered']
    );

    await runQuery(
      'INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)',
      [orderResult.lastID, productIds[0], 1, 1199.99]
    );

    await runQuery(
      'INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)',
      [orderResult.lastID, productIds[3], 1, 279.99]
    );

    const orderResult2 = await runQuery(
      'INSERT INTO orders (user_id, total, status) VALUES (?, ?, ?)',
      [userResult.lastID + 1, 119.98, 'processing']
    );

    await runQuery(
      'INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)',
      [orderResult2.lastID, productIds[4], 2, 29.99]
    );

    await runQuery(
      'INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)',
      [orderResult2.lastID, productIds[14], 1, 45.99]
    );

    console.log('✅ Commandes créées\n');

    // 6. Ajouter des produits à la wishlist
    console.log('❤️  Création de wishlists...');
    await runQuery(
      'INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)',
      [userResult.lastID, productIds[2]]
    );

    await runQuery(
      'INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)',
      [userResult.lastID, productIds[10]]
    );

    await runQuery(
      'INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)',
      [userResult.lastID + 1, productIds[6]]
    );

    console.log('✅ Wishlists créées\n');

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Seed terminé avec succès !');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n📝 Comptes de test créés :');
    console.log('   Admin:');
    console.log('   - Email: admin@ecommerce.com');
    console.log('   - Password: admin123');
    console.log('\n   Utilisateur:');
    console.log('   - Email: john@example.com');
    console.log('   - Password: user123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Fermer la connexion
    db.close((err) => {
      if (err) {
        console.error('Erreur lors de la fermeture de la DB:', err);
      }
      process.exit(0);
    });
  } catch (error) {
    console.error('❌ Erreur lors du seed:', error);
    process.exit(1);
  }
};

seedDatabase();
