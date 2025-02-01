import { request, response } from 'express';
import bcryptjs from 'bcryptjs';
import { User } from '../models/index.js';
import { generateJWT, googleVerify } from '../helpers/index.js';

/**
 * @typedef {Object} AuthResponse
 * @property {Object} user - Datos del usuario autenticado
 * @property {string} token - Token JWT de autenticación
 */

const createErrorResponse = (code, message) => ({
  status: 'error',
  code,
  message,
  timestamp: new Date().toISOString()
});

const createSuccessResponse = (data) => ({
  status: 'success',
  data,
  timestamp: new Date().toISOString()
});

/**
 * @name login
 * @description Controlador para autenticación local de usuarios
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
const login = async (req = request, res = response) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario y validar estado en una sola consulta
    const user = await User.findOne({ 
      email, 
      state: true 
    }).select('+password');

    if (!user) {
      return res.status(401).json(
        createErrorResponse(
          'AUTH_FAILED',
          'Credenciales incorrectas'
        )
      );
    }

    // Validar contraseña
    const validPassword = await bcryptjs.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json(
        createErrorResponse(
          'AUTH_FAILED',
          'Credenciales incorrectas'
        )
      );
    }

    // Generar JWT
    const token = await generateJWT(user.id);

    return res.json(createSuccessResponse({
      user: user.toJSON(),
      token
    }));

  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json(
      createErrorResponse(
        'INTERNAL_ERROR',
        'Error interno del servidor'
      )
    );
  }
};

/**
 * @name googleSigIn
 * @description Controlador para autenticación con Google
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 */
const googleSigIn = async (req = request, res = response) => {
  try {
    const { id_token } = req.body;

    const { name, email, img } = await googleVerify(id_token);

    let user = await User.findOne({ email });

    if (!user) {
      // Crear nuevo usuario
      const userData = {
        name,
        email,
        password: ':P',
        img,
        google: true,
        role: 'USER_ROLE' // Role por defecto para usuarios de Google
      };

      user = new User(userData);
      await user.save();
    }

    if (!user.state) {
      return res.status(403).json(
        createErrorResponse(
          'USER_BLOCKED',
          'Usuario bloqueado. Contacte al administrador'
        )
      );
    }

    const token = await generateJWT(user.id);

    return res.json(createSuccessResponse({
      user: user.toJSON(),
      token
    }));

  } catch (error) {
    console.error('Error en Google Sign-in:', error);
    return res.status(401).json(
      createErrorResponse(
        'GOOGLE_AUTH_FAILED',
        'Error en la autenticación con Google'
      )
    );
  }
};

export { login, googleSigIn };
