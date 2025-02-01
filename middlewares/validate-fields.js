import { validationResult } from 'express-validator';

/**
 * @typedef {Object} ValidationErrorResponse
 * @property {string} status - Estado del error
 * @property {string} code - Código de error
 * @property {Array<Object>} errors - Lista de errores de validación
 * @property {string} timestamp - Marca de tiempo del error
 */

/**
 * @name createErrorResponse
 * @description Crea una respuesta de error estandarizada
 */
const createErrorResponse = (code, message, errors = []) => ({
  status: 'error',
  code,
  ...(errors.length ? { errors } : { message }),
  timestamp: new Date().toISOString()
});

/**
 * @name validateFields
 * @description Middleware mejorado para validación de campos
 */
export const validateFields = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      const formattedErrors = errors.array().map(({ param, msg, location }) => ({
        field: param,
        message: msg,
        location
      }));

      return res.status(400).json(
        createErrorResponse('VALIDATION_ERROR', null, formattedErrors)
      );
    }

    // Solo validar body vacío en POST
    if (req.method === 'POST' && !hasValidBody(req)) {
      return res.status(400).json(
        createErrorResponse('EMPTY_BODY', 'Se requieren datos para crear el recurso')
      );
    }

    next();
  } catch (error) {
    console.error('Validation error:', error);
    return res.status(500).json(
      createErrorResponse('VALIDATION_SYSTEM_ERROR', 'Error interno en la validación')
    );
  }
};

// Funciones auxiliares
const shouldValidateBody = (req) => 
  ['POST', 'PUT', 'PATCH'].includes(req.method);

const hasValidBody = (req) => {
  // No requerir body para solicitudes GET y DELETE
  if (['GET', 'DELETE'].includes(req.method)) {
    return true;
  }
  
  // Para PUT y PATCH, permitir actualización parcial
  if (['PUT', 'PATCH'].includes(req.method)) {
    return req.body && typeof req.body === 'object';
  }

  // Para POST, requerir al menos un campo
  return req.body && Object.keys(req.body).length > 0;
};
