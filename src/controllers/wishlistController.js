const { runQuery, getQuery, allQuery } = require('../config/database');

// Obtenir la wishlist de l'utilisateur
const getWishlist = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const items = await allQuery(
      `SELECT w.*, p.name, p.description, p.price, p.stock, p.image_url
       FROM wishlist w
       JOIN products p ON w.product_id = p.id
       WHERE w.user_id = ?
       ORDER BY w.created_at DESC`,
      [userId]
    );

    res.json({
      success: true,
      data: {
        items,
        count: items.length
      }
    });
  } catch (error) {
    next(error);
  }
};

// Ajouter un produit à la wishlist
const addToWishlist = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { product_id } = req.body;

    // Vérifier que le produit existe
    const product = await getQuery('SELECT * FROM products WHERE id = ?', [product_id]);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouvé'
      });
    }

    // Vérifier si le produit est déjà dans la wishlist
    const existing = await getQuery(
      'SELECT * FROM wishlist WHERE user_id = ? AND product_id = ?',
      [userId, product_id]
    );

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Ce produit est déjà dans votre wishlist'
      });
    }

    const result = await runQuery(
      'INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)',
      [userId, product_id]
    );

    res.status(201).json({
      success: true,
      message: 'Produit ajouté à la wishlist',
      data: {
        id: result.lastID,
        product_id,
        product_name: product.name
      }
    });
  } catch (error) {
    next(error);
  }
};

// Retirer un produit de la wishlist
const removeFromWishlist = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { product_id } = req.params;

    const item = await getQuery(
      'SELECT * FROM wishlist WHERE user_id = ? AND product_id = ?',
      [userId, product_id]
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouvé dans la wishlist'
      });
    }

    await runQuery('DELETE FROM wishlist WHERE id = ?', [item.id]);

    res.json({
      success: true,
      message: 'Produit retiré de la wishlist'
    });
  } catch (error) {
    next(error);
  }
};

// Vérifier si un produit est dans la wishlist
const checkWishlist = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { product_id } = req.params;

    const item = await getQuery(
      'SELECT * FROM wishlist WHERE user_id = ? AND product_id = ?',
      [userId, product_id]
    );

    res.json({
      success: true,
      data: {
        in_wishlist: !!item
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  checkWishlist
};
