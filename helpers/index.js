/**
 * @fileoverview Punto de entrada principal para helpers
 * @module helpers
 */

// Registro de helpers disponibles
const HELPER_REGISTRY = {
  dbValidators: './db-validators.js',
  generateJWT: './generate-jwt.js',
  googleVerify: './google-verify.js',
  uploadFile: './upload-file.js'
};

/**
 * @name validateHelpers
 * @description Valida que todos los helpers estén disponibles
 * @throws {Error} Si algún helper no está disponible
 */
const validateHelpers = async () => {
  try {
    const results = await Promise.all(
      Object.entries(HELPER_REGISTRY).map(async ([name, path]) => {
        try {
          const module = await import(path);
          return module && Object.keys(module).length > 0;
        } catch (error) {
          console.error(`Failed to load helper ${name}:`, error);
          return false;
        }
      })
    );

    if (!results.every(Boolean)) {
      throw new Error('Some helpers failed to load');
    }
  } catch (error) {
    console.error('Helper validation failed:', error);
    throw error;
  }
};

// Validar helpers al importar
validateHelpers().catch(error => {
  console.error('Helper initialization error:', error);
  process.exit(1);
});

// Exportaciones ordenadas alfabéticamente
export * from './db-validators.js';
export * from './generate-jwt.js';
export * from './google-verify.js';
export * from './upload-file.js';

/**
 * @description Log de helpers cargados exitosamente
 */
console.log('All helpers loaded successfully');
