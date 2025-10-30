const express = require('express');
const router = express.Router();
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  checkWishlist
} = require('../controllers/wishlistController');
const { authenticateToken } = require('../middlewares/auth');
const { body } = require('express-validator');
const { validate } = require('../middlewares/validator');

// Toutes les routes nécessitent une authentification
router.use(authenticateToken);

router.get('/', getWishlist);
router.post(
  '/',
  [
    body('product_id')
      .notEmpty().withMessage('L\'ID du produit est requis')
      .isInt().withMessage('L\'ID du produit doit être un nombre entier'),
    validate
  ],
  addToWishlist
);
router.delete('/:product_id', removeFromWishlist);
router.get('/check/:product_id', checkWishlist);

module.exports = router;
