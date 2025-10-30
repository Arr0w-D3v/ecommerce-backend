const express = require('express');
const router = express.Router();

// Importer toutes les routes
const authRoutes = require('./authRoutes');
const productRoutes = require('./productRoutes');
const categoryRoutes = require('./categoryRoutes');
const cartRoutes = require('./cartRoutes');
const orderRoutes = require('./orderRoutes');
const reviewRoutes = require('./reviewRoutes');
const wishlistRoutes = require('./wishlistRoutes');

// Route de santé (health check)
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API E-commerce fonctionne correctement',
    timestamp: new Date().toISOString()
  });
});

// Enregistrer toutes les routes
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/reviews', reviewRoutes);
router.use('/wishlist', wishlistRoutes);

module.exports = router;
