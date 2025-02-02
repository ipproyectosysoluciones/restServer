import { response, request } from 'express';
import mongoose from 'mongoose';
import { Category, User, Product } from '../models/index.js';

/**
 * @typedef {Object} SearchResponse
 * @property {string} status - Estado de la búsqueda
 * @property {Array<Object>} results - Resultados encontrados
 * @property {number} total - Total de resultados
 */

const COLLECTIONS = {
  USERS: 'users',
  CATEGORIES: 'categories',
  PRODUCTS: 'products',
  ROLES: 'roles',
};

const createResponse = (status = 'success', data = null, message = null) => ({
  status,
  ...(data && { data }),
  ...(message && { message }),
  timestamp: new Date().toISOString(),
});

/**
 * @name searchUsers
 * @description Buscar usuarios por término
 */
const searchUsers = async (term, res = response) => {
  try {
    let query = { state: true };

    if (mongoose.Types.ObjectId.isValid(term)) {
      const user = await User.findOne({ _id: term, ...query });
      return res.json(
        createResponse('success', {
          results: user ? [user] : [],
          total: user ? 1 : 0,
        }),
      );
    }

    const regex = new RegExp(term, 'i');
    const users = await User.find({
      ...query,
      $or: [{ name: regex }, { email: regex }],
    });

    return res.json(
      createResponse('success', {
        results: users,
        total: users.length,
      }),
    );
  } catch (error) {
    console.error('Error en searchUsers:', error);
    return res
      .status(500)
      .json(createResponse('error', null, 'Error en la búsqueda de usuarios'));
  }
};

/**
 * @name searchCategories
 * @description Buscar categorías por término
 */
const searchCategories = async (term, res = response) => {
  try {
    let query = { state: true };

    if (mongoose.Types.ObjectId.isValid(term)) {
      const category = await Category.findOne({ _id: term, ...query });
      return res.json(
        createResponse('success', {
          results: category ? [category] : [],
          total: category ? 1 : 0,
        }),
      );
    }

    const regex = new RegExp(term, 'i');
    const categories = await Category.find({
      name: regex,
      ...query,
    });

    return res.json(
      createResponse('success', {
        results: categories,
        total: categories.length,
      }),
    );
  } catch (error) {
    console.error('Error en searchCategories:', error);
    return res
      .status(500)
      .json(
        createResponse('error', null, 'Error en la búsqueda de categorías'),
      );
  }
};

/**
 * @name searchProducts
 * @description Buscar productos por término
 */
const searchProducts = async (term, res = response) => {
  try {
    let query = { state: true };

    if (mongoose.Types.ObjectId.isValid(term)) {
      const product = await Product.findOne({ _id: term, ...query })
        .populate('category', 'name')
        .populate('user', 'name');

      return res.json(
        createResponse('success', {
          results: product ? [product] : [],
          total: product ? 1 : 0,
        }),
      );
    }

    const regex = new RegExp(term, 'i');
    const products = await Product.find({
      name: regex,
      ...query,
    })
      .populate('category', 'name')
      .populate('user', 'name');

    return res.json(
      createResponse('success', {
        results: products,
        total: products.length,
      }),
    );
  } catch (error) {
    console.error('Error en searchProducts:', error);
    return res
      .status(500)
      .json(createResponse('error', null, 'Error en la búsqueda de productos'));
  }
};

/**
 * @name search
 * @description Controlador principal de búsqueda
 */
const search = async (req = request, res = response) => {
  try {
    const { collection, term } = req.params;

    if (!Object.values(COLLECTIONS).includes(collection)) {
      return res
        .status(400)
        .json(
          createResponse(
            'error',
            null,
            `Colección no válida. Permitidas: ${Object.values(COLLECTIONS).join(', ')}`,
          ),
        );
    }

    const searchFunctions = {
      [COLLECTIONS.USERS]: () => searchUsers(term, res),
      [COLLECTIONS.CATEGORIES]: () => searchCategories(term, res),
      [COLLECTIONS.PRODUCTS]: () => searchProducts(term, res),
    };

    const searchFunction = searchFunctions[collection];
    if (!searchFunction) {
      return res
        .status(500)
        .json(createResponse('error', null, 'Búsqueda no implementada'));
    }

    await searchFunction();
  } catch (error) {
    console.error('Error en búsqueda:', error);
    return res
      .status(500)
      .json(createResponse('error', null, 'Error interno en la búsqueda'));
  }
};

export { search };
