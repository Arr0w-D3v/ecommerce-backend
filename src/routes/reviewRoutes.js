const express = require('express');
const router = express.Router();
const {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview
} = require('../controllers/reviewController');
const { reviewValidation } = require('../middlewares/validator');
const { authenticateToken } = require('../middlewares/auth');

// Routes publiques
router.get('/product/:product_id', getProductReviews);

// Routes protégées
router.post('/product/:product_id', authenticateToken, reviewValidation, createReview);
router.put('/:id', authenticateToken, reviewValidation, updateReview);
router.delete('/:id', authenticateToken, deleteReview);

module.exports = router;
