import { Role, User, Category, Product } from '../models/index.js';

/**
 * @typedef {Object} ValidationError
 * @property {string} code - Código de error
 * @property {string} message - Mensaje de error
 */

class ValidationError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
    this.name = 'ValidationError';
  }
}

/**
 * @name isRoleValid
 * @description Valida rol existente
 */
const isRoleValid = async (role = '') => {
  try {
    if (!role) {
      throw new ValidationError('ROLE_REQUIRED', 'El rol es requerido');
    }

    const existRole = await Role.findOne({ role: role.toUpperCase() });
    if (!existRole) {
      throw new ValidationError(
        'INVALID_ROLE',
        `El rol ${role} no está registrado en la base de datos`,
      );
    }

    return true;
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError(
      'VALIDATION_ERROR',
      `Error validando rol: ${error.message}`,
    );
  }
};

/**
 * @name existEmail
 * @description Valida email único
 */
const existEmail = async (email = '') => {
  try {
    if (!email) {
      throw new ValidationError('EMAIL_REQUIRED', 'El email es requerido');
    }

    const existingEmail = await User.findOne({
      email: email.toLowerCase(),
      state: true,
    });

    if (existingEmail) {
      throw new ValidationError(
        'EMAIL_EXISTS',
        `El email ${email} ya está registrado`,
      );
    }

    return true;
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError(
      'VALIDATION_ERROR',
      `Error validando email: ${error.message}`,
    );
  }
};

/**
 * @name validateId
 * @description Validación genérica de IDs
 */
const validateId = async (id, Model, entityName) => {
  try {
    if (!id?.match(/^[0-9a-fA-F]{24}$/)) {
      throw new ValidationError(
        'INVALID_ID',
        `El ID proporcionado no es válido`,
      );
    }

    const document = await Model.findOne({ _id: id, state: true });
    if (!document) {
      throw new ValidationError(
        'NOT_FOUND',
        `No existe ${entityName} con el ID: ${id}`,
      );
    }

    return true;
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError(
      'VALIDATION_ERROR',
      `Error validando ID: ${error.message}`,
    );
  }
};

// Funciones específicas de validación de ID
const userIdExist = (id) => validateId(id, User, 'usuario');
const categoryIdExit = (id) => validateId(id, Category, 'categoría');
const productIdExit = (id) => validateId(id, Product, 'producto');

/**
 * @name collectionsAllowed
 * @description Valida colección permitida
 */
const collectionsAllowed = (collection = '', allowedCollections = []) => {
  try {
    if (!collection) {
      throw new ValidationError(
        'COLLECTION_REQUIRED',
        'La colección es requerida',
      );
    }

    if (!allowedCollections.includes(collection)) {
      throw new ValidationError(
        'INVALID_COLLECTION',
        `Colección no permitida. Permitidas: ${allowedCollections.join(', ')}`,
      );
    }

    return true;
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError(
      'VALIDATION_ERROR',
      `Error validando colección: ${error.message}`,
    );
  }
};

export {
  categoryIdExit,
  collectionsAllowed,
  existEmail,
  productIdExit,
  userIdExist,
  isRoleValid,
};
