import { Router } from 'express';
import { check } from 'express-validator';
import { validateFields } from '../middlewares/index.js';
import { googleSigIn, login } from '../controllers/index.js';

/**
 * @typedef {Object} AuthResponse
 * @property {string} token - Token JWT de autenticación
 * @property {Object} user - Información del usuario autenticado
 */

const router = Router();

/**
 * @route POST /api/auth/login
 * @description Autenticar un usuario con credenciales locales
 * @access Public
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña del usuario
 * @returns {AuthResponse} Objeto con token y datos del usuario
 * @throws {400} - Si faltan campos requeridos o son inválidos
 * @throws {401} - Si las credenciales son incorrectas
 */
router.post(
  '/login',
  [
    check('email')
      .isEmail()
      .withMessage('El email debe ser válido')
      .normalizeEmail()
      .trim(),
    check('password')
      .isLength({ min: 6 })
      .withMessage('La contraseña debe tener al menos 6 caracteres')
      .trim(),
    validateFields,
  ],
  login
);

/**
 * @route POST /api/auth/google
 * @description Autenticar un usuario usando Google OAuth
 * @access Public
 * @param {string} id_token - Token de autenticación de Google
 * @returns {AuthResponse} Objeto con token JWT y datos del usuario
 * @throws {400} - Si el token de Google es inválido o falta
 * @throws {401} - Si falla la autenticación con Google
 */
router.post(
  '/google',
  [
    check('id_token')
      .notEmpty()
      .withMessage('El token de Google es requerido')
      .trim(),
    validateFields,
  ],
  googleSigIn
);

// Prevenir modificación del router después de su configuración
Object.freeze(router);

export default router;
