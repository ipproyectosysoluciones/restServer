import { request, response } from 'express';
import { Category } from '../models/index.js';

/**
 * @typedef {Object} CategoryResponse
 * @property {string} status - Estado de la respuesta
 * @property {Object} data - Datos de la categoría
 * @property {string} timestamp - Marca de tiempo
 */

const createResponse = (status = 'success', data = null, message = null) => ({
  status,
  ...(data && { data }),
  ...(message && { message }),
  timestamp: new Date().toISOString()
});

/**
 * @name getCategories
 * @description Obtener categorías con paginación
 */
const getCategories = async (req = request, res = response) => {
  try {
    const { 
      limit = 5, 
      from = 0,
      sort = 'name' 
    } = req.query;
    const query = { state: true };

    const [total, categories] = await Promise.all([
      Category.countDocuments(query),
      Category.find(query)
        .populate('user', 'name')
        .sort(sort)
        .skip(Number(from))
        .limit(Number(limit))
    ]);

    return res.json(createResponse('success', {
      total,
      page: Math.floor(from / limit) + 1,
      limit: Number(limit),
      categories
    }));
  } catch (error) {
    console.error('Error en getCategories:', error);
    return res.status(500).json(
      createResponse('error', null, 'Error al obtener categorías')
    );
  }
};

/**
 * @name getCategory
 * @description Obtener una categoría por ID
 */
const getCategory = async (req = request, res = response) => {
  try {
    const { id } = req.params;
    const category = await Category.findOne({ 
      _id: id, 
      state: true 
    }).populate('user', 'name');

    if (!category) {
      return res.status(404).json(
        createResponse('error', null, 'Categoría no encontrada')
      );
    }

    return res.json(createResponse('success', { category }));
  } catch (error) {
    console.error('Error en getCategory:', error);
    return res.status(500).json(
      createResponse('error', null, 'Error al obtener la categoría')
    );
  }
};

/**
 * @name createCategory
 * @description Crear nueva categoría
 */
const createCategory = async (req = request, res = response) => {
  try {
    const name = req.body.name.toUpperCase().trim();
    
    const existingCategory = await Category.findOne({ 
      name,
      state: true 
    });

    if (existingCategory) {
      return res.status(400).json(
        createResponse('error', null, `La categoría ${name} ya existe`)
      );
    }

    const category = new Category({
      name,
      user: req.authenticatedUser._id
    });

    await category.save();

    return res.status(201).json(createResponse('success', { category }));
  } catch (error) {
    console.error('Error en createCategory:', error);
    return res.status(500).json(
      createResponse('error', null, 'Error al crear la categoría')
    );
  }
};

/**
 * @name updateCategory
 * @description Actualizar categoría existente
 */
const updateCategory = async (req = request, res = response) => {
  try {
    const { id } = req.params;
    const { state, user, ...data } = req.body;

    data.name = data.name.toUpperCase().trim();
    data.user = req.authenticatedUser._id;

    const category = await Category.findOneAndUpdate(
      { _id: id, state: true },
      data,
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json(
        createResponse('error', null, 'Categoría no encontrada')
      );
    }

    return res.json(createResponse('success', { category }));
  } catch (error) {
    console.error('Error en updateCategory:', error);
    return res.status(500).json(
      createResponse('error', null, 'Error al actualizar la categoría')
    );
  }
};

/**
 * @name deleteCategory
 * @description Desactivar categoría (borrado lógico)
 */
const deleteCategory = async (req = request, res = response) => {
  try {
    const { id } = req.params;

    const category = await Category.findOneAndUpdate(
      { _id: id, state: true },
      { state: false },
      { new: true }
    );

    if (!category) {
      return res.status(404).json(
        createResponse('error', null, 'Categoría no encontrada')
      );
    }

    return res.json(createResponse('success', { category }));
  } catch (error) {
    console.error('Error en deleteCategory:', error);
    return res.status(500).json(
      createResponse('error', null, 'Error al eliminar la categoría')
    );
  }
};

export {
  createCategory,
  deleteCategory,
  getCategories,
  getCategory,
  updateCategory
};
