import { OAuth2Client } from 'google-auth-library';

const validateGoogleConfig = () => {
  if (!process.env.GOOGLE_ID) {
    throw new Error(
      'GOOGLE_ID no está configurado. Por favor, configure las variables de entorno necesarias.' +
        '\nAsegúrese de:' +
        '\n1. Tener un archivo .env en la raíz del proyecto' +
        '\n2. Incluir GOOGLE_ID=su_client_id en el archivo .env' +
        '\n3. Haber importado dotenv al inicio de su aplicación',
    );
  }
};

const GOOGLE_CLIENT_CONFIG = {
  clientId: process.env.GOOGLE_ID,
  maxRetries: 3,
  retryDelay: 1000,
};

// Validar configuración al iniciar
validateGoogleConfig();

const client = new OAuth2Client({
  clientId: GOOGLE_CLIENT_CONFIG.clientId,
});

/**
 * @typedef {Object} GoogleUserInfo
 * @property {string} email - Email del usuario verificado
 * @property {string} name - Nombre completo del usuario
 * @property {string} img - URL de la imagen de perfil
 */

/**
 * @name googleVerify
 * @description Verifica un token de Google y extrae la información del usuario
 * @param {string} token - Token de Google a verificar
 * @throws {Error} Si el token es inválido o la verificación falla
 * @returns {Promise<GoogleUserInfo>} Información del usuario verificada
 */
async function googleVerify(token) {
  try {
    // Validar entrada
    if (!token || typeof token !== 'string') {
      throw new Error('Token inválido o no proporcionado');
    }

    if (!GOOGLE_CLIENT_CONFIG.clientId) {
      throw new Error(
        'GOOGLE_ID no está configurado en las variables de entorno',
      );
    }

    // Verificar token con reintentos
    let lastError;
    for (
      let attempt = 1;
      attempt <= GOOGLE_CLIENT_CONFIG.maxRetries;
      attempt++
    ) {
      try {
        const ticket = await client.verifyIdToken({
          idToken: token,
          audience: GOOGLE_CLIENT_CONFIG.clientId,
        });

        const payload = ticket.getPayload();

        if (!payload) {
          throw new Error('No se pudo obtener la información del usuario');
        }

        const { email, name, picture } = payload;

        // Validar campos requeridos
        if (!email || !name) {
          throw new Error('Información de usuario incompleta en el token');
        }

        return {
          email: email.toLowerCase(),
          name: name.trim(),
          img: picture || null,
        };
      } catch (error) {
        lastError = error;
        if (attempt < GOOGLE_CLIENT_CONFIG.maxRetries) {
          await new Promise((resolve) =>
            setTimeout(resolve, GOOGLE_CLIENT_CONFIG.retryDelay * attempt),
          );
        }
      }
    }

    throw lastError;
  } catch (error) {
    console.error('Error en la verificación de Google:', error);
    throw new Error(`Fallo en la verificación del token: ${error.message}`);
  }
}

export { googleVerify };
