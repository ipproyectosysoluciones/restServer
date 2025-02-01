import { Router } from 'express';
import { check } from 'express-validator';
import { validateFields, validateFileUpload } from '../middlewares/index.js';
import { collectionsAllowed } from '../helpers/index.js';
import {
  showImage,
  uploadFile,
  updateImageCloudinary
} from '../controllers/index.js';

/**
 * @typedef {Object} UploadResponse
 * @property {string} url - URL del archivo subido
 * @property {string} filename - Nombre del archivo
 * @property {string} mimetype - Tipo MIME del archivo
 */

const router = Router();

// Colecciones permitidas para imágenes
const ALLOWED_COLLECTIONS = ['users', 'products'];

// Validaciones comunes
const uploadValidations = {
  getImage: [
    check('id')
      .isMongoId().withMessage('ID no válido')
      .trim(),
    check('collection')
      .custom(c => collectionsAllowed(c, ALLOWED_COLLECTIONS))
      .withMessage(`Colecciones permitidas: ${ALLOWED_COLLECTIONS.join(', ')}`),
    validateFields
  ],
  updateImage: [
    validateFileUpload,
    check('id')
      .isMongoId().withMessage('ID no válido')
      .trim(),
    check('collection')
      .custom(c => collectionsAllowed(c, ALLOWED_COLLECTIONS))
      .withMessage(`Colecciones permitidas: ${ALLOWED_COLLECTIONS.join(', ')}`),
    validateFields
  ]
};

/**
 * @route GET /api/uploads/:collection/:id
 * @description Obtener imagen de una colección
 * @access Public
 */
router.get(
  '/:collection/:id',
  uploadValidations.getImage,
  showImage
);

/**
 * @route POST /api/uploads
 * @description Subir archivo
 * @access Private
 * @returns {UploadResponse} Información del archivo subido
 */
router.post(
  '/',
  [validateFileUpload],
  uploadFile
);

/**
 * @route PUT /api/uploads/:collection/:id
 * @description Actualizar imagen de una entidad en Cloudinary
 * @access Private
 * @returns {UploadResponse} Información de la imagen actualizada
 */
router.put(
  '/:collection/:id',
  uploadValidations.updateImage,
  updateImageCloudinary
);

// Prevenir modificaciones del router
Object.freeze(router);

export default router;
