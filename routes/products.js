import { Router } from 'express';
import { check } from 'express-validator';
import {
  isAdminRole,
  validateFields,
  validateJWT,
} from '../middlewares/index.js';
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from '../controllers/index.js';
import { categoryIdExit, productIdExit } from '../helpers/index.js';

/**
 * @typedef {Object} ProductResponse
 * @property {string} id - ID del producto
 * @property {string} name - Nombre del producto
 * @property {number} price - Precio del producto
 * @property {Object} category - Categoría del producto
 * @property {Object} user - Usuario que creó/modificó el producto
 */

const router = Router();

// Validaciones comunes
const productValidations = {
  getById: [
    check('id').isMongoId().withMessage('ID no válido').custom(productIdExit),
    validateFields,
  ],
  create: [
    validateJWT,
    check('name')
      .trim()
      .notEmpty()
      .withMessage('El nombre es obligatorio')
      .isLength({ min: 3, max: 100 })
      .withMessage('El nombre debe tener entre 3 y 100 caracteres'),
    check('category')
      .isMongoId()
      .withMessage('ID de categoría no válido')
      .custom(categoryIdExit),
    check('price')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('El precio debe ser un número positivo'),
    validateFields,
  ],
  update: [
    validateJWT,
    check('id').isMongoId().withMessage('ID no válido').custom(productIdExit),
    check('name')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('El nombre no puede estar vacío')
      .isLength({ min: 3, max: 100 }),
    check('category')
      .optional()
      .isMongoId()
      .withMessage('ID de categoría no válido')
      .custom(categoryIdExit),
    validateFields,
  ],
  delete: [
    validateJWT,
    isAdminRole,
    check('id').isMongoId().withMessage('ID no válido').custom(productIdExit),
    validateFields,
  ],
};

/**
 * @route GET /api/products
 * @description Obtener listado de productos con paginación
 * @access Public
 * @returns {Array<ProductResponse>} Lista paginada de productos
 */
router.get('/', getProducts);

/**
 * @route GET /api/products/:id
 * @description Obtener un producto por ID
 * @access Public
 * @returns {ProductResponse} Producto encontrado
 */
router.get('/:id', productValidations.getById, getProduct);

/**
 * @route POST /api/products
 * @description Crear un nuevo producto
 * @access Private
 * @returns {ProductResponse} Producto creado
 */
router.post('/', productValidations.create, createProduct);

/**
 * @route PUT /api/products/:id
 * @description Actualizar un producto existente
 * @access Private
 * @returns {ProductResponse} Producto actualizado
 */
router.put('/:id', productValidations.update, updateProduct);

/**
 * @route DELETE /api/products/:id
 * @description Eliminar un producto (desactivar)
 * @access Private - Admin only
 * @returns {Object} Confirmación de eliminación
 */
router.delete('/:id', productValidations.delete, deleteProduct);

// Prevenir modificaciones del router
Object.freeze(router);

export default router;
