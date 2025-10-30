const { runQuery, getQuery, allQuery } = require('../config/database');

// Créer un avis pour un produit
const createReview = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { product_id } = req.params;
    const { rating, comment } = req.body;

    // Vérifier que le produit existe
    const product = await getQuery('SELECT * FROM products WHERE id = ?', [product_id]);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouvé'
      });
    }

    // Vérifier si l'utilisateur a déjà laissé un avis
    const existingReview = await getQuery(
      'SELECT * FROM reviews WHERE product_id = ? AND user_id = ?',
      [product_id, userId]
    );

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'Vous avez déjà laissé un avis pour ce produit'
      });
    }

    // Créer l'avis
    const result = await runQuery(
      'INSERT INTO reviews (product_id, user_id, rating, comment) VALUES (?, ?, ?, ?)',
      [product_id, userId, rating, comment || null]
    );

    const newReview = await getQuery(
      `SELECT r.*, u.name as user_name
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.id = ?`,
      [result.lastID]
    );

    res.status(201).json({
      success: true,
      message: 'Avis créé avec succès',
      data: newReview
    });
  } catch (error) {
    next(error);
  }
};

// Obtenir tous les avis d'un produit
const getProductReviews = async (req, res, next) => {
  try {
    const { product_id } = req.params;

    const reviews = await allQuery(
      `SELECT r.*, u.name as user_name
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.product_id = ?
       ORDER BY r.created_at DESC`,
      [product_id]
    );

    // Calculer la note moyenne
    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    res.json({
      success: true,
      data: {
        reviews,
        avg_rating: avgRating.toFixed(1),
        reviews_count: reviews.length
      }
    });
  } catch (error) {
    next(error);
  }
};

// Mettre à jour un avis
const updateReview = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { rating, comment } = req.body;

    // Vérifier que l'avis existe et appartient à l'utilisateur
    const review = await getQuery('SELECT * FROM reviews WHERE id = ?', [id]);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Avis non trouvé'
      });
    }

    if (review.user_id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Vous ne pouvez modifier que vos propres avis'
      });
    }

    await runQuery(
      'UPDATE reviews SET rating = ?, comment = ? WHERE id = ?',
      [rating || review.rating, comment !== undefined ? comment : review.comment, id]
    );

    const updatedReview = await getQuery(
      `SELECT r.*, u.name as user_name
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.id = ?`,
      [id]
    );

    res.json({
      success: true,
      message: 'Avis mis à jour avec succès',
      data: updatedReview
    });
  } catch (error) {
    next(error);
  }
};

// Supprimer un avis
const deleteReview = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const review = await getQuery('SELECT * FROM reviews WHERE id = ?', [id]);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Avis non trouvé'
      });
    }

    if (review.user_id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Vous ne pouvez supprimer que vos propres avis'
      });
    }

    await runQuery('DELETE FROM reviews WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Avis supprimé avec succès'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview
};
