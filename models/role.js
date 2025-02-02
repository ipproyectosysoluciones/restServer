import { Schema, model } from 'mongoose';

/**
 * @typedef {Object} Role
 * @property {string} role - Nombre único del rol
 * @property {boolean} state - Estado del rol (activo/inactivo)
 */

/**
 * @name RoleSchema
 * @description Schema for roles in MongoDB using Mongoose
 */
const RoleSchema = new Schema(
  {
    role: {
      type: String,
      required: [true, 'El rol es obligatorio'],
      unique: true,
      trim: true,
      uppercase: true,
      minlength: [3, 'El rol debe tener al menos 3 caracteres'],
      maxlength: [30, 'El rol no puede exceder 30 caracteres'],
      validate: {
        validator: function (v) {
          return /^[A-Z_]+$/.test(v);
        },
        message: 'El rol solo puede contener letras mayúsculas y guiones bajos',
      },
    },
    state: {
      type: Boolean,
      default: true,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Crear índice para búsquedas frecuentes
RoleSchema.index({ role: 1, state: 1 });

/**
 * @description Transforma el documento antes de enviarlo como JSON
 * @returns {Object} Documento transformado
 */
RoleSchema.methods.toJSON = function () {
  try {
    const roleObject = this.toObject();
    const { state, createdAt, updatedAt, ...cleanedData } = roleObject;

    // Solo incluir estado si es false
    if (!state) {
      cleanedData.state = state;
    }

    return cleanedData;
  } catch (error) {
    console.error('Error al transformar rol a JSON:', error);
    return this.toObject();
  }
};

const Role = model('Role', RoleSchema);
export default Role;
