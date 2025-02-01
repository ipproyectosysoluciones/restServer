import { Router } from 'express';
import { check } from 'express-validator';
import {
  hasRole,
  isAdminRole,
  validateFields,
  validateJWT,
} from '../middlewares/index.js';
import { existEmail, userIdExist, isRoleValid } from '../helpers/index.js';
import {
  usersDelete,
  usersGet,
  usersPatch,
  usersPost,
  usersPut,
} from '../controllers/index.js';

/**
 * @typedef {Object} UserResponse
 * @property {string} id - ID del usuario
 * @property {string} name - Nombre del usuario
 * @property {string} email - Email del usuario
 * @property {string} role - Rol del usuario
 * @property {string} [img] - URL de la imagen de perfil
 */

const router = Router();

// Validaciones comunes
const userValidations = {
  create: [
    check('name')
      .trim()
      .notEmpty().withMessage('El nombre es obligatorio')
      .isLength({ min: 2, max: 50 }).withMessage('El nombre debe tener entre 2 y 50 caracteres'),
    check('password')
      .isLength({ min: 6 }).withMessage('El password debe tener al menos 6 caracteres')
      .matches(/\d/).withMessage('El password debe contener al menos un número'),
    check('email')
      .trim()
      .isEmail().withMessage('El email no es válido')
      .normalizeEmail()
      .custom(existEmail),
    check('role').custom(isRoleValid),
    validateFields
  ],
  update: [
    check('id')
      .isMongoId().withMessage('ID no válido')
      .custom(userIdExist),
    check('role')
      .optional()  // Hacer el rol opcional en actualizaciones
      .custom(isRoleValid),
    check('email')
      .optional()  // Hacer el email opcional
      .isEmail().withMessage('Email no válido')
      .custom(existEmail),
    check('name')
      .optional()  // Hacer el nombre opcional
      .trim()
      .notEmpty().withMessage('El nombre no puede estar vacío')
      .isLength({ min: 2, max: 50 }),
    validateFields
  ],
  delete: [
    validateJWT,
    hasRole('ADMIN_ROLE', 'SALES_ROLE'),
    check('id')
      .isMongoId().withMessage('ID no válido')
      .custom(userIdExist),
    validateFields
  ]
};

/**
 * @route GET /api/users
 * @description Obtener listado de usuarios con paginación
 * @access Public
 * @returns {Object} Lista paginada de usuarios
 */
router.get('/', usersGet);

/**
 * @route POST /api/users
 * @description Crear nuevo usuario
 * @access Public
 * @returns {UserResponse} Usuario creado
 */
router.post('/', userValidations.create, usersPost);

/**
 * @route PUT /api/users/:id
 * @description Actualizar usuario existente
 * @access Private
 * @returns {UserResponse} Usuario actualizado
 */
router.put('/:id', userValidations.update, usersPut);

/**
 * @route PATCH /api/users/:id
 * @description Actualizar parcialmente un usuario
 * @access Private
 */
router.patch('/:id', [
  validateJWT,
  ...userValidations.update
], usersPatch);

/**
 * @route DELETE /api/users/:id
 * @description Eliminar usuario (desactivar)
 * @access Private - Admin/Sales
 * @returns {Object} Confirmación de eliminación
 */
router.delete(
  '/:id',
  userValidations.delete,  // Usar las validaciones agrupadas
  usersDelete
);

// Prevenir modificaciones del router
Object.freeze(router);

export default router;
