/**
 * @description Configuración centralizada para JWT
 */
export const JWT_CONFIG = {
  secret: process.env.SECRET_JWT_SEED || 'S3cr3t@K3y-D3v-2024*',  // Valor por defecto para desarrollo
  expiresIn: process.env.JWT_EXPIRES_IN || '4h',
  algorithm: 'HS256',
  maxRetries: 3
};

/**
 * @description Valida la configuración de JWT
 * @throws {Error} Si la configuración no es válida en producción
 */
export const validateJWTConfig = () => {
  // En producción, requerir explícitamente la clave secreta
  if (process.env.NODE_ENV === 'production' && !process.env.SECRET_JWT_SEED) {
    throw new Error('JWT secret key must be configured in production environment');
  }
  
  // Advertencia si se usa la clave por defecto en producción
  if (process.env.NODE_ENV === 'production' && 
      JWT_CONFIG.secret === 'S3cr3t@K3y-D3v-2024*') {
    console.warn('WARNING: Using default JWT secret key in production environment');
  }
};
