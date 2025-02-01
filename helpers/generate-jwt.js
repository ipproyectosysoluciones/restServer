import jwt from 'jsonwebtoken';
import { JWT_CONFIG, validateJWTConfig } from '../config/jwt.config.js';

/**
 * @typedef {Object} JWTPayload
 * @property {string} uid - ID del usuario
 * @property {Date} iat - Fecha de emisión
 * @property {Date} exp - Fecha de expiración
 */

// Validar configuración al iniciar
validateJWTConfig();

/**
 * @name generateJWT
 * @description Genera un token JWT para un usuario
 * @param {string} uid - ID del usuario
 * @throws {Error} Si el UID es inválido o la generación falla
 * @returns {Promise<string>} Token JWT generado
 */
const generateJWT = async (uid) => {
  try {
    // Validar entrada
    if (!uid || typeof uid !== 'string') {
      throw new Error('UID inválido o no proporcionado');
    }

    const payload = { 
      uid,
      timestamp: Date.now()
    };

    const signOptions = {
      expiresIn: JWT_CONFIG.expiresIn,
      algorithm: JWT_CONFIG.algorithm
    };

    // Implementar lógica de reintentos
    let lastError;
    for (let attempt = 1; attempt <= JWT_CONFIG.maxRetries; attempt++) {
      try {
        return await new Promise((resolve, reject) => {
          jwt.sign(
            payload,
            JWT_CONFIG.secret,
            signOptions,
            (error, token) => {
              if (error) {
                reject(new Error(`Error en la generación del token: ${error.message}`));
              } else if (!token) {
                reject(new Error('Token generado es inválido'));
              } else {
                resolve(token);
              }
            }
          );
        });
      } catch (error) {
        lastError = error;
        if (attempt === JWT_CONFIG.maxRetries) {
          throw error;
        }
        // Esperar antes de reintentar
        await new Promise(resolve => setTimeout(resolve, 100 * attempt));
      }
    }

    throw lastError;

  } catch (error) {
    console.error('Error en generateJWT:', error);
    throw new Error(`Fallo en la generación del token: ${error.message}`);
  }
};

export { generateJWT };
