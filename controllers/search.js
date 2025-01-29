import { response, request } from 'express';
import mongoose from 'mongoose';
import { Category, User, Product } from '../models/index.js';

const collectionsAllowed = ['users', 'categories', 'products', 'roles'];

/**
 * @name searchUsers
 * @description Controlador para buscar usuarios en la base de datos.
 * @param { string } term - Término de búsqueda.
 * @param { Object } res - Objeto de respuesta para enviar la respuesta al cliente.
 * @returns { Promise<void> } Una promesa que se resuelve después de enviar la respuesta.
 */
const searchUsers = async (term = '', res = response) => {
  const isMongoID = mongoose.Types.ObjectId.isValid(term);
  if (isMongoID) {
    const user = await User.findById(term);
    return res.json({ results: user ? [user] : [] });
  }

  const regex = new RegExp(term, 'i');
  const users = await User.find({
    $or: [{ name: regex }, { email: regex }],
    $and: [{ status: true }],
  });
  return res.json({ results: users });
};

/**
 * @name searchCategories
 * @description Controlador para buscar categorías en la base de datos.
 * @param { string } term - Término de búsqueda.
 * @param { Object } res - Objeto de respuesta para enviar la respuesta al cliente.
 * @returns { Promise<void> } Una promesa que se resuelve después de enviar la respuesta.
 */
const searchCategories = async (term = '', res = response) => {
  const isMongoID = mongoose.Types.ObjectId.isValid(term);
  if (isMongoID) {
    const category = await Category.findById(term);
    return res.json({ results: category ? [category] : [] });
  }

  const regex = new RegExp(term, 'i');
  const categories = await Category.find({ name: regex, state: true });
  return res.json({ results: categories });
};

/**
 * @name searchProducts
 * @description Controlador para buscar productos en la base de datos.
 * @param { string } term - Término de búsqueda.
 * @param { Object } res - Objeto de respuesta para enviar la respuesta al cliente.
 * @returns { Promise<void> } Una promesa que se resuelve después de enviar la respuesta.
 */
const searchProducts = async (term = '', res = response) => {
  const isMongoID = mongoose.Types.ObjectId.isValid(term);
  if (isMongoID) {
    const product = await Product.findById(term).populate('category', 'name');
    return res.json({ results: product ? [product] : [] });
  }

  const regex = new RegExp(term, 'i');
  const products = await Product.find({ name: regex, state: true }).populate(
    'category',
    'name',
  );
  return res.json({ results: products });
};

/**
 * @name search
 * @description Controlador para realizar búsquedas en las colecciones de la base de datos.
 * @param { Object } req - Objeto de solicitud con la información de la búsqueda.
 * @param { Object } res - Objeto de respuesta para enviar la respuesta al cliente.
 * @returns { Promise<void> } Una promesa que se resuelve después de enviar la respuesta.
 */
const search = (req = request, res = response) => {
  const { collection, term } = req.params;

  if (!collectionsAllowed.includes(collection)) {
    return res
      .status(400)
      .json({ msg: `Las colecciones permitidas son: ${collectionsAllowed}` });
  }

  switch (collection) {
    case 'users':
      searchUsers(term, res);
      break;
    case 'categories':
      searchCategories(term, res);
      break;
    case 'products':
      searchProducts(term, res);
      break;
    default:
      res.status(500).json({ msg: 'Se me olvidó hacer esta búsqueda' });
  }
};

export { search };
