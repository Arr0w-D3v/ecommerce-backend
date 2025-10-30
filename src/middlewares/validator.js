const { body, validationResult } = require('express-validator');

// Middleware pour valider les résultats
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Erreurs de validation',
      errors: errors.array()
    });
  }
  next();
};

// Validations pour l'authentification
const registerValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Le nom est requis')
    .isLength({ min: 2, max: 50 }).withMessage('Le nom doit contenir entre 2 et 50 caractères'),
  body('email')
    .trim()
    .notEmpty().withMessage('L\'email est requis')
    .isEmail().withMessage('Email invalide')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Le mot de passe est requis')
    .isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères'),
  validate
];

const loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('L\'email est requis')
    .isEmail().withMessage('Email invalide')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Le mot de passe est requis'),
  validate
];

// Validations pour les produits
const productValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Le nom du produit est requis')
    .isLength({ min: 2, max: 200 }).withMessage('Le nom doit contenir entre 2 et 200 caractères'),
  body('description')
    .optional()
    .trim(),
  body('price')
    .notEmpty().withMessage('Le prix est requis')
    .isFloat({ min: 0 }).withMessage('Le prix doit être un nombre positif'),
  body('stock')
    .optional()
    .isInt({ min: 0 }).withMessage('Le stock doit être un nombre entier positif'),
  body('category_id')
    .optional()
    .isInt().withMessage('L\'ID de catégorie doit être un nombre entier'),
  body('image_url')
    .optional()
    .trim(),
  validate
];

// Validations pour les catégories
const categoryValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Le nom de la catégorie est requis')
    .isLength({ min: 2, max: 100 }).withMessage('Le nom doit contenir entre 2 et 100 caractères'),
  body('description')
    .optional()
    .trim(),
  validate
];

// Validations pour les avis
const reviewValidation = [
  body('rating')
    .notEmpty().withMessage('La note est requise')
    .isInt({ min: 1, max: 5 }).withMessage('La note doit être entre 1 et 5'),
  body('comment')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Le commentaire ne doit pas dépasser 1000 caractères'),
  validate
];

// Validations pour le panier
const cartItemValidation = [
  body('product_id')
    .notEmpty().withMessage('L\'ID du produit est requis')
    .isInt().withMessage('L\'ID du produit doit être un nombre entier'),
  body('quantity')
    .notEmpty().withMessage('La quantité est requise')
    .isInt({ min: 1 }).withMessage('La quantité doit être un nombre entier positif'),
  validate
];

module.exports = {
  registerValidation,
  loginValidation,
  productValidation,
  categoryValidation,
  reviewValidation,
  cartItemValidation,
  validate
};
