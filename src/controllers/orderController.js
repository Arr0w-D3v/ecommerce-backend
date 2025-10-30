const { runQuery, getQuery, allQuery, db } = require('../config/database');

// Créer une commande à partir du panier
const createOrder = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Récupérer le panier
    const cart = await getQuery('SELECT * FROM cart WHERE user_id = ?', [userId]);

    // Récupérer les articles du panier
    const items = await allQuery(
      `SELECT ci.*, p.name, p.price, p.stock
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.cart_id = ?`,
      [cart.id]
    );

    if (items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Le panier est vide'
      });
    }

    // Vérifier le stock pour tous les produits
    for (const item of items) {
      if (item.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Stock insuffisant pour ${item.name}. Stock disponible: ${item.stock}`
        });
      }
    }

    // Calculer le total
    const total = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);

    // Utiliser une transaction pour garantir l'intégrité
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        db.run('BEGIN TRANSACTION');

        // Créer la commande
        db.run(
          'INSERT INTO orders (user_id, total, status) VALUES (?, ?, ?)',
          [userId, total, 'pending'],
          function (err) {
            if (err) {
              db.run('ROLLBACK');
              return next(err);
            }

            const orderId = this.lastID;

            // Ajouter les articles à la commande et mettre à jour le stock
            let completed = 0;
            items.forEach((item, index) => {
              // Ajouter l'article à la commande
              db.run(
                'INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)',
                [orderId, item.product_id, item.quantity, item.price],
                (err) => {
                  if (err) {
                    db.run('ROLLBACK');
                    return next(err);
                  }

                  // Mettre à jour le stock
                  db.run(
                    'UPDATE products SET stock = stock - ? WHERE id = ?',
                    [item.quantity, item.product_id],
                    (err) => {
                      if (err) {
                        db.run('ROLLBACK');
                        return next(err);
                      }

                      completed++;
                      if (completed === items.length) {
                        // Vider le panier
                        db.run('DELETE FROM cart_items WHERE cart_id = ?', [cart.id], (err) => {
                          if (err) {
                            db.run('ROLLBACK');
                            return next(err);
                          }

                          db.run('COMMIT', (err) => {
                            if (err) {
                              db.run('ROLLBACK');
                              return next(err);
                            }

                            res.status(201).json({
                              success: true,
                              message: 'Commande créée avec succès',
                              data: {
                                order_id: orderId,
                                total: total.toFixed(2),
                                status: 'pending'
                              }
                            });
                            resolve();
                          });
                        });
                      }
                    }
                  );
                }
              );
            });
          }
        );
      });
    });
  } catch (error) {
    next(error);
  }
};

// Obtenir toutes les commandes de l'utilisateur
const getUserOrders = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const orders = await allQuery(
      `SELECT o.*,
              COUNT(oi.id) as items_count
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       WHERE o.user_id = ?
       GROUP BY o.id
       ORDER BY o.created_at DESC`,
      [userId]
    );

    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

// Obtenir les détails d'une commande
const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Récupérer la commande
    const order = await getQuery('SELECT * FROM orders WHERE id = ?', [id]);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Commande non trouvée'
      });
    }

    // Vérifier que la commande appartient à l'utilisateur (sauf si admin)
    if (req.user.role !== 'admin' && order.user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Accès non autorisé à cette commande'
      });
    }

    // Récupérer les articles de la commande
    const items = await allQuery(
      `SELECT oi.*, p.name, p.image_url
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`,
      [id]
    );

    res.json({
      success: true,
      data: {
        ...order,
        items
      }
    });
  } catch (error) {
    next(error);
  }
};

// Mettre à jour le statut d'une commande (admin seulement)
const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Statut invalide. Valeurs acceptées: ${validStatuses.join(', ')}`
      });
    }

    const order = await getQuery('SELECT * FROM orders WHERE id = ?', [id]);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Commande non trouvée'
      });
    }

    await runQuery('UPDATE orders SET status = ? WHERE id = ?', [status, id]);

    res.json({
      success: true,
      message: 'Statut de la commande mis à jour'
    });
  } catch (error) {
    next(error);
  }
};

// Obtenir toutes les commandes (admin seulement)
const getAllOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = '';
    let params = [];

    if (status) {
      whereClause = 'WHERE o.status = ?';
      params.push(status);
    }

    const orders = await allQuery(
      `SELECT o.*,
              u.name as user_name,
              u.email as user_email,
              COUNT(oi.id) as items_count
       FROM orders o
       JOIN users u ON o.user_id = u.id
       LEFT JOIN order_items oi ON o.id = oi.order_id
       ${whereClause}
       GROUP BY o.id
       ORDER BY o.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    const countResult = await getQuery(`SELECT COUNT(*) as total FROM orders o ${whereClause}`, params);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: countResult.total,
          totalPages: Math.ceil(countResult.total / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders
};
