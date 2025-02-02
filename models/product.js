import { Schema, model } from 'mongoose';

/**
 * @typedef {Object} Product
 * @property {string} name - Nombre único del producto
 * @property {boolean} state - Estado del producto (activo/inactivo)
 * @property {Schema.Types.ObjectId} user - Usuario que creó el producto
 * @property {number} price - Precio del producto
 * @property {Schema.Types.ObjectId} category - Categoría del producto
 * @property {string} description - Descripción del producto
 * @property {boolean} available - Disponibilidad del producto
 * @property {string} img - URL de la imagen del producto
 */

/**
 * @name ProductSchema
 * @description Schema for products in MongoDB using Mongoose
 */
const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      unique: true,
      trim: true,
      minlength: [3, 'El nombre debe tener al menos 3 caracteres'],
      maxlength: [100, 'El nombre no puede exceder 100 caracteres'],
    },
    state: {
      type: Boolean,
      default: true,
      required: true,
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El usuario es obligatorio'],
      index: true,
    },
    price: {
      type: Number,
      default: 0,
      min: [0, 'El precio no puede ser negativo'],
      max: [1000000, 'El precio excede el límite permitido'],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'La categoría es obligatoria'],
      index: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'La descripción no puede exceder 500 caracteres'],
    },
    available: {
      type: Boolean,
      default: true,
      index: true,
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
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Índices compuestos para búsquedas frecuentes
ProductSchema.index({ name: 1, state: 1 });
ProductSchema.index({ category: 1, available: 1 });
ProductSchema.index({ price: 1, available: 1 });

/**
 * @description Transforma el documento antes de enviarlo como JSON
 * @returns {Object} Documento transformado
 */
ProductSchema.methods.toJSON = function () {
  try {
    const productObject = this.toObject();
    const { state, ...cleanedData } = productObject;

    // Solo incluir estado si es false
    if (!state) {
      cleanedData.state = state;
    }

    return cleanedData;
  } catch (error) {
    console.error('Error al transformar producto a JSON:', error);
    return this.toObject();
  }
};

const Product = model('Product', ProductSchema);
export default Product;
