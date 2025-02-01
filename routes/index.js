import authRoutes from './auth.js';
import categoriesRoutes from './categories.js';
import productsRoutes from './products.js';
import searchRoutes from './search.js';
import uploadsRoutes from './uploads.js';
import usersRoutes from './users.js';

export const routes = {
  auth: authRoutes,
  categories: categoriesRoutes,
  products: productsRoutes,
  search: searchRoutes,
  uploads: uploadsRoutes,
  users: usersRoutes,
};

// Mantener las exportaciones individuales por compatibilidad
export {
  authRoutes,
  categoriesRoutes,
  productsRoutes,
  searchRoutes,
  uploadsRoutes,
  usersRoutes,
};
