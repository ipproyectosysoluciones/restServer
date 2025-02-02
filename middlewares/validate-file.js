import { request, response } from 'express';

/**
 * @typedef {Object} FileValidationConfig
 * @property {number} maxFileSize - Tamaño máximo del archivo en bytes
 * @property {string[]} allowedMimeTypes - Tipos MIME permitidos
 */

const FILE_CONFIG = {
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
};

/**
 * @name validateFileProperties
 * @description Valida las propiedades del archivo subido
 * @throws {Error} Si el archivo no cumple con los requisitos
 */
const validateFileProperties = (file) => {
  if (file.size > FILE_CONFIG.maxFileSize) {
    throw new Error(
      `El archivo excede el tamaño máximo permitido de ${FILE_CONFIG.maxFileSize / 1024 / 1024}MB`,
    );
  }

  if (!FILE_CONFIG.allowedMimeTypes.includes(file.mimetype)) {
    throw new Error(
      `Tipo de archivo no permitido. Tipos permitidos: ${FILE_CONFIG.allowedMimeTypes.join(', ')}`,
    );
  }
};

/**
 * @name validateFileUpload
 * @description Middleware para validar archivos subidos
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 * @returns {void | Response} Continúa con next() o devuelve respuesta de error
 */
export const validateFileUpload = (req = request, res = response, next) => {
  try {
    // Validar existencia de archivos
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({
        status: 'error',
        code: 'NO_FILES_UPLOADED',
        message: 'No se han proporcionado archivos para subir',
        timestamp: new Date().toISOString(),
      });
    }

    const file = req.files.file;

    // Validar que sea un solo archivo
    if (Array.isArray(file)) {
      return res.status(400).json({
        status: 'error',
        code: 'MULTIPLE_FILES_NOT_ALLOWED',
        message: 'Solo se permite subir un archivo a la vez',
        timestamp: new Date().toISOString(),
      });
    }

    // Validar propiedades del archivo
    validateFileProperties(file);

    next();
  } catch (error) {
    console.error('Error en la validación del archivo:', error);
    return res.status(400).json({
      status: 'error',
      code: 'FILE_VALIDATION_ERROR',
      message: error.message,
      timestamp: new Date().toISOString(),
    });
  }
};
