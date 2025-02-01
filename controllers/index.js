/**
 * @fileoverview Punto de entrada principal para controladores
 */

// Importaciones de controladores
const controllers = {
  auth: () => import('./auth.js'),
  users: () => import('./users.js'),
  categories: () => import('./categories.js'),
  products: () => import('./products.js'),
  search: () => import('./search.js'),
  uploads: () => import('./uploads.js')
};

/**
 * @name validateControllers
 * @throws {Error} Si algún controlador no está disponible
 */
const validateControllers = async () => {
  try {
    const results = await Promise.all(
      Object.entries(controllers).map(async ([name, loader]) => {
        try {
          const module = await loader();
          return module && Object.keys(module).length > 0;
        } catch {
          return false;
        }
      })
    );

    if (!results.every(Boolean)) {
      throw new Error('Some controllers failed to load');
    }
  } catch (error) {
    throw new Error(`Controller validation failed: ${error.message}`);
  }
};

// Validar controladores al importar
validateControllers().catch(error => {
  console.error('Controller initialization error:', error);
  process.exit(1);
});

// Exportaciones
export * from './auth.js';
export * from './users.js';
export * from './categories.js';
export * from './products.js';
export * from './search.js';
export * from './uploads.js';