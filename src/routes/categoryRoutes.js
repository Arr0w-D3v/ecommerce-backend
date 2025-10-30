const express = require('express');
const router = express.Router();
const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');
const { categoryValidation } = require('../middlewares/validator');
const { authenticateToken, requireAdmin } = require('../middlewares/auth');

// Routes publiques
router.get('/', getAllCategories);
router.get('/:id', getCategoryById);

// Routes protégées (admin seulement)
router.post('/', authenticateToken, requireAdmin, categoryValidation, createCategory);
router.put('/:id', authenticateToken, requireAdmin, categoryValidation, updateCategory);
router.delete('/:id', authenticateToken, requireAdmin, deleteCategory);

module.exports = router;
