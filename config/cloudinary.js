import { v2 as cloudinary } from 'cloudinary';

/**
 * @typedef {Object} CloudinaryConfig
 * @property {string} cloud_name - Nombre de la nube de Cloudinary
 * @property {string} api_key - Clave API de Cloudinary
 * @property {string} api_secret - Secreto API de Cloudinary
 */

/**
 * Valida la configuración de Cloudinary
 * @throws {Error} Si faltan variables de entorno requeridas
 */
const validateConfig = () => {
  const required = [
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET',
  ];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing Cloudinary config: ${missing.join(', ')}`);
  }
};

/**
 * Configura la instancia de Cloudinary
 * @returns {void}
 */
const configureCloudinary = () => {
  try {
    validateConfig();

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    console.log('✓ Cloudinary configured successfully');
  } catch (error) {
    console.error('✗ Cloudinary configuration error:', error.message);
    process.exit(1); // Terminar el proceso si la configuración falla
  }
};

/**
 * Sube un archivo a Cloudinary
 * @param {string} filePath - Ruta del archivo temporal
 * @param {Object} options - Opciones de subida
 * @returns {Promise<Object>} Resultado de la subida
 */
const uploadToCloudinary = async (filePath, options = {}) => {
  try {
    return await cloudinary.uploader.upload(filePath, options);
  } catch (error) {
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
};

/**
 * Elimina un archivo de Cloudinary
 * @param {string} publicId - ID público del recurso
 * @returns {Promise<Object>} Resultado de la eliminación
 */
const deleteFromCloudinary = async (publicId) => {
  try {
    return await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    throw new Error(`Cloudinary delete failed: ${error.message}`);
  }
};

export {
  cloudinary,
  configureCloudinary,
  uploadToCloudinary,
  deleteFromCloudinary,
};
