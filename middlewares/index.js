/**
 * @fileoverview Punto de entrada principal para middlewares
 * @module middlewares
 */

// Registro de middlewares disponibles
const MIDDLEWARE_REGISTRY = {
  validateFields: './validate-fields.js',
  validateFile: './validate-file.js',
  validateJWT: './validate-jwt.js',
  validateRoles: './validate-roles.js',
};

/**
 * @name validateMiddlewares
 * @description Valida que todos los middlewares estén disponibles
 * @throws {Error} Si algún middleware no está disponible
 */
const validateMiddlewares = async () => {
  try {
    const results = await Promise.all(
      Object.entries(MIDDLEWARE_REGISTRY).map(async ([name, path]) => {
        try {
          const module = await import(path);
          return module && Object.keys(module).length > 0;
        } catch (error) {
          console.error(`Failed to load middleware ${name}:`, error);
          return false;
        }
      }),
    );

    if (!results.every(Boolean)) {
      throw new Error('Some middlewares failed to load');
    }
  } catch (error) {
    console.error('Middleware validation failed:', error);
    throw error;
  }
};

// Validar middlewares al importar
validateMiddlewares().catch((error) => {
  console.error('Middleware initialization error:', error);
  process.exit(1);
});

// Exportaciones ordenadas alfabéticamente
export * from './validate-fields.js';
export * from './validate-file.js';
export * from './validate-jwt.js';
export * from './validate-roles.js';

/**
 * @description Log de middleware cargados exitosamente
 */
console.log('All middlewares loaded successfully');
