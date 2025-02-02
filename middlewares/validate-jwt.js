import { request, response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import { JWT_CONFIG } from '../config/jwt.config.js';

/**
 * @typedef {Object} JWTError
 * @property {string} status - Estado del error
 * @property {string} code - Código de error
 * @property {string} message - Mensaje de error
 * @property {string} timestamp - Marca de tiempo
 */

const JWT_ERRORS = {
  NO_TOKEN: 'TOKEN_MISSING',
  INVALID_TOKEN: 'TOKEN_INVALID',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  USER_INACTIVE: 'USER_INACTIVE',
};

/**
 * @name createErrorResponse
 * @description Crea una respuesta de error estandarizada
 */
const createErrorResponse = (code, message) => ({
  status: 'error',
  code,
  message,
  timestamp: new Date().toISOString(),
});

/**
 * @name validateJWT
 * @description Middleware para validar tokens JWT
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 * @returns {Promise<void>} Continúa con next() o devuelve respuesta de error
 */
export const validateJWT = async (req = request, res = response, next) => {
  const token = req.header('x-token');

  if (!token) {
    return res
      .status(401)
      .json(
        createErrorResponse(
          JWT_ERRORS.NO_TOKEN,
          'Token de autenticación no proporcionado',
        ),
      );
  }

  try {
    // Usar la misma configuración JWT que se usa para generar tokens
    const { uid } = jwt.verify(token, JWT_CONFIG.secret);

    // Buscar usuario y validar estado
    const user = await User.findOne({ _id: uid, state: true });

    if (!user) {
      return res
        .status(401)
        .json(
          createErrorResponse(
            JWT_ERRORS.USER_NOT_FOUND,
            'Usuario no encontrado o inactivo',
          ),
        );
    }

    // Almacenar usuario autenticado en request
    req.authenticatedUser = user;
    next();
  } catch (error) {
    console.error('JWT Validation error:', error);

    // Determinar tipo específico de error JWT
    let errorResponse;
    if (error instanceof jwt.TokenExpiredError) {
      errorResponse = createErrorResponse(
        'TOKEN_EXPIRED',
        'El token ha expirado',
      );
    } else if (error instanceof jwt.JsonWebTokenError) {
      errorResponse = createErrorResponse(
        JWT_ERRORS.INVALID_TOKEN,
        'Token inválido',
      );
    } else {
      errorResponse = createErrorResponse(
        'AUTH_ERROR',
        'Error de autenticación',
      );
    }

    return res.status(401).json(errorResponse);
  }
};
