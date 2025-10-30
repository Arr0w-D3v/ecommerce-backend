const express = require('express');
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders
} = require('../controllers/orderController');
const { authenticateToken, requireAdmin } = require('../middlewares/auth');
const { body } = require('express-validator');
const { validate } = require('../middlewares/validator');

// Toutes les routes nécessitent une authentification
router.use(authenticateToken);

// Routes utilisateurs
router.post('/', createOrder);
router.get('/my-orders', getUserOrders);
router.get('/:id', getOrderById);

// Routes admin
router.get('/', requireAdmin, getAllOrders);
router.put(
  '/:id/status',
  requireAdmin,
  [
    body('status')
      .notEmpty().withMessage('Le statut est requis')
      .isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
      .withMessage('Statut invalide'),
    validate
  ],
  updateOrderStatus
);

module.exports = router;
