import { Router } from 'express';
import { check } from 'express-validator';
import {
  isAdminRole,
  validateFields,
  validateJWT,
} from '../middlewares/index.js';
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategory,
  updateCategory,
} from '../controllers/index.js';
import { categoryIdExit } from '../helpers/index.js';

/**
 * @typedef {Object} CategoryResponse
 * @property {string} id - ID de la categoría
 * @property {string} name - Nombre de la categoría
 * @property {Object} user - Usuario que creó/modificó la categoría
 */

const router = Router();

// Validaciones comunes
const categoryValidations = {
  getById: [
    check('id')
      .isMongoId().withMessage('ID no válido')
      .custom(categoryIdExit),
    validateFields
  ],
  create: [
    validateJWT,
    check('name')
      .trim()
      .notEmpty().withMessage('El nombre es obligatorio')
      .isLength({ min: 3, max: 50 }).withMessage('El nombre debe tener entre 3 y 50 caracteres'),
    validateFields
  ],
  update: [
    validateJWT,
    check('id')
      .isMongoId().withMessage('ID no válido')
      .custom(categoryIdExit),
    check('name')
      .trim()
      .notEmpty().withMessage('El nombre es obligatorio')
      .isLength({ min: 3, max: 50 }).withMessage('El nombre debe tener entre 3 y 50 caracteres'),
    validateFields
  ],
  delete: [
    validateJWT,
    isAdminRole,
    check('id')
      .isMongoId().withMessage('ID no válido')
      .custom(categoryIdExit),
    validateFields
  ]
};

/**
 * @route GET /api/categories
 * @description Obtener todas las categorías
 * @access Public
 * @returns {Array<CategoryResponse>} Lista de categorías
 */
router.get('/', getCategories);

/**
 * @route GET /api/categories/:id
 * @description Obtener una categoría por ID
 * @access Public
 * @returns {CategoryResponse} Categoría encontrada
 */
router.get('/:id', categoryValidations.getById, getCategory);

/**
 * @route POST /api/categories
 * @description Crear una nueva categoría
 * @access Private
 * @returns {CategoryResponse} Categoría creada
 */
router.post('/', categoryValidations.create, createCategory);

/**
 * @route PUT /api/categories/:id
 * @description Actualizar una categoría existente
 * @access Private
 * @returns {CategoryResponse} Categoría actualizada
 */
router.put('/:id', categoryValidations.update, updateCategory);

/**
 * @route DELETE /api/categories/:id
 * @description Eliminar una categoría (desactivar)
 * @access Private - Admin only
 * @returns {Object} Confirmación de eliminación
 */
router.delete('/:id', categoryValidations.delete, deleteCategory);

// Prevenir modificaciones del router
Object.freeze(router);

export default router;
