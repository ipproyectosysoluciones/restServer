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
 * @description Authenticate user with local credentials
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
      .withMessage('Invalid email format')
      .normalizeEmail()
      .trim(),
    check('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long')
      .trim()
      .escape(),
    validateFields,
  ],
  async (req, res, next) => {
    try {
      await login(req, res);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route POST /api/auth/google
 * @description Authenticate user using Google OAuth
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
      .withMessage('Google token is required')
      .trim()
      .escape(),
    validateFields,
  ],
  async (req, res, next) => {
    try {
      await googleSigIn(req, res);
    } catch (error) {
      next(error);
    }
  }
);

// Prevenir modificación del router después de su configuración
Object.freeze(router);

export default router;
