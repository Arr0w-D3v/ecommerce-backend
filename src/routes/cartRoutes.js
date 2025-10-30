const express = require('express');
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} = require('../controllers/cartController');
const { cartItemValidation } = require('../middlewares/validator');
const { authenticateToken } = require('../middlewares/auth');

// Toutes les routes du panier nécessitent une authentification
router.use(authenticateToken);

router.get('/', getCart);
router.post('/add', cartItemValidation, addToCart);
router.put('/item/:item_id', updateCartItem);
router.delete('/item/:item_id', removeFromCart);
router.delete('/clear', clearCart);

module.exports = router;
