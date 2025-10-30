const { runQuery, getQuery, allQuery } = require('../config/database');

// Obtenir tous les produits avec pagination et filtres
const getAllProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, category_id, search, min_price, max_price } = req.query;
    const offset = (page - 1) * limit;

    let whereConditions = [];
    let params = [];

    // Filtre par catégorie
    if (category_id) {
      whereConditions.push('p.category_id = ?');
      params.push(category_id);
    }

    // Filtre par recherche
    if (search) {
      whereConditions.push('(p.name LIKE ? OR p.description LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }

    // Filtre par prix
    if (min_price) {
      whereConditions.push('p.price >= ?');
      params.push(min_price);
    }
    if (max_price) {
      whereConditions.push('p.price <= ?');
      params.push(max_price);
    }

    const whereClause = whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : '';

    // Compter le total
    const countResult = await getQuery(
      `SELECT COUNT(*) as total FROM products p ${whereClause}`,
      params
    );

    // Récupérer les produits avec les infos de catégorie
    const products = await allQuery(
      `SELECT p.*, c.name as category_name
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       ${whereClause}
       ORDER BY p.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: countResult.total,
          totalPages: Math.ceil(countResult.total / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Obtenir un produit par ID
const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await getQuery(
      `SELECT p.*, c.name as category_name
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.id = ?`,
      [id]
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouvé'
      });
    }

    // Récupérer les avis du produit
    const reviews = await allQuery(
      `SELECT r.*, u.name as user_name
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.product_id = ?
       ORDER BY r.created_at DESC`,
      [id]
    );

    // Calculer la note moyenne
    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    res.json({
      success: true,
      data: {
        ...product,
        reviews,
        avg_rating: avgRating.toFixed(1),
        reviews_count: reviews.length
      }
    });
  } catch (error) {
    next(error);
  }
};

// Créer un nouveau produit (admin seulement)
const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, stock, category_id, image_url } = req.body;

    const result = await runQuery(
      'INSERT INTO products (name, description, price, stock, category_id, image_url) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description, price, stock || 0, category_id || null, image_url || null]
    );

    const newProduct = await getQuery('SELECT * FROM products WHERE id = ?', [result.lastID]);

    res.status(201).json({
      success: true,
      message: 'Produit créé avec succès',
      data: newProduct
    });
  } catch (error) {
    next(error);
  }
};

// Mettre à jour un produit (admin seulement)
const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, category_id, image_url } = req.body;

    // Vérifier si le produit existe
    const existingProduct = await getQuery('SELECT * FROM products WHERE id = ?', [id]);
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouvé'
      });
    }

    await runQuery(
      `UPDATE products
       SET name = ?, description = ?, price = ?, stock = ?, category_id = ?, image_url = ?
       WHERE id = ?`,
      [
        name !== undefined ? name : existingProduct.name,
        description !== undefined ? description : existingProduct.description,
        price !== undefined ? price : existingProduct.price,
        stock !== undefined ? stock : existingProduct.stock,
        category_id !== undefined ? category_id : existingProduct.category_id,
        image_url !== undefined ? image_url : existingProduct.image_url,
        id
      ]
    );

    const updatedProduct = await getQuery('SELECT * FROM products WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Produit mis à jour avec succès',
      data: updatedProduct
    });
  } catch (error) {
    next(error);
  }
};

// Supprimer un produit (admin seulement)
const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await getQuery('SELECT * FROM products WHERE id = ?', [id]);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouvé'
      });
    }

    await runQuery('DELETE FROM products WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Produit supprimé avec succès'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
