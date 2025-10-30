const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { productValidation } = require('../middlewares/validator');
const { authenticateToken, requireAdmin } = require('../middlewares/auth');

// Routes publiques
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Routes protégées (admin seulement)
router.post('/', authenticateToken, requireAdmin, productValidation, createProduct);
router.put('/:id', authenticateToken, requireAdmin, productValidation, updateProduct);
router.delete('/:id', authenticateToken, requireAdmin, deleteProduct);

module.exports = router;
