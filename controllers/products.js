import { request, response } from 'express';
import { Product } from '../models/index.js';

/**
 * @name getProducts
 * @description Controlador para manejar las solicitudes GET y obtener todos los productos en la base de datos.
 * @param {*} req Objeto de solicitud que contiene la información enviada por el cliente.
 * @param {*} res Objeto de respuesta para enviar la respuesta al cliente.
 * @returns { Promise<void> } Una promesa que se resuelve después de enviar la respuesta.
 */
const getProducts = async (req = request, res = response) => {
  // Get params from query
  const { limit = 5, from = 0 } = req.query;
  const query = { state: true };

  // Find all the products and paginate them
  const [total, products] = await Promise.all([
    Product.countDocuments(query),
    Product.find(query)
      .populate('user', 'name')
      .populate('category', 'name')
      .skip(Number(from))
      .limit(Number(limit)),
  ]);

  res.status(200).json({
    total,
    products,
  });
};

/**
 * @name getProduct
 * @description Controlador para manejar las solicitudes GET y obtener un producto en particular.
 * @param {*} req Objeto de solicitud que contiene la información enviada por el cliente.
 * @param {*} res Objeto de respuesta para enviar la respuesta al cliente.
 * @returns { Promise<void> } Una promesa que se resuelve después de enviar la respuesta.
 */
const getProduct = async (req = request, res = response) => {
  const { id } = req.params;
  // Find the product by id
  const product = await Product.findById(id)
    .populate('user', 'name')
    .populate('category', 'name');

  res.status(200).json(product);
};

/**
 * @name createProduct
 * @description Función asincrónica para crear un nuevo producto.
 *
 * @param { Object } req - El objeto de solicitud que contiene los datos del producto en el cuerpo.
 * @param { Object } res - El objeto de respuesta para enviar el resultado.
 * @returns { Object } El producto creado si se realizó correctamente, o un mensaje de error si el producto ya existe.
 */
const createProduct = async (req = request, res = response) => {
  const { state, user, ...body } = req.body;
  const productDB = await Product.findOne({ name: body.name });

  if (productDB) {
    return res.status(400).json({
      msg: `El producto ${productDB.name}, ya existe`,
    });
  }

  // Generate the Data to Save
  const data = {
    ...body,
    name: req.body.name.toUpperCase(),
    user: req.user._id,
  };

  const product = new Product(data);

  // Save Product
  await product.save();

  res.status(201).json(product);
};

/**
 * @name updateProduct
 * @description Actualiza un producto por su ID.
 * @param { Object } req - El objeto de solicitud que contiene los datos del producto en el cuerpo.
 * @param { Object } res - El objeto de respuesta para enviar el resultado.
 * @returns { Object } El producto actualizado si se realizó correctamente, o un mensaje de error si el producto no existe
 */
const updateProduct = async (req = request, res = response) => {
  const { id } = req.params;
  const { state, user, ...data } = req.body;

  if (data.name) {
    data.name = data.name.toUpperCase();
  }
  data.user = req.user._id;

  const product = await Product.findByIdAndUpdate(id, data, { new: true });

  res.status(200).json(product);
};

/**
 * @name deleteProduct
 * @description Elimina un producto por su ID.
 * @param { Object } req - El objeto de solicitud que contiene los datos del producto en el cuerpo.
 * @param { Object } res - El objeto de respuesta para enviar el resultado.
 * @returns { Object } El producto eliminado si se realizó correctamente, o un mensaje de error si el producto no existe
 */
const deleteProduct = async (req = request, res = response) => {
  const { id } = req.params;

  const productDelete = await Product.findByIdAndUpdate(
    id,
    { state: false },
    { new: true },
  );

  res.status(200).json(productDelete);
};

export { createProduct, deleteProduct, getProduct, getProducts, updateProduct };
