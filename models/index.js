/**
 * @fileoverview Punto de entrada principal para todos los modelos
 * @module models
 */

// Importaciones de modelos ordenadas alfabéticamente
import Category from './category.js';
import Product from './product.js';
import Role from './role.js';
import Server from './server.js';
import User from './user.js';

// Validación de modelos requeridos
const validateModels = () => {
  const requiredModels = {
    Category,
    Product,
    Role,
    Server,
    User,
  };

  for (const [modelName, ModelClass] of Object.entries(requiredModels)) {
    if (!ModelClass || typeof ModelClass !== 'function') {
      throw new Error(`Model ${modelName} is not properly exported`);
    }
  }
};

try {
  validateModels();
} catch (error) {
  console.error('Error loading models:', error.message);
  throw error;
}

/**
 * @description Exportación de todos los modelos de la aplicación
 * Los modelos están ordenados alfabéticamente para mejor mantenibilidad
 */
export { Category, Product, Role, Server, User };
