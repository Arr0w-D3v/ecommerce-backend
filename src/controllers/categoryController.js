const { runQuery, getQuery, allQuery } = require('../config/database');

// Obtenir toutes les catégories
const getAllCategories = async (req, res, next) => {
  try {
    const categories = await allQuery(`
      SELECT c.*,
             COUNT(p.id) as products_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id
      GROUP BY c.id
      ORDER BY c.name
    `);

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

// Obtenir une catégorie par ID
const getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await getQuery('SELECT * FROM categories WHERE id = ?', [id]);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Catégorie non trouvée'
      });
    }

    // Récupérer les produits de cette catégorie
    const products = await allQuery(
      'SELECT * FROM products WHERE category_id = ? ORDER BY name',
      [id]
    );

    res.json({
      success: true,
      data: {
        ...category,
        products
      }
    });
  } catch (error) {
    next(error);
  }
};

// Créer une nouvelle catégorie (admin seulement)
const createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    const result = await runQuery(
      'INSERT INTO categories (name, description) VALUES (?, ?)',
      [name, description || null]
    );

    const newCategory = await getQuery('SELECT * FROM categories WHERE id = ?', [result.lastID]);

    res.status(201).json({
      success: true,
      message: 'Catégorie créée avec succès',
      data: newCategory
    });
  } catch (error) {
    next(error);
  }
};

// Mettre à jour une catégorie (admin seulement)
const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const category = await getQuery('SELECT * FROM categories WHERE id = ?', [id]);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Catégorie non trouvée'
      });
    }

    await runQuery(
      'UPDATE categories SET name = ?, description = ? WHERE id = ?',
      [name || category.name, description !== undefined ? description : category.description, id]
    );

    const updatedCategory = await getQuery('SELECT * FROM categories WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Catégorie mise à jour avec succès',
      data: updatedCategory
    });
  } catch (error) {
    next(error);
  }
};

// Supprimer une catégorie (admin seulement)
const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await getQuery('SELECT * FROM categories WHERE id = ?', [id]);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Catégorie non trouvée'
      });
    }

    await runQuery('DELETE FROM categories WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Catégorie supprimée avec succès'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};
