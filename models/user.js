import { Schema, model } from 'mongoose';

/**
 * @typedef {Object} User
 * @property {string} name - Nombre del usuario
 * @property {string} email - Correo electrónico único del usuario
 * @property {string} password - Contraseña encriptada
 * @property {string} [img] - URL de la imagen de perfil
 * @property {string} role - Rol del usuario
 * @property {boolean} state - Estado del usuario (activo/inactivo)
 * @property {boolean} google - Indica si el usuario se registró con Google
 */

const VALID_ROLES = ['ADMIN_ROLE', 'USER_ROLE', 'SALES_ROLE'];

/**
 * @name UserSchema
 * @description Schema for users in MongoDB using Mongoose
 */
const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
      minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
      maxlength: [50, 'El nombre no puede exceder 50 caracteres'],
    },
    email: {
      type: String,
      required: [true, 'El email es obligatorio'],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: 'El formato del email no es válido',
      },
      index: true,
    },
    password: {
      type: String,
      required: [true, 'La contraseña es obligatoria'],
      minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
    },
    img: {
      type: String,
      validate: {
        validator: function (v) {
          return !v || /^https?:\/\/.+/.test(v);
        },
        message: 'La URL de la imagen debe ser válida',
      },
    },
    role: {
      type: String,
      required: [true, 'El rol es obligatorio'],
      default: 'USER_ROLE',
      enum: {
        values: VALID_ROLES,
        message: '{VALUE} no es un rol válido',
      },
      index: true,
    },
    state: {
      type: Boolean,
      default: true,
      index: true,
    },
    google: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Índices compuestos para búsquedas frecuentes
UserSchema.index({ email: 1, state: 1 });
UserSchema.index({ role: 1, state: 1 });

/**
 * @description Transforma el documento antes de enviarlo como JSON
 * @returns {Object} Documento transformado
 */
UserSchema.methods.toJSON = function () {
  try {
    const userObject = this.toObject();
    const { password, _id, state, ...cleanedData } = userObject;

    cleanedData.uid = _id;

    // Solo incluir estado si es false
    if (!state) {
      cleanedData.state = state;
    }

    return cleanedData;
  } catch (error) {
    console.error('Error al transformar usuario a JSON:', error);
    return this.toObject();
  }
};

const User = model('User', UserSchema);
export default User;
