import { request, response } from 'express';
import { Category } from '../models/index.js';

/**
 * @name getCategories
 * @description Función asincrónica para recuperar categorías en función de los parámetros de consulta de solicitud proporcionados.
 *
 * @param { Object } req: el objeto de solicitud que contiene los parámetros de consulta para filtrar categorías.
 * @param { Object } res: el objeto de respuesta para devolver el recuento total y las categorías paginadas.
 * @returns { Promise<void> }: una promesa que se resuelve con el recuento total y las categorías paginadas en la respuesta.
 */
const getCategories = async (req = request, res = response) => {
  // Get params from query
  const { limit = 5, from = 0 } = req.query;
  const query = { state: true };

  // Find all the categories and paginate them
  const [total, categories] = await Promise.all([
    Category.countDocuments(query),
    Category.find(query)
      .populate('user', 'name')
      .skip(Number(from))
      .limit(Number(limit)),
  ]);

  res.status(200).json({
    total,
    categories,
  });
};

/**
 * @name getCategory
 * @description Recupera una categoría por su ID y la envía como una respuesta JSON.
 *
 * @param {Object} req: el objeto de solicitud que contiene el ID de la categoría en los parámetros.
 * @param {Object} res: el objeto de respuesta utilizado para enviar la categoría recuperada como una respuesta JSON.
 * @returns {Promise<void>}: una promesa que se resuelve cuando la categoría se recupera correctamente y se envía como una respuesta.
 */
const getCategory = async (req = request, res = response) => {
  const { id } = req.params;
  // Find the category by id
  const category = await Category.findById(id).populate('user', 'name');

  res.status(200).json(category);
};

/**
 * @name createCategory
 * @description Función asincrónica para crear una nueva categoría.
 *
 * @param { Object } req - El objeto de solicitud que contiene el nombre de la categoría en el cuerpo.
 * @param { Object } res - El objeto de respuesta para enviar el resultado.
 * @returns { Object } La categoría creada en mayúsculas si se realizó correctamente, o un mensaje de error si la categoría ya existe.
 */
const createCategory = async (req = request, res = response) => {
  const name = req.body.name.toUpperCase();
  const categoryDB = await Category.findOne({ name });

  if (categoryDB) {
    return res.status(400).json({
      msg: `La categoría ${categoryDB.name}, ya existe`,
    });
  }

  // Generate the Data to Save
  const data = {
    name,
    user: req.user._id,
  };

  const category = new Category(data);

  // Save Category
  await category.save();

  res.status(201).json(category);
};

/**
 * @name updateCategory
 * @description Actualiza una categoría por su ID.
 *
 * @param { Object } req - el objeto de solicitud que contiene el ID de la categoría en los parámetros y los datos de la categoría actualizada en el cuerpo.
 * @param { Object } res - el objeto de respuesta para devolver la categoría actualizada.
 * @returns { Promise<void> } - una promesa que se resuelve después de actualizar la categoría y enviar la respuesta.
 */
const updateCategory = async (req = request, res = response) => {
  const { id } = req.params;
  const { state, user, ...data } = req.body;

  data.name = data.name.toUpperCase();
  data.user = req.user._id;

  const category = await Category.findByIdAndUpdate(id, data, { new: true });

  res.status(200).json(category);
};

/**
 * @name deleteCategory
 * @description Elimina de forma asincrónica una categoría actualizando su estado a falso en la base de datos.
 *
 * @param { Object } req - el objeto de solicitud que contiene el ID de la categoría en los parámetros.
 * @param { Object } res - el objeto de respuesta para enviar de vuelta la información de la categoría actualizada.
 * @returns { Promise<void> } - una promesa que se resuelve después de actualizar el estado de la categoría y enviar la respuesta.
 */
const deleteCategory = async (req = request, res = response) => {
  const { id } = req.params;

  const categoryDelete = await Category.findByIdAndUpdate(
    id,
    { state: false },
    { new: true },
  );

  res.status(200).json(categoryDelete);
};

export {
  createCategory,
  deleteCategory,
  getCategories,
  getCategory,
  updateCategory,
};
