const { runQuery, getQuery, allQuery, db } = require('../config/database');

// Obtenir le panier de l'utilisateur
const getCart = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Récupérer le panier
    const cart = await getQuery('SELECT * FROM cart WHERE user_id = ?', [userId]);

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Panier non trouvé'
      });
    }

    // Récupérer les articles du panier avec les infos produits
    const items = await allQuery(
      `SELECT ci.*, p.name, p.price, p.stock, p.image_url,
              (ci.quantity * p.price) as subtotal
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.cart_id = ?`,
      [cart.id]
    );

    // Calculer le total
    const total = items.reduce((sum, item) => sum + item.subtotal, 0);

    res.json({
      success: true,
      data: {
        cart_id: cart.id,
        items,
        total: total.toFixed(2),
        items_count: items.length
      }
    });
  } catch (error) {
    next(error);
  }
};

// Ajouter un article au panier
const addToCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { product_id, quantity } = req.body;

    // Vérifier que le produit existe et a assez de stock
    const product = await getQuery('SELECT * FROM products WHERE id = ?', [product_id]);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouvé'
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Stock insuffisant. Stock disponible: ${product.stock}`
      });
    }

    // Récupérer le panier
    const cart = await getQuery('SELECT * FROM cart WHERE user_id = ?', [userId]);

    // Vérifier si l'article existe déjà dans le panier
    const existingItem = await getQuery(
      'SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ?',
      [cart.id, product_id]
    );

    if (existingItem) {
      // Mettre à jour la quantité
      const newQuantity = existingItem.quantity + quantity;

      if (product.stock < newQuantity) {
        return res.status(400).json({
          success: false,
          message: `Stock insuffisant. Stock disponible: ${product.stock}`
        });
      }

      await runQuery(
        'UPDATE cart_items SET quantity = ? WHERE id = ?',
        [newQuantity, existingItem.id]
      );
    } else {
      // Ajouter un nouvel article
      await runQuery(
        'INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)',
        [cart.id, product_id, quantity]
      );
    }

    res.json({
      success: true,
      message: 'Produit ajouté au panier'
    });
  } catch (error) {
    next(error);
  }
};

// Mettre à jour la quantité d'un article
const updateCartItem = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { item_id } = req.params;
    const { quantity } = req.body;

    // Récupérer le panier
    const cart = await getQuery('SELECT * FROM cart WHERE user_id = ?', [userId]);

    // Vérifier que l'article appartient au panier de l'utilisateur
    const item = await getQuery(
      `SELECT ci.*, p.stock
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.id = ? AND ci.cart_id = ?`,
      [item_id, cart.id]
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Article non trouvé dans le panier'
      });
    }

    // Vérifier le stock
    if (item.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Stock insuffisant. Stock disponible: ${item.stock}`
      });
    }

    await runQuery('UPDATE cart_items SET quantity = ? WHERE id = ?', [quantity, item_id]);

    res.json({
      success: true,
      message: 'Quantité mise à jour'
    });
  } catch (error) {
    next(error);
  }
};

// Retirer un article du panier
const removeFromCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { item_id } = req.params;

    // Récupérer le panier
    const cart = await getQuery('SELECT * FROM cart WHERE user_id = ?', [userId]);

    // Vérifier que l'article appartient au panier de l'utilisateur
    const item = await getQuery(
      'SELECT * FROM cart_items WHERE id = ? AND cart_id = ?',
      [item_id, cart.id]
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Article non trouvé dans le panier'
      });
    }

    await runQuery('DELETE FROM cart_items WHERE id = ?', [item_id]);

    res.json({
      success: true,
      message: 'Article retiré du panier'
    });
  } catch (error) {
    next(error);
  }
};

// Vider le panier
const clearCart = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Récupérer le panier
    const cart = await getQuery('SELECT * FROM cart WHERE user_id = ?', [userId]);

    await runQuery('DELETE FROM cart_items WHERE cart_id = ?', [cart.id]);

    res.json({
      success: true,
      message: 'Panier vidé'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
};
