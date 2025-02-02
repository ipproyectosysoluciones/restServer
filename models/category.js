import { Schema, model } from 'mongoose';

/**
 * @typedef {Object} Category
 * @property {string} name - Nombre único de la categoría
 * @property {boolean} state - Estado de la categoría (activo/inactivo)
 * @property {Schema.Types.ObjectId} user - Referencia al usuario que creó la categoría
 */

/**
 * @name CategorySchema
 * @description Schema for categories in MongoDB using Mongoose
 */
const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      unique: true,
      trim: true,
      minlength: [3, 'El nombre debe tener al menos 3 caracteres'],
      maxlength: [50, 'El nombre no puede exceder 50 caracteres'],
    },
    state: {
      type: Boolean,
      default: true,
      required: true,
      index: true, // Índice para consultas frecuentes por estado
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El usuario es obligatorio'],
      index: true,
    },
  },
  {
    timestamps: true, // Agrega createdAt y updatedAt
    versionKey: false, // Elimina el campo __v
  },
);

// Crear índice compuesto para búsquedas frecuentes
CategorySchema.index({ name: 1, state: 1 });

/**
 * @description Transforma el documento antes de enviarlo como JSON
 * @returns {Object} Documento transformado
 */
CategorySchema.methods.toJSON = function () {
  try {
    const categoryObject = this.toObject();
    const { state, ...cleanedData } = categoryObject;

    // Solo incluir estado si es false
    if (!state) {
      cleanedData.state = state;
    }

    return cleanedData;
  } catch (error) {
    console.error('Error al transformar categoría a JSON:', error);
    return this.toObject();
  }
};

const Category = model('Category', CategorySchema);
export default Category;
