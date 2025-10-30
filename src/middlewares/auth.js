const jwt = require('jsonwebtoken');

// Middleware pour vérifier le token JWT
const authenticateToken = (req, res, next) => {
  // Récupérer le token depuis le header Authorization
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Accès refusé. Token manquant.'
    });
  }

  try {
    // Vérifier et décoder le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Ajouter les infos user à la requête
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: 'Token invalide ou expiré.'
    });
  }
};

// Middleware pour vérifier le rôle admin
const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Accès refusé. Droits administrateur requis.'
    });
  }
};

// Middleware pour vérifier que l'utilisateur accède à ses propres ressources
const requireOwnership = (req, res, next) => {
  const requestedUserId = parseInt(req.params.userId) || parseInt(req.body.userId);

  // Admin peut tout faire, sinon vérifier que c'est bien l'utilisateur
  if (req.user.role === 'admin' || req.user.id === requestedUserId) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Accès refusé. Vous ne pouvez accéder qu\'à vos propres ressources.'
    });
  }
};

module.exports = {
  authenticateToken,
  requireAdmin,
  requireOwnership
};
