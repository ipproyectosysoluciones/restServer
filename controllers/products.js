import { request, response } from 'express';
import { Product } from '../models/index.js';

/**
 * @typedef {Object} ProductResponse
 * @property {string} status - Estado de la respuesta
 * @property {Object} data - Datos del producto
 * @property {string} timestamp - Marca de tiempo
 */

const createResponse = (status = 'success', data = null, message = null) => ({
  status,
  ...(data && { data }),
  ...(message && { message }),
  timestamp: new Date().toISOString(),
});

/**
 * @name getProducts
 * @description Obtener productos con paginación y filtros
 */
const getProducts = async (req = request, res = response) => {
  try {
    const { limit = 5, from = 0, sort = 'name', available } = req.query;

    const query = {
      state: true,
      ...(available !== undefined && { available: available === 'true' }),
    };

    const [total, products] = await Promise.all([
      Product.countDocuments(query),
      Product.find(query)
        .populate('user', 'name')
        .populate('category', 'name')
        .sort(sort)
        .skip(Number(from))
        .limit(Number(limit)),
    ]);

    return res.json(
      createResponse('success', {
        total,
        page: Math.floor(from / limit) + 1,
        limit: Number(limit),
        products,
      }),
    );
  } catch (error) {
    console.error('Error en getProducts:', error);
    return res
      .status(500)
      .json(createResponse('error', null, 'Error al obtener productos'));
  }
};

/**
 * @name getProduct
 * @description Obtener un producto por ID
 */
const getProduct = async (req = request, res = response) => {
  try {
    const { id } = req.params;

    const product = await Product.findOne({
      _id: id,
      state: true,
    })
      .populate('user', 'name')
      .populate('category', 'name');

    if (!product) {
      return res
        .status(404)
        .json(createResponse('error', null, 'Producto no encontrado'));
    }

    return res.json(createResponse('success', { product }));
  } catch (error) {
    console.error('Error en getProduct:', error);
    return res
      .status(500)
      .json(createResponse('error', null, 'Error al obtener el producto'));
  }
};

/**
 * @name createProduct
 * @description Crear nuevo producto
 */
const createProduct = async (req = request, res = response) => {
  try {
    const { state, user, ...productData } = req.body;

    const existingProduct = await Product.findOne({
      name: productData.name?.toUpperCase(),
      state: true,
    });

    if (existingProduct) {
      return res
        .status(400)
        .json(
          createResponse(
            'error',
            null,
            `El producto ${productData.name} ya existe`,
          ),
        );
    }

    const data = {
      ...productData,
      name: productData.name.toUpperCase(),
      user: req.authenticatedUser._id,
    };

    const product = new Product(data);
    await product.save();

    return res.status(201).json(createResponse('success', { product }));
  } catch (error) {
    console.error('Error en createProduct:', error);
    return res
      .status(500)
      .json(createResponse('error', null, 'Error al crear el producto'));
  }
};

/**
 * @name updateProduct
 * @description Actualizar producto existente
 */
const updateProduct = async (req = request, res = response) => {
  try {
    const { id } = req.params;
    const { state, user, ...data } = req.body;

    if (data.name) {
      data.name = data.name.toUpperCase().trim();
    }

    data.user = req.authenticatedUser._id;

    const product = await Product.findOneAndUpdate(
      { _id: id, state: true },
      data,
      { new: true, runValidators: true },
    ).populate('category', 'name');

    if (!product) {
      return res
        .status(404)
        .json(createResponse('error', null, 'Producto no encontrado'));
    }

    return res.json(createResponse('success', { product }));
  } catch (error) {
    console.error('Error en updateProduct:', error);
    return res
      .status(500)
      .json(createResponse('error', null, 'Error al actualizar el producto'));
  }
};

/**
 * @name deleteProduct
 * @description Desactivar producto (borrado lógico)
 */
const deleteProduct = async (req = request, res = response) => {
  try {
    const { id } = req.params;

    const product = await Product.findOneAndUpdate(
      { _id: id, state: true },
      { state: false },
      { new: true },
    );

    if (!product) {
      return res
        .status(404)
        .json(createResponse('error', null, 'Producto no encontrado'));
    }

    return res.json(createResponse('success', { product }));
  } catch (error) {
    console.error('Error en deleteProduct:', error);
    return res
      .status(500)
      .json(createResponse('error', null, 'Error al eliminar el producto'));
  }
};

export { createProduct, deleteProduct, getProduct, getProducts, updateProduct };
