import { Router } from 'express';
import { check } from 'express-validator';
import { validateFields } from '../middleware/validate-fields.js';
import { login } from '../controllers/auth.js';

const router = Router();


/**
 * @route POST /api/auth/login
 * @description Autenticar un usuario
 * @access Publica
 * @returns { Object } - Token de autenticación.
 * @returns { string } - Token de autenticación.
 */
router.post( '/login', [
  check( 'email', 'El email es obligatorio' ).isEmail(),
  check( 'password', 'La contraseña es obligatoria' ).not().isEmpty(),
  validateFields,
], login );

export default router;