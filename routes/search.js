import { Router } from 'express';
import { check } from 'express-validator';
import { validateFields } from '../middlewares/index.js';
import { search } from '../controllers/index.js';

/**
 * @typedef {Object} SearchResponse
 * @property {string} status - Estado de la búsqueda
 * @property {Array<Object>} results - Resultados de la búsqueda
 * @property {number} total - Total de resultados encontrados
 */

const router = Router();

// Colecciones permitidas para búsqueda
const ALLOWED_COLLECTIONS = [
  'users',
  'categories',
  'products',
  'roles'
];

/**
 * @route GET /api/search/:collection/:term
 * @description Buscar en colecciones específicas
 * @access Public
 * @returns {SearchResponse} Resultados de la búsqueda
 */
router.get('/:collection/:term', [
  check('collection')
    .isIn(ALLOWED_COLLECTIONS)
    .withMessage(`Colección no válida. Permitidas: ${ALLOWED_COLLECTIONS.join(', ')}`),
  check('term')
    .trim()
    .notEmpty()
    .withMessage('El término de búsqueda es requerido')
    .isLength({ min: 2 })
    .withMessage('El término debe tener al menos 2 caracteres'),
  validateFields
], search);

// Prevenir modificaciones del router
Object.freeze(router);

export default router;
