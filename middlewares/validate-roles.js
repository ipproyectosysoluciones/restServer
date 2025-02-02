import { request, response } from 'express';

/**
 * @typedef {Object} RoleError
 * @property {string} status - Estado del error
 * @property {string} code - Código de error
 * @property {string} message - Mensaje descriptivo
 * @property {string} timestamp - Marca de tiempo
 */

const ROLE_ERRORS = {
  NO_TOKEN_VALIDATION: 'TOKEN_VALIDATION_REQUIRED',
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
  INVALID_ROLE: 'INVALID_ROLE',
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
 * @name isAdminRole
 * @description Valida que el usuario tenga rol de administrador
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 */
export const isAdminRole = (req = request, res = response, next) => {
  try {
    if (!req.authenticatedUser) {
      return res
        .status(500)
        .json(
          createErrorResponse(
            ROLE_ERRORS.NO_TOKEN_VALIDATION,
            'Se requiere validación de token antes de verificar el rol',
          ),
        );
    }

    const { role, name } = req.authenticatedUser;

    if (role !== 'ADMIN_ROLE') {
      return res
        .status(403)
        .json(
          createErrorResponse(
            ROLE_ERRORS.INSUFFICIENT_PERMISSIONS,
            `${name} no tiene permisos de administrador para esta acción`,
          ),
        );
    }

    next();
  } catch (error) {
    console.error('Error en validación de rol admin:', error);
    return res
      .status(500)
      .json(
        createErrorResponse(
          'ROLE_VALIDATION_ERROR',
          'Error interno en validación de rol',
        ),
      );
  }
};

/**
 * @name hasRole
 * @description Valida que el usuario tenga alguno de los roles especificados
 * @param {...string} roles - Roles permitidos
 * @returns {Function} Middleware de Express
 */
export const hasRole = (...roles) => {
  return (req = request, res = response, next) => {
    try {
      if (!roles.length) {
        throw new Error('No se especificaron roles para validar');
      }

      if (!req.authenticatedUser) {
        return res
          .status(500)
          .json(
            createErrorResponse(
              ROLE_ERRORS.NO_TOKEN_VALIDATION,
              'Se requiere validación de token antes de verificar roles',
            ),
          );
      }

      const userRole = req.authenticatedUser.role?.toUpperCase();

      if (!userRole || !roles.includes(userRole)) {
        return res
          .status(403)
          .json(
            createErrorResponse(
              ROLE_ERRORS.INVALID_ROLE,
              `Se requiere uno de los siguientes roles: ${roles.join(', ')}`,
            ),
          );
      }

      next();
    } catch (error) {
      console.error('Error en validación de roles:', error);
      return res
        .status(500)
        .json(
          createErrorResponse(
            'ROLE_VALIDATION_ERROR',
            'Error interno en validación de roles',
          ),
        );
    }
  };
};
