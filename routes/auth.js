import { Router } from 'express';
import { check } from 'express-validator';
import { validateFields } from '../middleware/index.js';
import { googleSigIn, login } from '../controllers/auth.js';

const router = Router();

/**
 * @route POST /api/auth/login
 * @description Autenticar un usuario
 * @access Publica
 * @returns { Object } - Token de autenticación.
 * @returns { string } - Token de autenticación.
 */
router.post(
  '/login',
  [
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validateFields,
  ],
  login,
);

/**
 * @route POST /api/auth/google
 * @description Autenticar un usuario con Google
 * @access Publica
 * @returns { Object } - Token de autenticación.
 * @returns { string } - Token de autenticación.
 * @todo Validar que el token de Google sea válido y que el email corresponda a un usuario registrado en la base de datos.
 */
router.post(
  '/google',
  [
    check('id_token', 'El Token de Google es necesario').not().isEmpty(),
    validateFields,
  ],
  googleSigIn,
);

export default router;
